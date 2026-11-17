---
title: "Will AI Replace Junior Developers? I'm About to Find Out"
date: 2025-05-10
tags: ["post", "essays", "ai-philosophy"]
---

I'm about to enter my final year of computer engineering and apparently the job I'm studying for is supposed to be dead by the time I graduate. According to my feed, AI has already replaced every junior developer. Then I open another post explaining why it absolutely hasn't. Both get thousands of likes.

I'm not interested in choosing the comforting side. I'm interested in whether companies will still want to hire someone like me.

## What's actually getting automated

Let's not pretend the tools are bad just because the implications are uncomfortable. They can already do a lot of the work juniors were traditionally given:

- Boilerplate: CRUD endpoints, config files, data classes, test scaffolding.
- Translating between things: one language to another, a spec into a function, an error message into a likely fix.
- Looking things up: the right library call, the argument order, the regex you'd otherwise search for.
- First drafts of SQL, scripts and documentation.

I've seen things that took me an afternoon in second year take twenty minutes with an assistant. That's not a hypothetical productivity gain. If you're hiring juniors just to crank out boilerplate, I can see why you're reconsidering.

But that was never really what juniors were for.

## What a junior is actually for

Here's what gets lost in the "AI replaced my intern" victory laps: juniors aren't supposed to stay juniors. You hire someone inexperienced, give them small tasks, review their work and gradually trust them with bigger ones. It's an **apprenticeship**, not a code-generation subscription.

If companies stop doing that because a model can ship the small tasks, who's going to be the senior engineer in five years? I suspect plenty of companies will ignore that question because this quarter's headcount is easier to measure than a future skills gap. That's an actual problem for people graduating now.

## What doesn't get automated

The parts of the job I find hardest aren't typing code. They're things like:

- **Working out what the problem is.** Requirements are usually incomplete, and the person asking often doesn't know what they need yet.
- **Knowing the system.** Why this table has a strange column, why that service can't be called during a batch run, which team owns what.
- **Judgment.** Is this change safe? Is this abstraction worth it? Should this be built at all?
- **Debugging things that don't fit in a prompt.** A failure that only shows up with production data, across three services, at month end.
- **Owning the outcome.** Someone has to be accountable when it breaks.

An assistant can help with each of these. It can't do them for you, because they depend on context it doesn't have and responsibility it can't hold.

## The real risk: skipping the learning

What scares me just as much is what we're doing to ourselves with the tools.

If Claude writes an entire feature and I paste it in without understanding any of it, what exactly did I learn? I can say I shipped a feature. Great. Next week I'm still just as lost when something breaks. Repeat that for a year and I've basically trained myself to be a middleman between a prompt box and a repo.

The uncomfortable truth is that struggling with a bug for an hour is often where the learning happens. Tools that remove the struggle also remove the lesson, unless you're deliberate about it.

## How I'm trying to learn now

I don't think the answer is to avoid the tools. Refusing to use them would be like refusing to use Stack Overflow ten years ago. What I'm trying to do instead:

- **Write it myself first when I'm learning something new.** Then compare with what the assistant suggests. The diff teaches me more than either version alone.
- **Never commit code I can't explain.** If I can't walk through it line by line, it doesn't go in.
- **Read more code than I generate.** Open-source projects, library internals, other people's pull requests. Reading builds the judgment that lets you spot when generated code is subtly wrong.
- **Ask the tool "why", not just "how".** Then check the answer against the documentation, because it's sometimes confidently wrong.
- **Learn the fundamentals properly.** Data structures, databases, networking, how memory and concurrency actually behave. These are what let you evaluate output instead of trusting it.

## So, will it take junior jobs?

Some of them, probably. I think the number of roles that consist of turning clear tickets into straightforward code will shrink. The bar for entry will move up: a junior will be expected to do what a junior plus a year of experience did before, because the tools cover the gap.

I don't think the junior role disappears, because the need for people who grow into seniors doesn't disappear. What changes is what a junior needs to bring: less raw typing speed, more understanding, more ability to check and question what a tool produces, and more of the communication and ownership that used to come later.

I'm not going to pretend that's exciting for every student staring at a hiring freeze. It's a worse entry point than the one we were promised, and I think we should be allowed to say that.

## Where this leaves me

- Use the tools, but don't let them do your learning for you.
- Don't ship what you can't explain.
- Put real effort into fundamentals and reading code; that's where judgment comes from.
- Look for teams that still invest in reviewing and mentoring juniors. An apprenticeship is worth more than a slightly higher first salary.

I'd much rather be the annoying person in a code review who spots why the generated solution will fail than the guy who can produce ten more versions of it.

*Update, October 2026: I revisited this after Claude Opus 5.5 came out, in [Opus 5.5 and the Junior Question, Seventeen Months Later](/blog/opus-5-5-and-the-junior-question/).*
