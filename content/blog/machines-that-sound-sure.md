---
title: "Machines That Sound Sure"
date: 2026-01-24
tags: ["post", "essays", "ai-philosophy"]
---

We have spent most of history using confidence as a shortcut for knowledge. The doctor who speaks without hesitating, the senior engineer who says "that'll never scale" and turns out to be right, the friend who knows the way without checking a map. We can't verify everything ourselves, so we read the signals people give off, and certainty is one of the strongest.

Large language models have broken that shortcut, and I don't think we've fully adjusted.

## Fluency is not evidence

An LLM generates text by predicting likely next tokens. The tone of its answer comes from the same process as the content. It sounds confident because confident, well-structured prose is what most of its training text looks like, not because it has checked anything.

So a correct answer and an invented one arrive in the same voice. Same tidy paragraphs, same reasonable caveats in the same places, same "Here's how it works." A fabricated citation is formatted as carefully as a real one. A function that doesn't exist in the library is called with the right-looking arguments.

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

There's a quieter effect on how expertise works.

An expert using an LLM can spot a wrong answer quickly, because they already know roughly what right looks like. For them the model is a fast first draft. A beginner can't do that. They get the same confident output and have no way to tell good from bad, which is exactly the situation where confidence used to be the only signal they had.

So the tool is most reliable in the hands of people who need it least, and riskiest for the people who lean on it most. As a student, I've felt this directly: it is very easy to accept a plausible explanation of something I don't yet understand, and much harder to notice when it's subtly wrong.

There's also the question of how expertise gets built in the first place. A lot of it comes from struggling with problems, being wrong and working out why. If a machine always supplies a fluent answer, it's easy to skip the struggle and never build the judgement needed to check the machine. I don't think that's inevitable, but it's a habit I watch for in myself.

## The responsibility of builders

Users can learn to be sceptical, but I don't think the burden should sit mainly with them. People building LLM features have more leverage, and a few obligations follow:

- **Ground answers where possible.** Retrieval with visible sources lets users check claims rather than trust tone.
- **Show uncertainty honestly.** If the system has a real signal (low retrieval scores, disagreement between multiple samples, a validator failing), surface it. Don't let generated hedging stand in for measured uncertainty.
- **Make abstaining acceptable.** "I don't have enough information to answer that" should be a designed, tested outcome, not a failure.
- **Match the stakes.** A wrong film recommendation costs nothing. A wrong dosage, legal claim or financial figure costs a lot. Put human review and hard checks where the cost of a confident mistake is high.
- **Evaluate on hard cases.** Average accuracy hides the confident failures. Test specifically on the out-of-distribution questions where the model is likely to bluff.

## A different habit of reading

The old instinct says: it sounds sure, so it probably knows. The new habit has to be: it sounds sure, and that tells me nothing on its own. What tells me something is a source I can open, a test that passes, a number I can recompute, or my own understanding of the subject.

That's more work. But confidence was always a proxy. These machines have just made it obvious how much we were leaning on it.
