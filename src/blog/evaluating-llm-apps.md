---
title: "Evaluating LLM Apps: Treat Prompts Like Pipelines"
date: 2026-10-08
tags: ["post", "genai", "llms", "guides"]
---

I wouldn't ship a data pipeline with zero tests and then act surprised when the numbers go wrong. Yet people will put an LLM into production, test three prompts by hand, and call it good. Then somebody changes one sentence or the model gets updated and the whole feature behaves differently.

If it's part of a real product, it needs **evals**. Not a fancy benchmark leaderboard. Your actual inputs, expected behaviour and a test that runs when something changes.


<figure><img src="/img/blog/diagram-evals.png" alt="Evals in CI: golden set, run, graders, scores, gate" loading="lazy"><figcaption>Evals as a pipeline step that can fail the build.</figcaption></figure>

## 1. Build a golden dataset

I'd start by saving 50–200 inputs that resemble what the feature actually receives. Not polished examples invented for a demo—real questions, incomplete messages, awkward documents. Then write down what a correct response would need to contain. Sometimes that's an exact category. Sometimes it's a fact or a short grading rubric. Commit the dataset beside the prompt so changes are reviewable.

Don't get stuck designing the perfect benchmark. Thirty ugly real-world examples are a better start than another week of prompt tweaking.

## 2. Use the cheapest check that works

Don't pay another LLM to judge something a few lines of code can check. My order would be:

1. **Code checks first.** Is it valid JSON? Does it follow the schema? Did it return an allowed label? These tests are cheap and easy to understand.
2. **Compare against labelled results.** If you're extracting a payment amount, check it against the known amount. For retrieval, check whether the correct document came back.
3. **Use another model only when you need judgement.** It can grade a summary against a rubric, but the judge can be wrong too. Compare its decisions with human-reviewed examples before trusting the score.

## 3. Score the parts separately

One "AI quality" score tells you almost nothing when something breaks. For RAG, I want to know whether retrieval found the right document *before* I blame the model for its answer. For agents, I care whether the task finished, how many steps it needed and what it cost.

## 4. Run evals like CI

```text
prompt or model change
        │
        ▼
run the golden set ──► scores vs. last release
        │
        ▼
regression? ── yes ──► block the change
        │
        no
        ▼
     ship it
```

I'd wire this into CI. Change the prompt? Run the cases. Swap models? Run them again. Replace the retriever? Same thing. Decide beforehand how much regression you're willing to tolerate and fail the build when it crosses that line. We already do this for code and data pipelines; the fact that the component generates text isn't a reason to stop.

## 5. Keep watching in production

- Record the model version, inputs, outputs, timing and token usage, with sensitive data handled appropriately.
- Review real production cases regularly and move the surprising failures into the test set.
- Pay attention to what users actually do. If they keep retrying or rewriting the answer, a happy-looking model response might not be helping them.

## 6. Don't forget cost and latency

An improved score isn't a win if the feature becomes painfully slow or three times more expensive to operate. I want accuracy, latency and cost next to each other. A two-point accuracy gain is only useful when you know what you're paying for it.

If someone asks "did the new prompt actually improve anything?" and your answer is "it feels better", you don't have an evaluation process yet.

## Try it: a five-question eval that fails

For a concrete example, I ran five questions against a small local 1.7B model. The checks are deliberately simple—exact matches, substrings and regex. There's no complicated evaluation platform involved:

```bash
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/eval_demo.py
python eval_demo.py
```

<figure><img src="/img/blog/term-evals.png" alt="Eval output: 2 of 5 pass, gate fails" loading="lazy"><figcaption>Real output. The small model scored 2/5 and the gate blocked the merge.</figcaption></figure>

The model got 2/5. Good. The test caught it inventing a port number, getting a basic SQL fact wrong and ignoring the length limit. Now I can try a better prompt or a bigger model and see if it actually helps. That's a lot more useful than posting the one good answer it happened to generate.
