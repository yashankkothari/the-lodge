---
title: "FastAPI in Production: The Things the Tutorial Skips"
date: 2025-09-06
tags: ["post", "backend", "python", "guides"]
---

FastAPI is almost suspiciously pleasant when you're starting out. Write a typed function, add a decorator, and suddenly you have an API with validation and docs. Then it meets real traffic and the endpoint that worked perfectly on your laptop starts timing out.

The tutorial isn't lying to you. It's just not preparing you for all the boring things that make a service stay up. These are the things I'd look at before trusting a FastAPI app in production.

## async def vs def, and blocking calls

FastAPI makes `async def` look like the obvious modern choice, so it's tempting to put it everywhere. But the difference between `async def` and ordinary `def` is easy to misunderstand:

- **`async def`** runs on the event loop. While you're awaiting network or database I/O through an async library, the worker can handle other requests. Call a blocking driver or `requests.get` inside it, though, and you've blocked that event loop.
- **`def`** endpoints get executed in a thread pool. That can be a perfectly sensible option when you're working with synchronous libraries. There's no prize for adding `async` to code that doesn't benefit from it.

This is the classic footgun:

```python
import requests

@app.get("/rates")
async def get_rates():
    r = requests.get("https://example.com/rates")  # blocks the event loop
    return r.json()
```

Either make it fully async with an async client:

```python
import httpx

client = httpx.AsyncClient(timeout=5.0)

@app.get("/rates")
async def get_rates():
    r = await client.get("https://example.com/rates")
    return r.json()
```

Alternatively, keep the endpoint synchronous and let FastAPI run it in a worker thread. My rule is simple: if the slow I/O inside the function isn't actually awaited, adding `async` isn't doing what you think it is.

For heavy CPU work, changing the function declaration won't make the task disappear. Python's GIL and worker capacity still matter; I'd move substantial processing to a separate process or queue instead of tying up request handling.

## Let Pydantic do the validation

One of the genuinely good parts of FastAPI is that Pydantic can make request validation boring. I'd use it properly rather than passing unvalidated dictionaries around and checking fields manually inside every route.

```python
from pydantic import BaseModel, Field, field_validator

class PaymentIn(BaseModel):
    account_id: str = Field(min_length=1, max_length=64)
    amount: float = Field(gt=0, le=1_000_000)
    currency: str = Field(pattern=r"^[A-Z]{3}$")

    @field_validator("account_id")
    @classmethod
    def no_spaces(cls, v: str) -> str:
        if " " in v:
            raise ValueError("account_id must not contain spaces")
        return v

class PaymentOut(BaseModel):
    payment_id: str
    status: str

@app.post("/payments", response_model=PaymentOut)
def create_payment(body: PaymentIn) -> PaymentOut:
    ...
```

Don't treat **`response_model`** as a nice-to-have for Swagger. It filters what leaves your endpoint. That's the difference between returning the fields you intended and accidentally exposing some internal value because your database object had it. Request validation also saves you from writing the same defensive checks everywhere.

## Dependency injection for shared resources

I like `Depends` because it makes the endpoint's requirements explicit. A route needs a database session, user identity or settings? Declare it. In tests, you can replace that dependency with a fake instead of patching global state all over the place.

```python
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/accounts/{account_id}")
def read_account(account_id: str, db=Depends(get_db)):
    return db.get(Account, account_id)

# in tests
app.dependency_overrides[get_db] = lambda: fake_db
```

The `yield` pattern gives the dependency a cleanup path. That's useful for things like database sessions. For resources you want to create once per process, such as a shared HTTP client or connection pool, I'd use the application's **lifespan** handler instead of constructing them on every request.

## Background tasks are not a queue

FastAPI's `BackgroundTasks` is convenient because the HTTP response can return before a small follow-up function finishes. I'd use it for work that's genuinely okay to lose if the process dies, like a noncritical notification—not for something the business absolutely requires.

```python
from fastapi import BackgroundTasks

@app.post("/signup")
def signup(user: UserIn, tasks: BackgroundTasks):
    create_user(user)
    tasks.add_task(send_welcome_email, user.email)
    return {"ok": True}
```

Here's the catch: it still runs in the same worker process. Restart the worker and you can lose the task. You don't get a proper retry system or job tracking for free. If this is something that absolutely must happen, use an actual **task queue** such as Celery, RQ, Arq or a managed queue.

The question I'd ask is: if this task vanished halfway through, would somebody open a support ticket? If yes, I want durable queueing and retry behaviour.

## Workers: uvicorn and gunicorn

That `--reload` command from the tutorial is great while you're editing code. I wouldn't use it as a production deployment plan. You need a process setup that handles failures, uses available CPU capacity and makes restarts predictable.

One traditional deployment pattern uses Gunicorn to manage Uvicorn workers:

```bash
gunicorn main:app \
  -k uvicorn.workers.UvicornWorker \
  --workers 4 \
  --bind 0.0.0.0:8000 \
  --timeout 30 \
  --graceful-timeout 20
```

Uvicorn also has its own `--workers` option. In Kubernetes, you might choose one Uvicorn process per container and scale through replicas instead. There's no single magic worker count. Start with something reasonable for the machine and workload, then measure throughput, memory and latency.

## Timeouts everywhere

No timeout is basically a decision to let one slow dependency hold your service hostage. Put sensible time limits at every layer:

- **Outbound requests:** check the client's default and set an explicit timeout where it matters. In particular, `requests` won't time out unless you tell it to.
- **Database calls:** configure connection and query limits so one bad statement doesn't occupy resources forever.
- **Worker processes:** the process manager needs a policy for stuck workers, not just a hope that they'll finish.
- **Reverse proxy:** make sure its timeout settings make sense alongside those in your application.

For a larger async operation, `asyncio.timeout` on Python 3.11+ or `asyncio.wait_for` can enforce a deadline around the entire block. One outbound request timeout doesn't necessarily cover everything the endpoint does.

## Structured logging

You can get away with `print()` for a while. Then something breaks in production and you have to correlate one request across several systems. That's when consistent **JSON logs** and request IDs stop looking like boring enterprise plumbing and start looking essential.

```python
import logging, time, uuid, json

logger = logging.getLogger("api")

@app.middleware("http")
async def log_requests(request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    start = time.perf_counter()
    response = await call_next(request)
    logger.info(json.dumps({
        "request_id": request_id,
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration_ms": round((time.perf_counter() - start) * 1000, 1),
    }))
    response.headers["x-request-id"] = request_id
    return response
```

`structlog` and similar libraries can make this cleaner, but the format matters more than the package. And don't dump entire request bodies into logs just because debugging is easier that way. That data may include somebody's personal or payment information.

## Before you ship

- Check whether your endpoint is truly nonblocking before reaching for `async def`.
- Define request and response schemas; don't leak internal objects by accident.
- Make dependencies and their cleanup lifecycle explicit.
- Use durable queues for important background work instead of hoping a worker survives.
- Test worker configuration, timeouts and logging before calling the service production-ready.

None of this makes for a very exciting "I built an API in five minutes" video. It's the stuff that matters after those five minutes are over.
