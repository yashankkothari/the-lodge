---
title: "Embeddings Explained: Meaning as Vectors"
date: 2026-08-29
tags: ["post", "genai", "llms", "guides"]
---

Embeddings get treated as some magical ingredient you throw into a vector database because every RAG tutorial told you to. They're actually worth understanding on their own. They're useful well beyond chatbots, and the basic idea isn't nearly as intimidating as the terminology makes it sound.

## What an embedding is

An **embedding** is just a numerical representation of something: text, an image, a product description, whatever the model was trained to handle. The useful property is that similar inputs should end up close to each other in the resulting space. That gives us a way to compare things without demanding the exact same words.

Imagine a support search. Someone types "I forgot my login" and your help article says "reset your password". Keyword matching might struggle, but a decent embedding model should see the relationship. A question about resetting a router might share the word "reset" yet be much less relevant. That's the kind of distinction I want to capture.

That's the useful bit. You can compare two pieces of text without requiring them to share the same words. Underneath all the vector-database branding, you're comparing numbers.

## Cosine similarity

The comparison you'll keep running into is **cosine similarity**. It looks at the angle between two vectors instead of just subtracting the numbers:

```text
cos(a, b) = (a · b) / (|a| * |b|)
```

The mathematical range is -1 to 1. A score near 1 means the vectors point in almost the same direction. Near 0 means they're roughly orthogonal. But don't take a screenshot of a similarity score of 0.8 and declare it "80% semantically correct". Real embedding distributions often occupy a narrower range, and the useful threshold depends on the model and data.

Cosine ignores magnitude and compares direction. That's often the behaviour we're after for similarity search, although you should still check what your specific embedding model was trained to produce.

## Normalisation

If every vector has length one, cosine similarity becomes an ordinary dot product. You get there by **normalising** each vector—dividing it by its norm. Now search can use a much simpler calculation.

Some APIs already return unit vectors. Check before building assumptions into your index. I usually want the normalisation decision to happen once when the vector is stored, not to have three different services making different choices later.

## A small runnable example

Real models produce vectors with hundreds or thousands of numbers. I don't think staring at 1,536 floats helps anybody learn this, so the example below uses four hand-made dimensions: roughly account issues, networking, billing and food. They're fake vectors, but the calculations are real.

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

The `search` function is doing nearest-neighbour lookup, the similarity matrix finds likely duplicate tickets, and the centroids give us a simple classifier. Replace my made-up vectors with actual model output and the same basic operations apply.

## Uses beyond RAG

- **Search by meaning.** Match a question to relevant documents even when they use different wording. I'd still combine it with keyword search for codes, names and other exact terms.
- **Spot duplicates.** Compare support tickets, product listings or imported records. Review the borderline scores instead of pretending one threshold can decide everything.
- **Find groups in messy text.** K-means or other clustering methods can reveal themes across thousands of responses before anybody has labelled them.
- **Classify cheaply.** Logistic regression on top of embeddings, or a nearest-centroid approach like this demo, can be enough for plenty of tasks without another enormous model call.
- **Find unusual items.** If something sits far away from your normal clusters, it might deserve a closer look.

## Choosing dimensions

More dimensions can represent more detail, but you're paying for them in storage and search. A million 1,536-dimensional float32 vectors is roughly 6 GB before adding an index. "Just use the largest embedding model" becomes expensive advice pretty quickly.

Some embedding models support shortening the vector while keeping much of the useful signal. If yours does, test the smaller dimension count on real queries before deciding bigger must be better. And remember to normalise again after truncating.

## Pitfalls

- **Don't mix vector spaces.** Different embedding models or versions won't necessarily produce comparable vectors. Record the model version and re-embed when you switch.
- **Don't worship a magic cutoff.** A threshold from somebody else's tutorial might be useless for your documents. Label some pairs and measure it.
- **Watch truncation.** Long documents can exceed input limits, and one vector for an entire report can lose important detail. Split documents around their actual structure.
- **Test your domain.** A generic model may treat two insurance products as nearly identical when the difference matters enormously to your business.
- **Keep exact search available.** Product IDs and unusual names are exactly where embeddings can disappoint you.

## What I'd try first

- Start with one model and record which version created each stored vector.
- Assemble a few dozen examples of what should and shouldn't match in your own data.
- Try using embeddings to group or deduplicate records before jumping straight to a chat interface.
- Add keyword search wherever exact strings actually matter. Semantic search isn't supposed to replace every other kind of search.
