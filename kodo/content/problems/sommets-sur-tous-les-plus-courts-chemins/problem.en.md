---
title: Vertices on every shortest path
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges, and two distinct vertices `S` and `T`. The length of a path is its number of edges; a **shortest path** from `S` to `T` is a path from `S` to `T` of minimum length. There may be several of them.

Write a program that finds the vertices that **every** shortest path from `S` to `T` goes through. `S` and `T` are always among them.

## Input
- The first line contains four integers `N`, `M`, `S` and `T`: the number of vertices (numbered from `1` to `N`), the number of edges, the start and the end.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge links vertices `A` and `B`.

Two vertices may be linked by several edges.

## Output
Two lines: the number `K` of vertices that every shortest path from `S` to `T` goes through, then these `K` vertices in increasing order, separated by spaces.

If `T` cannot be reached from `S`, print only `-1`.

## Constraints
- 2 ≤ N ≤ 10,000
- 0 ≤ M ≤ 10,000
- 1 ≤ S, T ≤ N and S ≠ T
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. Removing each vertex in turn and running a new traversal costs `N` traversals: too slow for `N = 10,000`. Instead, run one breadth-first search from `S` and another from `T`.
2. With `dS[v]` the distance from `S` to `v` and `dT[v]` the distance from `v` to `T`, vertex `v` lies on **at least one** shortest path if and only if `dS[v] + dT[v] = dS[T]`.
3. A shortest path of length `D` goes through exactly one vertex at distance `k` from `S`, for each `k` from `0` to `D`. How many vertices of at least one shortest path are there at each distance?

## Solution
We run two breadth-first searches: one from `S` gives `dS[v]`, the other from `T` gives `dT[v]`. If `T` is not reached, we print `-1`. Otherwise, let `D = dS[T]`.

**Vertices of at least one shortest path.** A vertex `v` lies on a shortest path if and only if `dS[v] + dT[v] = D`: just glue a shortest path from `S` to `v` and a shortest path from `v` to `T`. Along a shortest path, the `k`-th vertex is exactly at distance `k` from `S` (otherwise the path could be shortened). So every shortest path goes through **a single** vertex of each "layer" `k = 0, 1, …, D`.

**Mandatory vertices.** For each distance `k`, we count the vertices `v` of at least one shortest path with `dS[v] = k`.
- If there is only one, every shortest path goes through it: it is mandatory.
- If there are two or more, none of them is mandatory: a shortest path through one of them cannot go through another, since it has only one vertex at that distance.

In the first example, `D = 4` and the layers are `{1}`, `{2, 3}`, `{4}`, `{5, 6}`, `{7}`: the mandatory vertices are `1`, `4` and `7`. In the second one, the only shortest path is `1 - 2 - 3 - 5`, of length `3`; the path through `4`, `6` and `7` is longer.

**Complexity.** Two breadth-first searches and one pass over the vertices: **O(N + M)**.

**Why the naive solution is too slow.** Removing each vertex and checking with a traversal whether the distance from `S` to `T` grows costs `N` traversals, that is **O(N × (N + M))**: 2 × 10⁸ operations here.

**Pitfalls.**
- A mandatory vertex is not necessarily a vertex whose removal disconnects `S` from `T`: in the second example, without vertex `2`, you can still go from `1` to `5` through `4`, `6` and `7`, but along a longer path.
- In each layer, count only the vertices that lie on a shortest path: the other vertices at distance `k` from `S` do not count.
