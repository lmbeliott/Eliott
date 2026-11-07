---
title: Distances from vertex 1
---

## Statement
An undirected graph has `N` vertices numbered from `1` to `N` and `M` edges; each edge has a length. An edge may join a vertex to itself, and two vertices may be joined by several edges.

For each vertex `v`, print the length of a shortest path from vertex `1` to vertex `v`, or `-1` if `v` cannot be reached from `1`.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains three integers `A`, `B` and `L`: an edge of length `L` joins `A` and `B`.

## Output
One line of `N` integers: the distances of vertices `1`, `2`, …, `N` from vertex `1`.

## Constraints
- 1 ≤ N ≤ 8,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁹

## Hints
1. Lengths are positive: this is exactly the setting of Dijkstra's algorithm.
2. A heap (`heapq`, `priority_queue`) gives, at each step, the closest unprocessed vertex. When a vertex leaves the heap with a distance larger than the one already known, ignore it.
3. A shortest path can have thousands of edges of length 10⁹: which type is needed in C++?

## Solution
This is Dijkstra's algorithm, applied as is. Keep `dist[v]`, the smallest known length of a path from `1` to `v` (infinity at first, `0` for vertex `1`), and a heap of pairs `(distance, vertex)`. At each step, pop the pair with the smallest distance `(d, u)`. If `d > dist[u]`, it is a **stale entry**: `u` was already processed with a better distance, skip it. Otherwise `d` is the final distance of `u`, and **relax** each edge `u – v` of length `L`: if `d + L < dist[v]`, improve `dist[v]` and push `(dist[v], v)`.

**Why it is correct.** All lengths being positive, the unprocessed vertex with the smallest tentative distance cannot be reached more cheaply through another unprocessed vertex: any such detour already costs at least as much before even arriving. This is the proof from the lesson.

**Complexity.** Each edge is relaxed twice (once from each end) and pushes at most one pair: O((N + M) log M). Finding the minimum by scanning all vertices at each step would cost O(N²), that is 64 million steps: too slow in Python.

**Pitfalls.** Distances exceed 2³¹ as soon as a path has three edges of length 10⁹ (second sample): `long long` is needed in C++, and an "infinite" value much larger than any possible distance (8,000 × 10⁹ = 8 × 10¹²). Vertices never reached print `-1`. Loops and multiple edges need no special care.
