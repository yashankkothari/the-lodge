---
title: "Alignment for Engineers: Helpful, Honest, Harmless in Actual Code"
date: 2026-04-25
tags: ["post", "essays", "ai-philosophy"]
---

"Helpful, honest, harmless" is a good slogan. It is also useless to a compiler. Nobody writes `if harmful: don't()`. What engineers actually write are prompts, filters, thresholds, test sets and fallback paths, and every one of those is a small, concrete guess about what the slogan means.

I've been thinking about this while working on data pipelines that sit near language models. The interesting part of alignment, for most of us, isn't the research on how models are trained. It's the layer we own: the code that decides what the model sees, what it's allowed to say back, and how we know whether it's behaving.

## Values are not specs

A value is something like "don't mislead the user". A spec is something a test can check: "if the retrieved documents don't contain the answer, the response must say so and must not include a number".

The gap between those two is where most of the work happens. The value is broad and the spec is narrow. Every spec you write covers some of the value and misses the rest, and the bits you miss are exactly the ones nobody tested.

This isn't a new problem. Requirements documents have always been lossy translations of what a business actually wants. The difference with language models is that the system will happily fill the gaps with plausible behaviour, so the missing parts don't fail loudly. They just quietly do something you didn't intend.

## Refusals are a product decision

A **refusal** looks like a safety feature, and sometimes it is. It is also a product decision with a cost.

If you build an assistant for an insurance claims team and it refuses to discuss anything involving injuries because "medical" tripped a filter, it isn't harmless. It's useless, and the user will route around it, probably by pasting the same text into a tool with fewer controls. Over-refusal pushes risk elsewhere rather than removing it.

So refusal logic deserves the same scrutiny as any other branch in your code:

- What exactly triggers it?
- What does the user see instead?
- Is there a path to a human or a different tool?
- How often does it fire on legitimate requests?

That last question is the one teams forget to measure.

## Guardrails are just code

A **guardrail** is a check before or after the model call. Input checks catch things you never want sent (personal data, credentials, prompt injection patterns). Output checks catch things you never want shown (unsupported numbers, leaked system text, malformed JSON).

```python
def answer(question: str, docs: list[str]) -> str:
    if contains_pii(question):
        return "I can't process personal identifiers here. Please remove them."

    raw = llm_call(build_prompt(question, docs))

    if not grounded_in(raw, docs):
        return "I couldn't find that in the provided documents."
    return raw
```

Nothing about this is magic. `contains_pii` and `grounded_in` are heuristics with false positives and false negatives. Treat them like any other classifier: know their error rates, log their decisions, and review the cases they get wrong. A guardrail you never measure is a guess you've stopped questioning.

## Evals are where honesty lives

If "honest" means anything at the code level, it means **evals**: a fixed set of inputs with known good behaviour, run every time you change the prompt, the model or the retrieval.

A useful eval set for honesty includes:

- Questions whose answer is in the context.
- Questions whose answer is deliberately not in the context, where the right response is "I don't know".
- Questions with a false premise, where the right response is to correct it.
- Questions that invite a confident number, where the right response is a caveat.

The second and third categories matter most. A system that scores well only on answerable questions has learned to answer, not to be honest.

## Goodhart is waiting for you

**Goodhart's law**: when a measure becomes a target, it stops being a good measure.

The moment you optimise against an eval, you start to overfit to it. Tune a prompt until refusals on your test set hit zero, and you may have taught the system to never refuse. Reward responses that cite sources, and you may get citations attached to claims the sources don't support. Score "helpfulness" with another model as a judge, and you'll drift toward whatever that judge likes, which is often length and confidence.

A few habits help:

- Keep a held-out set you don't look at while tuning.
- Use more than one metric, especially ones that pull in opposite directions (answer rate and correctness, for example).
- Read raw outputs regularly. Aggregates hide the weird cases.
- Refresh the eval set with real failures from production logs.

None of this solves Goodhart. It just makes it slower and easier to notice.

## The engineer's share

It's tempting to treat alignment as someone else's job: the model provider trained it, so it's aligned. But the provider can't know your users, your data or your failure modes. Whatever general behaviour a model has, the system you ship is a combination of that model and your choices about context, checks and fallbacks.

That's the part I find motivating. You don't need to understand every detail of how a model was trained to make the system around it more honest. You need clear specs, measured guardrails and evals that test the uncomfortable cases.

## What I'd actually do on Monday

- Write down, in one sentence each, what helpful, honest and harmless mean for your specific feature.
- Turn each sentence into at least five test cases, including ones where the right answer is "no" or "I don't know".
- Log every refusal and guardrail decision, and sample them weekly.
- Track at least two metrics that trade off against each other, so you notice when tuning one breaks the other.
