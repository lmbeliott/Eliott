---
title: Far-apart vertices in a tree
---

## Statement
You are given a tree with `N` vertices numbered from `1` to `N`. Vertex `i` has a weight `W[i]`. The **distance** between two vertices is the number of edges on the path between them.

Write a program that chooses vertices that are pairwise at distance **at least 3**, so as to maximize the sum of their weights, and prints this sum.

## Input
- The first line contains the integer `N`.
- The second line contains the `N` integers `W[1]`, …, `W[N]`.
- The third line contains `N - 1` integers `P[2]`, …, `P[N]`: for each vertex `i ≥ 2`, an edge joins `i` and `P[i]`, with `P[i] < i`. This line is empty if `N = 1`.

## Output
A single integer: the greatest possible sum.

## Constraints
- 1 ≤ N ≤ 15 000
- 1 ≤ W[i] ≤ 1 000
- 1 ≤ P[i] < i

## Hints
1. Root the tree at `1`. To decide what to do with a vertex, you need to know how far the closest chosen vertex in its subtree is: `0` (the vertex itself), `1` (one of its children) or at least `2`.
2. Compute three values per vertex `v`: `taken[v]` (v is chosen), `child[v]` (v isn't, but one of its children is) and `free[v]` (neither v nor its children are). Two children of `v` are at distance 2: at most one of them can be chosen.
3. Since `P[i] < i`, going through the vertices from `N` down to `1` handles every child before its parent. No recursion needed.

## Solution
**The states.** Root the tree at `1`. The constraints between the subtree of a vertex `v` and the rest of the tree go through `v`. It is enough to know whether `v` is chosen, or else whether one of its children is. We define, for the subtree of `v`:
- `taken[v]`: best sum with `v` chosen;
- `child[v]`: `v` not chosen, one child of `v` chosen;
- `free[v]`: neither `v` nor its children chosen.

**The transitions**, writing `m(c) = max(child[c], free[c])` for a child `c`:
- `taken[v] = W[v] + sum of free[c]`: the children (distance 1) and grandchildren (distance 2) are forbidden.
- `free[v] = sum of m(c)`: two vertices chosen in subtrees of different children are at distance at least `2 + 1 + 1 = 4`.
- `child[v] = sum of m(c) + max over c of (taken[c] - m(c))`: only one child `c` is chosen, since two children are at distance 2. The other children `c'` must not be chosen. Their own children are then at distance 3 from `c`, which is allowed.

The answer is `max(taken[1], child[1], free[1])`. Since `P[i] < i`, we go through `i` from `N` down to `1`, adding the contribution of `i` to its parent. Each vertex is handled once: **O(N)**.

Why simple ideas fail: trying every set of vertices costs 2ᴺ. The greedy "take the heaviest vertex that is still allowed" is wrong, and the tests contain cases where it fails. The problem looks like the independent set problem (distance at least 2), but distance 3 forces you to track the children too: two states are not enough.

Traps:
- A leaf has no child: `child[leaf]` is impossible. Give it a very negative value (not `0`).
- A recursion on a path-shaped tree exceeds Python's recursion limit. Going from `N` down to `1` avoids it.
