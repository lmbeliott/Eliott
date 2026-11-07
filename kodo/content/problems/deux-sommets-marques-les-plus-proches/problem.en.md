---
title: The two closest marked vertices
---

## Statement
An undirected graph has `N` vertices and `M` edges; each edge has a length. Among the vertices, `K` are **marked**. Print the smallest distance between two different marked vertices, or `-1` if no pair of marked vertices is joined by a path.

## Input
- The first line contains `N`, `M` and `K`.
- The second line contains the `K` marked vertices, all different.
- Each of the next `M` lines contains three integers `A`, `B` and `L`: an edge of length `L` joins `A` and `B`.

## Output
A single integer: the smallest distance between two different marked vertices, or `-1`.

## Constraints
- 2 ≤ K ≤ N ≤ 5,000
- 0 ≤ M ≤ 6,000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁹

## Hints
1. One Dijkstra from each marked vertex costs `K` times too much when almost all vertices are marked.
2. A single Dijkstra can start from all marked vertices at once. It gives, for each vertex `v`, the distance `d(v)` to the closest marked vertex and that vertex, its **origin**.
3. On a shortest path between two marked vertices, the origin changes at least once, on an edge `u – v`. Examine `d(u) + L + d(v)` for each edge whose endpoints have different origins.

## Solution
Run **a single** Dijkstra, putting all marked vertices in the heap with distance 0: it is like adding a fictitious source joined to each of them by an edge of length 0. This gives `d(v)`, the distance from `v` to the closest marked vertex, and `origin(v)`, a marked vertex at that distance (the one we came from at the last improvement). Then, for each edge `u – v` of length `L` such that `origin(u) ≠ origin(v)`, propose `d(u) + L + d(v)`; the answer is the minimum of these proposals.

**Why it is correct.** *Each proposal is a real distance, or more.* Going from `origin(u)` to `u`, then to `v`, then to `origin(v)` gives a path of length `d(u) + L + d(v)` between two different marked vertices: the proposal is at least the answer. *The answer is proposed.* Let `s` and `t` be two marked vertices at minimum distance, and `P` a shortest path from `s` to `t`. Since lengths are positive, `origin(s) = s` and `origin(t) = t`. So the origin changes at least once along `P`, on an edge `u – v`. Now `d(u)` is at most the length of `P` from `s` to `u`, and `d(v)` at most that from `v` to `t`: the proposal of this edge is at most the length of `P`.

**Complexity.** One Dijkstra and one pass over the edges: O((N + M) log M). One Dijkstra per marked vertex would cost `K` times more: up to 5,000 times.

**Pitfalls.** Comparing only `d(u) + d(v)` between neighbouring marked vertices is not enough: the best path may go through unmarked vertices, for example a detour of length 40 between two marked vertices directly joined by an edge of length 100. A loop `u – u` has two endpoints with the same origin: it proposes nothing. The answer exceeds 2³¹: `long long` in C++.
