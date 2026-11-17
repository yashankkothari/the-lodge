---
title: "When the AI Is Wrong, Who Is Responsible?"
date: 2026-07-25
tags: ["post", "essays", "ai-philosophy"]
---

A model makes something up, an employee trusts it, and a customer gets hurt. Now everyone involved wants to explain why it was technically somebody else's fault.

The model company points at the product team. The product team points at the employee who clicked approve. Management points at the policy that says "human in the loop". Somehow we end up with a long chain of people who had a hand in the system and nobody who wants to own the outcome.

## The usual suspects

**The company that trains the model** determines a lot of its behaviour: what it knows, when it refuses and how confidently it answers. But it doesn't control every product built on top. Blaming the model provider for every downstream mistake is a bit like blaming the compiler for every bad decision in your code.

**The team building the product** chooses the prompt, the documents the model sees, the checks and what the user is shown. They decide whether somebody gets a chance to catch a bad answer. To me, that's where a lot of responsibility sits, even if nobody bothered to document those choices.

**The person using it** might make the final decision. Sometimes they were careless. Sometimes the interface made a wrong recommendation look official and gave them thirty seconds to approve it. I don't think those situations deserve the same blame.

**Management** decided to deploy this thing in the first place. They set the review targets and decide whether employees are rewarded for checking carefully or punished for being slow. Those choices don't look technical, but they shape the entire failure.

## Moral crumple zones

Madeleine Clare Elish has a term for this: the **moral crumple zone**. In a car, the crumple zone absorbs the impact. In a badly designed automated system, the human operator absorbs the blame. The technology stays in place; the person closest to the failure gets crushed.

She was writing about automation in fields such as aviation, where operators were blamed for systems they couldn't fully control. It's difficult not to see the same pattern with AI. Suppose somebody has to approve hundreds of model-generated decisions per day. One is wrong. Suddenly everyone asks why they didn't catch it, as if the workload had been designed to make careful review possible.

## Human-in-the-loop as a liability sponge

I get suspicious whenever somebody says "there's a human in the loop" as though that sentence automatically makes the system safe. Sometimes it means a real person can stop a bad decision. Sometimes it means a person is there so somebody can be blamed afterwards.

A real review needs more than a checkbox with somebody's name on it:

- Time to read the case instead of racing through a queue.
- Access to the context and evidence behind the recommendation.
- Permission to say no, without being punished for slowing down the process.
- Feedback when their previous approvals turned out to be wrong.

Take those away and you've built a rubber stamp that happens to have an employee ID. The company gets to say a human approved it. The human gets the blame. The flawed workflow gets to continue untouched.

There's also automation bias. The more often the machine is right, the easier it becomes to approve its suggestions without thinking. A system that's correct 99 times can train a reviewer to stop checking just in time for the hundredth case to be disastrous.

## A data engineer's view: lineage is accountability

I work with data pipelines, so the comparison that makes sense to me is **data lineage**. When somebody asks where a number came from, I want to know which source, transformation and job run produced it. Otherwise we're guessing.

If a report shows the wrong figure, a decent data platform should let you trace it through source tables, transformations and code versions. That doesn't tell you whose fault it was. It does stop five teams from spending the entire incident meeting arguing over what happened.

I'd want exactly that kind of trail for a consequential AI decision. At minimum, log:

- The specific model version, not just the provider's marketing name.
- The prompt and any retrieved documents that shaped its answer.
- The validation and safety checks, including which ones failed.
- The reviewer, their decision and how much time they had.
- The action that ultimately happened and who approved it.

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

Often the trail leads upstream, to the people who designed the workflow and approved its deployment. If you want the reviewer to own the decision, give them the information, time and authority to make it. If you won't, stop hiding behind "human oversight" and admit you've automated the decision.

## If you're building one of these

- Make a decision trace part of the design, not something you wish you had after the incident.
- Look at how long people spend reviewing outputs. If every review lasts a few seconds, investigate the workflow.
- Give reviewers a way to reject the suggestion and use those rejections to improve testing.
- Decide who owns model behaviour, checks and deployment *before* a customer is harmed. Incident response is a terrible time to invent an ownership chart.
