---
title: "Caching Without Regret: A Practical Guide to Redis"
date: 2026-06-13
tags: ["post", "backend", "guides"]
---

Caching is one of those things that looks like a free performance win right up until someone asks why your app is showing yesterday's data. Redis makes a slow page fast. It can also make an incorrect answer really fast, which is somehow worse.

Here's how I think about caching with Redis, including the part everyone likes to skip: how that cached value eventually stops being true.

## Start with the question

Before I add a cache to anything, I want answers to three questions:

- **What's the acceptable staleness?** If a value can be five minutes old, great. If it must be correct at this exact moment, caching it becomes a much harder problem.
- **How bad is a miss?** Saving a 5 ms database lookup may not justify a new system. Avoiding a ten-second aggregation might.
- **Do requests reuse the same keys?** A cache is useful when popular values get read repeatedly. If every request is unique, you might just be paying for an extra lookup that misses.

If you don't have good answers to those questions, you probably don't need Redis yet. "We added a cache" isn't a performance metric.

## Cache-aside: the default pattern

The pattern I usually start with is **cache-aside**. Your application checks Redis first. If the key isn't there, fetch the actual data and populate the cache for next time. No elaborate synchronization mechanism to begin with:

```python
import json
import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def get_user(user_id: int) -> dict:
    key = f"user:{user_id}"
    cached = r.get(key)
    if cached is not None:
        return json.loads(cached)

    user = db_fetch_user(user_id)          # your database call
    r.set(key, json.dumps(user), ex=300)   # 5-minute TTL
    return user
```

This is why I like cache-aside as a starting point. You're only caching things people actually ask for. The application can also fall back to the database if Redis is unavailable, assuming you've built that fallback. The trade-off is that the first request after expiry still has to do the slow work.

## TTLs are your safety net

Set a **TTL**. Even if you swear you've handled every invalidation path, set one. A missed deletion with a ten-minute TTL is an irritating bug. A missed deletion with no expiry is the kind of bug that quietly survives until somebody compares two reports a month later.

## Invalidation

The fun ends when something changes in the database. Now you have to decide what happens to the old value sitting in Redis. Two obvious approaches:

- Delete the cached key after a successful source update, so the next read reloads it.
- Write the new value into the cache as part of the update path.

I generally prefer deletion. Imagine two concurrent writers: the database ends up with the newer value, but their cache updates arrive in the opposite order. Now Redis is proudly serving old data until expiration. Deleting after the source write avoids some of that complexity, though you'll still want to think about concurrent reads and writes.

```python
def update_user(user_id: int, fields: dict) -> None:
    db_update_user(user_id, fields)
    r.delete(f"user:{user_id}")
```

The ordering matters. Commit the database change, then invalidate the cache. Delete first and another request might read the unchanged database row and fill the cache right back up with stale data before your update finishes.

The horrible part is remembering everywhere that data appears. A user profile can be cached as `user:42`, buried in a team listing and copied into a search response. If you can't explain which keys depend on a write, you haven't solved invalidation just because you added `r.delete()` once.

## Stampedes

Picture a popular dashboard whose cached report expires at exactly noon. Hundreds of requests arrive, all see a miss and all decide to recompute the same expensive result. Congratulations, your cache has coordinated a mini denial-of-service against your own database. That's a **cache stampede**.

There are a few ways I'd deal with it depending on how expensive the value is:

### Jittered TTLs

If a deployment populated thousands of keys at once, they'll probably expire together too. Giving each TTL a little random variation spreads those misses over time:

```python
import random

def ttl_with_jitter(base: int, spread: float = 0.1) -> int:
    return int(base * random.uniform(1 - spread, 1 + spread))

r.set(key, value, ex=ttl_with_jitter(300))
```

The jitter doesn't make an individual cache miss faster. It prevents an entire group of keys from expiring in lockstep.

### A lock around recomputation

For a particularly expensive report, I'd rather let one request perform the rebuild while the others wait or take a fallback. Redis `SET` with `NX` can act as a simple lock around the recomputation:

```python
import time

def get_report(report_id: str) -> dict:
    key = f"report:{report_id}"
    lock_key = f"lock:{key}"

    for _ in range(50):
        cached = r.get(key)
        if cached is not None:
            return json.loads(cached)

        if r.set(lock_key, "1", nx=True, ex=30):
            try:
                report = build_report(report_id)   # expensive
                r.set(key, json.dumps(report), ex=ttl_with_jitter(600))
                return report
            finally:
                r.delete(lock_key)

        time.sleep(0.1)

    return build_report(report_id)   # give up waiting
```

That lock needs an expiry too. If the process crashes while holding it, you don't want everybody blocked forever. For production code I'd also use a unique token and verify ownership before deleting, otherwise a slow worker can accidentally remove somebody else's newer lock.

### Stale-while-revalidate

Sometimes the best answer is to serve a slightly old result while you refresh in the background. That's **stale-while-revalidate**. Store a soft expiry inside the value and a later hard expiry on the Redis key. After the soft expiry, return the cached result and schedule a refresh instead of making the user wait for it.

```python
def get_with_swr(key: str, loader, soft_ttl: int = 300, hard_ttl: int = 3600):
    raw = r.get(key)
    if raw is not None:
        entry = json.loads(raw)
        if time.time() > entry["soft_expiry"]:
            schedule_refresh(key, loader, soft_ttl, hard_ttl)  # e.g. a task queue
        return entry["value"]

    value = loader()
    entry = {"value": value, "soft_expiry": time.time() + soft_ttl}
    r.set(key, json.dumps(entry), ex=hard_ttl)
    return value
```

I'd still put a lock around the refresh. Otherwise every request that sees an expired value schedules another background job, and you've recreated the stampede somewhere else.

## What not to cache

- **Anything that must be exact right now.** Account balances, checkout inventory and permission decisions deserve extreme caution. Stale authorization data can become a security issue.
- **One-off per-user values with almost no reuse.** Filling memory with entries read once doesn't sound like a win.
- **Huge objects.** Storing giant blobs in Redis adds network and memory pressure. Often an ID or small computed summary is enough.
- **Failures by accident.** Negative caching can protect a struggling dependency, but caching an error for an hour after the service recovers is a nasty surprise.

Set `maxmemory` and an eviction policy such as `allkeys-lru`, too. Redis filling up should be something you planned for, not a surprise incident.

## Before you ship the cache

- Decide how old each kind of cached value is allowed to be, then choose the TTL from that requirement.
- Work through invalidation and concurrent writes, not just the happy path where nobody updates the data.
- For expensive popular keys, consider jitter, a rebuild lock or stale-while-revalidate before traffic makes the problem obvious.
- Track hit rate and miss latency. If almost everything misses, congratulations, you've added an extra network call to a slow endpoint.
