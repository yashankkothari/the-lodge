---
title: "Prompt Engineering Is Mostly Specification Writing"
date: 2025-03-29
tags: ["post", "genai", "llms", "guides"]
---

I can't take half of the "prompt engineering" advice online seriously. People are still posting magic phrases and pretending they've discovered a secret language for talking to AI. A prompt that works consistently is usually just a decent **specification**: here's the input, here's what I need back, here are the constraints, here's what to do when things go wrong.

It's the same thing as writing a good engineering ticket. If another developer would have to ask you six questions before starting, the model is going to fill those gaps with guesses.

## Treat the prompt as a contract

The model doesn't have the full project sitting in its head. It sees the context you give it and tries to produce a plausible response. If you leave a requirement out, it doesn't know that requirement exists. It'll invent a reasonable-looking interpretation and carry on.

I find it useful to treat the prompt like an interface contract. Spell out:

- What data is coming in and how it's structured.
- What the output must contain, including the format.
- What the model is absolutely not allowed to invent or include.
- How it should behave when the input is missing, contradictory or completely unrelated.

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

I'd rather say "a support agent has thirty seconds to decide whether this complaint needs escalation" than "act as a world-class customer service expert". The first describes a real constraint. The second is just a costume for the model to wear.

## Constraints do the heavy lifting

A lot of annoying model output is technically on topic. It's just five times too long, full of unnecessary disclaimers, or confidently adding details nobody asked for. That's why I specify limits instead of hoping the model understands what "concise" means.

- If it needs to be short, give a number: twenty-five words, three bullets, whatever you can actually check.
- If the answer must come from a document, explicitly forbid outside claims.
- If the information isn't there, provide a specific failure response such as `NOT_FOUND`.
- If you don't want corporate-sounding filler, show what you *do* want, not just an adjective like "professional".

That third one saves so much trouble. A prompt that never gives the model permission to say "I don't know" is practically asking it to fill the silence with something plausible.

## Examples beat adjectives

When someone says "make it concise and professional", I have no idea if they want twelve words or three paragraphs. Neither does the model. One or two good input/output examples usually communicate more than a pile of adjectives.

The examples need some thought, though:

- Use examples that actually resemble what users send, including the awkward cases.
- Don't make every sample identical unless you genuinely want the output to copy that structure.
- Check the examples against your own rules. Saying "under 25 words" and then providing a 40-word example is your bug, not the model's.

## Ask for a schema when code reads the output

If the response is going into an application, I don't want paragraphs that I have to scrape for the useful bit. Give me named JSON fields and a schema I can validate:

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

Most major APIs have some kind of structured-output support now. I'd use it, and I'd still validate on the application side. The model having been asked nicely for JSON isn't the same as my code checking the JSON it received.

## Specs need tests

This is the step that separates a prompt you played with from something I'd put in a real product. Keep a set of inputs and expected outcomes and run them after changes. Call it **evaluation** or just tests; I don't particularly care about the label.

You can start with something embarrassingly small:

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

Thirty carefully chosen cases can already catch an obvious regression. When an unexpected input breaks the prompt in production, save it as another test. I don't see why the probabilistic part should mean we're suddenly allowed to stop testing.

Not every output has one exact answer. That's fine. For a summary, check the word count, required fields and whether it added names or claims that weren't in the source. You can still test useful properties without grading the entire paragraph by hand.

## Iterate like you'd debug

When a prompt fails, don't add "IMPORTANT!!!" for the seventh time. Look at the actual failure. Usually you've left something ambiguous, contradicted yourself or stuffed two separate jobs into one request.

- A weird input the prompt never accounted for.
- Instructions that contradict each other somewhere in the middle.
- A sample output that's teaching the model the wrong habit.
- Two separate tasks crammed together that would be easier to handle independently.

Make one change, rerun the cases and look at the difference. Otherwise you can spend an afternoon adding instructions and have no clue whether the latest paragraph improved anything.

## The rules I keep coming back to

- Could a capable person complete this task using only the instructions I've written?
- Will my application reject an output in the wrong format?
- Have I told the model what to do when the answer isn't available?
- Do the examples show the actual edge cases?
- Can I demonstrate that the newest prompt is better than the previous one?

There's no mystical art here. You describe the task clearly, you test it, and when it breaks you debug it. Calling it "prompt engineering" doesn't exempt you from basic engineering.
