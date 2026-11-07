---
title: Path additions, subtree sums
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`, rooted at vertex `1`. Each vertex has a value, which is `0` at the start. The **subtree** of `v` is made of `v` and all its descendants.

Write a program that processes, in order, a sequence of `Q` operations of two kinds:
- `1 U V X`: add `X` to the value of each vertex on the path between `U` and `V`, `U` and `V` included;
- `2 V`: print the sum of the values of the vertices in the subtree of `V`.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order. It is empty if `N = 1`.
- Each of the next `Q` lines contains an operation: the integer `1` followed by `U`, `V` and `X`, or the integer `2` followed by `V`.

A vertex may have a smaller number than its parent.

## Output
For each operation of kind `2`, in order, a line with the requested sum.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ Q ≤ 8,000
- 1 ≤ U, V ≤ N (`U` and `V` may be equal)
- 1 ≤ X ≤ 1,000

## Hints
1. Start with a simpler case: if you put a "mark" `c[z]` on some vertices, and the value of a vertex `y` is the sum of the marks in its subtree, how can you add `X` to the whole path from `U` to `V` by changing only four marks? Think of the common ancestor `W` of `U` and `V`.
2. Put `+X` on `U`, `+X` on `V`, `-X` on `W` and `-X` on the parent of `W`. What remains is computing the sum of the values of a subtree from the marks: a mark `c[z]` placed in the subtree of `v` counts for each vertex on the path from `v` to `z`, that is `depth[z] - depth[v] + 1` times.
3. So the answer is `Σ c[z] × depth[z] - (depth[v] - 1) × Σ c[z]`, the sums being over the subtree of `v`. With a depth-first search, a subtree becomes a range of positions: two Fenwick trees are enough.

## Solution
**Marks instead of values.** Keep an array of marks `c`, such that the value of a vertex `y` is the sum of the marks in its subtree. To add `X` to the path `U – V`, compute the common ancestor `W` with **binary lifting**, then do `c[U] += X`, `c[V] += X`, `c[W] -= X` and, if `W` is not the root, `c[parent(W)] -= X`. Let's check: a vertex strictly between `U` and `W` only sees the mark of `U`; `W` sees `+X + X - X`; a strict ancestor of `W` sees `+X + X - X - X = 0`; the other vertices see nothing. If `U = W`, the mark of `U` and that of `W` cancel out and `W` does receive `X` exactly once.

**Sum of a subtree.** The sum of the values of the subtree of `v` is
`Σ_{y in the subtree of v} Σ_{z in the subtree of y} c[z]`.
A mark `c[z]` is counted once for each vertex `y` on the path from `v` to `z`, that is `depth[z] - depth[v] + 1` times. So the sum is
`S₂ - (depth[v] - 1) × S₁`, with `S₁ = Σ c[z]` and `S₂ = Σ c[z] × depth[z]` over the subtree of `v`.

**The structures.** A **depth-first search** (without recursion) numbers the vertices: the subtree of `v` takes up the positions `start[v] … end[v]`. Two **Fenwick trees** on these positions hold `c[z]` and `c[z] × depth[z]` at position `start[z]`. An addition changes four cells in each; a query reads two range sums in each.

Complexity: **O(N log N)** for the preparation, then **O(log N)** per operation.

Why the naive method fails: on a deep tree, a path can contain thousands of vertices, and so can a subtree. Walking along the path for each addition and through the subtree for each query takes tens of millions of operations. A single Fenwick tree on the marks would give the **value** of a vertex, not the sum of a whole subtree: the second one, weighted by the depth, is what makes the difference.

Pitfalls:
- When `W` is the root, there is no parent to put `-X` on.
- The sums exceed 2³¹: use `long long` in C++.
- Recursion on a tree of depth 10,000 goes beyond Python's default limit: use a stack.
