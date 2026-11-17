---
title: "Open-Weight vs Closed Models: How I Choose"
date: 2025-10-18
tags: ["post", "genai", "llms"]
---

Every time I start messing with an LLM project, I end up asking the same thing: do I pay for an API or run a model myself? The internet turns this into a weird ideological war about open source and the future of AI. I'm mostly interested in what works, what it costs and whether I'm going to spend my weekend fixing GPU drivers.

## What the two camps actually are

**Closed models** are the ones you reach through a provider's API: the GPT, Claude and Gemini families. You send a request, you get tokens back, and you never see the weights.

**Open-weight models** publish their weights so you can download and run them: the Llama, Qwen, Mistral and Gemma families, among others. "Open-weight" is the honest term. Most of them don't release training data or the full training recipe, so they aren't open source in the sense the term usually carries for software.

People get unnecessarily tribal about this. A strong closed model will usually be easier to work with on difficult reasoning tasks. But if I'm extracting fields from documents or classifying messages, paying frontier-model prices may be a complete waste. It depends on the job.

## Privacy and data residency

This is the first thing I'd ask before looking at benchmark charts.

With a closed API, your prompts leave your infrastructure. Providers offer enterprise terms, zero-retention options and regional hosting, and for many teams that's enough. For others, particularly anything touching financial, health or customer records, the policy answer is simply "data does not leave our network". In that case an open-weight model running on your own hardware or a private cloud deployment isn't a preference, it's the requirement.

## Cost

The cost models are different in shape, not just size.

- **Closed APIs** charge per token. Zero cost when idle, cost grows linearly with use.
- **Self-hosted open models** cost roughly the same whether you send one request or a million, because you're paying for GPUs by the hour. Cheap per request at high, steady volume; expensive if the machine sits idle.

Do the boring maths before saying self-hosting is cheaper. Estimate monthly tokens and the API bill. Then price the hardware, power, capacity and somebody's time to keep the thing alive. For a side project with sporadic traffic, an API is usually cheaper. If you're hammering a narrow task all day, the calculation can flip.

## Latency

Hosted APIs are fast but you don't control them. You share capacity with everyone else, and response times can vary through the day.

Self-hosting gives you control: you can put a small model next to your application, keep it warm, and get consistent latency. A small open model that answers in a fraction of a second can beat a much stronger remote model for anything interactive, like autocomplete or routing a request to the right handler.

## Quality

Please stop choosing models from leaderboard screenshots. Give each candidate fifty to a few hundred real examples of *your* task and look at where it fails. A model that wins a reasoning benchmark might still be worse at reading your messy PDFs.

What I usually find:

- For open-ended reasoning, long multi-step instructions and tricky code, the top closed models are still the safest bet.
- For narrow, well-defined jobs, a mid-sized open model often lands close enough, especially with a good prompt and a few examples.

"Close enough" is a product decision. A 2% drop in accuracy may be fine for tagging support tickets and unacceptable for anything a customer reads directly.

## Licensing

Open-weight doesn't mean do whatever you like. Licences vary across families: some are permissive (Apache 2.0 style), others are custom licences with acceptable-use policies, attribution rules or restrictions above a certain user count. Read the licence for the specific model before building a product on it, and check it again when you upgrade, because terms can change between releases.

Closed APIs have their own terms too, usually around what you can use outputs for. Read those as well.

## Fine-tunability

With open weights you can fine-tune however you want: full fine-tuning, or parameter-efficient methods like **LoRA** that train a small set of extra weights. You own the result and can run it anywhere.

Some closed providers offer fine-tuning through their API, but on their terms: limited model choice, limited control over the process, and the tuned model lives on their platform. If adapting the model's behaviour deeply is central to the project, open weights give you far more room.

## Ops burden

This is the dimension people underestimate. Running a model means:

- provisioning and paying for GPUs
- choosing and maintaining a serving stack (vLLM, TGI, llama.cpp or similar)
- handling scaling, monitoring, failover and upgrades
- managing quantisation trade-offs between memory and quality

An API call is a few lines of code and someone else's operational headache. That has value. If nobody wants to own the serving infrastructure, admit it before volunteering the whole team for a new side quest.

## How it plays out

A simplified version of my decision:

```text
Must data stay in-house?          -> open-weight, self-hosted
Prototype or low/spiky volume?    -> closed API
Hardest reasoning, top quality?   -> closed API (check with evals)
Narrow task, high steady volume?  -> open-weight, possibly fine-tuned
Need deep behaviour changes?      -> open-weight + LoRA
No one to run infra?              -> closed API, or a managed host for open models
```

The last line matters: there's a middle path. Several providers host open-weight models behind an API, so you get the model choice and licence of open weights with per-token pricing and no GPUs to babysit.

## What I'd do for a new project

- Start with a hosted API unless privacy rules or the workload say otherwise. First prove the feature is useful.
- Build an evaluation set from day one, so switching models is a measurement rather than a debate.
- Keep the model behind a thin interface in your code. Swapping providers or moving to a self-hosted model should be a config change, not a rewrite.
- Revisit the choice when usage, privacy requirements or model quality changes. This isn't a lifelong commitment to a model family.
