---
title: "Prompting, RAG or Fine-Tuning? Picking the Right Lever"
date: 2026-03-14
tags: ["post", "genai", "llms", "guides"]
---

Every time an LLM gives a bad answer, somebody suggests fine-tuning. Somebody else says RAG. Half the time the prompt just wasn't clear. These aren't rival technologies. They're three different fixes for three different kinds of problems, and reaching for the fanciest one first is an excellent way to waste money.

## The one distinction that matters

Before installing another framework, ask one question: is the model missing **information**, or is it behaving badly with information it already has?

- **Knowledge**: the model doesn't know something. Your internal docs, last week's policy change, a customer's order history.
- **Behaviour**: the model knows enough but responds the wrong way. Wrong format, wrong tone, ignores a rule, too verbose, inconsistent at a narrow task.

If it doesn't have your internal policy document, tweaking its personality won't help. If it has the right document but keeps ignoring your output format, building a vector database won't fix that either. I'd try a better prompt first because it costs almost nothing.

## Prompting

Prompting changes nothing about the model. You're just giving it better instructions for this request.

What it's good at:

- clear task definitions and constraints
- output formats, especially combined with structured-output or JSON modes
- a few worked examples (**few-shot** prompting) to show the pattern you want
- small amounts of reference information pasted directly in

Cost: basically your time, plus the extra input tokens. Data needed: a handful of examples. You can iterate in minutes.

Where it runs out: when the information you need is too large or changes too often to paste in, or when you've written a page of rules and the model still drifts on some of them.

## RAG

**Retrieval-augmented generation** keeps the model unchanged and adds a search step. At query time you find the most relevant chunks of your data and put them in the context window alongside the question.

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

What it changes: what the model **knows for this request**. Nothing is learned permanently.

What it's good at:

- large or frequently changing knowledge bases
- answers that need citations, since you know exactly which chunks were used
- access control, because you can filter retrieval by what the user is allowed to see
- keeping information current: update the index, and the next answer reflects it

Cost: an embedding model, a vector store (or a search engine you already run), and the engineering to chunk, index and keep data fresh. More input tokens per call.

Data needed: your documents. No labelled examples required to get started, though you'll want some question–answer pairs to evaluate retrieval quality.

Where it falls apart: retrieval gets the wrong chunk and everyone blames the LLM. I've seen people spend ages tuning the generator while their search step is feeding it irrelevant paragraphs. Fix the chunking, queries and metadata first. Hybrid search and reranking are often worth more than a model swap.

## Fine-tuning

Fine-tuning continues training the model on your own examples, so the weights change.

What it changes: **behaviour**. How the model responds by default: format, style, terminology, how it handles a narrow task. It's a poor way to add facts. The model may pick some up, but unreliably, they go stale, and you can't cite them. Use retrieval for facts.

What it's good at:

- consistent output format or tone without a long prompt every time
- narrow, repetitive tasks such as classification, extraction and routing, where a smaller tuned model can match a larger general one at lower cost and latency
- shortening prompts, which cuts tokens on every call

### LoRA

Full fine-tuning updates every weight, which needs a lot of GPU memory. **LoRA** (low-rank adaptation) freezes the original weights and trains small extra matrices added to certain layers. You end up with an adapter that's a small fraction of the model's size.

Why it matters in practice:

- far less memory to train, so it fits on modest hardware (QLoRA goes further by quantising the base model)
- you can keep several adapters for different tasks on one base model
- results are often close to full fine-tuning for task adaptation

Cost: preparing data is usually the biggest cost, followed by training runs, evaluation and hosting the tuned model. Data needed: hundreds to thousands of good input–output examples, consistent and representative. Fifty sloppy examples will teach the model to be sloppy.

And now you own a training dataset forever. New base model? Retrain. Requirements changed? Update the examples. Fine-tuning isn't a one-off command you get to forget about.

## They combine

You can use all three together. Sometimes that's the right design. But if you're adding RAG, fine-tuning and an elaborate agent workflow to answer a question that fits in one prompt, you've built yourself a problem.

## A decision checklist

Work through these in order:

1. **Have I written a clear prompt with a few examples and tested it on real inputs?** If not, do that first.
2. **Is the failure about missing or changing information?** Use RAG.
3. **Do I need citations, freshness or per-user access control?** Use RAG.
4. **Is the failure about format, tone or consistency, after good prompting?** Consider fine-tuning.
5. **Do I have hundreds of high-quality examples, or can I build them?** If not, fine-tuning isn't ready yet.
6. **Is cost or latency the problem at high volume on a narrow task?** A small model fine-tuned with LoRA may beat a large one.
7. **Do I have an evaluation set to prove each change helped?** Without it, none of these decisions are measurable.

## My default order

- Fix the prompt before spending money on infrastructure or training.
- Knowledge problem: retrieve. Behaviour problem: fine-tune.
- Spend effort on retrieval quality before blaming the model.
- Don't fine-tune without good examples and a way to measure the result. Start with LoRA unless you have a reason not to.
