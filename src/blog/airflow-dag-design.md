---
title: "Designing Airflow DAGs That Don't Wake You Up"
date: 2026-09-21
tags: ["post", "data-engineering", "airflow", "guides"]
---

Airflow is a scheduler and orchestrator, not a processing engine. The DAGs that cause the fewest incidents keep the heavy lifting in the warehouse and use Airflow to decide **what runs, when, and in what order**.


<figure><img src="/img/blog/diagram-airflow.png" alt="Airflow DAG: sensor, extract, load, transform, checks" loading="lazy"><figcaption>The shape I aim for: each task owns one step and one data interval.</figcaption></figure>

## 1. Keep top-level code cheap

The scheduler re-parses every DAG file every few seconds. Anything at module level runs on every parse:

```python
# Bad: hits the database on every parse
tables = get_tables_from_db()

# Good: do it inside a task
@task
def list_tables():
    return get_tables_from_db()
```

Slow parsing is the most common reason a scheduler "feels stuck".

## 2. One task, one job, safe to retry

Each task should do one thing and be idempotent (same window in, same result out), so retries are harmless:

```python
from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    schedule="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    max_active_runs=1,
    default_args={"retries": 2, "retry_delay": timedelta(minutes=5)},
    tags=["claims"],
)
def claims_daily():

    @task
    def extract(data_interval_start=None, data_interval_end=None):
        # pull exactly this run's window
        ...

    @task
    def load(path: str):
        ...

    load(extract())

claims_daily()
```

## 3. Use the run's window, never `now()`

Every DAG run has a `data_interval_start` and `data_interval_end`. Use them, and reruns and backfills just work. `datetime.now()` inside a task means a rerun on Tuesday processes Tuesday, not the Monday it was meant for.

## 4. Decide on catchup on purpose

`catchup=True` with an old `start_date` schedules every missed interval the moment you unpause. Leave it `False` unless you actually want a backfill, and run backfills deliberately.

## 5. Pass references, not data

XCom is for small values: a file path, a row count, a table name. Don't push DataFrames through it. Write to object storage or a staging table and pass the location.

## 6. Make waiting cheap

Sensors that poke in `mode="poke"` hold a worker slot the whole time. Use `mode="reschedule"`, or a deferrable sensor, so waiting costs nothing.

## 7. Let the warehouse do the work

Pulling a million rows into a Python task to transform them is slower and more fragile than one SQL statement. Trigger the transform (a stored procedure, a `dbt build`, a MERGE) and let Snowflake run it.

## A pre-merge checklist

- No database or API calls at module level.
- `catchup`, `retries`, and `max_active_runs` set explicitly.
- Every task uses the data interval, not wall-clock time.
- Only small values in XCom.
- Alerts (`on_failure_callback` or email) wired to someone who will read them.

## Try it: lint your DAGs before they hit the scheduler

Two commands catch most of the problems above before they reach production:

```bash
# Fails fast on import errors and slow top-level code
time python dags/load_orders.py

# Runs one logical date end to end, no scheduler needed
airflow dags test load_orders 2026-09-21
```

If the first command takes more than a second or two, something at the top of the file is calling a database or an API. Move it inside a task.
