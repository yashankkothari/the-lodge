---
title: "Opus 5.5 and the Junior Question, Seventeen Months Later"
date: 2026-10-08
tags: ["post", "essays", "ai-philosophy"]
---

In May 2025 I wrote [Will AI Replace Junior Developers?](/blog/will-ai-replace-juniors/) as a student about to start his final year. My answer then was a careful "some of them, probably". The role would shrink, the bar would rise, but juniors wouldn't disappear, because companies need people who grow into seniors.

I've reread that post a few times since Anthropic released **Claude Opus 5.5** on 22 September. I still believe the reasoning. I'm much less relaxed about the timeline, and I want to be honest about that.

## What changed in a few months

Opus 5.5 isn't one dramatic leap. It's what happens when a lot of small improvements land at once and the price drops too. Anthropic says it performs at the level of their bigger Fable 5.1 model on most work and costs about 40% less to run than Opus 5 on typical workloads. Their launch post mentions one early tester finishing a 680,000-line code migration in under a day, and an internal test where it translated HAProxy from C to Rust and passed nearly all of HAProxy's own regression tests in about nine and a half hours.

Those are a vendor's own examples, so I discount them a bit. What worries me more is what's happening outside the press releases.

- **Prototypes are almost free now.** Something that used to be a weekend side project, like a CRUD app with auth, a dashboard or a small mobile app, now takes an evening of describing and reviewing. I built [NotesAid](/work/notesaid/) the slow way in 2025. A first-year student today could get a rough version running before dinner.
- **Small products ship with tiny teams.** Building a working app was never the hard part of starting something. It's just stopped being a serious obstacle at all.
- **Reverse engineering has sped up a lot.** In August, Chris Lewis finished a full decompilation of the N64 game Snowboard Kids in 84 days. His previous one took 596. He credits LLMs for a lot of that, though he's clear that experienced people in the decomp community were essential, especially for the strange quirks of the old SGI compiler. This month a developer released open-source "clean-room" clones of seven Adobe apps, Photoshop, Illustrator, Premiere and four others, which he says he built with Opus 5.5 in Rust.

That last one deserves a closer look. Reviewers have pointed out how unfinished those clones are: they're super-early alphas with plenty of bugs, and the "100% parity within a month" promise has already been walked back to "months, not years". But two years ago the idea that one person could produce something that looks like Photoshop at all would have been a joke. The bugs are real. So is the trend.

## So was the old post right?

The part about **what gets automated** was too modest. I listed boilerplate, translation, lookups and first drafts. The tools now do a lot more than that: whole features, migrations, and even rebuilding software from its behaviour. The "clear tickets turned into straightforward code" work I said would shrink is shrinking faster than I expected.

The part about **what doesn't get automated** still holds, but the line is moving. Working out the actual problem, knowing the system, judgment, debugging across messy production reality, owning the outcome: none of those have gone away. But every model release takes a little more of them. Opus 5.5 is noticeably better at reading a large codebase and explaining what it found, which is exactly the "knowing the system" skill I said was ours.

## The part I'm holding onto: systems

If there's one thing I hope stays human for a long time, it's **system design**. I don't mean drawing boxes in an interview. I mean the real version:

- Deciding where state lives, and what happens when two services disagree about it.
- Knowing which failure modes matter for this business. A dropped log line and a dropped insurance claim are not the same kind of failure.
- Choosing between consistency, cost and latency when you can't have all three.
- Designing for the people who'll run the system at 3 a.m., and for the audit that happens a year later.

A model can produce a very convincing architecture diagram. What it can't do yet is carry the consequences. It wasn't in the room when the last outage happened, and it won't be the one explaining the next one to someone who lost money. Big systems still need a person who understands why they are the way they are, and who's accountable for changing them.

I'll admit "I hope AI never learns system design" is a wish, not a prediction. The honest version is: I don't know how long this part stays ours, and I'm not going to build my career on the assumption that it's forever.

## The money question

There's a second uncertainty, and it gets talked about less than capability: the economics.

Frontier AI is wildly expensive to build. Anthropic's leaked IPO prospectus, reported last month, showed revenue of about $4.6 billion in 2025, an operating loss of over $8 billion, and more than $500 billion in future compute and infrastructure commitments. OpenAI is reportedly forecasting around $278 billion of negative free cash flow between 2026 and 2030. To be fair, Anthropic reportedly posted its first small operating profit in Q2 2026, so the picture isn't purely one of losses. But the industry as a whole is still spending far more than it earns, betting that revenue catches up.

I genuinely don't know how that ends. A few possibilities:

- **The bet pays off.** Prices keep falling, usage keeps climbing, and today's capabilities become cheap infrastructure like cloud computing did.
- **Prices go up.** Subsidised pricing ends, the best models become expensive, and the "one developer clones Adobe" stories get rarer because the tokens cost real money.
- **A correction.** Some labs consolidate or fold, progress slows, and we spend a few years working out what the current tools are actually good for.

Any of those would change how fast the junior market moves. None of them sends us back to 2023.

## What I'd tell myself now

My old advice was: use the tools, don't let them do your learning, don't ship what you can't explain, invest in fundamentals. I'd keep all of it and add some sharper edges.

- **Adapt early, not reluctantly.** The people I see doing well are the ones who've changed how they work: they direct, review and verify, instead of typing everything themselves.
- **Move towards systems and ownership.** Learn how the whole pipeline or service behaves in production, not just your corner of it. Be the person who understands why it's built that way.
- **Get very good at checking.** Reading code, writing tests, spotting a plausible but wrong answer. As generation gets cheap, verification becomes the valuable part.
- **Learn the domain, not just the stack.** Knowing how insurance, payments or logistics actually work is context a model doesn't have about your particular company.
- **Don't panic, but don't coast.** The ones who adapt will be fine. The ones waiting for this to blow over will have a harder time.

Seventeen months ago I ended with: "I'd rather be the person who knows when the generated code is wrong than the person who can only generate it." I still mean that. I'd just add that the gap between those two people is shrinking faster than I thought, so it's worth closing it in the right direction now.
