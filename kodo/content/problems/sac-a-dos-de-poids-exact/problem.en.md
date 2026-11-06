---
title: Exact-weight knapsack
---

## Statement
You have `N` items; each one has a weight and a value.

Write a program that chooses items, each at most once, whose total weight is **exactly** `W`, maximising the sum of their values. If no choice of items weighs exactly `W`, print `-1`.

## Input
- The first line contains two integers `N` and `W`.
- Each of the next `N` lines contains two integers: the weight `P` of an item and its value `V`.

## Output
A single integer: the maximum total value of a selection weighing exactly `W`, or `-1` if there is none.

## Constraints
- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10 000
- 1 ≤ P ≤ 10 000
- 0 ≤ V ≤ 1 000

## Hints
1. There are 2¹⁰⁰ ways to choose items. On the other hand, there are only `W + 1` possible total weights between `0` and `W`.
2. Handle the items one by one, keeping up to date `meilleur[w]` ("best"): the best value of a selection weighing exactly `w` using the items handled so far. How does a new item of weight `P` and value `V` change this array?
3. At the start, only `meilleur[0] = 0` is possible: the other cells must be "impossible" (for example `-1`), not `0`. For each item, go through `w` from `W` down to `P` in **decreasing** order, so as not to use the same item twice.

## Solution
This is the **knapsack** problem, with an equality constraint. Let `meilleur[w]` be the best value of a selection weighing exactly `w`, using only the items examined so far, or `-1` if no selection weighs `w`.

- At the start (no items), only the empty selection exists: `meilleur[0] = 0` and `meilleur[w] = -1` for `w > 0`.
- When we examine an item of weight `P` and value `V`, a selection of weight `w` either doesn't contain it (value `meilleur[w]`), or contains it and the rest weighs `w - P` (value `meilleur[w - P] + V`, if `meilleur[w - P]` is not `-1`). We keep the better of the two.

We go through `w` from `W` down to `P` in **decreasing** order: this way, `meilleur[w - P]` has not yet been changed for this item, and each item is used at most once. The answer is `meilleur[W]`.

Complexity: **O(N × W)**, that is 10⁶ operations at most. Trying every subset would cost 2¹⁰⁰: impossible. A greedy approach (taking the most valuable items first, or the most "profitable" per unit of weight) doesn't work either: it can miss the exact weight or a better combination.

Traps:
- Initialising the whole array to `0` computes the best value for a weight **at most** `W`, not exactly `W`. On the first example, you would get `90` instead of `70`.
- Going through `w` in increasing order would allow taking the same item several times.
- An item of value `0` can be essential to reach the exact weight: the answer can be `0` without being `-1`.
