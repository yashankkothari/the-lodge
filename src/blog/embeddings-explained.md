---
title: "Embeddings Explained: Meaning as Vectors"
date: 2026-08-29
tags: ["post", "genai", "llms", "guides"]
---

Most people meet embeddings as the retrieval step in a RAG pipeline and never look further. That's a shame, because they're one of the most useful tools in applied machine learning, and they're far simpler than the models that generate text.

## What an embedding is

An **embedding** is a list of numbers (a vector) that represents a piece of input, such as a sentence, a product description or an image. An embedding model is trained so that inputs with similar meaning end up with vectors that point in similar directions.

"How do I reset my password?" and "I forgot my login" share almost no words, but a good text embedding model places them close together. "How do I reset my router?" lands somewhere nearby but noticeably further away.

That's the whole trick. Once meaning is geometry, you can compare, group and search things using basic linear algebra.

## Cosine similarity

The standard way to compare two embeddings is **cosine similarity**: the cosine of the angle between the vectors.

```text
cos(a, b) = (a · b) / (|a| * |b|)
```

It ranges from -1 to 1. Close to 1 means the vectors point the same way, close to 0 means they're unrelated. In practice, with most text embedding models, scores cluster in a narrower band, so "0.8" doesn't have a universal meaning. You learn what a good score looks like for your model and your data.

Cosine similarity ignores vector length and only looks at direction. That's usually what you want, since length often reflects things like input size rather than meaning.

## Normalisation

If you **normalise** every vector to unit length (divide by its norm), cosine similarity becomes a plain dot product. That's faster to compute and it's what many vector databases assume.

Some embedding APIs return normalised vectors already. Check the documentation rather than assuming. Normalising an already normalised vector is harmless, so when in doubt, do it once at write time and store the result.

## A small runnable example

Real embeddings have hundreds or thousands of dimensions. These toy vectors have four, hand-made so the dimensions loosely mean "account", "networking", "billing" and "food". The maths is identical.

```python
import numpy as np

docs = {
    "reset my password":        [0.9, 0.1, 0.0, 0.0],
    "forgot my login":          [0.8, 0.2, 0.1, 0.0],
    "router keeps disconnecting": [0.1, 0.9, 0.0, 0.0],
    "wifi is very slow":        [0.0, 0.8, 0.1, 0.1],
    "charged twice this month": [0.1, 0.0, 0.9, 0.0],
    "refund for my invoice":    [0.2, 0.0, 0.8, 0.1],
    "best biryani nearby":      [0.0, 0.0, 0.1, 0.9],
}

names = list(docs)
X = np.array([docs[n] for n in names], dtype=float)
X = X / np.linalg.norm(X, axis=1, keepdims=True)   # normalise once

def search(query_vec, k=3):
    q = np.array(query_vec, dtype=float)
    q = q / np.linalg.norm(q)
    scores = X @ q                                   # cosine via dot product
    top = np.argsort(-scores)[:k]
    return [(names[i], round(float(scores[i]), 3)) for i in top]

print("Search 'can't sign in':")
for name, score in search([0.85, 0.15, 0.05, 0.0]):
    print(f"  {score:.3f}  {name}")

# Near-duplicate detection: pairs above a threshold
sim = X @ X.T
print("\nLikely duplicates (> 0.95):")
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        if sim[i, j] > 0.95:
            print(f"  {sim[i, j]:.3f}  {names[i]!r} ~ {names[j]!r}")

# Classification by nearest labelled centroid
labels = {"account": [0, 1], "network": [2, 3], "billing": [4, 5]}
centroids = {k: X[idx].mean(axis=0) for k, idx in labels.items()}
centroids = {k: v / np.linalg.norm(v) for k, v in centroids.items()}

ticket = np.array([0.15, 0.05, 0.85, 0.05])
ticket = ticket / np.linalg.norm(ticket)
best = max(centroids, key=lambda k: centroids[k] @ ticket)
print(f"\nNew ticket classified as: {best}")
```

Swap the toy vectors for output from a real embedding model and the same code works for search, deduplication and classification.

## Uses beyond RAG

- **Semantic search.** Find documents by meaning rather than keywords. Often best combined with keyword search (hybrid search), because embeddings can miss exact terms like product codes.
- **Deduplication.** Near-identical support tickets, product listings or records from different sources score very high against each other. A threshold plus human review of the borderline band goes a long way.
- **Clustering.** Run k-means or a density-based method on embeddings to find themes in thousands of free-text responses without labelling anything first.
- **Classification.** Train a simple logistic regression on embeddings, or use nearest centroid as above. With a few hundred labelled examples this is often competitive with much heavier approaches, and far cheaper to run.
- **Anomaly detection.** Items far from every cluster are worth a look.

## Choosing dimensions

More dimensions can capture more nuance, but cost more to store and compare. A million 1,536-dimensional float32 vectors is roughly 6 GB before any index overhead.

Some newer models are trained so you can truncate vectors to fewer dimensions with modest quality loss. If yours supports that, test a smaller size on your own retrieval eval before defaulting to the largest. Re-normalise after truncating.

## Pitfalls

- **Mixing models.** Vectors from different embedding models (or different versions of the same one) are not comparable. Changing models means re-embedding everything. Store the model name alongside each vector.
- **Assuming a universal threshold.** A similarity cut-off that works for one model and domain won't transfer. Calibrate on labelled pairs.
- **Long inputs.** Models have input limits and may truncate silently. Embedding a whole document into one vector also blurs its topics together. Chunk sensibly.
- **Domain mismatch.** A general model may not separate terms that matter in your field, like insurance policy types. Test on your own data.
- **Exact matches.** Embeddings are weak at IDs, numbers and rare names. Keep keyword search around.

## Where to start

- Pick one embedding model, record its name with every vector, and normalise at write time.
- Build a small labelled set of similar and dissimilar pairs from your own data, and use it to choose thresholds and dimensions.
- Try deduplication or clustering before RAG. They're simpler, easier to evaluate and often more immediately useful.
- Use hybrid search when exact terms matter.
