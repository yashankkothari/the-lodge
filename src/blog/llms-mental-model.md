---
title: "How LLMs Work: A Mental Model for Engineers"
date: 2026-09-10
tags: ["post", "genai", "llms", "guides"]
---

I keep seeing people build LLM apps as though the model is a database that happens to speak English. Then they're shocked when it confidently invents an answer. You don't need to know how to train an LLM to use one, but you do need to know what it is actually doing.


<figure><img src="/img/blog/diagram-llm.png" alt="Tokenizer, transformer, probabilities, sampling" loading="lazy"><figcaption>Generation is this loop, one token at a time.</figcaption></figure>

## It predicts the next token

An LLM reads **tokens** (chunks of text, often pieces of words) and assigns probabilities to what comes next. It selects a token, adds it to the sequence and does the same thing again. That loop is how you get everything from a decent SQL query to a completely fabricated historical fact.

Two things follow from that loop that I wish more people understood:

- **A fluent answer isn't a database lookup.** When the model lacks the relevant fact, it may still produce a plausible answer. That's one reason hallucinations happen; confident writing doesn't prove the claim was checked.
- **Every token has a cost.** The longer the input and generated output, the more work the system has to do. Output tokens also arrive sequentially, which affects latency.

## The context window is its only working memory

The model doesn't magically know your project, your database or what you told it last Tuesday. It only has the **context window** for the current request: the prompt, conversation history and whatever documents your application included. If an app remembers you, the app is storing and supplying that information.

So when a product claims you can "chat with your documents", it probably isn't retraining a model every time you upload a PDF. It retrieves relevant text and includes it in the next request. That's **RAG**, and understanding that distinction saves a lot of confusion.

## Sampling controls variety

- With **low temperature**, the sampler favours the most likely next tokens. I usually want that for structured or repetitive tasks.
- Turn **temperature** up and the model explores less probable options more often. That's useful when generating ideas, less useful when extracting a payment amount.

Low temperature still isn't a promise that every run will produce exactly the same bytes, especially if the serving setup or model version changes. If your application needs a specific value, test the value.

## Embeddings: meaning as numbers

An **embedding model** turns text into numerical vectors. Ideally, pieces of text that mean similar things end up near each other in that vector space. So a query about "getting fit" might retrieve a workout article that never uses that exact phrase. That's useful for semantic search, clustering, deduplication and RAG. The numbers aren't magic; you still need to test whether the model captures the similarities your application cares about.

## Ask for structure

If I'm passing model output to another piece of code, I don't want to parse an essay. I'd ask for a known JSON shape and validate it at the boundary:

```python
from pydantic import BaseModel

class Claim(BaseModel):
    claim_id: str
    amount_inr: float
    category: str

# raw = llm_call(prompt)  # your provider's SDK
claim = Claim.model_validate_json(raw)   # fails loudly on bad output
```

Structured-output features are useful, but my application should still check the response before trusting it. The schema is a contract, not a suggestion.

## Where LLMs fit in a data stack

I like models for turning messy language into something a program can use: claim notes into categories, PDF text into fields, incident logs into summaries. I don't want one doing arithmetic over a million rows when Snowflake or Postgres can give me an exact answer. Let the database count. Let the model handle language.

## Try it with a local model

You can watch most of this happen on your own laptop using [Ollama](/blog/ollama-local-llms/). I used `qwen3:1.7b` for a small experiment: ask for a product name four times at different temperatures, then try a log-classification request that must follow a JSON schema.

```bash
ollama pull qwen3:1.7b
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/sampling_demo.py
curl -O https://www.yashank.site/files/demos/structured_demo.py
python sampling_demo.py && python structured_demo.py
```

<figure><img src="/img/blog/term-llm.png" alt="Temperature 0 gives the same answer four times; 1.2 varies. JSON output matches the schema." loading="lazy"><figcaption>Real output. At temperature 0 all four answers are identical; at 1.2 they wander. The <code>format</code> schema forces valid JSON.</figcaption></figure>

Look at the token counts as well. My 20-word prompt turned into 32 tokens once the chat template was included. It's an easy detail to miss until you wonder why the context window or API bill is bigger than you expected.
