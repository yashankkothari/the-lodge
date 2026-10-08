---
title: "Running Local LLMs with Ollama: A Hands-On Guide"
date: 2026-10-08
tags: ["post", "genai", "ollama", "linux", "guides"]
---

Ollama runs open-weight models on your own machine behind a small HTTP server. No API key, no per-token bill, and your prompts never leave the laptop. It's the model backend for my [OpenClaw Telegram assistant](/blog/openclaw-telegram-ollama/), and the easiest way I know to learn how LLMs behave.

Every screenshot here is real terminal output, captured while writing this guide.

<figure><img src="/img/blog/diagram-ollama-arch.png" alt="Ollama architecture: client, server, scheduler, llama.cpp runner" loading="lazy"><figcaption>One server process on port 11434 loads models on demand and runs them on your GPU or CPU.</figcaption></figure>

## 1. Install it

On Omarchy, use **Install > AI > Ollama** in the menu (`Super + Alt + Space`), or install from the repos. Pick the package that matches your GPU:

```bash
yay -S ollama          # CPU only
yay -S ollama-cuda     # NVIDIA
yay -S ollama-rocm     # AMD
sudo systemctl enable --now ollama
```

On any other Linux, the official script does the same: `curl -fsSL https://ollama.com/install.sh | sh`.

## 2. Pull and run a model

```bash
ollama pull qwen3:1.7b
ollama run qwen3:1.7b --think=false "In one sentence: what does Ollama do?"
```

<figure><img src="/img/blog/term-ollama_pull.png" alt="ollama pull output" loading="lazy"><figcaption>Models download as layers, like container images.</figcaption></figure>

<figure><img src="/img/blog/term-ollama_run.png" alt="ollama run answer and ollama ps output" loading="lazy"><figcaption>Real output, and a real lesson: the 1.7B model confidently got its own description wrong.</figcaption></figure>

Look at that answer. Ollama is not a model and has nothing to do with OpenAI, but a small model said so with total confidence. Small local models are great for classification, extraction, formatting and grounded answers. Don't trust them on facts from memory. Give them the facts (that's what [RAG](/blog/rag-pipeline-guide/) is for).

`ollama ps` is the other half of that screenshot. It shows what's loaded, how much memory it takes, whether it's on GPU or CPU, and the context size it was loaded with.

## 3. Pick a model that fits your hardware

Rules of thumb that have held up for me:

- **Memory:** a 4-bit model needs roughly 0.6 to 0.7 GB per billion parameters, plus room for the context. A 7–8B model wants about 6 GB of VRAM; a 14B model about 10 GB.
- **Context costs memory too.** The KV cache grows with `num_ctx`. On a test box with 8 GB of RAM, a 32k context on even a tiny model got the runner killed and every request returned HTTP 500. Dropping to 8k fixed it.
- **Start small, then go up.** Try a 1.7B–4B model first to check your pipeline works, then move to the largest model that stays fast enough.

```bash
ollama show qwen3:1.7b     # architecture, context length, capabilities
ollama list                # what's on disk
ollama rm <model>          # free the space
```

<figure><img src="/img/blog/term-ollama_basics.png" alt="ollama show output with capabilities" loading="lazy"><figcaption><code>ollama show</code> tells you whether a model supports tools and thinking before you build on it.</figcaption></figure>

## 4. Call it from code

The CLI is a client for a REST API on `localhost:11434`. There's a native API and an OpenAI-compatible one, so most SDKs work by changing the base URL.

<figure><img src="/img/blog/term-ollama_api.png" alt="curl calls to /api/chat and /v1/chat/completions" loading="lazy"><figcaption>The same server answering the native API and the OpenAI-style endpoint.</figcaption></figure>

In Python with the OpenAI SDK:

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # key is ignored
r = client.chat.completions.create(model="qwen3:1.7b",
        messages=[{"role": "user", "content": "Summarise this log line: ..."}])
print(r.choices[0].message.content)
```

## 5. Make your own model with a Modelfile

A Modelfile bakes a system prompt and parameters into a named model, so every client gets the same behaviour:

<figure><img src="/img/blog/term-ollama_modelfile.png" alt="Modelfile, ollama create, and a test run" loading="lazy"><figcaption>A custom <code>linux-helper</code> model built from <code>qwen3:1.7b</code>. It reuses the base layers, so it costs almost no disk.</figcaption></figure>

Notice it answered with `netstat`, which is fine, but on Omarchy I'd use `ss -ltnp | grep 11434`. Small models give the most common answer, not always the best one.

## 6. Embeddings for search and RAG

Ollama also serves embedding models. `nomic-embed-text` is small and good enough to build real retrieval on:

<figure><img src="/img/blog/term-ollama_embed.png" alt="Embedding request returning 768-dimension vectors" loading="lazy"><figcaption>Two strings in, two 768-dimension vectors out.</figcaption></figure>

The [RAG guide](/blog/rag-pipeline-guide/) uses exactly this to build a 30-line retrieval demo.

## 7. Settings worth changing

Set these on the service so every client gets them:

```bash
sudo systemctl edit ollama
```

```ini
[Service]
Environment="OLLAMA_CONTEXT_LENGTH=65536"   # agents like OpenClaw need a big window
Environment="OLLAMA_KEEP_ALIVE=30m"         # keep the model warm between messages
Environment="OLLAMA_HOST=127.0.0.1:11434"   # don't expose it to the network
```

```bash
sudo systemctl restart ollama
```

Keep the server on `127.0.0.1`. The API has no authentication, so anyone who can reach the port can use your GPU.

## Cheat sheet

| Command | What it does |
| --- | --- |
| `ollama pull <model>` | Download a model |
| `ollama run <model>` | Chat, or answer one prompt |
| `ollama ps` | What's loaded, on GPU or CPU, and its context |
| `ollama show <model>` | Capabilities and parameters |
| `ollama create <name> -f Modelfile` | Build a custom model |
| `ollama launch openclaw` | Set up OpenClaw on top of Ollama |

Next: [hooking Ollama up to Telegram with OpenClaw](/blog/openclaw-telegram-ollama/).
