---
title: "Alignment for Engineers: Helpful, Honest, Harmless in Actual Code"
date: 2026-04-25
tags: ["post", "essays", "ai-philosophy"]
---

AI companies love saying their models are "helpful, honest and harmless". Nice words. Completely useless when you're the engineer who has to make the actual product behave. You can't ship `if harmful: don't()` and call it alignment.

In the code you write prompts, filters, thresholds, tests and fallback paths. Each one is your interpretation of what "safe" should mean. I've been thinking about that while working around data pipelines and LLMs. Most of us aren't training frontier models. We still have to answer for the behaviour of the systems we put in front of users.

## Values are not specs

"Don't mislead users" is a value. It doesn't tell me what to implement. "If the supplied documents don't contain the answer, respond that you don't know and don't invent a number" is something I can test. That second sentence belongs in a specification.

The frustrating part is that the specification will always cover less than the ideal behind it. You make rules for the cases you can think of. Then somebody finds a case you didn't. With a model, that missing requirement often turns into a perfectly fluent answer instead of an obvious failure.

Bad requirements aren't new. The difference is that an ordinary program often throws an error when you haven't accounted for something. An LLM will happily improvise and make the mistake sound intentional. I'd much rather have a loud failure than a plausible lie in production.

## Refusals are a product decision

Refusals are an easy thing to celebrate in a safety report. "Look how many risky requests we blocked." Fine. But what did you block that was actually legitimate? That's part of the product decision too.

Imagine an insurance claims assistant that refuses to analyse a claim because the description mentions an injury and some generic medical filter panics. The employee still needs to process the claim. Now they may paste the text into a less controlled tool. Congratulations, your safety feature may have moved the risk somewhere you can't see it.

I'd review the refusal path the same way I'd review any other conditional branch:

- Which specific conditions make it refuse?
- Does the user get an explanation or just a useless wall?
- Can someone escalate or use a safer alternative?
- How often are normal requests being rejected by mistake?

That last question tends to disappear from the dashboard. It's easy to report how many dangerous requests you blocked. It's less flattering to report how many legitimate customers you made miserable.

## Guardrails are just code

A **guardrail** is code around a model call. Before the call, you might catch personal data, credentials or obvious prompt-injection attempts. After it, you might catch unsupported numbers, leaked system text or broken JSON. Calling it a guardrail doesn't make it infallible.

```python
def answer(question: str, docs: list[str]) -> str:
    if contains_pii(question):
        return "I can't process personal identifiers here. Please remove them."

    raw = llm_call(build_prompt(question, docs))

    if not grounded_in(raw, docs):
        return "I couldn't find that in the provided documents."
    return raw
```

Those two functions look reassuring. They're also imperfect classifiers. `contains_pii` can flag harmless text, and `grounded_in` can miss a completely made-up claim. You need to measure false positives and false negatives, log what happened and inspect failures. Otherwise you've wrapped the model in another set of guesses and decided to trust those instead.

## Evals are where honesty lives

The only way I'd be comfortable calling an LLM feature "honest" is if I could show how we're testing that claim. That's where **evals** come in: known inputs, expected outcomes and repeatable checks after every prompt, retrieval or model change.

And no, testing only questions with obvious answers doesn't count. I'd include:

- Questions that the supplied documents actually answer.
- Questions the documents don't answer, where the model is supposed to admit it.
- Prompts built on a false assumption that the model should challenge.
- Requests for exact numbers where the available evidence only supports an estimate.

I'm especially interested in the middle two. If you only reward the system for providing an answer, don't be shocked when it invents one instead of saying no.

## Goodhart is waiting for you

**Goodhart's law** is the annoying reminder that a metric can stop being useful once everybody starts optimising specifically for it.

Suppose you optimise until your refusal rate on a test set is zero. Maybe you made the model better. Maybe you trained it to agree to everything. Require citations and you can end up with irrelevant sources stapled to confident claims. Use another model to grade "helpfulness" and you might start rewarding long, polished nonsense because the judge likes it. Your score goes up. The product doesn't necessarily improve.

I try to put some friction between tuning and declaring victory:

- Keep test cases you haven't been staring at while changing prompts.
- Measure competing things, like how often it answers *and* how often those answers are correct.
- Open the raw responses. A single average hides spectacular failures.
- Add real incidents from production to the evaluation set.

You can still game the metrics. At least these habits make it harder to fool yourself without noticing.

## The engineer's share

The easiest excuse is "the provider already aligned the model". The provider doesn't know which documents your app retrieves, which customer records it handles or what happens when a result is wrong. You made those choices. Their model might be one component, but the behaviour users experience is your system.

I actually like that part of the work. I can't change how the provider trained its model. I can decide what my application does when the model makes up a number, refuses a legitimate request or ignores the context. Those are engineering problems. We should stop treating them like PR statements.

## What I'd actually do on Monday

- Define what those three nice-sounding values mean for one actual feature in your product.
- Write test cases for each one, including cases where refusal or uncertainty is the right response.
- Record what your filters and guardrails blocked, then read samples every week.
- Watch two metrics that pull against each other. Improving the answer rate shouldn't quietly destroy correctness.
