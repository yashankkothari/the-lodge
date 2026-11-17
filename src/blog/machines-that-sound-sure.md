---
title: "Machines That Sound Sure"
date: 2026-01-24
tags: ["post", "essays", "ai-philosophy"]
---

We're embarrassingly easy to impress with confidence. Someone says something in a calm, authoritative voice and half the room decides they must know what they're talking about. Usually there's at least a chance that confidence came from experience.

LLMs have made that shortcut almost useless. And I don't think people have caught up.

## Fluency is not evidence

An LLM generates text by predicting likely next tokens. The tone of its answer comes from the same process as the content. It sounds confident because confident, well-structured prose is what most of its training text looks like, not because it has checked anything.

That's the problem. A real citation and a completely made-up one get the same formatting. A library function that doesn't exist comes with plausible arguments and a friendly explanation. The answer can be nonsense and still look like it belongs in documentation.

With people, tone and accuracy are at least loosely linked. Someone who is bluffing often gives it away. With a model, the link is much weaker, and the signal we've relied on for centuries becomes noise.

## What calibration means

The technical word for the missing property is **calibration**. A system is well calibrated if, among all the times it says it's 80% sure, it's right about 80% of the time. Calibration isn't about being right more often. It's about your stated confidence matching your actual hit rate.

Weather forecasters are the classic example of good calibration. When a forecast says 30% chance of rain, it rains on roughly 30% of those days. You can plan around that.

Research on language models suggests the underlying token probabilities can carry useful information about uncertainty, and that some models are reasonably calibrated on certain tasks before later training stages. But the confidence a chatbot *expresses in words* is a different thing. "I'm fairly certain" is just more generated text. It isn't a readout of an internal probability, and training for helpful, pleasant answers can push models towards sounding sure.

## What it does to trust

I see two failure modes, and they pull in opposite directions.

The first is **over-trust**. If an answer sounds expert and is right most of the time, people stop checking. That works until it doesn't, and the failures cluster in exactly the places that matter: edge cases, recent events, niche domains, anything that wasn't well represented in the training data. The model doesn't get quieter when it's out of its depth.

The second is **blanket distrust**. Someone gets burned by a confident hallucination and decides the whole thing is useless. That throws away real value, because on many tasks these tools are genuinely good.

Neither is calibrated trust. Calibrated trust would mean knowing *which kinds* of questions a tool handles well and checking the rest. That's hard when the tool gives you no signal of its own.

## What it does to expertise

This bothers me even more when it comes to learning.

An expert using an LLM can spot a wrong answer quickly, because they already know roughly what right looks like. For them the model is a fast first draft. A beginner can't do that. They get the same confident output and have no way to tell good from bad, which is exactly the situation where confidence used to be the only signal they had.

The annoying irony is that the people who can check an LLM's work are usually the people who already know the subject. When I was studying something new, I could read a perfectly convincing explanation and have absolutely no clue which sentence was wrong. That's not learning. That's being handed confidence on credit.

There's also the question of how expertise gets built in the first place. A lot of it comes from struggling with problems, being wrong and working out why. If a machine always supplies a fluent answer, it's easy to skip the struggle and never build the judgement needed to check the machine. I don't think that's inevitable, but it's a habit I watch for in myself.

## The responsibility of builders

Users can learn to be sceptical, but I don't think the burden should sit mainly with them. People building LLM features have more leverage, and a few obligations follow:

- **Ground answers where possible.** Retrieval with visible sources lets users check claims rather than trust tone.
- **Show uncertainty honestly.** If the system has a real signal (low retrieval scores, disagreement between multiple samples, a validator failing), surface it. Don't let generated hedging stand in for measured uncertainty.
- **Make abstaining acceptable.** "I don't have enough information to answer that" should be a designed, tested outcome, not a failure.
- **Match the stakes.** A wrong film recommendation costs nothing. A wrong dosage, legal claim or financial figure costs a lot. Put human review and hard checks where the cost of a confident mistake is high.
- **Evaluate on hard cases.** Average accuracy hides the confident failures. Test specifically on the out-of-distribution questions where the model is likely to bluff.

## What I trust instead

When a model tells me something, I want the documentation link, the failing test, the query result or a number I can check myself. "It sounded confident" is not evidence. We wouldn't accept that from a junior engineer in a code review. Why are we accepting it from software?

Yes, checking takes more time. So does cleaning up after a decision you made because a chatbot wrote it in a reassuring tone.
