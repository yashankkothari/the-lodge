---
title: "Why Rule Engines Still Matter in Fraud Detection"
date: 2025-07-26
tags: ["post", "backend", "guides"]
---

When people hear "fraud detection" they usually picture a machine learning model scoring every transaction. Models are a big part of it. But in most real payment systems there's also a **rule engine** sitting in the path of every transaction, and it isn't going away.

I spent this summer as an AI/ML intern at Card91, where I worked on integrating the open-source **Tazama** fraud engine. A big chunk of that was porting rule logic from TypeScript to Python and implementing more than 30 transaction rules. Doing that made it much clearer to me why rules and models end up working side by side.

## What a rule engine does

A rule engine evaluates each transaction against a set of explicit conditions: "more than five transactions from this card in ten minutes", "amount far above this customer's usual spend", "card used in two distant cities within an hour". Each rule produces a result, the results are combined, and the system decides whether to allow, block, or flag the transaction for review.

The logic is written by people, readable by people, and changed by people. That's both the point and the limitation.

## Why rules haven't been replaced by ML

**Explainability.** When a transaction is declined, someone will ask why: the customer, a support agent, an auditor, a regulator. "Rule 14: transaction amount exceeded the per-day limit for a new account" is an answer. "The model scored it 0.91" usually isn't, at least not without extra tooling.

**Latency.** Payment authorisation has a tight time budget. Many rules are simple lookups and comparisons that run in microseconds once the right counters are in memory. They don't need a feature pipeline or a model server.

**Speed of response.** When a new fraud pattern appears, a team can write and deploy a rule the same day. Retraining a model needs labelled examples of the new pattern, which by definition you don't have much of yet.

**Hard requirements.** Some checks aren't predictions at all. Sanctions lists, blocked merchants, regulatory limits: these are policies, and policies should be code, not probabilities.

Models are better at catching subtle patterns across many weak signals. Rules are better at being certain, fast and auditable. Most systems use rules as a first line and a model score as one more input, sometimes literally as a rule: "block if model score > threshold and amount > X".

## Common rule types

Most transaction rules fall into a few families.

- **Velocity rules** count events in a time window: transactions per card per minute, new payees per account per day, failed PIN attempts per hour. Fraudsters testing stolen cards tend to move fast.
- **Geolocation rules** look at where the transaction happens: a country the customer has never used, or "impossible travel" where two transactions are too far apart for the time between them.
- **Amount threshold rules** compare the amount to fixed limits or to the customer's own history: a first transaction far above the account's average, or many transactions just under a reporting threshold.
- **Behavioural rules** look at changes: a new device followed immediately by a password reset and a large transfer.

## A simple rule in Python

Here's a generic sketch. It isn't how any particular engine is built, but it shows the shape: each rule is a small, pure function that takes a transaction plus some context and returns a result with a reason.

```python
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class Txn:
    card_id: str
    amount: float
    country: str
    ts: datetime

@dataclass
class RuleResult:
    rule_id: str
    triggered: bool
    reason: str = ""

def velocity_rule(txn: Txn, recent: list[Txn],
                  window=timedelta(minutes=10), limit=5) -> RuleResult:
    count = sum(1 for t in recent
                if t.card_id == txn.card_id and txn.ts - t.ts <= window)
    if count >= limit:
        return RuleResult("VEL-01", True,
                          f"{count} txns in {window}, limit {limit}")
    return RuleResult("VEL-01", False)

def amount_rule(txn: Txn, avg_amount: float, factor=10) -> RuleResult:
    if avg_amount > 0 and txn.amount > avg_amount * factor:
        return RuleResult("AMT-01", True,
                          f"amount {txn.amount} > {factor}x avg {avg_amount:.0f}")
    return RuleResult("AMT-01", False)
```

Keeping rules pure (no database calls inside, context passed in) makes them easy to test and easy to reason about. The engine around them handles fetching history and combining the results.

## False positives are the real cost

A rule that blocks all fraud is easy: decline everything. The hard part is **false positives**, legitimate customers getting blocked. Each one is a frustrated customer, a support call, and sometimes a lost customer.

Some things that help:

- **Graduated outcomes.** Not every triggered rule needs a block. Many should flag for review or ask for extra authentication.
- **Combine signals.** One weak rule firing alone may mean little; three firing together means more. Weighted scoring across rules is common.
- **Personal baselines.** "Ten times this customer's average" is usually better than a single fixed amount for everyone.
- **Watch the rates.** Track how often each rule fires and how often its alerts turn out to be real fraud. A rule that fires constantly and is almost never right is noise.

## Testing rules properly

Rules look simple, which is why they're easy to get subtly wrong. Off-by-one errors at window boundaries, time zones, currency conversions, and `>` versus `>=` all matter.

Treat rules like any other code:

```python
from datetime import datetime, timedelta

def test_velocity_triggers_at_limit():
    now = datetime(2025, 7, 1, 12, 0)
    recent = [Txn("c1", 100, "IN", now - timedelta(minutes=i))
              for i in range(5)]
    txn = Txn("c1", 100, "IN", now)
    assert velocity_rule(txn, recent).triggered

def test_velocity_ignores_old_txns():
    now = datetime(2025, 7, 1, 12, 0)
    recent = [Txn("c1", 100, "IN", now - timedelta(minutes=30))] * 5
    assert not velocity_rule(Txn("c1", 100, "IN", now), recent).triggered
```

Beyond unit tests, the useful habit is **backtesting**: run a new or changed rule over historical transactions before deploying it, and see how many it would have flagged. When porting rules between languages, as I did, comparing outputs from the old and new implementations on the same inputs is the quickest way to catch behaviour that drifted in translation.

## The short version

- Use rules for what must be certain, fast and explainable; use models for subtle patterns.
- Write each rule as a small pure function that returns a reason, not just a boolean.
- Prefer graduated outcomes and combined signals over single hard blocks.
- Test boundaries explicitly, and backtest before every rule change.

Rules aren't the old way of doing fraud detection. They're the part of the system you can read, and that matters more than it sounds.
