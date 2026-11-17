---
title: "Opus 5.5 and the Junior Question, Seventeen Months Later"
date: 2026-10-08
tags: ["post", "essays", "ai-philosophy"]
---

In May 2025 I wrote [Will AI Replace Junior Developers?](/blog/will-ai-replace-juniors/) right before my final year. I said some junior roles would disappear, but companies would still need people to eventually become seniors. I thought the transition would be gradual.

Then **Claude Opus 5.5** arrived on 22 September. I've reread my old post since. I don't think I was completely wrong, but I was definitely too comfortable about how much time we'd have.

## What changed in a few months

Opus 5.5 isn't some singular moment where AI suddenly learned to code. It's a bunch of improvements arriving together, while the cost comes down. Anthropic says it matches their larger Fable 5.1 model on most work and costs roughly 40% less than Opus 5 on typical workloads. They also cite a 680,000-line migration done in under a day and a C-to-Rust translation of HAProxy that passed nearly all its own regression tests in about nine and a half hours.

Obviously, those are the examples Anthropic chose to publish. I'm not taking a launch blog as independent proof of anything. What I find harder to ignore is what people are attempting outside the launch demos.

- **Prototypes are almost free now.** Something that used to be a weekend side project, like a CRUD app with auth, a dashboard or a small mobile app, now takes an evening of describing and reviewing. I built [NotesAid](/work/notesaid/) the slow way in 2025. A first-year student today could get a rough version running before dinner.
- **Small products ship with tiny teams.** Building a working app was never the hard part of starting something. It's just stopped being a serious obstacle at all.
- **Reverse engineering has sped up a lot.** In August, Chris Lewis finished a full decompilation of the N64 game Snowboard Kids in 84 days. His previous one took 596. He credits LLMs for a lot of that, though he's clear that experienced people in the decomp community were essential, especially for the strange quirks of the old SGI compiler. This month a developer released open-source "clean-room" clones of seven Adobe apps, Photoshop, Illustrator, Premiere and four others, which he says he built with Opus 5.5 in Rust.

Let's be serious about the Adobe clones. They're early, buggy alphas. The original promise of "100% parity within a month" has already become "months, not years". Calling them finished Adobe replacements would be absurd. But dismissing the whole thing because they're unfinished misses the point too. The speed at which one person can get to a *rough* product has changed, even if the last 80% is still brutally hard.

## So was the old post right?

I undersold **what gets automated**. I was talking about boilerplate and first drafts. Now I'm looking at full features, migrations and attempts to rebuild software from its behaviour. You can argue about how production-ready the output is, and you should, but the scope of the tasks has clearly grown.

The part about **what doesn't get automated** still holds, but the line is moving. Working out the actual problem, knowing the system, judgment, debugging across messy production reality, owning the outcome: none of those have gone away. But every model release takes a little more of them. Opus 5.5 is noticeably better at reading a large codebase and explaining what it found, which is exactly the "knowing the system" skill I said was ours.

## The part I'm holding onto: systems

The thing I keep coming back to is **system design**. Not the interview version where you draw boxes and sprinkle Kafka everywhere. The version where the system has to survive actual users and someone has to explain why it failed:

- Deciding where state lives, and what happens when two services disagree about it.
- Knowing which failure modes matter for this business. A dropped log line and a dropped insurance claim are not the same kind of failure.
- Choosing between consistency, cost and latency when you can't have all three.
- Designing for the people who'll run the system at 3 a.m., and for the audit that happens a year later.

A model can produce a very convincing architecture diagram. What it can't do yet is carry the consequences. It wasn't in the room when the last outage happened, and it won't be the one explaining the next one to someone who lost money. Big systems still need a person who understands why they are the way they are, and who's accountable for changing them.

I would love to believe that part is permanently safe. I also know how stupid it would be to build an entire career on "surely AI can't do *this*" after watching that boundary move repeatedly.

## The money question

There's another issue the "every developer is obsolete" crowd conveniently forgets: who's paying for all this compute?

Frontier AI is wildly expensive to build. Anthropic's leaked IPO prospectus, reported last month, showed revenue of about $4.6 billion in 2025, an operating loss of over $8 billion, and more than $500 billion in future compute and infrastructure commitments. OpenAI is reportedly forecasting around $278 billion of negative free cash flow between 2026 and 2030. To be fair, Anthropic reportedly posted its first small operating profit in Q2 2026, so the picture isn't purely one of losses. But the industry as a whole is still spending far more than it earns, betting that revenue catches up.

I genuinely don't know how that bill gets paid. I can imagine at least three outcomes:

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
- **Don't panic, but don't coast.** I don't trust anyone who guarantees you'll be fine, but I trust "ignore it and hope" even less.

Seventeen months ago I said I'd rather know when generated code is wrong than just know how to generate it. I stand by that. What changed is my sense of urgency. You can't spend your whole time telling an AI to write code and then act surprised when the AI gets better at the only thing you've learned to do.
