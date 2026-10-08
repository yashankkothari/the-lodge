import math
from ollama_client import chat, embed
chunks = [  # (source, text) — in real life these come from your chunker
    ("runbook.md#suspend", "ETL_WH auto-suspends after 60 seconds idle. Resume happens automatically on the next query."),
    ("runbook.md#retries", "Airflow tasks retry 3 times with a 5 minute delay before paging the on-call engineer."),
    ("dbt.md#incremental", "fct_events is incremental with a 3-day lookback so late events are merged, not duplicated."),
    ("costs.md#budget", "The monthly Snowflake budget is 400 credits; a resource monitor suspends warehouses at 100%."),
    ("oncall.md#rota", "On-call rotates weekly on Mondays at 10:00 IST."),
]
vecs = embed([f"{src}: {txt}" for src, txt in chunks])  # prepend the source, like a heading
def cos(a, b): return sum(x*y for x, y in zip(a, b)) / (math.sqrt(sum(x*x for x in a)) * math.sqrt(sum(y*y for y in b)))
question = "What happens when a task fails in Airflow?"
q = embed([question])[0]
ranked = sorted(zip(chunks, vecs), key=lambda cv: cos(q, cv[1]), reverse=True)[:2]
for (src, _), v in ranked: print(f"retrieved  {cos(q, v):.3f}  {src}")
context = "\n".join(f"[{src}] {txt}" for (src, txt), _ in ranked)
prompt = f"Answer only from the sources and cite them in brackets. If they don't say, reply 'not in the docs'.\n\nSources:\n{context}\n\nQuestion: {question}"
print("\nanswer:", chat([{"role": "user", "content": prompt}], temperature=0)["message"]["content"].strip())
