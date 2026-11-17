---
title: "Open-Weight vs Closed Models: How I Choose"
date: 2025-10-18
tags: ["post", "genai", "llms"]
---

Every time I start messing with an LLM project, I end up asking the same thing: do I pay for an API or run a model myself? The internet turns this into a weird ideological war about open source and the future of AI. I'm mostly interested in what works, what it costs and whether I'm going to spend my weekend fixing GPU drivers.

## What the two camps actually are

When I say **closed model**, I mean something like GPT, Claude or Gemini accessed through an API. I send text, the provider runs the model, and I get a response. I don't get to download the weights or decide how inference is run.

**Open-weight** means the weights are available for me to run, like models in the Llama, Qwen, Mistral and Gemma families. Notice I didn't say open source. Training data and training recipes are often missing, and some licences are restrictive. Having the weights is useful; pretending every release meets the traditional meaning of open-source software isn't.

People get unnecessarily tribal about this. A strong closed model will usually be easier to work with on difficult reasoning tasks. But if I'm extracting fields from documents or classifying messages, paying frontier-model prices may be a complete waste. It depends on the job.

## Privacy and data residency

This is the first thing I'd ask before looking at benchmark charts.

An API request usually means sending the prompt and relevant data to somebody else's infrastructure. Some providers offer regional hosting and enterprise data-handling terms, which may be fine for your use case. But if the actual requirement says customer records must remain inside your network, the discussion is already over. Run a suitable model in infrastructure you control. Don't build a privacy argument from a benchmark screenshot.

## Cost

Cost depends on how often you're using the thing, not just the advertised price per million tokens.

- **API:** pay for the tokens you use. No inference-server bill sitting there when traffic disappears.
- **Self-hosted:** you're paying for GPU capacity whether or not requests arrive. Under heavy, predictable load, you can spread that cost across lots of calls. At low utilisation, it's an expensive space heater.

Do the boring maths before saying self-hosting is cheaper. Estimate monthly tokens and the API bill. Then price the hardware, power, capacity and somebody's time to keep the thing alive. For a side project with sporadic traffic, an API is usually cheaper. If you're hammering a narrow task all day, the calculation can flip.

## Latency

An API can be extremely fast, but you don't control the queue on the provider's side. Response times can change when their service is busy or an upstream dependency is having a bad day.

On your own hardware, you can keep a small model loaded close to the application and tune the serving stack for your traffic. If you're doing autocomplete or routing requests, a small model answering quickly may be much more useful than a frontier model with a long network round trip. The better model on paper isn't always the better product choice.

## Quality

Please stop choosing models from leaderboard screenshots. Give each candidate fifty to a few hundred real examples of *your* task and look at where it fails. A model that wins a reasoning benchmark might still be worse at reading your messy PDFs.

This is how I'd start testing candidates:

- For difficult reasoning, complicated coding and long instructions, I'd benchmark the strongest hosted models first.
- For classification, extraction and other narrowly defined jobs, I'd test smaller open models early. A few good examples in the prompt can get you surprisingly far.

And define "good enough" before you test. Losing two accuracy points on internal ticket tags is not the same as losing two points on a customer-facing decision. The metric needs a real-world consequence attached to it.

## Licensing

Downloading a model doesn't mean you can use it however you like. Some weights come with permissive Apache-style terms. Others have their own usage rules, attribution requirements or restrictions tied to scale. Check the licence for the *exact version* you're using. A different release in the same family might have different terms.

API providers have terms about data and outputs too. I wouldn't skim those just because there's no model file to download.

## Fine-tunability

With weights you can adapt the model yourself. Full fine-tuning changes the base weights; methods like **LoRA** train smaller additional matrices. That gives you more control over the process and lets you deploy the adapted model where you need it, subject to its licence.

Some closed APIs also offer fine-tuning. The difference is that you're working within their supported models, methods and hosting setup. If custom training is central to the whole product, I'd be reluctant to lock myself into that much provider control without a good reason.

## Ops burden

Here's the part that gets omitted from all the "self-hosted AI is free" posts. Running your own inference service means somebody has to deal with:

- GPU capacity and the actual bill for running it.
- A serving stack like vLLM, TGI or llama.cpp, plus upgrades and compatibility problems.
- Monitoring, traffic spikes, failed processes and restarts.
- Quantisation and its trade-off between memory use, speed and output quality.

An API call is a few lines of code and someone else's operational headache. That has value. If nobody wants to own the serving infrastructure, admit it before volunteering the whole team for a new side quest.

## How it plays out

If I'm sketching the decision on a whiteboard, it looks roughly like this:

```text
Must data stay in-house?          -> open-weight, self-hosted
Prototype or low/spiky volume?    -> closed API
Hardest reasoning, top quality?   -> closed API (check with evals)
Narrow task, high steady volume?  -> open-weight, possibly fine-tuned
Need deep behaviour changes?      -> open-weight + LoRA
No one to run infra?              -> closed API, or a managed host for open models
```

There's also an option people forget: an open-weight model hosted by somebody else. You get to choose the model family without running inference yourself. That can be a sensible compromise when the licence and hosting terms fit the project.

## What I'd do for a new project

- Unless privacy or workload rules force my hand, I'd prototype with a hosted model first and figure out whether anyone wants the feature.
- I'd save real test cases from the beginning. That way changing models later is a comparison, not a fight about which one feels smarter.
- I'd keep provider-specific calls behind a small interface instead of letting them spread through the codebase.
- I'd check the decision again once usage grows. The cheapest or best model in October might be a terrible choice by February.
