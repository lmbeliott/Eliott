---
title: Shortest cycle through vertex 1
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges; each edge has a length.

A **cycle through vertex 1** starts at vertex `1` and comes back to it using edges that are **all different**, without visiting any other vertex twice. It contains at least two edges. Its length is the sum of the lengths of its edges.

Write a program that computes the minimal length of a cycle through vertex `1`, or prints `-1` if there is none.

## Input
- The first line contains two integers `N` and `M`: the number of vertices and the number of edges.
- Each of the next `M` lines contains three integers `A`, `B` and `T`: an edge of length `T` joins vertices `A` and `B`.

## Output
A single integer: the minimal length of a cycle through vertex `1`, or `-1`.

## Constraints
- 1 ≤ N ≤ 5,000
- 0 ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N and A ≠ B; two vertices may be joined by several edges
- 1 ≤ T ≤ 1,000

## Hints
1. Removing an edge `1 – V`, then looking for the shortest path from `V` to `1` without it, gives the best cycle that starts with this edge. But vertex `1` can have thousands of edges: one Dijkstra per edge is too slow.
2. Run Dijkstra only once from `1`. It builds a shortest-path tree. Each vertex `v` belongs to a **branch**: the first edge of the path from `1` to `v` in the tree.
3. If the edge `A – B` (with `A` and `B` different from `1`) joins two different branches, the path from `1` to `A`, the edge, then the path from `B` to `1` form a real cycle. If the branches are the same, it is not a cycle through `1`. And an edge `1 – V` that is not the one in the tree also closes a cycle.

## Solution
Run **Dijkstra** from vertex `1`. For each vertex `v` reached, store its distance `d[v]`, the edge `arrival[v]` through which it was reached, and its **branch**: the first edge of the path in the tree. When relaxing an edge `u → v`, the branch of `v` is this edge if `u = 1`, and the branch of `u` otherwise.

Then look at each edge `A – B` of length `T`:
- if `A` and `B` are both different from `1` and their branches differ, the tree paths from `1` to `A` and from `1` to `B` only meet at `1`: this gives a cycle of length `d[A] + T + d[B]`;
- if the edge joins `1` to a vertex `V` and it is not `arrival[V]`, this gives the cycle made of the edge and the tree path from `V` to `1`, of length `T + d[V]`.

The answer is the smallest of these candidates. Why it is correct: take an optimal cycle `1, x₁, …, x_k, 1`. Its first and last edges are different. Going along it, the branch must "change" somewhere: either between two neighbouring vertices `x_i` and `x_{i+1}` that have different branches, or at the start (the branch of `x₁` is not the first edge of the cycle), or at the end. In each case, the edge at that place gives a candidate, and this candidate is not longer than the cycle, since `d[x]` is at most the length of the part of the cycle between `1` and `x`.

Complexity: **O(M log M)**.

Why the other ideas fail:
- One Dijkstra per edge leaving `1` costs O(deg(1) × M log M): too slow when vertex `1` has thousands of edges.
- Taking the smallest value `d[A] + T + d[B]` over all the edges outside the tree is wrong: if `A` and `B` are in the same branch, the two paths share their beginning, and this is not a cycle through `1`. In the first example, the triangle `4 – 5 – 6` is very short but does not go through `1`.

Pitfalls:
- Parallel edges: two edges between `1` and `V` form a cycle (second example). This is why you store the **index** of the edge through which a vertex is reached, not just its neighbour.
- A cycle cannot come back along the edge it just used: going back and forth on the same edge does not count.
- Vertices not reached from `1` are ignored.
