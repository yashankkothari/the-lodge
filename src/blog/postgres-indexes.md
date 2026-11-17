---
title: "Postgres Indexes: A Practical Guide"
date: 2025-12-13
tags: ["post", "backend", "sql", "guides"]
---

When a Postgres query is slow, the first instinct is usually "add an index". Sometimes that's exactly right. Other times there's already an index and the query planner has a perfectly good reason to ignore it. I've found it's worth understanding *why* before creating five more indexes and hoping one works.

This is the model I use for B-trees, composite indexes and reading the actual query plan.

## What a B-tree index is

In Postgres, a normal `CREATE INDEX` gives you a **B-tree** unless you specify otherwise. Think of a sorted lookup structure that stores the indexed values and points back to rows in the table. Sorting is what makes certain searches fast without scanning every record.

That means it works particularly well for:

- Exact lookups such as `WHERE email = 'a@b.com'`.
- Ranges like `WHERE created_at >= '2025-12-01'`.
- Queries that need results ordered by an indexed column.
- Prefix searches such as `LIKE 'Yas%'`, provided the collation or operator class supports that use.

It doesn't magically speed up `LIKE '%shank'` because the useful sorted prefix is missing. This is why "but the column is indexed" isn't a convincing performance argument.

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

Postgres creates a unique index for the primary key automatically. It does **not** create an index for every foreign key. If a foreign-key column is heavily used in joins or affected by parent-row updates and deletes, check whether it needs its own index. That's an easy detail to miss when the schema looks properly constrained.

## Composite indexes: column order matters

For a multi-column index, order matters. Picture a phone book sorted by surname first and given name second. It's easy to find all the people named Kothari, then narrow down to a particular first name. Looking up only a first name is a different problem. A composite B-tree behaves similarly.

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

What about filtering only by `created_at`? This index is arranged by customer first, so the dates aren't in one convenient global range. Depending on the data and Postgres version, the planner may find another approach much cheaper.

My starting rule is to put common equality filters before the range or sort key. It's not an absolute law—query patterns and selectivity matter—but it's a good mental model before looking at the actual plan.

## Partial indexes

Sometimes indexing the whole table is unnecessary. If the hot query only cares about pending orders, a **partial index** can cover just those rows:

```sql
CREATE INDEX idx_orders_pending ON orders (created_at)
WHERE status = 'pending';
```

Suppose only 2% of orders are pending. A partial index can be much smaller and cheaper than an index covering all orders. But the planner has to recognise that the query satisfies the index predicate. Here's the sort of query that can use it:

```sql
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50;
```

They're also handy for rules like "a user can only have one active cart", where a normal uniqueness constraint would be too broad:

```sql
CREATE UNIQUE INDEX one_active_cart ON carts (user_id) WHERE active;
```

## Expression indexes

Here's another common gotcha: you index `email` and later search using `lower(email)`. The plain index isn't necessarily useful for that transformed value. If that's the query pattern, index the expression itself:

```sql
CREATE INDEX idx_users_email_lower ON users (lower(email));

SELECT * FROM users WHERE lower(email) = 'yashank@example.com';
```

The expression in the query needs to match what the index can support. For date transformations, I'd first ask whether the query could use a simple timestamp range instead. A plain index on the underlying column is often easier to reuse.

## Covering indexes with INCLUDE

Usually an index tells Postgres which rows to visit, but it still has to fetch other columns from the table. An **index-only scan** can avoid those table reads when the index contains everything the query needs and the visibility map says the relevant pages are all-visible. That's one reason vacuum maintenance matters.

`INCLUDE` lets you carry extra columns in the index without making them part of its search ordering:

```sql
CREATE INDEX idx_orders_cust_cov ON orders (customer_id, created_at)
INCLUDE (status, total);

SELECT created_at, status, total
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC;
```

I'd use this for a very common query that needs a few extra small columns. Stuff every wide text field into the index and you've defeated the point by making the index enormous.

## Reading EXPLAIN ANALYZE

The query planner gets the final vote. To see what it actually chose, run:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
```

Careful: `ANALYZE` executes the statement. Don't casually run it on a destructive write query; use a transaction and roll it back if you're testing one. For a read query, these are the bits I scan first:

- **Scan type:** is Postgres reading the whole table (`Seq Scan`), walking an index, or using a bitmap scan to gather matching table pages?
- **Estimates versus reality:** if it expects ten rows and gets fifty thousand, statistics may be misleading it. Run `ANALYZE orders;` and inspect the plan again.
- **Actual time:** look for the expensive nodes rather than focusing on the top-level total alone.
- **Sorting:** an `external merge` sort spilled to disk. Sometimes a better index can avoid that step altogether.
- **Buffer activity:** `shared hit` indicates cached pages; `read` points to pages fetched into the buffer cache.

And please don't treat `Seq Scan` as an error message. For a tiny table, or a query reading most of the rows, scanning everything can be the best plan. The objective is a fast query, not a pretty-looking execution plan.

## When indexes hurt

Indexes aren't free. Every `INSERT` has to maintain them, and an `UPDATE` that changes an indexed column has work to do too. It can also prevent Postgres's HOT optimisation, which avoids index updates when the indexed values stay the same. Then there's disk space, memory and vacuum overhead. This is why indexing everything "just in case" is a bad habit.

Before creating another index, I'd check a few things:

- Is there a real query that needs it, or am I just indexing columns out of anxiety?
- Does `pg_stat_user_indexes` show the existing index has been unused over a meaningful observation period? If so, investigate before keeping it forever.
- Are two indexes doing almost the same work, such as `(customer_id)` and `(customer_id, created_at)`?
- Will creating it block production writes? On busy tables I'd look at `CREATE INDEX CONCURRENTLY`, accepting that it takes longer and can't run inside a transaction.

## What to remember

- Start with the slow query and `EXPLAIN (ANALYZE, BUFFERS)`. Look at what Postgres actually did before deciding what it should have done.
- Think about composite column order based on equality filters, ranges and sorting, then verify with a plan.
- Use partial indexes for small hot subsets, expression indexes when queries transform values, and `INCLUDE` when a covering index genuinely helps.
- Don't assume a foreign-key declaration added an index for you.
- Every extra index has a write cost. If nobody uses it, ask why you're still maintaining it.
