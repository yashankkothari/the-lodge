---
title: "Evaluating LLM Apps: Treat Prompts Like Pipelines"
date: 2026-10-08
tags: ["post", "genai", "llms", "guides"]
---

I wouldn't ship a data pipeline with zero tests and then act surprised when the numbers go wrong. Yet people will put an LLM into production, test three prompts by hand, and call it good. Then somebody changes one sentence or the model gets updated and the whole feature behaves differently.

If it's part of a real product, it needs **evals**. Not a fancy benchmark leaderboard. Your actual inputs, expected behaviour and a test that runs when something changes.


<figure><img src="/img/blog/diagram-evals.png" alt="Evals in CI: golden set, run, graders, scores, gate" loading="lazy"><figcaption>Evals as a pipeline step that can fail the build.</figcaption></figure>

## 1. Build a golden dataset

Collect 50–200 real inputs: actual user questions, real documents, messy edge cases. For each, write down what a good output looks like. That could be an exact label, a required fact, or a short rubric. Version it in git next to the prompts.

Don't get stuck designing the perfect benchmark. Thirty ugly real-world examples are a better start than another week of prompt tweaking.

## 2. Use the cheapest check that works

In order of preference:

1. **Deterministic checks.** Valid JSON? Matches the schema? Contains the required field? Correct label? These are fast, free and unambiguous.
2. **Reference comparisons.** Does the extracted amount equal the labelled amount? Did retrieval return the labelled document?
3. **LLM-as-judge.** A second model grades the output against a rubric ("Is every claim supported by the sources? yes/no, and why"). Useful for open-ended text, but spot-check the judge against human ratings before you trust it.

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

Every prompt edit, model upgrade or retrieval change runs the suite. A drop in any metric beyond a small tolerance blocks the change, just as a failing dbt test blocks a deploy.

## 5. Keep watching in production

- Log inputs, outputs, latency, token cost and the model version for every call.
- Sample production traffic for review each week and add interesting failures to the golden set.
- Collect cheap user signals such as thumbs up or down, and whether the user retried or edited the answer.

## 6. Don't forget cost and latency

Quality is one axis. A change that improves accuracy by two points but doubles latency or cost per request is a trade-off, not a win. Put all three on the same dashboard.

If someone asks "did the new prompt actually improve anything?" and your answer is "it feels better", you don't have an evaluation process yet.

## Try it: a five-question eval that fails

Here's a tiny golden set with cheap graders (substring, exact match, regex) run against a 1.7B local model:

```bash
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/eval_demo.py
python eval_demo.py
```

<figure><img src="/img/blog/term-evals.png" alt="Eval output: 2 of 5 pass, gate fails" loading="lazy"><figcaption>Real output. The small model scored 2/5 and the gate blocked the merge.</figcaption></figure>

The model got 2/5. Good. The test caught it inventing a port number, getting a basic SQL fact wrong and ignoring the length limit. Now I can try a better prompt or a bigger model and see if it actually helps. That's a lot more useful than posting the one good answer it happened to generate.
