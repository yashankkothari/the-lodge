---
title: "Idempotent Pipelines: Making the 3 a.m. Rerun Safe"
date: 2026-08-14
tags: ["post", "data-engineering", "guides"]
---

A data pipeline is going to get rerun. Maybe a task times out, maybe a backfill is needed, maybe someone clears an Airflow task at 3 a.m. If running the same input twice doubles your numbers, the pipeline was broken before anyone pressed that button.

That's why I care so much about **idempotency**: the same input should give the same result, whether the job runs once or five times. A green DAG means nothing if the report now shows twice the revenue.


<figure><img src="/img/blog/diagram-idempotent.png" alt="Append vs delete-insert on a retry" loading="lazy"><figcaption>A retry is only safe when the write replaces the partition instead of adding to it.</figcaption></figure>

## The three patterns that get you there

### 1. Process a window, not "whatever is new"

Bad: `WHERE loaded_at > (SELECT MAX(loaded_at) FROM target)`. Now the input depends on whatever happened in the previous run. Good luck reproducing a failure from last Tuesday.

Better: make the input interval explicit. A daily run should know that it owns the 7 October window regardless of whether it runs on the seventh, eighth or a month later. Airflow gives you `data_interval_start` and `data_interval_end` for exactly this reason. The scheduler's clock should not change what historical data you're replaying.

### 2. Overwrite the window, don't append to it

The write strategy is the other half. I generally want one of these two patterns instead of a blind append:

**Delete-then-insert inside one transaction**

```sql
BEGIN;
DELETE FROM analytics.daily_policies
 WHERE business_date = '2026-10-07';
INSERT INTO analytics.daily_policies
SELECT * FROM staging.daily_policies
 WHERE business_date = '2026-10-07';
COMMIT;
```

**MERGE on a real business key**

```sql
MERGE INTO analytics.policies t
USING staging.policies s
   ON t.policy_id = s.policy_id
WHEN MATCHED THEN UPDATE SET
     t.status     = s.status,
     t.premium    = s.premium,
     t.updated_at = s.updated_at
WHEN NOT MATCHED THEN INSERT (policy_id, status, premium, updated_at)
     VALUES (s.policy_id, s.status, s.premium, s.updated_at);
```

Blind `INSERT INTO ... SELECT` is fine until somebody retries the job and you get two copies of every row. If there's any chance of a rerun, think about the write semantics before celebrating a successful load.

### 3. Deduplicate the source before you merge

`MERGE` isn't a substitute for knowing your source data. If there are two versions of the same business key in one batch, the result can fail or depend on the database's merge rules. Resolve that ambiguity before writing. Here I keep the newest row:

```sql
SELECT *
FROM raw.policies
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY policy_id ORDER BY updated_at DESC
) = 1;
```

## A quick checklist

- Does the job get a specific date window rather than relying on `CURRENT_DATE`?
- Can I explain what happens when the same window is written a second time?
- Have I removed duplicate business keys from the incoming data before the merge?
- Are emails, file drops and other side effects separated from the data write so retries don't repeat them?
- Have I actually run the same window twice and compared the results, instead of assuming the SQL is idempotent?

I'd much rather spend a little time getting the write pattern right now than be the person manually cleaning duplicate rows out of a production report later.

## Try it: break it, then fix it

I put together a tiny SQLite demo so you can see the failure without needing a warehouse. It loads 1,000 orders, then retries the exact same batch. First with a naive append, then with delete-and-insert wrapped in a transaction. Watch what happens to the row count:

```bash
curl -O https://www.yashank.site/files/demos/idempotent_demo.py
python idempotent_demo.py append
python idempotent_demo.py idempotent
```

<figure><img src="/img/blog/term-idem.png" alt="Terminal output: append doubles rows, idempotent load keeps 1,000" loading="lazy"><figcaption>Real output. The append run doubles to 2,000 rows on the retry; the idempotent run stays at 1,000.</figcaption></figure>

The demo uses SQLite because it's easy to run locally. On Snowflake, the same principle applies: `DELETE ... WHERE order_date = :ds` and `INSERT` in one transaction, or `MERGE` using a real business key. Different database, same requirement: a retry shouldn't rewrite history by accident.
