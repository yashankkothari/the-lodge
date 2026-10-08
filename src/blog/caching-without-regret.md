---
title: "Caching Without Regret: A Practical Guide to Redis"
date: 2026-06-13
tags: ["post", "backend", "guides"]
---

Caching is the fastest way to make a slow system feel quick, and one of the fastest ways to make a correct system wrong. The speed-up is immediate. The bugs show up weeks later, when someone asks why the dashboard still shows yesterday's number.

This is the set of patterns I reach for with Redis, and the questions I try to answer before adding a cache at all.

## Start with the question

Before writing any code, answer three things:

- **How stale can this data be?** Seconds, minutes, a day? If the answer is "never", don't cache it, or cache it with a very deliberate invalidation path.
- **How expensive is a miss?** A cache in front of a 5 ms query buys you little. A cache in front of a heavy aggregation or a slow third-party API buys a lot.
- **How is it read?** Lots of reads of the same keys is ideal. Every request hitting a unique key means your hit rate will be poor.

If the answers aren't good, a cache adds complexity without much benefit.

## Cache-aside: the default pattern

**Cache-aside** (or lazy loading) is the pattern most applications use. The application checks the cache, and on a miss it loads from the source and writes the result back.

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

It's simple, the cache only holds data that's actually requested, and if Redis goes down the application can still fall back to the database. The downside is that the first request after expiry always pays the full cost.

## TTLs are your safety net

Always set a **TTL** (time to live). Even if you have an explicit invalidation path, a TTL bounds how long a bug can keep wrong data alive. A missed invalidation with a 10-minute TTL is an annoyance. A missed invalidation with no TTL is a support ticket next month.

## Invalidation

On writes, you have two common options:

- **Delete the key** after updating the source. The next read repopulates it.
- **Update the key** with the new value.

Deleting is usually safer. Updating risks a race: two writers update the database in one order and the cache in the other, and the cache ends up holding the older value until the TTL expires.

```python
def update_user(user_id: int, fields: dict) -> None:
    db_update_user(user_id, fields)
    r.delete(f"user:{user_id}")
```

Update the database first, then delete. If you delete first, a concurrent read can repopulate the cache with the old value before your write lands.

The hard part of invalidation is knowing **which keys** depend on a piece of data. A user's profile might be cached under `user:42`, inside a team listing, and inside a search result. Keep key naming consistent and the dependency map written down, or you'll miss one.

## Stampedes

A **cache stampede** happens when a popular key expires and many requests miss at once, all hitting the database together. Three ways to handle it:

### Jittered TTLs

If you cache lots of keys at the same time (on deploy, say), they'll also expire at the same time. Add randomness:

```python
import random

def ttl_with_jitter(base: int, spread: float = 0.1) -> int:
    return int(base * random.uniform(1 - spread, 1 + spread))

r.set(key, value, ex=ttl_with_jitter(300))
```

This spreads expiries out and avoids synchronised misses.

### A lock around recomputation

Let one request rebuild the value while the others wait briefly or use a fallback. Redis `SET` with `NX` gives a simple lock:

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

The lock's own TTL matters: if the process holding it crashes, the lock frees itself. For anything critical, use a token so a process only deletes a lock it owns.

### Stale-while-revalidate

Store the value with a soft expiry inside it, and a longer hard TTL on the key. When the soft expiry passes, serve the stale value and trigger a refresh in the background. Users never wait on the rebuild, and a slightly old value is often fine.

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

Combine this with the lock so only one background refresh runs per key.

## What not to cache

- **Data that must be exact right now**: balances, inventory at checkout, permissions. Stale permissions are a security bug.
- **Per-user data with low reuse**, unless the source is slow. You'll fill memory with keys read once.
- **Huge values.** Large blobs slow down Redis and the network. Cache an ID or a summary instead.
- **Errors**, unless deliberately. Caching a failed lookup for a few seconds can protect a struggling dependency, but caching it for an hour hides recovery.

Also set a memory limit and an eviction policy (`maxmemory` and `maxmemory-policy`, such as `allkeys-lru`), so Redis degrades predictably when it fills up.

## Before you ship the cache

- Write down the acceptable staleness for each cached thing, and set TTLs from it.
- Update the source first, then delete the key.
- Add jitter to TTLs and a lock or stale-while-revalidate for expensive, popular keys.
- Track hit rate and miss latency. If the hit rate is low, the cache is probably costing more than it saves.
