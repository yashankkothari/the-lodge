import re
from ollama_client import chat
golden = [
    ("What port does Ollama listen on by default? Number only.", lambda a: "11434" in a),
    ("Is SQL's COUNT(*) affected by NULLs? Answer yes or no.", lambda a: a.lower().startswith("no")),
    ("Return the ISO date for 14 August 2026, nothing else.", lambda a: a.strip() == "2026-08-14"),
    ("Which Airflow template variable holds the logical date as YYYY-MM-DD? Reply like {{ x }}.", lambda a: "{{ ds }}" in a.replace("{{ds}}", "{{ ds }}")),
    ("Name the Snowflake feature that suspends warehouses at a credit quota. Two words.", lambda a: bool(re.search(r"resource monitor", a, re.I))),
]
passed = 0
for q, check in golden:
    a = chat([{"role": "user", "content": q}], temperature=0, num_predict=40)["message"]["content"].strip()
    ok = check(a); passed += ok
    print(f"{'PASS' if ok else 'FAIL'}  {q[:52]:<52}  -> {a[:40]!r}")
print(f"\nscore: {passed}/{len(golden)}  (gate: >= 4 to merge)")
