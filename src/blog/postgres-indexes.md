---
title: "Postgres Indexes: A Practical Guide"
date: 2025-12-13
tags: ["post", "backend", "sql", "guides"]
---

Most slow Postgres queries I've debugged came down to one of two things: a missing index, or an index that existed but couldn't be used. This is the mental model and the handful of patterns that cover most real cases.

## What a B-tree index is

When you run `CREATE INDEX` without specifying a type, Postgres builds a **B-tree**. It's a sorted, balanced tree of the indexed values, each pointing to the row's location in the table (the heap).

Because it's sorted, a B-tree is good at:

- equality: `WHERE email = 'a@b.com'`
- ranges: `WHERE created_at >= '2025-12-01'`
- sorting: `ORDER BY created_at`
- prefix matches: `WHERE name LIKE 'Yas%'` (with the right collation or operator class)

It does not help `LIKE '%shank'`, because there's no sorted prefix to search on.

```sql
CREATE TABLE orders (
    id          bigserial PRIMARY KEY,
    customer_id bigint      NOT NULL,
    status      text        NOT NULL,
    total       numeric(12,2),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
```

The primary key already gets a unique B-tree index automatically. Foreign keys do not, which catches people out: if you join or delete on `customer_id`, index it yourself.

## Composite indexes: column order matters

A composite index sorts by the first column, then by the second within each value of the first, and so on. Think of a phone book sorted by surname, then first name.

```sql
CREATE INDEX idx_orders_cust_created ON orders (customer_id, created_at);
```

This index serves:

```sql
-- uses both columns
SELECT * FROM orders WHERE customer_id = 42 AND created_at >= '2025-11-01';

-- uses the leading column
SELECT * FROM orders WHERE customer_id = 42;

-- equality on the first, sort on the second: no separate sort step
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
```

It is a poor fit for `WHERE created_at >= ...` alone, because the dates are scattered across every customer.

The rule of thumb: **equality columns first, then the range or sort column**. Put the column you filter on with `=` at the front, and the one you filter with `>` or `ORDER BY` after it.

## Partial indexes

If your queries only ever care about a subset of rows, index only that subset.

```sql
CREATE INDEX idx_orders_pending ON orders (created_at)
WHERE status = 'pending';
```

If 2% of orders are pending, this index is a fraction of the size of a full one, cheaper to maintain and more likely to stay in memory. The query has to include a matching condition for the planner to use it:

```sql
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50;
```

Partial indexes are also the clean way to enforce conditional uniqueness:

```sql
CREATE UNIQUE INDEX one_active_cart ON carts (user_id) WHERE active;
```

## Expression indexes

An index on `email` doesn't help `WHERE lower(email) = ...`, because the indexed values aren't lowercased. Index the expression instead:

```sql
CREATE INDEX idx_users_email_lower ON users (lower(email));

SELECT * FROM users WHERE lower(email) = 'yashank@example.com';
```

The query must use the same expression. The same applies to things like `date_trunc('day', created_at)`, though often it's better to rewrite the query as a range on the raw column so a plain index works.

## Covering indexes with INCLUDE

Normally an index lookup finds matching entries, then visits the table to fetch the other columns. If the index holds every column the query needs, Postgres can do an **index-only scan** and skip the table (as long as the visibility map says the pages are all-visible, which regular vacuuming keeps true).

`INCLUDE` adds columns to the index leaf entries without making them part of the sort key:

```sql
CREATE INDEX idx_orders_cust_cov ON orders (customer_id, created_at)
INCLUDE (status, total);

SELECT created_at, status, total
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC;
```

Use it for hot queries that read a few small columns. Don't stuff wide text columns in; the index gets large and the benefit disappears.

## Reading EXPLAIN ANALYZE

Never guess whether an index is used. Ask:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
```

`ANALYZE` actually runs the query, so be careful with writes (wrap them in a transaction and roll back). What I look for:

- **Node types.** `Seq Scan` reads the whole table. `Index Scan` and `Index Only Scan` use an index. `Bitmap Heap Scan` collects matches from an index first, then reads table pages in order, which is common for medium selectivity.
- **Estimated vs actual rows.** `rows=10` estimated against `rows=50000` actual means the planner's statistics are off. Run `ANALYZE orders;` and see if the plan changes.
- **Where the time goes.** Each node shows `actual time=start..end`. Read from the innermost node outwards and find the expensive one.
- **Sort nodes.** A `Sort` with `external merge` spilled to disk. An index matching the `ORDER BY` can remove the sort entirely.
- **Buffers.** `shared hit` came from memory, `read` came from disk.

A sequential scan isn't automatically wrong. On a small table, or when the query returns a large share of rows, it's often the fastest plan, and the planner knows that.

## When indexes hurt

Every index is a cost on writes. Each `INSERT` updates every index on the table; an `UPDATE` that changes an indexed column does too, and it can prevent Postgres's HOT optimisation, which avoids index updates when no indexed column changes. Indexes also take disk space, compete for memory and add vacuum work.

So:

- Don't index every column "just in case".
- Find unused indexes with `pg_stat_user_indexes` (look for `idx_scan = 0` over a meaningful period) and drop them.
- Watch for redundant indexes: one on `(customer_id)` is mostly covered by one on `(customer_id, created_at)`.
- On a live table, use `CREATE INDEX CONCURRENTLY` to avoid blocking writes while it builds. It's slower and can't run inside a transaction.

## What to remember

- Start from the slow query, run `EXPLAIN (ANALYZE, BUFFERS)`, and let the plan tell you what's missing.
- Composite index: equality columns first, then range or sort.
- Use partial indexes for hot subsets, expression indexes for transformed lookups, `INCLUDE` for index-only scans.
- Index foreign keys yourself.
- Treat every index as a write cost and remove the ones nobody uses.
