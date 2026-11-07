---
title: Cut a tree in two
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`, rooted at vertex `1`. Each vertex `v` has a weight `P[v]`.

Removing an edge cuts the tree into two parts. The **gap** of the cut is the absolute value of the difference between the total weights of the two parts. Write a program that computes the smallest possible gap, and the number of edges whose removal gives this gap.

## Input
- The first line contains an integer `N`.
- The second line contains `N` integers `P[1] … P[N]`.
- The third line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order.

A vertex may have a smaller number than its parent.

## Output
Two integers separated by a space: the smallest gap, then the number of edges that reach it.

## Constraints
- 2 ≤ N ≤ 12 000
- 1 ≤ P[v] ≤ 1 000

## Hints
1. Removing the edge between `v` and its parent separates the **subtree** of `v` (vertex `v` and all its descendants) from the rest of the tree. If `S` is the total weight and `s` that of the subtree, the gap is `|S - 2s|`.
2. The weight of a subtree is the weight of `v` plus the weights of the subtrees of its children. You only need to process each vertex **after** all its children.
3. A breadth-first search from the root gives an order where each vertex comes after its parent. Read backwards, this order processes each vertex after its children: then add `s[v]` to `s[parent[v]]`.

## Solution
Each edge links a vertex `v ≠ 1` to its parent. Removing it separates the subtree of `v` from the rest: if `s[v]` is the weight of the subtree of `v` and `S` the total weight, the two parts weigh `s[v]` and `S - s[v]`, and the gap is `|S - 2 × s[v]|`. So it is enough to know the weight of every subtree.

First store the children of each vertex in lists. A **breadth-first search** from the root produces a list `order` where each vertex appears after its parent. Go through `order` backwards: when you process `v`, all its descendants, further in the list, have already been processed, and `s[v]` is complete. Then add it to `s[parent[v]]`. At the start, `s[v] = P[v]`.

Finally, compute `|S - 2 × s[v]|` for each `v` from `2` to `N`, keeping the minimum and the number of times it is reached.

Complexity: **O(N)**.

Why the naive approaches fail:
- For each edge, recomputing the weight of one of the two parts with a traversal costs O(N) per edge, O(N²) in total: about 7 × 10⁷ vertex visits, too many for Python.
- A recursive function that computes `s[v]` exceeds Python's recursion limit when the tree is a long path (12,000 levels).

Pitfalls:
- The numbers do not follow the hierarchy: a vertex may have a smaller number than its parent. Going through the vertices from `N` down to `2` to add `s[v]` to its parent is therefore wrong; you need a real traversal order.
- Several edges may give the same gap: a path of 7 vertices of weight `1` can be cut into `3 + 4` or into `4 + 3`.
