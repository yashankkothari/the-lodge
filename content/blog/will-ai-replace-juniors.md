---
title: "Will AI Replace Junior Developers? I'm About to Find Out"
date: 2025-05-10
tags: ["post", "essays", "ai-philosophy"]
---

I'm about to enter my final year of computer engineering and apparently the job I'm studying for is supposed to be dead by the time I graduate. According to my feed, AI has already replaced every junior developer. Then I open another post explaining why it absolutely hasn't. Both get thousands of likes.

I'm not interested in choosing the comforting side. I'm interested in whether companies will still want to hire someone like me.

## What's actually getting automated

Let's not pretend the tools are bad just because the implications are uncomfortable. They can already do a lot of the work juniors were traditionally given:

- The boring setup work: CRUD routes, configuration, basic data models and test scaffolding.
- Turning a rough specification into working code, or translating code between languages.
- Finding the library call or regex I'd otherwise spend twenty minutes searching for.
- Getting a first version of a SQL query, script or README on screen.

I've seen things that took me an afternoon in second year take twenty minutes with an assistant. That's not a hypothetical productivity gain. If you're hiring juniors just to crank out boilerplate, I can see why you're reconsidering.

I think it's a mistake to confuse that list with the entire reason junior roles exist.

## What a junior is actually for

Here's what gets lost in the "AI replaced my intern" victory laps: juniors aren't supposed to stay juniors. You hire someone inexperienced, give them small tasks, review their work and gradually trust them with bigger ones. It's an **apprenticeship**, not a code-generation subscription.

If companies stop doing that because a model can ship the small tasks, who's going to be the senior engineer in five years? I suspect plenty of companies will ignore that question because this quarter's headcount is easier to measure than a future skills gap. That's an actual problem for people graduating now.

## What doesn't get automated

The hard parts, at least from where I'm sitting, are the ones a code-generation demo neatly avoids:

- **Figuring out what somebody actually needs.** Tickets aren't always clear, and the person who wrote them doesn't necessarily know the right solution.
- **Knowing the ugly history.** Why a table has a bizarre field, why a service can't be called during a batch run, and who'll be furious if you change it.
- **Making calls.** Whether a shortcut is safe, whether an abstraction is worth the hassle, or whether the feature should exist at all.
- **Debugging real production failures.** Three systems disagreeing at month end is not the same as solving a self-contained LeetCode problem.
- **Being responsible.** If customers lose data, somebody has to own the fix. You can't send the model to the incident review.

I'm not claiming models will never help with these jobs. They already do. But a model that can suggest an architecture is not the person who knows why the team rejected that architecture last year, or who has to defend the decision when it breaks.

## The real risk: skipping the learning

What scares me just as much is what we're doing to ourselves with the tools.

If Claude writes an entire feature and I paste it in without understanding any of it, what exactly did I learn? I can say I shipped a feature. Great. Next week I'm still just as lost when something breaks. Repeat that for a year and I've basically trained myself to be a middleman between a prompt box and a repo.

I hate being stuck on a bug as much as anyone. But that hour of staring at an error, reading documentation and trying the wrong fix is sometimes where you learn what the system is doing. Outsource every one of those hours and you're outsourcing a pretty important part of becoming an engineer.

## How I'm trying to learn now

I'm still going to use AI. Refusing on principle makes about as much sense to me as refusing to look things up on Stack Overflow. I just need rules for when it helps me learn and when it lets me cheat myself:

- When I'm learning something new, I try it first. Then I look at the assistant's version and work through why the two differ.
- If I can't explain what a function does, I'm not comfortable committing it just because it passed once.
- I spend time reading real code: libraries, open-source projects and other people's PRs. Generated code is much easier to judge when you've seen good code written by humans.
- I ask why a solution works and check the answer against documentation. The model explaining its own mistake confidently is still a mistake.
- I don't skip data structures, databases, networking or concurrency because the autocomplete looks impressive. Those are exactly the things I need when the output is subtly broken.

## So, will it take junior jobs?

Yes, I think some junior jobs will disappear. If the entire role was completing straightforward tickets, a smaller team with good tools can plausibly cover more of that work. And I expect companies to raise the bar for fresh graduates because they assume everyone has the same tools available.

What I don't buy is the idea that a company can stop training people and somehow keep producing experienced engineers. Someone still has to learn the codebase, get things wrong under supervision and become the person who knows what to do during an incident. The value of a junior might shift away from typing speed and towards judgement much earlier than before.

I'm not going to pretend that's exciting for every student staring at a hiring freeze. It's a worse entry point than the one we were promised, and I think we should be allowed to say that.

## Where this leaves me

- I'm not ditching AI tools. I'm also not letting them replace the hours I need to understand things.
- If I can't defend a piece of code in a review, I need to go back and read it.
- The fundamentals are not optional just because a chatbot can generate something that runs.
- I'd choose a team that actually reviews my work and teaches me over one that treats a graduate as a cheaper prompt operator. That mentorship will matter long after the first payslip.

I'd much rather be the annoying person in a code review who spots why the generated solution will fail than the guy who can produce ten more versions of it.

*Update, October 2026: I revisited this after Claude Opus 5.5 came out, in [Opus 5.5 and the Junior Question, Seventeen Months Later](/blog/opus-5-5-and-the-junior-question/).*
