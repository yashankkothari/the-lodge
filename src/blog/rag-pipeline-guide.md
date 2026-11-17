---
title: "Building a RAG Pipeline That Actually Retrieves"
date: 2026-09-28
tags: ["post", "genai", "rag", "guides"]
---

I've seen RAG explained as though putting embeddings in a vector database makes a chatbot intelligent. It doesn't. **Retrieval-augmented generation** just means finding relevant passages, putting them in the prompt and asking the model to answer from those passages.

The unglamorous truth is that a lot of bad RAG answers start with bad search. The model gets two irrelevant chunks, writes a very convincing paragraph about them, and everyone starts changing prompts. I'd debug the retrieval pipeline first.


<figure><img src="/img/blog/diagram-rag.png" alt="RAG indexing and query pipelines" loading="lazy"><figcaption>Two pipelines: one offline, one per question.</figcaption></figure>

## The two halves

First is **indexing**, which looks a lot like any other ETL job:

1. Read the files and remove noise without throwing away useful headings and titles.
2. Split the content into pieces that still make sense on their own.
3. Generate embeddings and store each one with the original text and metadata: source, section, date and access permissions.

Then every user question goes through a second pipeline:

1. Embed the question using the same compatible embedding setup.
2. Find chunks that might contain the answer.
3. Rerank those candidates if the first search isn't selective enough.
4. Give the best passages to the model and ask for an answer grounded in them.

## Chunking decides most of your quality

- Don't blindly cut every document at the 500-token mark. Try heading and paragraph boundaries first so the retrieved text isn't missing half a sentence.
- A few hundred tokens with a little overlap is a starting point, not a universal rule. Test different sizes against questions people actually ask.
- Carry the document title and section name into the chunk. "Section 4.2: Exclusions" is useless if you've thrown away the name of the policy it belongs to.

## Retrieve with more than one signal

Embeddings are not great at exact IDs, error codes or rare product names. If someone asks for policy `POL-123456`, I don't want the system returning a semantically similar but completely different policy. **Hybrid search** mixes keyword matching such as BM25 with vector results. A **reranker** can then score the best twenty or fifty candidates against the actual question before you select the few passages the generator will see.

Permissions belong in the retrieval step, not in a hopeful instruction telling the model to ignore forbidden documents. Filter by access, dates and document type before ranking.

## Prompt for grounded answers

```text
Answer the question using only the sources below.
Cite sources as [1], [2]. If the sources don't contain
the answer, say you don't know.

[1] {chunk text, with title}
[2] {chunk text, with title}

Question: {user question}
```

I want an actual way for the model to say "I don't know" and citations I can open. A prompt that simply says "be accurate" is not a substitute for either.

## Measure retrieval and answers separately

For testing, I'd write down thirty to fifty genuine questions and the documents that should answer them. Then measure three things separately:

- **Retrieval recall:** did the right passage appear in the top `k` results?
- **Faithfulness:** did the model stick to what those passages actually support?
- **Usefulness:** did it answer the user's question correctly instead of rambling about a related topic?

If the relevant passage isn't being retrieved, the generation model never had a fair chance. Stop changing the prompt and investigate chunking, search and ranking.

## Keep the index fresh

The index is another data pipeline. Documents change, get deleted and sometimes change permissions. Update the vectors accordingly. And when you switch embedding models, re-embed the collection; vectors from different models don't belong in the same search space.

## Try it: a 30-line RAG on your laptop

You don't even need a vector database for the demo. I used Ollama's `nomic-embed-text` to make vectors, plain cosine similarity to rank passages and `qwen3:1.7b` for the final answer. It's intentionally small enough that you can see what each stage does:

```bash
ollama pull nomic-embed-text && ollama pull qwen3:1.7b
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/rag_demo.py
python rag_demo.py
```

<figure><img src="/img/blog/term-rag.png" alt="RAG demo output: two retrieved chunks with scores, then a cited answer" loading="lazy"><figcaption>Real output. Retrieval picked the right chunk first (0.679), but the second chunk (0.530) was irrelevant and the model used it anyway.</figcaption></figure>

Look at that second chunk. It's irrelevant, but the model still drags warehouse auto-suspend into an otherwise correct answer. That's exactly how a RAG system can sound informed while giving you junk. I'd try a score threshold and clearer instructions to ignore irrelevant sources, then check retrieval recall again. Don't mistake a citation for proof that the source was useful.
