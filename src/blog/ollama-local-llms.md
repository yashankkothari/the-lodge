---
title: "Running Local LLMs with Ollama: A Hands-On Guide"
date: 2026-10-08
tags: ["post", "genai", "ollama", "linux", "guides"]
---

One of my favourite things about messing with local LLMs is that I can break things without watching a token bill climb. **Ollama** lets me run open-weight models through a local HTTP server. No API key, and prompts sent to that local server don't have to leave the laptop. It's what I use behind my [OpenClaw Telegram assistant](/blog/openclaw-telegram-ollama/).

The screenshots aren't mockups. I ran these commands and captured the output while putting this guide together.

<figure><img src="/img/blog/diagram-ollama-arch.png" alt="Ollama architecture: client, server, scheduler, llama.cpp runner" loading="lazy"><figcaption>One server process on port 11434 loads models on demand and runs them on your GPU or CPU.</figcaption></figure>

## 1. Install it

On my Omarchy setup you can find Ollama under **Install > AI > Ollama** (`Super + Alt + Space`). I also like knowing the actual packages underneath, especially when GPU support misbehaves. Pick the one for your hardware:

```bash
yay -S ollama          # CPU only
yay -S ollama-cuda     # NVIDIA
yay -S ollama-rocm     # AMD
sudo systemctl enable --now ollama
```

On other Linux distributions, Ollama also provides `curl -fsSL https://ollama.com/install.sh | sh`. As always, read a script before piping it into your shell if you want to know what it's installing.

## 2. Pull and run a model

```bash
ollama pull qwen3:1.7b
ollama run qwen3:1.7b --think=false "In one sentence: what does Ollama do?"
```

<figure><img src="/img/blog/term-ollama_pull.png" alt="ollama pull output" loading="lazy"><figcaption>Models download as layers, like container images.</figcaption></figure>

<figure><img src="/img/blog/term-ollama_run.png" alt="ollama run answer and ollama ps output" loading="lazy"><figcaption>Real output, and a real lesson: the 1.7B model confidently got its own description wrong.</figcaption></figure>

Look at the screenshot carefully. The tiny model gave a completely wrong description of Ollama with absolutely no hesitation. Ollama isn't itself a language model, and it isn't an OpenAI product. That little failure is why I like experimenting locally. Small models can be genuinely useful for extraction or classification, but I wouldn't use one as an encyclopedia. Give it real source material when facts matter; that's where [RAG](/blog/rag-pipeline-guide/) comes in.

The `ollama ps` output in the same screenshot is worth looking at too. It tells you what's actually loaded, whether the model is using GPU or CPU, how much memory it's occupying and what context size it's using. Much more useful than guessing why a model is slow.

## 3. Pick a model that fits your hardware

Don't start by downloading the biggest model with the most impressive benchmarks. Start with what the machine can actually run:

- **Model weights need space.** As a rough guide, 4-bit weights use about 0.6–0.7 GB for every billion parameters, before accounting for context and runtime overhead. Think around 6 GB of VRAM for 7–8B, roughly 10 GB for 14B, depending on the model and quantisation.
- **A huge context can kill an otherwise working setup.** The KV cache grows with `num_ctx`. I tried 32k on a machine with 8 GB RAM and watched the runner die with HTTP 500s. At 8k, the same setup worked.
- **Make it work with a small model first.** I usually test the plumbing on something around 1.7B–4B, then increase size until the speed or memory trade-off becomes annoying.

```bash
ollama show qwen3:1.7b     # architecture, context length, capabilities
ollama list                # what's on disk
ollama rm <model>          # free the space
```

<figure><img src="/img/blog/term-ollama_basics.png" alt="ollama show output with capabilities" loading="lazy"><figcaption><code>ollama show</code> tells you whether a model supports tools and thinking before you build on it.</figcaption></figure>

## 4. Call it from code

The CLI isn't doing anything mystical. Underneath it, Ollama exposes an HTTP service on `localhost:11434`. You can call its native endpoints or the OpenAI-compatible interface. That means existing SDK code often needs little more than a different base URL.

<figure><img src="/img/blog/term-ollama_api.png" alt="curl calls to /api/chat and /v1/chat/completions" loading="lazy"><figcaption>The same server answering the native API and the OpenAI-style endpoint.</figcaption></figure>

Here's the Python version with the OpenAI SDK pointed at my local server:

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # key is ignored
r = client.chat.completions.create(model="qwen3:1.7b",
        messages=[{"role": "user", "content": "Summarise this log line: ..."}])
print(r.choices[0].message.content)
```

## 5. Make your own model with a Modelfile

If I keep reusing the same instructions and settings, I'd rather put them in a **Modelfile** than paste them into every request. It creates a named configuration based on an existing model:

<figure><img src="/img/blog/term-ollama_modelfile.png" alt="Modelfile, ollama create, and a test run" loading="lazy"><figcaption>A custom <code>linux-helper</code> model built from <code>qwen3:1.7b</code>. It reuses the base layers, so it costs almost no disk.</figcaption></figure>

In the screenshot it suggests `netstat`. That's not technically absurd, but on Omarchy I'd reach for `ss -ltnp | grep 11434`. Small models often produce the familiar answer from training data, which isn't always the best one for your exact machine.

## 6. Embeddings for search and RAG

Ollama isn't limited to chat models. It can serve embeddings too. I used `nomic-embed-text` here because it's lightweight enough for experimenting with actual retrieval instead of hand-waving about vector databases:

<figure><img src="/img/blog/term-ollama_embed.png" alt="Embedding request returning 768-dimension vectors" loading="lazy"><figcaption>Two strings in, two 768-dimension vectors out.</figcaption></figure>

If you're wondering what to do with those vectors, my [RAG walkthrough](/blog/rag-pipeline-guide/) uses this model in a short working retrieval example.

## 7. Settings worth changing

For an always-running assistant, I'd configure the service itself so I don't have to pass the same options from every client:

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

Please keep the server on `127.0.0.1` unless you deliberately secure it. Ollama's API doesn't have built-in authentication. Exposing it to the internet because you wanted to chat with a model from your phone is a great way to let strangers use your GPU.

## Cheat sheet

| Command | What it does |
| --- | --- |
| `ollama pull <model>` | Grab the model weights |
| `ollama run <model>` | Open a chat or run a one-off prompt |
| `ollama ps` | See loaded models, memory placement and context |
| `ollama show <model>` | Check architecture, settings and capabilities |
| `ollama create <name> -f Modelfile` | Save a reusable model configuration |
| `ollama launch openclaw` | Start the OpenClaw setup using Ollama |

If you want to take it further, I wrote up [how I connected it to Telegram with OpenClaw](/blog/openclaw-telegram-ollama/). It's much more fun once you can actually use the thing away from your desk.
