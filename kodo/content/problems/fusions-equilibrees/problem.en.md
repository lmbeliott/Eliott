---
title: Balanced merges
---

## Statement
You have a row of `N` positive integers. A **merge** replaces two **neighbouring** numbers `x` and `y` with a single number, their sum `x + y`, placed at the same spot; it costs `|x - y|`. You keep merging until only one number is left.

Write a program that computes the minimum total cost of all the merges.

## Input
- The first line contains an integer `N`.
- The second line contains `N` integers: the row, from left to right.

## Output
A single integer: the minimum total cost.

## Constraints
- 1 ≤ N ≤ 250
- each number is between `1` and `10⁹`

## Hints
1. Merging the two closest neighbours at each step does not work: on the second example, this strategy costs `6` instead of `2`.
2. Look at the **last** merge: it joins a number coming from a block `a[1..k]` and a number coming from the block `a[k+1..N]`. These two numbers are the sums of their blocks, whatever the order of the merges inside each block.
3. Let `cost[i][j]` be the minimum cost to merge the block `a[i..j]` into a single number. Then `cost[i][j]` is the minimum, over `k` from `i` to `j - 1`, of `cost[i][k] + cost[k+1][j] + |S(i, k) - S(k+1, j)|`, where `S` is the sum of a block. Compute the blocks by increasing length.

## Solution
Whatever the order of the merges, each number obtained is the sum of a **block** of consecutive numbers of the initial row. So the last merge joins the block `a[i..k]` and the block `a[k+1..j]`, for some `k`, and costs `|S(i, k) - S(k+1, j)|`, a value that depends only on `k`. Before it, the merges of each block happen independently of each other. Hence **dynamic programming over intervals**:

- `cost[i][i] = 0`: a single number, nothing to merge;
- `cost[i][j] = min(cost[i][k] + cost[k+1][j] + |S(i, k) - S(k+1, j)|)` for `i ≤ k < j`.

Block sums are obtained in O(1) with **prefix sums**. Fill the table by increasing block length, so that both sub-blocks are already computed. The answer is `cost[1][N]`.

There are O(N²) blocks and O(N) split points for each one: the complexity is **O(N³)**, about 2.6 million split points for `N = 250`.

Why the other ideas fail:
- Trying every merge order is exponential: there are `(N - 1)!` possible sequences of merges, and even after grouping equivalent orders, the number of merge trees explodes (Catalan numbers).
- The greedy "merge the two closest neighbours" is wrong. On `1 1 1 2 1`, it first merges two `1`s for free, but creates a badly placed `2` and ends up at `6`. The best sequence costs `2`: for example `1 1 1 2 1 → 1 1 1 3 → 2 1 3 → 3 3 → 6`, with costs `1`, `0`, `1` and `0`.

Pitfalls:
- The total cost can go far beyond 2³¹: use `long long` in C++.
- With `N = 1`, there is no merge: the answer is `0`.
- The order of the lengths matters: filling the table row by row, with `i` increasing, would use `cost[k+1][j]` before computing it.
