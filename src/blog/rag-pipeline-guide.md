---
title: "Building a RAG Pipeline That Actually Retrieves"
date: 2026-09-28
tags: ["post", "genai", "rag", "guides"]
---

I've seen RAG explained as though putting embeddings in a vector database makes a chatbot intelligent. It doesn't. **Retrieval-augmented generation** just means finding relevant passages, putting them in the prompt and asking the model to answer from those passages.

The unglamorous truth is that a lot of bad RAG answers start with bad search. The model gets two irrelevant chunks, writes a very convincing paragraph about them, and everyone starts changing prompts. I'd debug the retrieval pipeline first.


<figure><img src="/img/blog/diagram-rag.png" alt="RAG indexing and query pipelines" loading="lazy"><figcaption>Two pipelines: one offline, one per question.</figcaption></figure>

## The two halves

**Indexing (offline, like any ETL job)**

1. Load documents and clean them: strip boilerplate, keep titles and section headings.
2. Split them into chunks.
3. Embed each chunk and store the vector with its text and metadata (source, section, date, permissions).

**Query time**

1. Embed the user's question.
2. Retrieve the top candidate chunks.
3. Optionally rerank them.
4. Build a prompt with the best few chunks and generate an answer with citations.

## Chunking decides most of your quality

- Split on structure (headings, paragraphs) before falling back to a fixed size.
- A few hundred tokens per chunk with a small overlap is a sensible starting point. Tune it against real questions.
- Prepend the document title and section heading to each chunk before embedding, so "Section 4.2: Exclusions" still knows which policy it belongs to.

## Retrieve with more than one signal

Pure vector search misses exact terms such as policy numbers, error codes and product names. **Hybrid search** combines keyword search (BM25) with vector search and merges the two result lists. Then a **reranker** (a cross-encoder that scores each question-chunk pair) reorders the top 20–50 candidates so the best five go in the prompt.

Filter on metadata before ranking: date ranges, document type and, above all, the user's access permissions.

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

Build a small evaluation set of 30–50 real questions, each labelled with the chunk or document that answers it. Then track:

- **Retrieval:** is the right chunk in the top k (recall@k)?
- **Faithfulness:** does the answer only claim what the sources say?
- **Answer quality:** is it correct and does it actually answer the question?

If recall@k is low, fix chunking, hybrid search or reranking. Tweaking the prompt won't help.

## Keep the index fresh

The index is another data pipeline. Documents change, get deleted and sometimes change permissions. Update the vectors accordingly. And when you switch embedding models, re-embed the collection; vectors from different models don't belong in the same search space.

## Try it: a 30-line RAG on your laptop

No vector database needed to learn the moving parts. This uses Ollama's `nomic-embed-text` for embeddings, plain cosine similarity, and `qwen3:1.7b` to answer:

```bash
ollama pull nomic-embed-text && ollama pull qwen3:1.7b
curl -O https://www.yashank.site/files/demos/ollama_client.py
curl -O https://www.yashank.site/files/demos/rag_demo.py
python rag_demo.py
```

<figure><img src="/img/blog/term-rag.png" alt="RAG demo output: two retrieved chunks with scores, then a cited answer" loading="lazy"><figcaption>Real output. Retrieval picked the right chunk first (0.679), but the second chunk (0.530) was irrelevant and the model used it anyway.</figcaption></figure>

Look at that second chunk. It's irrelevant, but the model still drags warehouse auto-suspend into an otherwise correct answer. That's exactly how a RAG system can sound informed while giving you junk. I'd try a score threshold and clearer instructions to ignore irrelevant sources, then check retrieval recall again. Don't mistake a citation for proof that the source was useful.
