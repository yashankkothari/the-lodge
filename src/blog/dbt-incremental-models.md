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

What each piece does:

- **`unique_key`** tells dbt how to match incoming rows to existing ones. Without it, the merge becomes a plain append and reruns create duplicates.
- **`incremental_strategy = 'merge'`** is the default on Snowflake. It's written out here so nobody has to wonder.
- **`is_incremental()`** is false on the first run and on `--full-refresh`, so the filter only applies once the table exists.
- **The 3-day lookback** is there because real data doesn't arrive neatly in order. Filtering on exactly `> max(updated_at)` will miss late updates. The window has to be wide enough for your actual source, not just the example here.

## Things that bite

1. **Duplicate keys in the source.** If `stg_claims` has two rows for one `claim_id`, the merge errors out. Deduplicate in staging with `qualify row_number() over (partition by claim_id order by updated_at desc) = 1`.
2. **Logic changes don't backfill themselves.** Change a calculation and only new rows get it. Run `dbt run --select my_model --full-refresh` after changing business logic.
3. **Schema changes.** The default `on_schema_change` is `ignore`, so new columns just don't appear. `append_new_columns` or `sync_all_columns` is usually what you want.
4. **Hard deletes are invisible.** Rows deleted upstream stay in your table forever. Use a soft-delete flag from the source, or a snapshot.

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

You don't need a Snowflake account to see the behaviour. `dbt-duckdb` runs the same Jinja and the same `merge` strategy on your laptop.

```bash
pip install dbt-duckdb
mkdir -p dbt_demo/models && cd dbt_demo
curl -o models/fct_events.sql https://www.yashank.site/files/demos/fct_events.sql
```

Add a two-line `dbt_project.yml` (name and profile) and a `profiles.yml` with `type: duckdb` and `path: demo.duckdb`. Create a `raw_events` table, run `dbt run`, then update 10 rows and insert 200 new ones upstream and run again:

<figure><img src="/img/blog/term-dbt.png" alt="Two dbt runs: 1,000 rows, then 1,200 rows with 10 refunded" loading="lazy"><figcaption>Real output from the two runs. Changed rows were merged in place and new rows appended, with no duplicates.</figcaption></figure>

Open `target/compiled/.../fct_events.sql` after the second run. You'll actually see the `where updated_at > (select max(updated_at) - interval 3 day ...)` filter switched on by `is_incremental()`. I find looking at the SQL dbt generated more useful than guessing what a config option did. The example uses DuckDB; the Snowflake version needs its own profile and adapter settings.
