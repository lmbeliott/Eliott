---
title: Connected set of K vertices
---

## Statement
You are given a tree with `N` vertices numbered from `1` to `N`. Vertex `i` has a weight `W[i]`, which may be negative. A set of vertices is **connected** if you can go from any vertex of the set to any other using only vertices of the set.

Write a program that chooses a connected set of **exactly** `K` vertices whose total weight is as large as possible, and prints this total.

## Input
- The first line contains the integers `N` and `K`.
- The second line contains the `N` integers `W[1]`, …, `W[N]`.
- The third line contains `N - 1` integers `P[2]`, …, `P[N]`: for each vertex `i ≥ 2`, an edge joins `i` to `P[i]`, with `P[i] < i`. This line is empty if `N = 1`.

## Output
A single integer: the largest total weight of a connected set of `K` vertices.

## Constraints
- 1 ≤ K ≤ N ≤ 10 000
- K ≤ 150
- −1 000 ≤ W[i] ≤ 1 000
- 1 ≤ P[i] < i

## Hints
1. Root the tree at `1`. A connected set has a unique vertex `v` closer to the root than all the others: its "highest vertex". Compute, for each `v` and each size `j ≤ K`, the best connected set of `j` vertices whose highest vertex is `v`.
2. To get these values, add the children of `v` one by one. With a child `c`, either take nothing below `c`, or take a set of `b` vertices whose highest vertex is `c`: it is a knapsack where each child is a group of items.
3. Never keep sizes beyond `K`, and only let `a` and `b` range up to the sizes actually reached (size of the part already merged, size of the subtree of `c`). The total is then O(N × K), not O(N × K²).

## Solution
Root the tree at `1`. In a connected set, exactly one vertex is closer to the root than all the others: call it the highest vertex `v`. The set then contains `v`, and, below each child `c` of `v`, either nothing or a connected set whose highest vertex is `c`.

**The state.** `f[v][j]` is the largest total of a connected set of `j` vertices (`1 ≤ j ≤ K`) whose highest vertex is `v`. Initially `f[v][1] = W[v]`. Add the children one by one: with child `c`, the new value for `a + b` vertices is the maximum of `f[v][a] + f[c][b]`, and the old value is kept too (nothing below `c`). The answer is the maximum of `f[v][K]` over all `v`.

Since `P[i] < i`, going through `v` from `N` down to `1` finishes each vertex before its parent: merge `f[v]` into `f[P[v]]` without recursion.

**Why it is fast.** If `a` and `b` are bounded by `K` **and** by the sizes already reached (the array of `v` only has `min(K, merged size)` cells), the total cost is O(N × K). The idea: a merge between two parts of sizes `s` and `t` costs `min(s, K) × min(t, K)`. While both parts are small, this cost is spread over the merged pairs of vertices, each counted once. As soon as a part exceeds `K`, each vertex of the other part pays at most `K`. With `N = 10 000` and `K = 150`, this is at most a few million operations.

Why simple ideas fail:
- Letting `a` and `b` range from `1` to `K` at each merge costs O(N × K²), more than 10⁸ operations.
- Merging without capping the sizes at `K` costs O(N²): on a path of 10 000 vertices, about 5 × 10⁷ operations, far too many for Python.
- Starting from the heaviest vertex and adding the heaviest neighbour at each step is wrong: sometimes you must go through a negative vertex to reach large weights. In the first sample, this greedy takes `3`, `6`, then `1`, for a total of `5`, while `{1, 2, 3}` gives `7`.

Traps:
- Negative weights forbid taking "the best with at most `K` vertices": you need exactly `K`.
- The answer may be negative: initialise the maximum to minus infinity, not `0`.
