---
title: "FastAPI in Production: The Things the Tutorial Skips"
date: 2025-09-06
tags: ["post", "backend", "python", "guides"]
---

FastAPI makes the first version of an API very pleasant. You write a typed function, add a decorator, and get validation and interactive docs for free. The trouble starts later, when real traffic arrives and something that worked fine on your laptop starts timing out.

Most of those problems come from a handful of things the getting-started guide doesn't dwell on. Here's what I'd check before calling a FastAPI service production-ready.

## async def vs def, and blocking calls

FastAPI lets you write endpoints as either `async def` or plain `def`, and the difference matters a lot.

- An **`async def`** endpoint runs on the event loop. While it's awaiting something, other requests can run. But if it does anything blocking, such as a synchronous database driver, `requests.get`, or heavy CPU work, it blocks the entire loop and every other request on that worker waits.
- A plain **`def`** endpoint is run in a thread pool, so blocking calls inside it don't freeze the loop.

The classic mistake:

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

or keep it synchronous and declare it with `def`, letting FastAPI use the thread pool. The rule of thumb: **use `async def` only if everything slow inside it is awaited.** If in doubt, `def` is the safer default.

For CPU-heavy work, neither helps much because of the GIL. Move it to a separate process or a task queue.

## Let Pydantic do the validation

Request and response models are where FastAPI earns its keep. Be strict about them.

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

Setting a **`response_model`** isn't just for docs. It filters the output, so an internal field you accidentally return doesn't leak to the client. Bad input gets a 422 with a clear error before your code runs, which keeps endpoint bodies free of defensive checks.

## Dependency injection for shared resources

`Depends` is FastAPI's way of providing things an endpoint needs: a database session, the current user, settings. Using it consistently makes testing much easier, because you can override any dependency.

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

The `yield` form guarantees cleanup runs after the response. For things that should exist once per process, like an HTTP client or a connection pool, create them in the app's **lifespan** handler rather than per request.

## Background tasks are not a queue

`BackgroundTasks` runs a function after the response is sent. It's handy for small things like writing an audit log entry or sending a notification.

```python
from fastapi import BackgroundTasks

@app.post("/signup")
def signup(user: UserIn, tasks: BackgroundTasks):
    create_user(user)
    tasks.add_task(send_welcome_email, user.email)
    return {"ok": True}
```

But it runs inside the same worker process. If the worker restarts, the task is lost. There are no retries, no visibility, and long tasks tie up the worker. For anything that must happen, takes a while, or needs retrying, use a real **task queue** (Celery, RQ, Arq, or a managed queue) with separate workers.

My rough test: if losing the task would mean a support ticket, it doesn't belong in `BackgroundTasks`.

## Workers: uvicorn and gunicorn

`uvicorn main:app --reload` is for development. In production you want several worker processes so one slow request or crash doesn't take down everything, and so you use more than one CPU core.

A common setup runs gunicorn as the process manager with uvicorn workers:

```bash
gunicorn main:app \
  -k uvicorn.workers.UvicornWorker \
  --workers 4 \
  --bind 0.0.0.0:8000 \
  --timeout 30 \
  --graceful-timeout 20
```

Uvicorn can also run multiple workers on its own with `--workers`. In containers on Kubernetes, many teams run one uvicorn process per container and scale by adding pods instead. Either way, start with roughly one worker per core and measure.

## Timeouts everywhere

A service without timeouts will eventually hang on a slow dependency and pile up requests until it falls over. Set them at every layer:

- **Outbound HTTP**: always pass a timeout to your client. httpx has a default; `requests` waits forever unless you set one.
- **Database**: set connection and statement timeouts in the driver or pool.
- **The worker**: gunicorn's `--timeout` kills stuck workers.
- **The proxy or load balancer** in front of the app.

For async code, `asyncio.timeout` (Python 3.11+) or `asyncio.wait_for` bounds a whole operation, not just one call.

## Structured logging

Plain text logs are fine until you need to search them. Log **JSON** with consistent fields, and include a request ID so you can follow one request through everything it touched.

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

Libraries like structlog make this neater. Don't log request bodies blindly; they often contain personal or payment data.

## Before you ship

- Use `async def` only when every slow call inside is awaited; otherwise use `def`.
- Validate inputs and set `response_model` on every endpoint.
- Provide shared resources through `Depends` and the lifespan handler.
- Keep `BackgroundTasks` for small, losable work; use a queue for the rest.
- Run multiple workers, set timeouts at every layer, and log JSON with request IDs.

None of this is exotic. It's just the difference between an API that works and one that keeps working.
