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

- **Getting a prototype running takes almost no time now.** Auth, CRUD, a dashboard, a basic app: things I'd have spent a weekend wrestling with are becoming an evening of prompting, checking and fixing. I built [NotesAid](/work/notesaid/) the slower way in 2025. A student starting today can get to a rough demo much faster.
- **You don't need a large team to show something working.** Making software *good* is still hard. But getting the first version in front of somebody is becoming a much smaller hurdle.
- **Even reverse engineering is moving faster.** Chris Lewis decompiled the N64 game Snowboard Kids in 84 days in August; his previous project took 596. He credits LLMs for a lot of the speed while also crediting experienced people who understood the original SGI compiler's weirdness. Then came the developer claiming seven early "clean-room" Adobe app clones, including Photoshop, Illustrator and Premiere, written in Rust with Opus 5.5. Those claims need scrutiny, but the experiments themselves are worth watching.

Let's be serious about the Adobe clones. They're early, buggy alphas. The original promise of "100% parity within a month" has already become "months, not years". Calling them finished Adobe replacements would be absurd. But dismissing the whole thing because they're unfinished misses the point too. The speed at which one person can get to a *rough* product has changed, even if the last 80% is still brutally hard.

## So was the old post right?

I undersold **what gets automated**. I was talking about boilerplate and first drafts. Now I'm looking at full features, migrations and attempts to rebuild software from its behaviour. You can argue about how production-ready the output is, and you should, but the scope of the tasks has clearly grown.

I still think understanding the actual problem, debugging messy failures and owning the outcome matter more than typing speed. But I can't keep moving those tasks into a sacred "human-only" category. Models are getting better at reading large repos and explaining how things fit together. That's uncomfortably close to one of the skills I said would protect us.

## The part I'm holding onto: systems

The thing I keep coming back to is **system design**. Not the interview version where you draw boxes and sprinkle Kafka everywhere. The version where the system has to survive actual users and someone has to explain why it failed:

- Who owns a piece of state when two services disagree, and which copy is supposed to win?
- What can we afford to lose? A missing debug log and a missing insurance claim aren't remotely comparable.
- What are we sacrificing between consistency, response time and cost? There's always a trade-off hiding somewhere.
- Can the person on call at 3 a.m. understand this thing? Can we explain its decisions in an audit a year later?

Any good model can draw boxes, label arrows and recommend a message queue. That doesn't mean it knows what your last production outage felt like or why the business refuses to tolerate a particular failure. It also won't be in the meeting explaining to somebody why their payment disappeared. I care about the engineer who can connect the diagram to those consequences.

I would love to believe that part is permanently safe. I also know how stupid it would be to build an entire career on "surely AI can't do *this*" after watching that boundary move repeatedly.

## The money question

There's another issue the "every developer is obsolete" crowd conveniently forgets: who's paying for all this compute?

The numbers being reported are absurd. A leaked Anthropic IPO prospectus reportedly put 2025 revenue around $4.6 billion against more than $8 billion in operating losses, plus over $500 billion in future compute and infrastructure commitments. OpenAI reportedly expects roughly $278 billion in negative free cash flow across 2026–2030. Anthropic also reportedly managed a small operating profit in Q2 2026, so I'm not claiming every lab is losing money every quarter. My point is that the industry is taking an enormous bet on future demand and falling costs. Today's token prices aren't some law of nature.

I genuinely don't know how that bill gets paid. I can imagine at least three outcomes:

- **It works.** Usage grows enough to support the infrastructure, models get cheaper and powerful coding tools become another utility developers expect to have.
- **The discounts end.** The best models get expensive to use, and suddenly all those stories of one person burning millions of tokens look a lot less practical.
- **The industry corrects.** Labs consolidate, some bets fail and we spend more time squeezing value out of the models we already have.

The hiring consequences look different in each scenario. But none ends with everybody uninstalling their coding assistant and going back to 2023.

## What I'd tell myself now

I don't regret telling students to learn the fundamentals and understand what they ship. I'd say all that again. I'd just be much more urgent about the rest:

- **Actually change how you work.** Directing, reviewing and verifying the output is a real skill. Pretending tools haven't changed is not a strategy.
- **Understand the whole system.** Know where the data comes from, where it fails and what happens when someone retries a job in production.
- **Get harder to fool.** Read generated code critically, write tests and learn to recognise when a plausible answer is wrong.
- **Know the business.** Insurance, payments and logistics each have rules you won't learn from a framework tutorial. The context matters as much as the stack.
- **Don't panic, but don't coast.** I don't trust anyone who guarantees you'll be fine, but I trust "ignore it and hope" even less.

Seventeen months ago I said I'd rather know when generated code is wrong than just know how to generate it. I stand by that. What changed is my sense of urgency. You can't spend your whole time telling an AI to write code and then act surprised when the AI gets better at the only thing you've learned to do.
