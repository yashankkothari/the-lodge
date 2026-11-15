---
title: "Prompt Engineering Is Mostly Specification Writing"
date: 2025-03-29
tags: ["post", "genai", "llms", "guides"]
---

"Prompt engineering" sounds like a bag of tricks: magic phrases, threats, tipping the model. Some of those tricks worked once, on some model, for some task. What keeps working is far more boring. A good prompt is a **specification**: it says what the input is, what the output must look like, what's out of scope, and how you'll know it's right.

If you've ever written a ticket that a stranger could pick up and finish without asking you anything, you already know how to write most of a good prompt.

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

The second one is longer, but every extra line removes a decision the model would otherwise make for you.

## Roles are context, not magic

"You are a senior data engineer" doesn't make a model smarter. What a role line does is set **context**: vocabulary, assumed audience, level of detail. That's useful, but it's a small lever. A role with no task description is still a vague prompt.

I find it more reliable to describe the situation directly: who will read the output, what they already know, and what they'll do with it. "The reader is a support agent who has 30 seconds to decide whether to escalate" tells the model more than any job title.

## Constraints do the heavy lifting

Most bad outputs aren't wrong, they're unbounded: too long, too chatty, padded with caveats, or inventing details. Constraints fix that.

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

When a prompt fails, resist the urge to add another sentence in capital letters. Look at the failing case and ask what the spec left open. Usually it's one of these:

- An edge case nobody described.
- Two instructions that conflict.
- An example that teaches the wrong pattern.
- A task that's really two tasks and should be two calls.

Change one thing, rerun the eval set, compare. It's slower than vibes but you'll know whether you made it better.

## What to keep in mind

- Write the prompt so a capable stranger could do the task from it alone.
- Define the output shape exactly, and validate it in code.
- Give the model an explicit way to say it doesn't know.
- Use a couple of varied examples instead of adjectives.
- Keep a small test set and rerun it on every change.

Most of what gets called prompt engineering is just being precise about what you want. That skill was useful before LLMs and it'll stay useful after the current tricks stop working.
