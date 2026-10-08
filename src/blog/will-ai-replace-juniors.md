---
title: "Will AI Replace Junior Developers? A Student's Honest View"
date: 2025-05-10
tags: ["post", "essays", "ai-philosophy"]
---

I'm about to start the final year of a computer engineering degree, which means I'm about to enter the job market that everyone online says is disappearing. Every few weeks there's a new post claiming AI will write all the code and nobody needs to hire juniors any more. Every few weeks there's a reply saying that's nonsense.

I don't think either side is quite right, and I'd rather think it through than pick a team.

## What's actually getting automated

Be honest about what coding assistants are good at. They're very good at the work that used to be a junior's first few months:

- Boilerplate: CRUD endpoints, config files, data classes, test scaffolding.
- Translating between things: one language to another, a spec into a function, an error message into a likely fix.
- Looking things up: the right library call, the argument order, the regex you'd otherwise search for.
- First drafts of SQL, scripts and documentation.

That's real. A task that took me an afternoon in my second year can take twenty minutes now. If a company measured juniors purely by lines of working code produced, the maths would look bad for us.

But that was never really what juniors were for.

## What a junior is actually for

Teams hire juniors because juniors become seniors. The first year is an **apprenticeship**: you do small, low-risk work, someone reviews it, you learn how the system and the team actually work, and slowly you're trusted with more.

The output in that first year was always modest. The value was in what the person turned into. If companies stop hiring juniors because AI covers the modest output, they'll find in a few years that there's nobody to promote. I expect some will make that mistake anyway, because hiring is often decided quarter by quarter. That's a real risk for people my age, and I don't want to wave it away.

## What doesn't get automated

The parts of the job I find hardest aren't typing code. They're things like:

- **Working out what the problem is.** Requirements are usually incomplete, and the person asking often doesn't know what they need yet.
- **Knowing the system.** Why this table has a strange column, why that service can't be called during a batch run, which team owns what.
- **Judgment.** Is this change safe? Is this abstraction worth it? Should this be built at all?
- **Debugging things that don't fit in a prompt.** A failure that only shows up with production data, across three services, at month end.
- **Owning the outcome.** Someone has to be accountable when it breaks.

An assistant can help with each of these. It can't do them for you, because they depend on context it doesn't have and responsibility it can't hold.

## The real risk: skipping the learning

The thing I actually worry about isn't replacement. It's that students and juniors use these tools to skip the part where you learn.

If an assistant writes my code and I paste it in without understanding it, I've shipped something, but I haven't got any better. Do that for a year and I'm a person who can prompt but can't reason about what comes back. That person is genuinely replaceable, because the only skill they've built is the one the tool already has.

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

That's a harder start than the one people a few years ahead of me had. It's also, honestly, a more interesting one.

## Where this leaves me

- Use the tools, but don't let them do your learning for you.
- Don't ship what you can't explain.
- Put real effort into fundamentals and reading code; that's where judgment comes from.
- Look for teams that still invest in reviewing and mentoring juniors. An apprenticeship is worth more than a slightly higher first salary.

I'd rather be the person who knows when the generated code is wrong than the person who can only generate it.
