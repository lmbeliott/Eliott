---
title: Weighted sum of distances
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`. Each vertex `u` has a weight `c[u]`. The distance between two vertices is the number of edges of the path between them.

For each vertex `v`, let `F(v)` be the sum, over all vertices `u`, of `c[u] × distance(u, v)`. Write a program that computes `F(v)` for every vertex `v`.

## Input
- The first line contains an integer `N`.
- The second line contains `N` integers `c[1] … c[N]`.
- The third line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order, when the tree is rooted at vertex `1`. It is empty if `N = 1`.

## Output
`N` lines: line `v` contains `F(v)`.

## Constraints
- 1 ≤ N ≤ 12 000
- 0 ≤ c[u] ≤ 1 000

## Hints
1. A search from every vertex gives the answer in O(N²): too slow. Start by computing `F(1)` alone, with the depths.
2. If `v` is a child of `p`, what changes when moving from `p` to `v`? Each vertex of the subtree of `v` gets `1` closer, every other vertex gets `1` farther.
3. With `W[v]` the sum of the weights of the subtree of `v` and `T` the sum of all the weights: `F(v) = F(p) - W[v] + (T - W[v])`. Compute the `F` values from the root down to the leaves.

## Solution
This is the **rerooting** technique: compute the answer for one root, then "slide" it along each edge in O(1).

1. A breadth-first search from vertex `1` gives an order where each vertex comes after its parent, and the depth of each vertex. From it, `F(1) = Σ c[u] × depth[u]`.
2. Going through this order backwards, compute `W[v]`, the sum of the weights of the subtree of `v`: `W[v] = c[v] + Σ W[child]`. Let `T = W[1]`.
3. Let `v` be a child of `p`. When moving from `p` to `v`, the vertices of the subtree of `v` get `1` closer (they weigh `W[v]` in total) and all the others get `1` farther (they weigh `T - W[v]`). So `F(v) = F(p) + T - 2 × W[v]`. Apply this formula in the search order, from the root down to the leaves, so that `F(p)` is known before `F(v)`.

Complexity: **O(N)**.

Why the naive method fails: a breadth-first search from every vertex costs O(N²), about 1.4 × 10⁸ vertex visits for `N = 12,000`: far too many for Python.

Pitfalls:
- The sums exceed 2³¹ (up to about 7 × 10¹⁰ for a long path): use `long long` in C++.
- The numbers do not follow the hierarchy: you need a real traversal order, not the order of the numbers.
- A recursive version exceeds Python's recursion limit on a path-shaped tree.
- Mind the signs: `W[v]` is **subtracted** once (the subtree gets closer) and `T - W[v]` is **added** (the rest gets farther). Check the formula on the first example before coding.
