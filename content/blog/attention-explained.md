---
title: "Attention, Explained for Engineers"
date: 2025-01-11
tags: ["post", "genai", "llms", "guides"]
---

Every explanation of transformers I found while studying either stopped at "attention lets the model focus on relevant words" or jumped straight into a wall of matrix notation. The first is too vague to reason with. The second hides a fairly simple idea.

This is the middle version: enough to understand why models behave the way they do, and why long prompts cost what they cost, with code you can run.

## Text becomes tokens

A model never sees characters or words directly. A **tokenizer** splits text into **tokens**, chunks from a fixed vocabulary that are often whole common words, word pieces, or punctuation. "Unbelievably" might become `un`, `believ`, `ably`. Each token maps to an integer ID.

This is why models are oddly bad at counting letters in a word: they never saw the letters, only the chunks.

## Tokens become embeddings

Each token ID looks up a row in an **embedding matrix**, giving a vector of a few hundred to a few thousand numbers. These vectors are learned during training, and tokens used in similar contexts end up with similar vectors.

So a sentence of `n` tokens becomes a matrix of shape `(n, d_model)`. Everything after this is arithmetic on that matrix.

## The problem attention solves

A token's meaning depends on its neighbours. "Bank" in "river bank" and "bank account" should end up represented differently. Older recurrent networks passed information along the sequence one step at a time, which was slow to train and tended to lose track of distant words.

Attention lets every token look at every other token directly, in one step, and decide how much each one matters to it.

## Queries, keys and values

For each token, the model computes three vectors by multiplying its embedding with three learned weight matrices:

- **Query (Q)**: what this token is looking for.
- **Key (K)**: what this token offers to others looking.
- **Value (V)**: the information it actually passes along if chosen.

The analogy I find useful is a fuzzy dictionary lookup. A normal dictionary matches a query to exactly one key and returns its value. Attention compares a query against every key, scores how well each matches, and returns a **weighted blend** of all the values.

## Scaled dot-product attention

The scoring is a dot product: `Q · K` is large when the two vectors point in similar directions. For a whole sequence at once:

```
Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V
```

Step by step:

1. `Q Kᵀ` gives an `(n, n)` matrix of scores: how much each token cares about each other token.
2. Divide by `√d_k` (the key dimension). Without this, dot products grow with dimension, softmax saturates, and gradients become tiny.
3. **Softmax** each row, turning scores into weights that are positive and sum to 1.
4. Multiply by `V`, so each token's output is a weighted average of the value vectors.

Here it is in NumPy:

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

The `causal` flag is what text-generating models use. Setting future positions to negative infinity before softmax makes their weights zero, so token 3 can attend to tokens 1 to 3 but not 4. That's what lets the model be trained to predict the next token without cheating.

In a real model the weight matrices are learned, not random.

## Multi-head attention

One attention pattern can only capture one kind of relationship at a time. **Multi-head attention** runs several attention operations in parallel, each with its own smaller Q, K and V projections. One head might learn to track which noun a pronoun refers to; another might focus on the previous token. The heads' outputs are concatenated and projected back to `d_model`.

A **transformer block** is multi-head attention followed by a small feed-forward network applied to each token separately, with residual connections and normalisation around both. A model stacks dozens of these blocks.

## Where does word order come from?

Look at the formula again: nothing in it knows about position. Shuffle the input tokens and each token's output is the same, just shuffled. Attention on its own treats a sentence as a bag of tokens.

So position has to be injected. The original transformer paper added fixed sine and cosine patterns to the embeddings. Some models learn a position embedding per slot. Many recent models use **rotary position embeddings (RoPE)**, which rotate the query and key vectors by an angle that depends on position, so their dot product reflects relative distance. The details vary; the point is that order is added information, not something attention gets for free.

## Why context windows cost what they do

The score matrix is `n × n`. Double the prompt length and you quadruple the number of query-key comparisons, per head, per layer. That **quadratic cost** is the main reason context windows were small for so long and why long prompts are slow and expensive.

There's a second cost during generation. To avoid recomputing everything for each new token, models keep a **KV cache**: the keys and values for every previous token, at every layer. It grows linearly with context length and can eat a lot of GPU memory, which limits how many requests a server can handle at once.

Plenty of engineering goes into softening this, from memory-efficient attention kernels to sparse and sliding-window attention patterns. But the basic shape holds: more context means more compute and memory, and providers price accordingly.

## The short version

- Text becomes tokens, tokens become vectors.
- Attention scores every token against every other with `Q · K`, softmaxes the scores, and blends the values.
- Multiple heads learn different relationships; position has to be added separately.
- The `n × n` score matrix and the KV cache are why long contexts are expensive.

If you remember one thing, make it the fuzzy dictionary lookup. Most transformer behaviour, good and odd, makes more sense once you picture every token asking every other token "are you relevant to me?" at every layer.
