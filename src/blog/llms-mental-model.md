---
title: "How LLMs Work: A Mental Model for Engineers"
date: 2026-09-10
tags: ["post", "genai", "llms", "guides"]
---

You don't need to train a large language model to build good things with one. You do need an accurate picture of what it does, because most bad LLM features come from expecting it to behave like a database or a search engine.


<figure><img src="/img/blog/diagram-llm.png" alt="Tokenizer, transformer, probabilities, sampling" loading="lazy"><figcaption>Generation is this loop, one token at a time.</figcaption></figure>

## It predicts the next token

An LLM reads a sequence of **tokens** (chunks of text, often parts of words) and predicts a probability for every possible next token. It picks one, appends it, and repeats. Everything else (answering, summarising, writing SQL) emerges from doing that very well.

Two consequences:

- **It generates plausible text, not retrieved facts.** If the right answer wasn't in its training data or in the prompt, it will still produce something that sounds right. That's a hallucination, and it's the default behaviour, not a bug.
- **Cost and speed scale with tokens.** You pay for input and output tokens, and long outputs are slow because they're generated one token at a time.

## The context window is its only working memory

The model knows nothing about your conversation, your company or your data except what's in the **context window** for this request: the system prompt, the chat history, any documents you pasted. Close the request and it's gone.

That's why "chat with your docs" products don't retrain anything. They find the relevant text and put it in the context. That pattern has a name: retrieval-augmented generation, or RAG.

## Sampling controls variety

- **Temperature** near 0 makes the output close to deterministic. Use it for extraction, classification and SQL.
- **Higher temperature** gives more varied wording. Use it for brainstorming and creative text.

Even at temperature 0, don't assume byte-identical output across runs or model versions. Validate the result instead.

## Embeddings: meaning as numbers

An **embedding model** turns text into a vector, a list of numbers, where texts with similar meaning land close together. Search "getting fit" and you can find a post about a workout routine that never uses those words. Embeddings power semantic search, deduplication, clustering and the retrieval step of RAG.

## Ask for structure

When the output feeds code, ask for JSON that matches a schema, and validate it:

```python
from pydantic import BaseModel

class Claim(BaseModel):
    claim_id: str
    amount_inr: float
    category: str

# raw = llm_call(prompt)  # your provider's SDK
claim = Claim.model_validate_json(raw)   # fails loudly on bad output
```

Most providers now offer a structured-output or JSON mode. Use it, and still validate.

## Where LLMs fit in a data stack

They're good at messy-text-to-structure jobs: classifying free-text claim notes, extracting fields from PDFs, writing a first draft of a SQL query, summarising incident logs. They're bad at arithmetic over large tables and at being the source of truth. Let the warehouse compute; let the model read and write language.

## Try it with a local model

Everything above is easy to see on a laptop with [Ollama](/blog/ollama-local-llms/). This script asks `qwen3:1.7b` for a product name four times at two temperatures, then asks for a log classification that has to match a JSON schema:

```bash
ollama pull qwen3:1.7b
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/sampling_demo.py
curl -O https://www.yashank.site/files/demos/structured_demo.py
python sampling_demo.py && python structured_demo.py
```

<figure><img src="/img/blog/term-llm.png" alt="Temperature 0 gives the same answer four times; 1.2 varies. JSON output matches the schema." loading="lazy"><figcaption>Real output. At temperature 0 all four answers are identical; at 1.2 they wander. The <code>format</code> schema forces valid JSON.</figcaption></figure>

The token counts are worth a look too: a 20-word prompt came to 32 tokens once the chat template was added. That's the number you pay for and the number that fills the context window.
