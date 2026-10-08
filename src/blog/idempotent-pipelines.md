---
title: "Idempotent Pipelines: Making the 3 a.m. Rerun Safe"
date: 2026-08-14
tags: ["post", "data-engineering", "guides"]
---

A pipeline is **idempotent** when running it once or five times for the same input gives the same result. It is the single most useful property a batch job can have, because every job eventually gets rerun: a retry after a timeout, a backfill after a bug fix, someone clicking "Clear" in Airflow at 3 a.m.

If a rerun doubles your revenue numbers, the pipeline is broken even when every task is green.

## The three patterns that get you there

### 1. Process a window, not "whatever is new"

Bad: `WHERE loaded_at > (SELECT MAX(loaded_at) FROM target)`. The answer changes every time you run it.

Good: every run owns a fixed, explicit window, such as one day, passed in from the scheduler. In Airflow that is the run's `data_interval_start` and `data_interval_end`. Rerunning the 7 October run always processes 7 October.

### 2. Overwrite the window, don't append to it

Two safe ways to write:

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

`INSERT INTO ... SELECT` with no delete or key is the classic source of duplicates. Avoid it for anything that can be rerun.

### 3. Deduplicate the source before you merge

MERGE fails (or behaves unpredictably) when the source has two rows for the same key. Keep only the latest:

```sql
SELECT *
FROM raw.policies
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY policy_id ORDER BY updated_at DESC
) = 1;
```

## A quick checklist

- Every run is parameterised by a date window from the scheduler, never by `CURRENT_DATE` inside the SQL.
- Writes are overwrite-by-partition or MERGE on a key, never blind appends.
- The source is deduplicated on that key first.
- Side effects (emails, API calls, file drops) live in their own task, so retrying the load doesn't resend them.
- You've actually tested it: run the same day twice and compare row counts.

Make this the default and backfills stop being scary.
