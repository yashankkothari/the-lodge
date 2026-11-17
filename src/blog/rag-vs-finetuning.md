---
title: "Prompting, RAG or Fine-Tuning? Picking the Right Lever"
date: 2026-03-14
tags: ["post", "genai", "llms", "guides"]
---

Every time an LLM gives a bad answer, somebody suggests fine-tuning. Somebody else says RAG. Half the time the prompt just wasn't clear. These aren't rival technologies. They're three different fixes for three different kinds of problems, and reaching for the fanciest one first is an excellent way to waste money.

## The one distinction that matters

Before installing another framework, ask one question: is the model missing **information**, or is it behaving badly with information it already has?

- **Missing knowledge:** the answer lives in internal documentation, yesterday's policy update or a customer's order history. None of that was necessarily in the model's training data.
- **Wrong behaviour:** it has the information but won't stick to the format, follows the wrong tone, ignores an instruction or behaves inconsistently on a repetitive task.

If it doesn't have your internal policy document, tweaking its personality won't help. If it has the right document but keeps ignoring your output format, building a vector database won't fix that either. I'd try a better prompt first because it costs almost nothing.

## Prompting

Changing the prompt is the lowest-effort thing to try. You aren't modifying weights or building an index. You're describing what this particular request needs more clearly.

I'd use it for:

- Explaining the task and telling the model what not to do.
- Specifying the response format, ideally with structured output enforced by the API.
- Showing a few examples of the pattern you're after (**few-shot prompting**).
- Supplying a short piece of reference material right in the request.

The cost is mostly your time and a few extra input tokens. You can test a change in minutes instead of creating a whole new data pipeline.

But there's only so much you can stuff into a prompt. If you need thousands of documents that change every day, copying them in isn't a strategy. And if the model keeps breaking the same rule after careful instructions, another paragraph may not solve it.

## RAG

**RAG** adds a search step before generation. You take the user's question, find relevant pieces of your own data, and put those pieces into the prompt. The model itself isn't retrained. You've simply given it material to work from.

```python
def answer(question: str) -> str:
    chunks = vector_store.search(embed(question), k=5)   # retrieve
    context = "\n\n".join(c.text for c in chunks)
    prompt = (
        "Answer using only the context below. "
        "If the answer isn't there, say so.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}"
    )
    return llm_call(prompt)                              # generate
```

The distinction matters: the extra knowledge exists in this request's context. It hasn't been permanently added to the weights. When the next question comes in, retrieval has to happen again.

I'd reach for RAG when I need:

- Lots of documentation or policies that change too frequently to bake into a prompt.
- Evidence behind an answer, with links to the passages that were retrieved.
- Permission-aware retrieval, so one employee doesn't accidentally receive another team's private documents.
- New information to become searchable as soon as the index is updated.

Of course, now you have more infrastructure: document ingestion, chunking, embeddings, some form of search, index updates and more prompt tokens. You can use an existing search engine; a dedicated vector database isn't automatically required.

You can start with the documents themselves. But before calling the system reliable, collect questions where you know which document *should* come back. Otherwise you have no way to tell whether retrieval is helping.

Where it falls apart: retrieval gets the wrong chunk and everyone blames the LLM. I've seen people spend ages tuning the generator while their search step is feeding it irrelevant paragraphs. Fix the chunking, queries and metadata first. Hybrid search and reranking are often worth more than a model swap.

## Fine-tuning

Fine-tuning is the one that actually changes model weights. You're taking a base model and training it further on examples of the behaviour you want.

I think of it primarily as a way to change **how the model behaves**: formatting, terminology, tone or consistency on a particular job. Treating fine-tuning as a knowledge database is asking for trouble. Facts learned through training aren't easy to update or cite, and they can become stale. Put changing facts in retrieval.

Cases where I'd consider it:

- Repeatedly getting a specific output style without shipping a massive instruction prompt each time.
- Classification, extraction or routing tasks where a small specialised model might replace an expensive general one.
- Reducing prompt length enough that the inference savings justify the training work.

### LoRA

Full fine-tuning updates all the weights, which gets expensive fast. **LoRA** keeps the base weights frozen and trains smaller matrices attached to certain layers. Instead of storing an entirely separate model for every task, you can store comparatively small adapters.

The practical advantages are:

- Lower training-memory requirements. **QLoRA** pushes this further by quantising the frozen base.
- Different adapters for different jobs without duplicating all the base weights.
- For many tasks, quality that comes close enough to full fine-tuning to make the savings worthwhile.

The real expense is often assembling and cleaning the examples. Depending on the task, you may need hundreds or thousands of consistent input/output pairs, plus time for training and evaluation. A messy dataset doesn't become good just because you fed it to a clever training algorithm.

And now you own a training dataset forever. New base model? Retrain. Requirements changed? Update the examples. Fine-tuning isn't a one-off command you get to forget about.

## They combine

You can use all three together. Sometimes that's the right design. But if you're adding RAG, fine-tuning and an elaborate agent workflow to answer a question that fits in one prompt, you've built yourself a problem.

## A decision checklist

When I'm deciding, I go through these questions in roughly this order:

1. Have I tested a clear prompt on actual user inputs, not just one demonstration?
2. Is the missing piece information the model wasn't given? Retrieval is the likely answer.
3. Do answers need citations, up-to-date documents or permissions? Again, retrieval.
4. Does the output keep breaking a style or format rule despite a decent prompt? Fine-tuning might be worth testing.
5. Can I produce enough good examples to train and validate it? If not, I'm not ready to fine-tune.
6. Am I repeating a narrow task at enough volume that a smaller tuned model could save serious money or latency?
7. Can I measure whether any of this improved the actual result? If not, I should fix that first.

## My default order

- Start by writing a clearer prompt and seeing where it actually fails.
- When the model needs facts, give it access to the facts. When it can't follow a consistent pattern, investigate training.
- If search returns garbage, upgrading the generation model won't rescue the system.
- Only train when you have good examples and tests. LoRA is usually the first method I'd investigate.
