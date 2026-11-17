---
title: "Snowflake Cost and Performance: The Basics That Matter Most"
date: 2026-10-06
tags: ["post", "data-engineering", "snowflake", "guides"]
---

Snowflake makes it surprisingly easy to spend money without noticing. Storage matters, but compute is usually where the real bill comes from. A virtual warehouse keeps charging while it's running, billed per second with a 60-second minimum each time it starts. So before getting clever with SQL optimisations, I'd check how long the warehouses are sitting there doing nothing.


<figure><img src="/img/blog/diagram-snowflake.png" alt="Snowflake query path: result cache, warehouse, disk cache, micro-partitions" loading="lazy"><figcaption>Each layer to the right costs more. Most savings come from staying left.</figcaption></figure>

## Warehouses

**Auto-suspend is the first place I'd look.** Most batch workloads don't need a warehouse sitting awake for ages after the job finishes. Set a short idle timeout and let it resume when work arrives:

```sql
ALTER WAREHOUSE transform_wh SET
  AUTO_SUSPEND = 60      -- seconds
  AUTO_RESUME  = TRUE;
```

If a two-minute job runs and the warehouse stays awake for another ten, you've spent most of those credits watching it idle. It's the first setting I'd check.

**Don't just make the warehouse bigger because the query is slow.** Each size step roughly doubles the compute and hourly credit rate. Some queries scale well enough to finish twice as fast and cost about the same. Others barely improve and simply cost more. Measure before and after.

**Don't put every workload on the same warehouse by default.** I'd separate ELT jobs, dashboards and ad-hoc queries when the usage justifies it. Otherwise a big transformation can interfere with someone's dashboard, and when the bill arrives you can't even tell which workload burned the credits.

## Queries

1. **Stop selecting columns nobody needs.** Snowflake stores columns separately, so `SELECT *` on a wide table can make you read a lot of unnecessary data.
2. **Give micro-partition pruning a chance.** Snowflake can skip partitions using their recorded min/max values. A straightforward date filter may work well; converting every date to a string in the `WHERE` clause can make pruning harder.
3. **Open Query Profile instead of guessing.** Check partitions scanned versus total, then look for local or remote spilling. If a query is spilling, it couldn't keep all the intermediate work in memory.
4. **Check join cardinality.** If joining two modest tables suddenly produces an enormous output, look for non-unique keys and accidental many-to-many matches before blaming warehouse size.

## Caching

- **Result cache:** Snowflake can reuse a previously computed result for an eligible identical query on unchanged data, potentially avoiding warehouse compute for up to 24 hours.
- **Warehouse cache:** while the warehouse stays running, local disks can hold recently accessed data. Suspending drops that cache. For most batch jobs, I'd rather save idle credits than keep a warehouse awake just for warm cache.

## Clustering keys

Clustering keys aren't something I'd add to every table because a tutorial mentioned them. They make sense mainly for very large tables with recurring filter patterns and genuinely poor pruning. Automatic clustering itself costs credits, so you'd better measure whether the improvement pays for maintenance.

## Keep an eye on spend

```sql
SELECT warehouse_name,
       SUM(credits_used) AS credits
FROM snowflake.account_usage.warehouse_metering_history
WHERE start_time >= DATEADD('day', -30, CURRENT_TIMESTAMP())
GROUP BY 1
ORDER BY 2 DESC;
```

I'd also put **resource monitors** around spend. They aren't a replacement for understanding your workloads, but they're useful protection against a job quietly eating the budget because somebody left a warehouse running.

## Try it: three queries to run this week

```sql
-- 1. Which warehouses burned the most credits in the last 7 days?
select warehouse_name, sum(credits_used) as credits
from snowflake.account_usage.warehouse_metering_history
where start_time >= dateadd(day, -7, current_timestamp())
group by 1 order by 2 desc;

-- 2. The 10 slowest queries, and how much of each table they scanned
select query_id, warehouse_name, total_elapsed_time / 1000 as seconds,
       partitions_scanned, partitions_total
from snowflake.account_usage.query_history
where start_time >= dateadd(day, -7, current_timestamp())
order by total_elapsed_time desc limit 10;

-- 3. A guardrail: suspend at the monthly budget
create resource monitor monthly_budget with credit_quota = 400
  triggers on 90 percent do notify on 100 percent do suspend;
alter warehouse etl_wh set resource_monitor = monthly_budget;
```

If `partitions_scanned` is almost the same as `partitions_total` for a large table, the query is reading nearly everything. Before throwing a bigger warehouse at it, look at the filter and whether the data layout lets Snowflake prune partitions. More compute won't fix a bad access pattern.
