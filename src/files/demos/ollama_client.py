import json, urllib.request
URL = "http://localhost:11434"
_opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
def post(path, body):
    req = urllib.request.Request(URL + path, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    return json.load(_opener.open(req, timeout=300))
def chat(messages, model="qwen3:1.7b", **opts):
    body = {"model": model, "messages": messages, "stream": False, "think": False}
    tools = opts.pop("tools", None)
    fmt = opts.pop("format", None)
    if tools: body["tools"] = tools
    if fmt: body["format"] = fmt
    if opts: body["options"] = opts
    return post("/api/chat", body)
def embed(texts, model="nomic-embed-text"):
    return post("/api/embed", {"model": model, "input": texts})["embeddings"]
