---
title: "AI Agents Without the Hype: Tools, Loops and Guardrails"
date: 2026-10-03
tags: ["post", "genai", "agents", "guides"]
---

There's so much nonsense being sold under the word "agent" that the basic definition gets lost. An **agent** is an LLM in a loop with access to tools. It decides what to do, calls a tool, reads the result and decides what to do next. Repeat until it's done, or until something stops it.

That's the interesting part: what stops it? The tools you expose and the limits you set matter a lot more than another flashy "autonomous workforce" demo.


<figure><img src="/img/blog/diagram-agents.png" alt="The agent loop: model, tool call, run tool, observation" loading="lazy"><figcaption>An agent is this loop with a budget and guardrails around it.</figcaption></figure>

## The loop

```python
messages = [system_prompt, user_task]

for step in range(MAX_STEPS):              # always cap it
    reply = llm(messages, tools=TOOLS)
    if reply.tool_call is None:
        return reply.text                  # done
    result = run_tool(reply.tool_call)     # validated, sandboxed
    messages += [reply, tool_result(result)]

raise RuntimeError("step limit reached")
```

That code is basically the whole loop. Most model APIs support **tool calling**: you describe available functions with names, descriptions and argument schemas. Instead of replying with normal text, the model can ask your application to execute one of them. Your code runs it and passes the result back. That's the difference between generating an instruction and actually attempting the action.

## Design tools like an API for a junior engineer

- Give it specific tools. `get_policy(policy_id)` is a lot safer to reason about than a giant `run_sql(query)` escape hatch.
- Describe the tools like you're explaining an unfamiliar API to another engineer. Include when they're appropriate and what they return.
- Don't dump 10,000 database rows into the context window because the tool technically can. Return the useful subset.
- Make failures readable. "Expected policy ID like POL-123456" gives the model something it can correct; a raw stack trace usually doesn't.

## Start with a workflow, not an agent

If you already know the steps (extract, validate, load), please just write a pipeline. You don't need an LLM improvising the order of operations for a job with a perfectly good order already. Use an agent when the next step actually depends on what the previous step discovered.

## Guardrails that matter

1. Put a hard cap on iterations and spend. A model stuck in a loop shouldn't be able to keep burning tokens indefinitely.
2. Start with read-only access. Give write tools narrow permissions instead of handing an agent your whole machine.
3. Require approval before sending messages, moving money, deleting files or deploying. If the action can't easily be undone, I want a person involved.
4. Assume the content it reads may be malicious. A web page saying "ignore your instructions" is data, not a new system prompt.
5. Check every tool argument in code. A schema in the prompt is not a security boundary.

## Make it observable

Log the prompt, tool calls, arguments, results, token use and timing. Otherwise, when the agent does something stupid, all you'll have is the final answer and a bill. You need to know whether it chose the wrong tool, got bad data back or misunderstood the request.

## Evaluate on tasks, not vibes

Give the agent real tasks with known outcomes and rerun them when you change anything. Count successful tasks, steps and cost. If the shiny new model is 5% more accurate but burns three times the tokens, that's a trade-off, not an automatic upgrade.

## Try it: a tool-calling agent in 25 lines

I wrote a tiny version you can actually break. It uses Ollama tool calling, allows one disk-usage tool to inspect only approved paths, and stops after four steps. That's enough to see both the useful behaviour and the limits:

```bash
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/agent_demo.py
python agent_demo.py
```

<figure><img src="/img/blog/term-agent.png" alt="Agent demo: one tool call to disk_usage, then a final answer" loading="lazy"><figcaption>Real output. The model called the tool once, read the result, and stopped.</figcaption></figure>

Try asking it about `/etc`. The allowlist blocks the request and the model has to handle that failure. That's what a working guardrail looks like, not another instruction begging the model to be careful. For a setup with memory, skills and a chat front end, here's [my OpenClaw Telegram assistant](/blog/openclaw-telegram-ollama/).
