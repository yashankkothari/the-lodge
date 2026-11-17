---
title: "When the AI Is Wrong, Who Is Responsible?"
date: 2026-07-25
tags: ["post", "essays", "ai-philosophy"]
---

A model makes something up, an employee trusts it, and a customer gets hurt. Now everyone involved wants to explain why it was technically somebody else's fault.

The model company points at the product team. The product team points at the employee who clicked approve. Management points at the policy that says "human in the loop". Somehow we end up with a long chain of people who had a hand in the system and nobody who wants to own the outcome.

## The usual suspects

**The model maker** shapes the general behaviour: what the model knows, how it handles uncertainty, what it refuses. But it can't see how its model will be used, on what data, for which decisions. Holding it solely responsible for every downstream use is like blaming a compiler for every bug in a program.

**The builder** (the team integrating the model into a product) makes most of the decisions that matter in practice: what context goes in, what checks run, what the user sees, whether a human reviews the output. This is often where the real design choices sit, and often where they're least documented.

**The user** acts on the output. Sometimes they should have known better. Often they were given a tool that looked authoritative, under time pressure, with no way to tell a confident right answer from a confident wrong one.

**The organisation** decides the system is good enough to deploy, sets the incentives, and decides how much time people have to check its work. Those decisions rarely get recorded as decisions, but they shape everything below them.

## Moral crumple zones

The researcher Madeleine Clare Elish described a **moral crumple zone**: in a complex automated system, the human operator absorbs the blame for failures, much as a car's crumple zone absorbs the force of a crash. The automation is protected; the person takes the hit.

Her examples came from aviation and other automated systems, where operators were held responsible for failures in systems they had limited control over. The pattern transfers neatly to AI. A reviewer approves a model's recommendation. The recommendation was wrong. The reviewer gets blamed, even though the system was designed so that reviewing hundreds of outputs a day made careful checking unrealistic.

## Human-in-the-loop as a liability sponge

I get suspicious whenever somebody says "there's a human in the loop" as though that sentence automatically makes the system safe. Sometimes it means a real person can stop a bad decision. Sometimes it means a person is there so somebody can be blamed afterwards.

A human check only means something if the human has:

- **Enough time** to actually evaluate each case.
- **Enough information** to see why the model produced its output.
- **Real authority** to disagree without being penalised for slowing things down.
- **Feedback** on whether their past decisions were right.

Take those away and you've built a rubber stamp that happens to have an employee ID. The company gets to say a human approved it. The human gets the blame. The flawed workflow gets to continue untouched.

Automation bias makes this worse. People tend to trust automated suggestions, especially when they're usually right. A system that is correct most of the time trains its reviewers to stop looking closely, which is exactly when the rare error slips through.

## A data engineer's view: lineage is accountability

My day job is moving and shaping data, so I tend to see this through the lens of **lineage**: the record of where a piece of data came from and what was done to it on the way.

In a well-run data platform, if a number on a report is wrong, you can trace it back. Which source table, which transformation, which job run, which version of the code. That trace doesn't assign blame by itself, but it makes the question answerable. Without it, every incident turns into an argument.

AI systems need the same thing, and mostly don't have it. For any decision a model influenced, you'd want to know:

- Which model and which version produced the output.
- What prompt and what retrieved context it saw.
- What checks ran, and what they decided.
- Who saw it, what they did, and how long they spent.
- What the final action was, and who authorised it.

```text
decision_id        -> 7f3c...
model / version    -> provider, pinned version string
prompt_template    -> claims_summary_v12
retrieved_docs     -> [doc_881, doc_904]
guardrail_results  -> grounded=pass, pii=pass
reviewer           -> user_id, time_on_screen=14s
final_action       -> approved
```

Fourteen seconds. That's how long the supposed safety check took. You can write fifty pages of AI governance policy, but if your reviewers are being given fourteen seconds per decision, the model is making the call. Let's at least be honest about that.

## Responsibility follows control

My rule is that **responsibility should follow control**. Who could actually change the system? Who knew what it was doing? Who set the targets and decided how much review time was enough? Start there, not with the last person who clicked a button.

That usually points upstream, to the builders and the organisation, rather than to the last person to click a button. It also means responsibility can be designed. If you want users to be responsible for their decisions, give them the time, context and authority that responsibility requires. If you can't, be honest that the system is making the decision and own it at the level that built it.

## If you're building one of these

- Log enough to reconstruct any decision: model version, inputs, context, checks, reviewer and action.
- Measure how long humans actually spend reviewing, and treat very short review times as a design problem.
- Give reviewers a clear way to disagree, and feed their disagreements back into evaluation.
- Write down who owns each part of the system, so the question "whose fault was that" has an answer before anyone needs to ask it.
