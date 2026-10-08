import sqlite3, sys
db = sqlite3.connect(":memory:")
db.execute("create table fct_orders (order_date text, order_id int, amount real)")
batch = [("2026-08-14", i, 10.0 * i) for i in range(1, 1001)]

def load_append(rows):
    db.executemany("insert into fct_orders values (?,?,?)", rows)

def load_idempotent(rows, day):
    with db:  # one transaction: delete the partition, then insert it
        db.execute("delete from fct_orders where order_date = ?", (day,))
        db.executemany("insert into fct_orders values (?,?,?)", rows)

def count():
    return db.execute("select count(*), count(distinct order_id) from fct_orders").fetchone()

mode = sys.argv[1]
for attempt in (1, 2):  # the 3 a.m. retry
    load_append(batch) if mode == "append" else load_idempotent(batch, "2026-08-14")
    rows, distinct = count()
    print(f"{mode:<11} run {attempt}: rows={rows:<5} distinct order_ids={distinct}")
