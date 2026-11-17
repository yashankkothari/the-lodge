---
title: "Attention, Explained for Engineers"
date: 2025-01-11
tags: ["post", "genai", "llms", "guides"]
---

When I was trying to understand transformers, every explanation seemed to be one of two extremes. Either "attention helps the model focus on words" (thanks, that explains nothing) or three pages of matrix equations before anyone tells you what problem we're even solving.

I wanted something in the middle. Enough maths to know what's happening, not so much that the actual idea gets buried. I'll also connect it to the very practical question of why large context windows eat memory and money.

## Text becomes tokens

Before any attention calculation, the text gets chopped into **tokens**. A tokenizer has a fixed vocabulary and maps each token to an integer. Sometimes a token is a whole word, sometimes it's punctuation or a fragment. A word like "unbelievably" might be split into pieces such as `un`, `believ` and `ably`, depending on the tokenizer. The model operates on those IDs, not on the word the way you see it on screen.

This is part of why asking a language model to count letters can get embarrassingly weird. We're seeing a word; the model is processing token IDs. Those are not the same view of the text.

## Tokens become embeddings

The token ID is then used to look up a row in a learned **embedding matrix**. Now we're dealing with a vector of numbers instead of a word fragment. The model has learned these vectors during training so that it can work with relationships in a numerical space.

For `n` tokens, stack those vectors and you get an `(n, d_model)` matrix. That shape is worth remembering because the rest of the explanation is mostly operations on it.

## The problem attention solves

Take the word "bank". In "river bank" and "bank account" it's the same token, but the surrounding words completely change what it means. Earlier recurrent networks passed information along the sequence step by step. That made training harder to parallelise and could make long-distance relationships difficult to learn.

Attention gives each position a way to gather information from other positions directly. It computes how strongly the current token should use information from each one, rather than relying on everything being carried through a long sequence of recurrent steps.

## Queries, keys and values

This is where the names **query**, **key** and **value** come in. For every token, learned projections create three different vectors:

- **Q, the query:** what information this position is trying to find.
- **K, the key:** what other positions can match against.
- **V, the value:** what information gets mixed into the output after the scores are calculated.

I picture a dictionary that doesn't insist on one exact match. Instead, it compares the query with every key and decides how relevant each entry is. Then it returns a **weighted mixture** of the values. It's a rough analogy, but it made Q, K and V much easier for me to reason about than just memorising their names.

## Scaled dot-product attention

The similarity score comes from a dot product. When a query and key line up, `Q · K` tends to be larger. To calculate all the token-to-token scores in one operation, we use:

```
Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V
```

If that formula looks intimidating, break it apart:

1. Multiply `Q` by the transpose of `K`. That produces an `n × n` table of attention scores, one for every pair of positions.
2. Divide by `√d_k`. With larger key dimensions, unscaled dot products can get huge and push softmax into regions with tiny gradients.
3. Apply **softmax** row by row. Each row becomes a set of nonnegative weights adding up to one.
4. Multiply those weights by `V`. Every position now receives a weighted combination of the value vectors.

Here's the same thing without a deep-learning framework. Just NumPy:

```python
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)   # for numerical stability
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def attention(Q, K, V, causal=False):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)            # (seq, seq)
    if causal:
        mask = np.triu(np.ones_like(scores, dtype=bool), k=1)
        scores = np.where(mask, -np.inf, scores)
    weights = softmax(scores, axis=-1)         # each row sums to 1
    return weights @ V, weights

rng = np.random.default_rng(0)
seq_len, d_model, d_k = 4, 8, 8

X = rng.normal(size=(seq_len, d_model))        # 4 token embeddings
W_q = rng.normal(size=(d_model, d_k))
W_k = rng.normal(size=(d_model, d_k))
W_v = rng.normal(size=(d_model, d_k))

out, w = attention(X @ W_q, X @ W_k, X @ W_v, causal=True)
print(out.shape)          # (4, 8)
print(w.round(2))         # lower-triangular: no token sees the future
```

Notice the `causal` switch. For next-token generation, a position must not look ahead to tokens that haven't been generated yet. The upper triangle of the score matrix gets set to negative infinity, so softmax assigns those future positions zero weight. Token 3 can use 1, 2 and 3, but it can't peek at token 4.

The random matrices in this demo only make the arithmetic runnable. An actual transformer learns those projection weights during training.

## Multi-head attention

One set of attention weights doesn't have to carry every relationship in a sentence. **Multi-head attention** uses several sets of smaller Q, K and V projections in parallel. Different heads can learn to emphasise different patterns: maybe a pronoun's referent, maybe something nearby in the sequence. Their results are combined and projected back to `d_model`. The heads aren't assigned human-readable jobs in advance; those patterns are learned.

Attention is only part of the block. A typical **transformer block** also has a feed-forward network, residual connections and normalisation. Stack a lot of those blocks and information gets repeatedly mixed and transformed. That's the architecture behind the simple sentence "it predicts the next token".

## Where does word order come from?

There's a problem hiding in that nice matrix equation: where did word order go? Pure attention doesn't know whether "dog bites man" or "man bites dog" came first. If you rearrange the inputs, the operation rearranges its outputs accordingly. The order has to enter the computation somehow.

The original transformer used sine and cosine patterns to add positional information. Other architectures learn position vectors. Many current models use **RoPE**, which rotates query and key vectors in a position-dependent way so the attention scores can reflect relative position. Different mechanism, same requirement: position doesn't come free with the dot product.

## Why context windows cost what they do

Remember the `n × n` score matrix? Double the sequence length and there are roughly four times as many query-key pairs in full attention. That's the **quadratic** part of the work. Efficient implementations avoid materialising some intermediate data, but they don't make long sequences magically cheap.

Generation has another memory bill: the **KV cache**. Instead of recomputing keys and values for every old token whenever a new token arrives, the server keeps them around for each layer. The cache grows with the amount of context and consumes GPU memory. A server with longer conversations can't necessarily handle as many concurrent users.

There are clever ways to reduce those costs—memory-efficient kernels, sparse attention, sliding windows and more. That's worth studying separately. For now I just want you to understand why "give the model the entire repo" isn't a free instruction.

## What I want you to remember

- A tokenizer turns text into IDs, and embeddings turn those IDs into vectors.
- Queries and keys decide the attention weights; the values supply the information being mixed.
- Multiple heads let the model learn different patterns, but it still needs positional information.
- Full attention grows quadratically with sequence length, while KV caching trades extra memory for faster generation.

The fuzzy dictionary lookup is the mental picture that finally made this click for me. Every token is looking at other tokens and working out what information to pull in. The equations are important, but once you get that part, they stop looking like random symbols.
