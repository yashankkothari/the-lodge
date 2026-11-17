---
title: "The Chinese Room, Revisited After ChatGPT"
date: 2024-10-19
tags: ["post", "essays", "ai-philosophy"]
---

I used to think the Chinese Room was one of those philosophy problems you read for an exam and promptly forget. Then ChatGPT got good enough that people around me started arguing about whether it actually *understands* anything. Suddenly the thought experiment didn't feel so pointless.

I went back to Searle's argument with an LLM open in the next tab. I still don't have a neat answer, which is annoying, but probably more honest than pretending this was settled in 1980.

## The argument

Searle's setup is deliberately ridiculous. You're locked in a room. You don't speak a word of Chinese. Somebody slides Chinese writing under the door, and you've got an enormous English rulebook telling you exactly which symbols to send back. You follow it perfectly. To a Chinese speaker outside, it looks like they're having a normal conversation with you.

But you still don't know Chinese. You're matching symbols. Searle says a computer works the same way: following **syntax**, or rules for manipulating symbols, isn't the same thing as grasping **semantics**, what those symbols mean. So even a machine that talks convincingly could, by his argument, have zero understanding.

He was arguing against **strong AI**: the idea that running the right program is enough to literally have a mind. Not just simulate one for an audience.

## The systems reply

The response I keep coming back to is the **systems reply**. Fine, the person doesn't understand Chinese. A single neuron in my brain doesn't understand English either. Maybe understanding belongs to the whole setup: person, rulebook, paper, process. Why are we insisting the person alone has to be the one who understands?

Searle anticipated that objection. His answer was to have the person memorise the whole rulebook. No paper, no external machinery. Now the person contains the entire system, but still supposedly doesn't understand anything. He takes that as a win.

This is where he loses me a bit. Someone who has memorised a rulebook sophisticated enough to hold any conversation in Chinese isn't really the person I was imagining at the start. We take an intuition that works for following a few rules on paper and stretch it to a ridiculously complicated system. I'm not convinced that intuition survives the trip.

Of course, saying his intuition doesn't scale isn't proof that a computer understands Chinese either. That's the irritating part. Neither argument gives me the certainty people online seem to have.

## What changes with LLMs

ChatGPT makes this much harder to keep abstract. You can open a tab and talk to something that takes tokens in and produces tokens out using learned numerical patterns. A text-only model doesn't experience the objects it talks about the way I do. From Searle's perspective, this looks suspiciously like the room with a much better rulebook.

Except there are some huge differences between the thought experiment and an actual model.

**Nobody sat down and wrote the rulebook.** An LLM learns billions of parameters from training data. Researchers can find internal representations connected to grammar, sentiment and relationships between concepts, but we don't have a neat list of English rules saying how it reaches each answer. Calling that a giant lookup table feels like avoiding the interesting part. Whether those representations amount to meaning is still a separate question.

**It isn't limited to memorised conversations.** Models can respond to novel questions, explain jokes, translate and attempt code for problems they haven't seen word for word. They're still doing computation, obviously. But the fact that they generalise makes the "it's just looking up a response" explanation pretty weak.

**The failures are ridiculous.** It can explain an obscure proof and then invent a paper with a perfectly formatted citation. It can write a program and mess up a trivial count. I find it hard to call something that behaves like that a reliable knower of facts, however good the prose sounds.

## What doesn't change

I think people misread Searle when they respond with screenshots of an impressive chatbot conversation. He wasn't saying machines couldn't *sound* intelligent. He was saying sounding intelligent doesn't prove a mind is there. Making the conversation ten times better doesn't automatically answer that objection.

And yet what evidence would convince me? I genuinely struggle with that. I assume the people around me have conscious experiences because they're people, with brains and lives much like mine. I haven't run a consciousness test on any of them. Now we have machines behaving intelligently in some ways, and the assumptions I usually rely on don't transfer cleanly.

## Where I've landed, for now

Here's what I can say without pretending to have solved consciousness:

- **"It's just next-token prediction" doesn't end the conversation.** That's a description of the training and generation process, not a philosophical proof about what complex systems can or can't do.
- **"It talks like us, therefore it understands" isn't an argument either.** Producing convincing language is precisely the thing we've trained it to do.
- **We're fighting over the word "understand".** Using concepts correctly, connecting them to the physical world and having a subjective experience are different questions. Throwing them into one word makes the debate impossible.

That's the part of the argument I find useful now. "Does it understand?" gets us a thousand hot takes and very little clarity. "Can it tell what's true?" and "Does it connect its words to anything outside text?" are questions we can actually test or disagree about without talking past each other.

## What I actually take from it

For now, if I'm building with one of these models, I treat its output as something to verify. Not because I've proved it has no understanding, but because a beautifully phrased wrong answer is still wrong. I'm equally suspicious of people declaring LLMs conscious and people confidently declaring the entire question stupid. Neither camp has earned that certainty.
