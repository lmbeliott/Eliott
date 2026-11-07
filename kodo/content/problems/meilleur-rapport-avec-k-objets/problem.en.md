---
title: Best ratio with K items
---

## Statement
There are N items: item number i has a value V_i and a weight P_i. You must choose **exactly K** different items. The ratio of a choice is the sum of the values of the chosen items divided by the sum of their weights.

Write a program that computes the largest possible ratio. To avoid decimal numbers, print the integer part of 1000 × this ratio.

## Input
- The first line contains two integers N and K.
- Each of the next N lines contains two integers V_i and P_i.

## Output
A single integer: the integer part of 1000 × (total V / total P), for the best choice of K items.

## Constraints
- 1 ≤ K ≤ N ≤ 10,000
- 1 ≤ V_i, P_i ≤ 10,000

## Hints
1. Taking the K items with the best individual ratio V_i / P_i does not work: look at the second example. A light item with an average ratio can hurt less than a heavy item with a good ratio.
2. Ask yourself a simpler question: for a given integer q, can you choose K items such that 1000 × (total V) ≥ q × (total P)? Rewrite this condition as a sum over the chosen items.
3. The condition becomes: the sum of `1000 × V_i − q × P_i` over the chosen items is ≥ 0. To make it as large as possible, take the K items where this quantity is largest. If it is possible for q, it is possible for q − 1: find the largest q with a binary search.

## Solution
**The trap.** Sorting the items by ratio V_i / P_i and taking the first K seems natural, but it is wrong. In the second example, with K = 2, the two best ratios are (100, 100) and (60, 100), giving 160 / 200 = 0.8; whereas (100, 100) and (1, 2) give 101 / 102 ≈ 0.99. The weight of an item matters as much as its ratio: a light item barely pulls the ratio down.

**The idea: binary search for the answer.** The answer is the largest integer q such that there are K items with `1000 × (total V) ≥ q × (total P)`. This condition can be rewritten as
`sum over the chosen items of (1000 × V_i − q × P_i) ≥ 0`.
So for a fixed q, each item has a "score" `1000 × V_i − q × P_i` that only depends on itself. The largest possible sum of K scores is obtained by taking the K largest scores: we sort and add them up. If this sum is ≥ 0, q is possible.

If q is possible, so is q − 1 (the scores only increase when q decreases). So the answers are yes, yes, …, yes, no, no: we look for the last "yes" with a binary search, between `0` (always possible) and `1000 × max(V) + 1` (never possible, since the ratio cannot exceed max(V) / 1).

**Complexity.** The binary search takes about log₂(10⁷) ≈ 24 rounds; each one computes N scores and sorts them: O(N log N × log(1000 × max V)), a few million operations.

**Why the naive solution does not work.** Trying every choice of K items among N is impossible: there are billions of them as soon as N = 40 and K = 20. And the greedy "best ratios first" gives a wrong answer, as we saw.

**Traps.**
- Work with integers only: the condition `1000 × V ≥ q × P` avoids any division and any rounding.
- Scores can reach 10⁷ × 10⁴ = 10¹¹ in absolute value: use `long long` in C++.
- The score depends on q: you must sort again at each round of the binary search, because the order of the items changes.
