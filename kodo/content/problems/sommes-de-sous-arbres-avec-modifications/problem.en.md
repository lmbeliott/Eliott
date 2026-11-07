---
title: Subtree sums with updates
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`, rooted at vertex `1`. Each vertex `v` has a value `P[v]`. The **subtree** of `v` is made of `v` and all its descendants.

Write a program that processes, in order, a sequence of `Q` operations of two kinds:
- `1 V X`: the value of vertex `V` becomes `X`;
- `2 V`: print the sum of the values of the vertices in the subtree of `V`.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N` integers `P[1] … P[N]`.
- The third line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order. It is empty if `N = 1`.
- Each of the next `Q` lines contains an operation: the integer `1` followed by `V` and `X`, or the integer `2` followed by `V`.

A vertex may have a smaller number than its parent.

## Output
For each operation of kind `2`, in order, a line with the requested sum.

## Constraints
- 1 ≤ N ≤ 8,000
- 1 ≤ Q ≤ 8,000
- 0 ≤ P[v], X ≤ 1,000
- 1 ≤ V ≤ N

## Hints
1. Going through the subtree for each query is too slow on a deep tree. Storing the sum of each subtree and updating all the ancestors on each change is too slow as well.
2. Number the vertices in the order in which a depth-first search visits them for the first time. What do you notice about the numbers of the vertices of a single subtree?
3. The subtree of `v` takes up a range of consecutive positions `[start[v], end[v]]`. The query becomes a sum over a range, and the update a change of a single cell: this is a job for a Fenwick tree.

## Solution
Run a **depth-first search** from the root and write down `start[v]`, the position of `v` in the order of visit (from `1` to `N`). A depth-first search visits the whole subtree of `v` right after `v`, before moving on: so the vertices of the subtree take up exactly the positions `start[v], start[v] + 1, …, end[v]`, where `end[v]` is the last position given out while visiting the subtree.

Store the value of each vertex `v` in the cell `start[v]` of a **Fenwick tree**:
- `2 V`: the answer is the sum of the cells `start[V] … end[V]`, that is `prefix(end[V]) - prefix(start[V] - 1)`;
- `1 V X`: add `X - P[V]` to the cell `start[V]`, then remember that `P[V]` is now `X`.

The search is done without recursion, with a stack: when a vertex is popped, give it its position, push a marker, then its children. When the marker is popped, its whole subtree has been visited and you write down `end[v]`.

Complexity: **O(N + Q log N)**.

Why the naive methods fail, on a very deep tree (close to a path):
- going through the subtree for each query costs up to `N` operations per query;
- storing the sum of each subtree and fixing it in every ancestor on each update costs the depth, up to `N`.
In both cases, this reaches tens of millions of operations.

Pitfalls:
- Operation `1` **replaces** the value: add the difference with the old value, and remember the new one.
- Recursion on a tree of depth 8,000 goes beyond Python's default limit: use a stack.
- A vertex may have a smaller number than its parent: build the lists of children first.
