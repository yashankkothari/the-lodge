import json
from ollama_client import chat
schema = {"type": "object", "properties": {"severity": {"type": "string", "enum": ["low", "medium", "high"]},
          "component": {"type": "string"}, "summary": {"type": "string"}}, "required": ["severity", "component", "summary"]}
log = "ERROR airflow.task: load_orders failed after 3 retries: Snowflake warehouse ETL_WH suspended"
r = chat([{"role": "user", "content": f"Classify this log line as JSON.\n{log}"}], format=schema, temperature=0)
print(json.dumps(json.loads(r["message"]["content"]), indent=2))
