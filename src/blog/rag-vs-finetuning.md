---
title: "Your LLM Probably Doesn't Need Fine-Tuning"
date: 2026-03-14
tags: ["post", "genai", "llms", "guides"]
---

There's a weird reflex in AI development where the moment a model gives a bad answer, people start talking about fine-tuning it. Or building a RAG pipeline. Or adding an agent to decide which one to use. We've barely worked out why the answer was wrong and we're already drawing architecture diagrams.

I think this is backwards. A model not doing what you want isn't automatically a model problem. Sometimes you gave it bad instructions. Sometimes it doesn't have the information. Sometimes it genuinely isn't consistent enough for the task. Those are very different problems, and throwing more infrastructure at them won't magically make them the same one.

Take a customer-support bot. Someone asks whether they can get a refund. It confidently says yes, except the company's policy says no after 30 days. You could fine-tune a model on examples of helpful support conversations and it might become *really good* at confidently giving that same wrong answer.

That's not a training problem. The bot needs access to the current refund policy.

Now imagine it has the correct policy in front of it, but you need a JSON response and it keeps returning a cheerful three-paragraph apology. That's a different failure entirely.

This is the distinction I'd make before touching anything else: **does the model lack the facts, or is it failing to use the facts correctly?**

## I'd fix the prompt before building anything

This isn't exciting advice, which is probably why people skip it. But a surprising amount of what gets called an LLM reliability problem is just an underspecified task.

If you want the model to classify a complaint, tell it what the categories mean. Give it a few awkward examples, not just the obvious ones. Tell it what to do when a message fits none of them. If the output has to be JSON, use the API's structured-output support where available instead of asking nicely and hoping it listens.

That's prompting. No special infrastructure. No new model. Just being precise about the job.

And yes, there are limits. You can't paste an entire company's changing documentation into every request. A prompt also won't necessarily make a small model consistently good at a difficult specialist task. But I'd want to *see* those failures before spending time on anything more complicated.

## RAG isn't teaching the model anything

The name makes it sound more mysterious than it is. **Retrieval-augmented generation** means you search for relevant information, put the results in the model's context, and ask it to answer using them. That's it. The model hasn't learned your documents. It's reading them for this particular request.

Here's the basic shape:

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

For the refund bot, this means fetching the relevant policy before it answers. When the policy changes next week, update the source documents and index. You shouldn't need to retrain the model every time somebody edits a PDF.

The same idea applies to internal documentation, product manuals, or anything where an answer should point back to an actual source. But it comes with a catch: **you've now made search part of your answer quality**.

If retrieval pulls the wrong document, the model can produce a beautifully written answer based on completely irrelevant context. You don't fix that by telling the model to "think harder." You fix the search. Maybe your chunks are terrible. Maybe exact keywords matter more than embeddings for this query. Maybe you need hybrid search or reranking. Maybe your index is out of date.

And please don't forget permissions. If an employee isn't allowed to read a document, your retrieval layer shouldn't hand it to the model on their behalf. A convincing answer that leaks another team's data is not a successful RAG system.

You also don't necessarily need a shiny vector database. If the existing search stack retrieves the right material, use it. Embeddings can be useful, but they're not a compulsory initiation ritual.

The part I'd test first is whether the correct passage comes back for real questions. If your retriever can't reliably find the relevant policy, the rest of the pipeline is decoration.

## Fine-tuning is for a different kind of stubbornness

Fine-tuning actually changes the model's weights by training it on examples. That's useful when the problem is consistent *behaviour*, not a missing document.

Say you're processing thousands of support tickets. You already have the relevant information, the instructions are clear, and the model still struggles to classify edge cases the way your team does. Or maybe you need a very specific extraction format at enough volume that a smaller specialised model could be cheaper and faster. Those are cases where I'd at least investigate fine-tuning.

What I wouldn't do is treat fine-tuning like a place to upload the company's knowledge base. You can teach a model facts during training, sure. But changing facts become awkward to update, and a generated answer doesn't automatically come with a traceable source. For current policies or account-specific information, retrieval makes far more sense.

There's another thing people underestimate: the training data. You need examples of the *actual behaviour you want*, including the unpleasant edge cases, and a separate set to evaluate whether training helped. Depending on the job, that might mean hundreds or thousands of carefully checked examples. Dumping a pile of inconsistent outputs into training is an expensive way to teach a model your inconsistencies.

And when people talk about fine-tuning, they don't always mean retraining every weight. **LoRA** freezes the base model and trains smaller adapter matrices, which is much lighter on memory. **QLoRA** goes further by quantising the frozen model during training. For certain tasks, adapters are a sensible trade-off compared with full fine-tuning. They don't remove the need for good examples or proper evaluation, though.

The cost doesn't end after training either. Your requirements change. Base models improve. Suddenly the dataset you spent weeks assembling needs updating, and you have to check whether your tuned model is still better than the newer base model with a decent prompt. Nobody puts that part in the demo.

## The part I care about more than the architecture

Before choosing any of these approaches, I'd put together a small set of real failures and label them. Did the model have the right information? Did retrieval find the right source? Did the answer follow the required format? Was it simply wrong despite having everything it needed?

Then change one thing and run the same cases again. Otherwise you're just swapping tools based on whichever demo looked impressive that week.

You can absolutely combine prompting, RAG and fine-tuning. A specialised model can retrieve current documents and follow a carefully written instruction. Nothing wrong with that if the task needs it.

What I find absurd is reaching for all three before proving you need even one. Sometimes the best improvement to an LLM app is a clearer prompt. Sometimes it's better search. Occasionally it's training. The interesting part isn't how complicated your architecture looks. It's whether you fixed the thing that was actually broken.
