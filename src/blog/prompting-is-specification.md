---
title: "Prompt Engineering Is Mostly Specification Writing"
date: 2025-03-29
tags: ["post", "genai", "llms", "guides"]
---

I can't take half of the "prompt engineering" advice online seriously. People are still posting magic phrases and pretending they've discovered a secret language for talking to AI. A prompt that works consistently is usually just a decent **specification**: here's the input, here's what I need back, here are the constraints, here's what to do when things go wrong.

It's the same thing as writing a good engineering ticket. If another developer would have to ask you six questions before starting, the model is going to fill those gaps with guesses.

## Treat the prompt as a contract

The model has no idea what you're building. It sees text and predicts more text. Every gap in your instructions gets filled with whatever is most plausible, and plausible is not the same as what you wanted.

So write the prompt the way you'd write an interface contract:

- **Inputs**: what the model will receive and in what form.
- **Outputs**: the exact shape of the response.
- **Constraints**: what it must not do.
- **Edge cases**: what to do when the input is empty, ambiguous or off-topic.

Vague prompt:

```text
Summarise this customer complaint.
```

Specified prompt:

```text
You will receive one customer complaint email for a food delivery app.
Return a JSON object with:
- "category": one of "late", "wrong_item", "refund", "app_bug", "other"
- "summary": one sentence, under 25 words, no customer names
- "needs_human": true if the customer mentions legal action or a health issue
If the email is not a complaint, return {"category": "other", "summary": "", "needs_human": false}.
```

Yes, the second prompt is longer. That's fine. I'd rather write ten more lines now than spend an afternoon wondering why half the outputs have the wrong shape.

## Roles are context, not magic

Typing "you are a senior data engineer" does not magically hire a senior data engineer inside the model. It mostly changes the vocabulary and level of detail. That can help, but it doesn't rescue a task you've barely described.

I find it more reliable to describe the situation directly: who will read the output, what they already know, and what they'll do with it. "The reader is a support agent who has 30 seconds to decide whether to escalate" tells the model more than any job title.

## Constraints do the heavy lifting

A lot of annoying model output is technically on topic. It's just five times too long, full of unnecessary disclaimers, or confidently adding details nobody asked for. That's why I specify limits instead of hoping the model understands what "concise" means.

- Length: "under 25 words", "at most three bullet points".
- Scope: "use only the information in the provided text".
- Refusal path: "if the answer isn't in the text, say `NOT_FOUND`".
- Tone: "plain language, no marketing words".

Giving the model an explicit way to say "I don't know" matters more than people expect. Without one, the most plausible continuation is usually a confident guess.

## Examples beat adjectives

"Write a concise, professional summary" means different things to different people, and to models. One or two **examples** of input and expected output pin down what you mean far better than adjectives.

A few things I've learned about examples:

- Make them representative, including at least one awkward case.
- Vary them. If every example has three bullet points, every output will too.
- Keep them consistent with your stated rules. If the instructions say 25 words and the example has 40, you've written a contradiction and the model will pick one.

## Ask for a schema when code reads the output

If the response goes into a program, don't parse prose. Ask for JSON with named fields and allowed values, and validate it on the way in:

```python
from typing import Literal
from pydantic import BaseModel, Field

class Complaint(BaseModel):
    category: Literal["late", "wrong_item", "refund", "app_bug", "other"]
    summary: str = Field(max_length=200)
    needs_human: bool

# raw = call_model(prompt, email_text)
result = Complaint.model_validate_json(raw)  # raises on bad output
```

Many APIs now have a JSON or structured-output mode. Use it, and still validate. A schema in the prompt plus a schema in code is the same contract written down twice, which is exactly what you want.

## Specs need tests

A specification you never check is a wish. The step most people skip is **evaluation**: running the prompt against a fixed set of inputs and checking the outputs, every time you change something.

It doesn't need to be fancy:

```python
cases = [
    ("My order came 2 hours late and cold.", "late"),
    ("I got paneer instead of chicken.", "wrong_item"),
    ("Hi, what are your opening hours?", "other"),
]

failures = []
for text, expected in cases:
    out = Complaint.model_validate_json(call_model(prompt, text))
    if out.category != expected:
        failures.append((text, expected, out.category))

print(f"{len(cases) - len(failures)}/{len(cases)} passed")
```

Twenty or thirty hand-picked cases catch most regressions. When you find a new failure in the wild, add it to the set. This is ordinary test-driven thinking applied to a component that happens to be probabilistic.

For outputs that can't be checked with equality, such as summaries, you can check properties instead: length limits, required fields, banned words, whether named entities in the output actually appear in the input.

## Iterate like you'd debug

When a prompt fails, don't add "IMPORTANT!!!" for the seventh time. Look at the actual failure. Usually you've left something ambiguous, contradicted yourself or stuffed two separate jobs into one request.

- An edge case nobody described.
- Two instructions that conflict.
- An example that teaches the wrong pattern.
- A task that's really two tasks and should be two calls.

Change one thing, rerun the eval set, compare. It's slower than vibes but you'll know whether you made it better.

## The rules I keep coming back to

- Write the prompt so a capable stranger could do the task from it alone.
- Define the output shape exactly, and validate it in code.
- Give the model an explicit way to say it doesn't know.
- Use a couple of varied examples instead of adjectives.
- Keep a small test set and rerun it on every change.

There's no mystical art here. You describe the task clearly, you test it, and when it breaks you debug it. Calling it "prompt engineering" doesn't exempt you from basic engineering.
