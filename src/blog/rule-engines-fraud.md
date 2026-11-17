---
title: "Why Rule Engines Still Matter in Fraud Detection"
date: 2025-07-26
tags: ["post", "backend", "guides"]
---

You'd think fraud detection had become entirely an ML problem from the way people talk about it. Train a model, score transactions, call it intelligent. But payment systems still rely heavily on plain old **rule engines**, and after looking into them I understand why.

During my AI/ML internship at Card91, I researched fraud detection and evaluated the open-source **Tazama** engine. Digging through its rules made me appreciate just how much value there is in logic that a human can actually read, test and explain.

## What a rule engine does

The basic idea isn't complicated. A transaction comes in and you check explicit conditions: has the card been used six times in ten minutes? Is the amount wildly different from the customer's normal behaviour? Has the same card appeared in two distant cities almost simultaneously? The engine combines those signals and decides whether the payment should proceed, be blocked or go for review.

You can point to the exact rule that fired and explain it to another human. That matters a lot when someone's card has just been declined. Of course it also means you need people to maintain the rules as fraud patterns change.

## Why rules haven't been replaced by ML

**You can actually explain the decision.** If a customer's payment gets declined, "this new account exceeded its daily limit" is a reason a support agent can communicate. "Our model gave it a risk score of 0.91" doesn't mean much to the customer, and it often isn't enough for an auditor either.

**They're fast when implemented properly.** Payment authorisation doesn't have unlimited time to think. A counter lookup and threshold comparison can be extremely cheap when the necessary state is already in memory. You don't need to call a model endpoint to enforce a fixed limit.

**You can react before you have a training dataset.** A new attack pattern appears this morning. A team might be able to write and deploy a targeted rule today. Training a model on the new behaviour requires examples, labels, evaluation and deployment work. There are cases where waiting isn't acceptable.

**Some things are policy, not prediction.** A blocked merchant or sanctions match isn't something I'd want a probabilistic model to "sort of" enforce. Certain rules exist because the business or regulator requires them, regardless of the model's score.

I'm not arguing that models are useless. They're good at combining weak, messy signals that would make a handwritten ruleset enormous. In practice I'd expect the two approaches to work together: explicit policies and thresholds, plus a model score that can influence what happens next. Even the model score might appear inside a rule like "high risk and amount above X requires review".

## Common rule types

Once you start reading through transaction rules, the same categories keep showing up:

- **Velocity:** a sudden burst of transactions, new payees or failed PIN attempts. Someone testing stolen credentials often moves quickly.
- **Location:** activity from an unfamiliar country, or two payments so far apart that the travel time makes no sense.
- **Amounts:** transactions far above an account's usual pattern, or repeated amounts clustered just below a threshold.
- **Behaviour changes:** a new device appears, the password changes and a large transfer follows. Each event alone might be fine; the sequence is suspicious.

## A simple rule in Python

To make this concrete, here's a deliberately small Python example. It's not copied from Tazama or any bank's production system. I just want to show what I like about this design: each rule accepts a transaction plus the context it needs and returns a decision *with a reason*.

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

Notice that the rule functions aren't reaching into databases themselves. They receive the recent history and compute a result. That separation makes the logic easier to test. The larger engine can handle fetching context, running rules and deciding how their results combine.

## False positives are the real cost

Want a fraud system that never allows a fraudulent payment? Decline every transaction. Obviously that isn't a business. The difficult part is controlling **false positives**: actual customers getting blocked because your system thought their perfectly normal purchase looked suspicious.

That changes how I'd think about the response to a triggered rule:

- **Don't block everything automatically.** Some suspicious payments deserve an extra authentication step or manual review rather than a hard decline.
- **Look at combinations.** One weak signal might be harmless. Several at once can be much more meaningful.
- **Use the customer's history.** A fixed threshold for everybody is crude compared with asking what's unusual for this particular account.
- **Measure false positives per rule.** If one rule triggers constantly and almost never catches fraud, it's creating work and annoying customers for very little benefit.

## Testing rules properly

The scary part is that the code can look trivial while hiding important bugs. Does "five transactions in ten minutes" include the current transaction? Is the boundary inclusive? Are timestamps in UTC? What happens when the amount is in another currency? That difference between `>` and `>=` is suddenly somebody's declined card.

I'd test the thresholds and the edges explicitly:

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

Unit tests aren't enough when the real question is how many legitimate customers you'll annoy. I'd **backtest** a new rule against historical data before deploying it to see what it would have flagged. And if I'm translating the rule to another language, I'd compare the old and new implementations on identical inputs. That's much more convincing than reading both functions and saying they look equivalent.

## Where I landed

- Explicit policies and predictable checks belong in rules. Complex behavioural patterns can benefit from ML.
- I want each rule to return a reason alongside its result, so investigators aren't left guessing.
- I'd combine signals and use reviews or extra authentication where a hard block would be excessive.
- I'd test time windows, thresholds and historical impact before trusting a new rule with real transactions.

I don't see rules and ML as competing approaches anymore. Models can catch complicated patterns. Rules give you direct control over the cases where you need a clear, auditable reason. Dismissing the second one because it isn't fashionable AI would be a mistake.
