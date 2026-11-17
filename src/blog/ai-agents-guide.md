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

Model providers support **tool calling** (also called function calling): you describe each tool with a name, a description and a JSON schema, and the model returns a structured call instead of prose.

## Design tools like an API for a junior engineer

- **Few, clear tools beat many vague ones.** `get_policy(policy_id)` is better than `run_sql(query)`.
- **Write the description for the model.** Say when to use the tool, what it returns and what it can't do.
- **Return compact, useful results.** Twenty relevant rows, not a 10,000-row dump that fills the context window.
- **Return errors as text the model can act on**: "policy_id must look like POL-123456", not a stack trace.

## Start with a workflow, not an agent

If you already know the steps (extract, validate, load), please just write a pipeline. You don't need an LLM improvising the order of operations for a job with a perfectly good order already. Use an agent when the next step actually depends on what the previous step discovered.

## Guardrails that matter

1. **Step and cost limits** on every run.
2. **Least privilege.** Read-only tools by default; separate, narrow tools for writes.
3. **A human approves anything irreversible**: sending an email, paying, deleting, deploying.
4. **Treat tool output as untrusted data.** A web page or document can contain text that tries to give the agent instructions (prompt injection). Never let retrieved content grant new permissions.
5. **Validate tool arguments** against the schema before running anything.

## Make it observable

Log the prompt, tool calls, arguments, results, token use and timing. Otherwise, when the agent does something stupid, all you'll have is the final answer and a bill. You need to know whether it chose the wrong tool, got bad data back or misunderstood the request.

## Evaluate on tasks, not vibes

Give the agent real tasks with known outcomes and rerun them when you change anything. Count successful tasks, steps and cost. If the shiny new model is 5% more accurate but burns three times the tokens, that's a trade-off, not an automatic upgrade.

## Try it: a tool-calling agent in 25 lines

This runs the loop above against a local model through Ollama's tool calling. One tool, an allowlist of paths, and a four-step budget:

```bash
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/agent_demo.py
python agent_demo.py
```

<figure><img src="/img/blog/term-agent.png" alt="Agent demo: one tool call to disk_usage, then a final answer" loading="lazy"><figcaption>Real output. The model called the tool once, read the result, and stopped.</figcaption></figure>

Try asking it about `/etc`. The allowlist blocks the request and the model has to handle that failure. That's what a working guardrail looks like, not another instruction begging the model to be careful. For a setup with memory, skills and a chat front end, here's [my OpenClaw Telegram assistant](/blog/openclaw-telegram-ollama/).
