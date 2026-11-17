---
title: "Designing Airflow DAGs That Don't Wake You Up"
date: 2026-09-21
tags: ["post", "data-engineering", "airflow", "guides"]
---

Airflow gets blamed for a lot of problems that really come from how people write DAGs. It isn't supposed to be your processing engine. It's supposed to tell other systems **what to run, when to run it and what depends on what**. If your DAG is dragging huge datasets through Python tasks, you've probably made life harder than it needs to be.


<figure><img src="/img/blog/diagram-airflow.png" alt="Airflow DAG: sensor, extract, load, transform, checks" loading="lazy"><figcaption>The shape I aim for: each task owns one step and one data interval.</figcaption></figure>

## 1. Keep top-level code cheap

One thing that's easy to forget is that the scheduler imports your DAG files repeatedly. Code at the top level isn't some harmless startup step that runs once when you deploy. It runs again and again while Airflow parses the file:

```python
# Bad: hits the database on every parse
tables = get_tables_from_db()

# Good: do it inside a task
@task
def list_tables():
    return get_tables_from_db()
```

If the scheduler feels randomly stuck, look here first. A database call at the top of a DAG file is not a harmless bit of setup code when the scheduler keeps importing that file.

## 2. One task, one job, safe to retry

I want each task to own one clear piece of work and be safe to retry. If I give it the same date window twice, I should get the same result twice, not duplicate records or another email sent to a customer. Here's the kind of structure I mean:

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

Every run already has a `data_interval_start` and `data_interval_end`. Use them. Calling `datetime.now()` from inside a task is how you end up rerunning Monday's failed job on Tuesday and accidentally loading Tuesday's data instead. Green task, wrong numbers. Lovely.

## 4. Decide on catchup on purpose

`catchup=True` plus an old `start_date` can queue every missed interval the moment you unpause the DAG. That's fine if you're deliberately backfilling. It's not fine if you just wanted today's run and accidentally queued six months of work.

## 5. Pass references, not data

XCom isn't where I'd pass an entire pandas DataFrame between tasks. It's for small bits of information: which file got created, which table to read, how many rows were processed. Put the actual dataset in storage or a staging table and pass a reference. Otherwise Airflow's metadata database starts doing a job it was never designed for.

## 6. Make waiting cheap

A sensor that sits in `mode="poke"` occupies a worker slot while it waits. That's a silly way to spend capacity when the task is literally doing nothing. Use rescheduling or deferrable sensors where appropriate so your workers can do useful work in the meantime.

## 7. Let the warehouse do the work

Please don't pull a million rows into an Airflow worker just to do something Snowflake could do in one query. Trigger the `MERGE`, stored procedure or `dbt build` and let the system built for processing data process the data.

## A pre-merge checklist

- Can the scheduler import this file without hitting a database or external API?
- Did I set `catchup`, retry behaviour and `max_active_runs` deliberately?
- Does every data task use the run's interval instead of asking what time it is now?
- Am I passing small references through XCom, rather than the actual dataset?
- Will a failure alert reach somebody who can do something about it?

## Try it: lint your DAGs before they hit the scheduler

Before merging a DAG, these two commands give me a quick sanity check. They're much easier than finding the problem after the scheduler has picked it up:

```bash
# Fails fast on import errors and slow top-level code
time python dags/load_orders.py

# Runs one logical date end to end, no scheduler needed
airflow dags test load_orders 2026-09-21
```

If importing the DAG takes ages, inspect the top-level code before touching scheduler settings. A stray API or database call there can slow down far more than this one DAG.
