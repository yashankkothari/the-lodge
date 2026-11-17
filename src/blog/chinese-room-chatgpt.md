---
title: "The Chinese Room, Revisited After ChatGPT"
date: 2024-10-19
tags: ["post", "essays", "ai-philosophy"]
---

I used to think the Chinese Room was one of those philosophy problems you read for an exam and promptly forget. Then ChatGPT got good enough that people around me started arguing about whether it actually *understands* anything. Suddenly the thought experiment didn't feel so pointless.

I went back to Searle's argument with an LLM open in the next tab. I still don't have a neat answer, which is annoying, but probably more honest than pretending this was settled in 1980.

## The argument

John Searle asks you to imagine a person who speaks no Chinese, locked in a room. Slips of paper with Chinese characters come in through a slot. The person has a huge rulebook, written in English, that says: when you see these symbols, write down those symbols and pass them back out. The rulebook is good enough that the people outside, who do speak Chinese, are convinced they are talking to a fluent speaker.

Searle's point: the person in the room doesn't understand a word of Chinese. They are just matching shapes. And a computer running a program is in the same position as that person. It manipulates **symbols** according to **syntax** (rules about form), and syntax alone is never enough for **semantics** (meaning). So passing a conversation test, however convincingly, doesn't show understanding.

The target was what he called **strong AI**: the claim that a suitably programmed computer literally has a mind, rather than merely simulating one.

## The systems reply

The response I keep coming back to is the **systems reply**. Fine, the person doesn't understand Chinese. A single neuron in my brain doesn't understand English either. Maybe understanding belongs to the whole setup: person, rulebook, paper, process. Why are we insisting the person alone has to be the one who understands?

Searle's answer was blunt. Let the person memorise the entire rulebook and do everything in their head. Now they *are* the whole system, and they still don't understand Chinese. So the systems reply fails.

This is where he loses me a bit. Someone who has memorised a rulebook sophisticated enough to hold any conversation in Chinese isn't really the person I was imagining at the start. We take an intuition that works for following a few rules on paper and stretch it to a ridiculously complicated system. I'm not convinced that intuition survives the trip.

But "your intuition might be wrong" is not the same as "you are wrong".

## What changes with LLMs

A large language model is, in a loose sense, a Chinese Room you can actually talk to. It takes in tokens, applies a vast set of learned numerical rules, and produces tokens. It has no eyes, no body, and no direct contact with the things its words refer to. In Searle's terms it looks like pure syntax.

A few things feel different, though.

**The rulebook wasn't written by anyone.** Searle's room has a hand-written rulebook, which makes it easy to picture as a lookup table. An LLM's "rules" are billions of parameters learned from text. Nobody wrote them, and we don't fully know what structure they encode. Interpretability research has found internal representations that track things like syntax, sentiment, and relations between entities. Whether that counts as anything like meaning is exactly the open question, but it isn't a lookup table.

**The behaviour generalises.** These models handle prompts nobody has written before. They translate, explain jokes, write code for problems that don't appear in their training data verbatim. That makes the room harder to dismiss as a trick.

**The failures are ridiculous.** It can explain an obscure proof and then invent a paper with a perfectly formatted citation. It can write a program and mess up a trivial count. I find it hard to call something that behaves like that a reliable knower of facts, however good the prose sounds.

## What doesn't change

The core of Searle's argument is untouched by any of this. His claim was never "computers can't produce fluent behaviour". It was "fluent behaviour, however good, doesn't establish understanding". ChatGPT makes the behaviour far more impressive. It doesn't make the inference from behaviour to understanding any more valid.

If anything, LLMs sharpen the problem. We now have a system that passes many informal conversation tests and that most of its builders would hesitate to call conscious. So we are forced to ask what, beyond behaviour, we would want as evidence. I don't have a good answer, and I notice I don't have one for other people either. I assume my friends understand things because they are built like me, not because I've checked.

## Where I've landed, for now

Some honest positions I hold loosely:

- **"It's just predicting the next token" is true and not decisive.** Describing the mechanism doesn't settle what the mechanism amounts to. "It's just neurons firing" is also true of us.
- **"It obviously understands" is also too fast.** Fluency is what these systems are optimised for. Being impressed by fluency is the one test they were built to pass.
- **The word "understand" is doing too much work.** It bundles together reliable use of concepts, grounding in the world, and subjective experience. LLMs may have some of the first, little of the second, and we have no idea how to measure the third.

That's the part of the argument I find useful now. "Does it understand?" gets us a thousand hot takes and very little clarity. "Can it tell what's true?" and "Does it connect its words to anything outside text?" are questions we can actually test or disagree about without talking past each other.

## What I actually take from it

For now, if I'm building with one of these models, I treat its output as something to verify. Not because I've proved it has no understanding, but because a beautifully phrased wrong answer is still wrong. I'm equally suspicious of people declaring LLMs conscious and people confidently declaring the entire question stupid. Neither camp has earned that certainty.
