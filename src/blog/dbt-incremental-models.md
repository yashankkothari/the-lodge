---
title: "dbt Incremental Models on Snowflake, Without the Surprises"
date: 2026-09-02
tags: ["post", "data-engineering", "dbt", "guides"]
---

I like a boring dbt `table` model. Every run rebuilds the result, so you don't have to wonder whether yesterday's logic is still sitting in some old row. Then the table gets big, runs get expensive, and someone says "let's make it incremental". Fair enough. Just know you're trading that simplicity for a bunch of ways to silently miss data.

An **incremental** model only processes new or changed rows and merges them into the existing table. This is how I'd set one up on Snowflake without making reruns a nightmare.


<figure><img src="/img/blog/diagram-dbt-incr.png" alt="dbt incremental flow on Snowflake" loading="lazy"><figcaption>What <code>dbt run</code> does on every run after the first.</figcaption></figure>

## The minimal correct version

{% raw %}
```sql
{{ config(
    materialized = 'incremental',
    unique_key   = 'claim_id',
    incremental_strategy = 'merge',
    on_schema_change = 'append_new_columns'
) }}

select
    claim_id,
    policy_id,
    claim_amount,
    status,
    updated_at
from {{ ref('stg_claims') }}

{% if is_incremental() %}
  where updated_at > (
      select dateadd('day', -3, max(updated_at)) from {{ this }}
  )
{% endif %}
```
{% endraw %}

There are a few lines in that model I'd want anyone reviewing it to understand:

- **`unique_key`** is how dbt matches incoming claims to existing rows. Forget it and you risk append-like behaviour and duplicate records on reruns.
- **`incremental_strategy = 'merge'`** is Snowflake's default here, but I still prefer being explicit in a model that will be maintained by other people.
- **`is_incremental()`** only enables the incremental filter once the target exists. The first run and a `--full-refresh` need to build the complete result.
- **The 3-day lookback** is there because real data doesn't arrive neatly in order. Filtering on exactly `> max(updated_at)` will miss late updates. The window has to be wide enough for your actual source, not just the example here.

## Things that bite

1. **Your source key isn't actually unique.** Two rows for one `claim_id` can break a merge. I'd deduplicate in staging, for example with `qualify row_number() over (partition by claim_id order by updated_at desc) = 1`.
2. **You change a calculation but forget old rows.** Incremental doesn't mean dbt magically recomputes historical data. If the business logic changed, plan a `dbt run --select my_model --full-refresh` or a targeted backfill.
3. **Columns silently don't appear.** With the default `on_schema_change: ignore`, upstream schema changes won't necessarily show up. Decide whether `append_new_columns` or `sync_all_columns` makes sense for that model.
4. **Deleted source rows never leave the target.** An incremental merge won't discover a hard delete just because the row is missing upstream. You need a soft-delete signal, snapshot or explicit reconciliation strategy.

## Test it like you mean it

```yaml
models:
  - name: fct_claims
    columns:
      - name: claim_id
        tests:
          - unique
          - not_null
```

That `unique` test is not optional decoration. If you're merging on `claim_id`, you'd better know when `claim_id` stops being unique. The test is much cheaper than finding duplicate claims downstream.

## When to go incremental

If a full rebuild still finishes quickly and costs next to nothing, leave it alone. You don't win anything by making your data pipeline more complicated just because incremental models sound more advanced.

## Try it locally with DuckDB

You can test the core idea without spending Snowflake credits. With `dbt-duckdb`, the Jinja and incremental merge behaviour are easy to explore locally. That's useful before you learn the gotchas against production data.

```bash
pip install dbt-duckdb
mkdir -p dbt_demo/models && cd dbt_demo
curl -o models/fct_events.sql https://www.yashank.site/files/demos/fct_events.sql
```

Add a minimal `dbt_project.yml` with the project name and profile, plus a `profiles.yml` pointing at `demo.duckdb`. Create the `raw_events` table and run the model once. Then update ten existing records, insert 200 new ones and run it again. The point is to see how it deals with both changed and new data:

<figure><img src="/img/blog/term-dbt.png" alt="Two dbt runs: 1,000 rows, then 1,200 rows with 10 refunded" loading="lazy"><figcaption>Real output from the two runs. Changed rows were merged in place and new rows appended, with no duplicates.</figcaption></figure>

Open `target/compiled/.../fct_events.sql` after the second run. You'll actually see the `where updated_at > (select max(updated_at) - interval 3 day ...)` filter switched on by `is_incremental()`. I find looking at the SQL dbt generated more useful than guessing what a config option did. The example uses DuckDB; the Snowflake version needs its own profile and adapter settings.
