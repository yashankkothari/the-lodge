---
title: "The Chinese Room, Revisited After ChatGPT"
date: 2024-10-19
tags: ["post", "essays", "ai-philosophy"]
---

I first came across the Chinese Room as a neat puzzle from 1980. Then I spent two years watching chatbots get good enough that my classmates now argue about whether they "understand" anything, and the puzzle stopped feeling academic.

This post is me working through the argument again, with a large language model open in another tab. I don't reach a verdict. I'm not sure anyone honestly can yet.

## The argument

John Searle asks you to imagine a person who speaks no Chinese, locked in a room. Slips of paper with Chinese characters come in through a slot. The person has a huge rulebook, written in English, that says: when you see these symbols, write down those symbols and pass them back out. The rulebook is good enough that the people outside, who do speak Chinese, are convinced they are talking to a fluent speaker.

Searle's point: the person in the room doesn't understand a word of Chinese. They are just matching shapes. And a computer running a program is in the same position as that person. It manipulates **symbols** according to **syntax** (rules about form), and syntax alone is never enough for **semantics** (meaning). So passing a conversation test, however convincingly, doesn't show understanding.

The target was what he called **strong AI**: the claim that a suitably programmed computer literally has a mind, rather than merely simulating one.

## The systems reply

The most common response, and the one I find most tempting, is the **systems reply**. Of course the person doesn't understand Chinese. Neither does a single neuron in your head understand English. Understanding, if it exists, belongs to the whole system: the person, the rulebook, the paper, the process.

Searle's answer was blunt. Let the person memorise the entire rulebook and do everything in their head. Now they *are* the whole system, and they still don't understand Chinese. So the systems reply fails.

I've never found that fully convincing. Someone who had genuinely internalised a rulebook capable of fluent Chinese conversation would be running something very unlike "following instructions" as we normally picture it. Our intuitions about what that person would or wouldn't understand are built for small, slow cases. The thought experiment asks us to trust them at a scale where they may simply not apply.

But "your intuition might be wrong" is not the same as "you are wrong".

## What changes with LLMs

A large language model is, in a loose sense, a Chinese Room you can actually talk to. It takes in tokens, applies a vast set of learned numerical rules, and produces tokens. It has no eyes, no body, and no direct contact with the things its words refer to. In Searle's terms it looks like pure syntax.

A few things feel different, though.

**The rulebook wasn't written by anyone.** Searle's room has a hand-written rulebook, which makes it easy to picture as a lookup table. An LLM's "rules" are billions of parameters learned from text. Nobody wrote them, and we don't fully know what structure they encode. Interpretability research has found internal representations that track things like syntax, sentiment, and relations between entities. Whether that counts as anything like meaning is exactly the open question, but it isn't a lookup table.

**The behaviour generalises.** These models handle prompts nobody has written before. They translate, explain jokes, write code for problems that don't appear in their training data verbatim. That makes the room harder to dismiss as a trick.

**The failures are strange.** The same model that explains a subtle proof will confidently invent a citation or fumble a simple counting task. To me that looks less like a mind and more like a very powerful pattern engine with no stable sense of what is true.

## What doesn't change

The core of Searle's argument is untouched by any of this. His claim was never "computers can't produce fluent behaviour". It was "fluent behaviour, however good, doesn't establish understanding". ChatGPT makes the behaviour far more impressive. It doesn't make the inference from behaviour to understanding any more valid.

If anything, LLMs sharpen the problem. We now have a system that passes many informal conversation tests and that most of its builders would hesitate to call conscious. So we are forced to ask what, beyond behaviour, we would want as evidence. I don't have a good answer, and I notice I don't have one for other people either. I assume my friends understand things because they are built like me, not because I've checked.

## Where I've landed, for now

Some honest positions I hold loosely:

- **"It's just predicting the next token" is true and not decisive.** Describing the mechanism doesn't settle what the mechanism amounts to. "It's just neurons firing" is also true of us.
- **"It obviously understands" is also too fast.** Fluency is what these systems are optimised for. Being impressed by fluency is the one test they were built to pass.
- **The word "understand" is doing too much work.** It bundles together reliable use of concepts, grounding in the world, and subjective experience. LLMs may have some of the first, little of the second, and we have no idea how to measure the third.

Splitting the word apart is the most useful thing I've taken from rereading Searle. The question "does it understand?" is almost unanswerable. Questions like "does it track the truth?", "does it connect words to the world?", and "is there anything it is like to be it?" are at least ones we can argue about separately.

## The short version

If you build things with these models, the practical stance is simple: treat the output as fluent text that needs checking, not as the words of something that knows what it's saying. That holds whichever side of the philosophy turns out to be right. The philosophical question is still open, and I'd be suspicious of anyone, on either side, who tells you it's settled.
