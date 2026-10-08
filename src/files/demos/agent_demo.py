import json, shutil
from ollama_client import chat
def disk_usage(path: str) -> dict:
    if path not in ("/", "/home"): return {"error": "path not allowed"}   # guardrail: allowlist
    u = shutil.disk_usage(path); return {"path": path, "used_pct": round(100 * u.used / u.total, 1)}
TOOLS = {"disk_usage": disk_usage}
schema = [{"type": "function", "function": {"name": "disk_usage", "description": "Percent of disk used for a path",
           "parameters": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}}}]
messages = [{"role": "user", "content": "Is my root disk (/) more than 80% full?"}]
for step in range(1, 5):                      # guardrail: step budget
    msg = chat(messages, tools=schema, temperature=0)["message"]
    messages.append(msg)
    if not msg.get("tool_calls"):
        print(f"step {step}: final answer -> {msg['content'].strip()}"); break
    for call in msg["tool_calls"]:
        name, args = call["function"]["name"], call["function"]["arguments"]
        result = TOOLS[name](**args)
        print(f"step {step}: tool call  -> {name}({json.dumps(args)}) = {json.dumps(result)}")
        messages.append({"role": "tool", "tool_name": name, "content": json.dumps(result)})
