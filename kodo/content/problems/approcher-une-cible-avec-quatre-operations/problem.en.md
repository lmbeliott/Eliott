---
title: Approaching a target with the four operations
---

## Statement
You have `N` positive integers and a target number `T`. A **step** chooses two of the available numbers, removes them, and replaces them with their sum, their difference, their product or their quotient, with two rules: a difference must be strictly positive, and a quotient is only allowed if the division is exact. Any number of steps may be done (including none), stopping at any time.

A number is **reachable** if it belongs to the available numbers at some moment. For example, with `1 3 4 6`, the steps 3 + 1 = 4, then 4 × 4 = 16, then 16 × 6 = 96 show that 96 is reachable; 24 is too, in a single step: 6 × 4.

Compute the smallest gap `|v − T|` between a reachable number `v` and the target.

## Input
- The first line contains two integers `N` and `T`.
- The second line contains the `N` numbers.

## Output
A single integer: the smallest gap between a reachable number and `T`.

## Constraints
- 1 ≤ N ≤ 6
- 1 ≤ T ≤ 1,000,000
- each number is between 1 and 100

## Hints
1. A recursive function receives the list of available numbers; for each pair and each allowed operation, it calls itself on the resulting list, which has one number less.
2. With 6 numbers, trying each pair in both orders gives a tree of about ten million nodes. One order is enough for a pair (the larger number first), and the same list is often obtained along several paths (doing `a + b` then `c × d`, or `c × d` then `a + b`).
3. Store in a set the lists already explored, sorted so that order does not matter, and do not explore them a second time.

## Solution
**Backtracking.** The function `explore(list)` tries every pair `(a, b)` of the list, with `a ≥ b`, and every allowed operation: `a + b`, `a × b`, `a − b` if `a > b`, `a ÷ b` if `b` divides `a`. Each result `v` updates the best gap, then `explore` is called on the list where `a` and `b` are replaced by `v`. The starting numbers are taken into account before the first call. Every reachable number thus appears in one of the lists visited, since the function tries every possible step from each list.

**Size of the tree.** A list of `k` numbers has `k(k − 1)/2` pairs and at most 4 results per pair. For `N = 6`, this gives up to 60 × 40 × 24 × 12 × 4 ≈ 2.8 million leaves; in practice, the tree has about one million nodes. If each pair is tried in both orders (`a + b` then `b + a`, `a × b` then `b × a`), it has more than ten million: far too many for Python. But many nodes represent the same situation: a list of numbers does not depend on the order in which the steps were done. So each list, sorted and turned into a tuple, is stored in a set `already_seen`, and the same list is never explored twice. On the tests, there are only about 65,000 different lists.

We also stop as soon as the gap is 0: nothing can do better.

**Why it is correct.** What remains to explore from a list only depends on its content, not on the path that led to it: skipping an already explored list loses no reachable number.

Numbers can become large (up to about 100⁶ = 10¹²): in C++, use `long long`.
