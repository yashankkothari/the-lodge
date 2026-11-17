---
title: "Machines That Sound Sure"
date: 2026-01-24
tags: ["post", "essays", "ai-philosophy"]
---

We're embarrassingly easy to impress with confidence. Someone says something in a calm, authoritative voice and half the room decides they must know what they're talking about. Usually there's at least a chance that confidence came from experience.

LLMs have made that shortcut almost useless. And I don't think people have caught up.

## Fluency is not evidence

Here's why this bothers me. A model generates both the answer and the *tone* of that answer. It doesn't necessarily sound sure because it verified the claim. It sounds sure because confident, well-structured language is an easy pattern for it to produce. The certainty is part of the text.

That's the problem. A real citation and a completely made-up one get the same formatting. A library function that doesn't exist comes with plausible arguments and a friendly explanation. The answer can be nonsense and still look like it belongs in documentation.

Humans bluff too, obviously, but sometimes you can tell when someone is unsure: they hesitate, ask for time, admit they haven't worked with that system. An LLM can be completely outside its depth and keep talking like the documentation's author.

## What calibration means

There's a technical name for the thing I want here: **calibration**. Imagine a system says "I'm 80% confident" on a hundred questions. If it gets roughly eighty right, that confidence estimate is useful. If it gets forty right, the number is basically decoration. Calibration isn't raw accuracy; it's whether confidence and reality line up.

Weather forecasts are the obvious example. A 30% chance of rain is useful when those forecasts correspond to rain about 30% of the time. You can make a decision around a probability that's been measured.

Language-model research does suggest that token probabilities sometimes contain useful uncertainty signals. Some models are better calibrated on particular tasks before they're tuned to behave like helpful assistants. But when a chatbot writes "I'm fairly certain", that's just another sentence it generated. It isn't necessarily reporting a measured 80% confidence. The training that makes it pleasant to talk to can also make it annoyingly reluctant to admit ignorance.

## What it does to trust

People seem to fall into two equally unhelpful habits.

**Trusting everything.** The tool answers twenty questions correctly, so you stop checking question twenty-one. Unfortunately, that might be the one about a niche API, a recent change or an edge case it has no business answering confidently. Its writing style doesn't change to warn you.

**Trusting nothing.** Somebody catches one hallucination and concludes the entire technology is garbage. That's not sensible either. These models are genuinely useful for a lot of tasks, especially when you know their limitations.

What I actually want is to know the difference. Trust it for the tasks where you've seen it perform, verify the things that matter and don't mistake a polite paragraph for a confidence estimate. It's harder than it sounds when the interface gives you so little to go on.

## What it does to expertise

This bothers me even more when it comes to learning.

If you understand a codebase, you can look at generated code and immediately notice the questionable parts. If you're learning the language for the first time, the exact same output looks equally authoritative. The model hasn't changed. Your ability to judge it has.

The annoying irony is that the people who can check an LLM's work are usually the people who already know the subject. When I was studying something new, I could read a perfectly convincing explanation and have absolutely no clue which sentence was wrong. That's not learning. That's being handed confidence on credit.

Then there's the uglier possibility: what if we never build that judgement? You get good at debugging by being stuck, reading the errors and eventually understanding what went wrong. If an assistant takes away every frustrating hour, you can finish the assignment without learning the thing that would let you check its next answer. I use these tools, so I'm not pretending to be above this temptation.

## The responsibility of builders

I don't buy the argument that this is entirely the user's fault for trusting the tool. If you're building an LLM feature, you have choices about the interface, evidence and failure handling. Those choices matter:

- **Give me sources I can inspect.** If an answer uses documents, show which ones, and make it possible to check whether they actually support the claim.
- **Only show uncertainty you can justify.** Low retrieval scores, conflicting results and failed validators are real signals. A generated "probably" isn't.
- **Let the system refuse to guess.** "I don't have enough information" needs to count as a correct outcome in testing.
- **Care about the consequences.** A bad movie suggestion and a wrong medical instruction aren't the same kind of failure. The checks shouldn't be the same either.
- **Test the uncomfortable questions.** Easy benchmark averages hide the confident mistakes. Put the difficult, unfamiliar cases in your eval set.

## What I trust instead

When a model tells me something, I want the documentation link, the failing test, the query result or a number I can check myself. "It sounded confident" is not evidence. We wouldn't accept that from a junior engineer in a code review. Why are we accepting it from software?

Yes, checking takes more time. So does cleaning up after a decision you made because a chatbot wrote it in a reassuring tone.
