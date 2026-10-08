---
title: "Building a RAG Pipeline That Actually Retrieves"
date: 2026-09-28
tags: ["post", "genai", "rag", "guides"]
---

Retrieval-augmented generation (RAG) means: find the passages that answer a question, put them in the prompt, and ask the model to answer **from those passages**. It's the standard way to give an LLM knowledge it wasn't trained on, without fine-tuning.

When a RAG system gives a bad answer, the generation step usually isn't the culprit. Retrieval handed the model the wrong text. So treat RAG as a data pipeline first.

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

"Say you don't know" plus visible citations does more against hallucination than any amount of clever wording.

## Measure retrieval and answers separately

Build a small evaluation set of 30–50 real questions, each labelled with the chunk or document that answers it. Then track:

- **Retrieval:** is the right chunk in the top k (recall@k)?
- **Faithfulness:** does the answer only claim what the sources say?
- **Answer quality:** is it correct and does it actually answer the question?

If recall@k is low, fix chunking, hybrid search or reranking. Tweaking the prompt won't help.

## Keep the index fresh

Treat the index like a warehouse table: load incrementally, re-embed changed documents, delete removed ones, and re-embed everything when you change the embedding model, because vectors from different models aren't comparable.
