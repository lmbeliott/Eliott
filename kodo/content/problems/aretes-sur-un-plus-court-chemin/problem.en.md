---
title: Edges on a shortest path
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges; each edge has a length. There may be several shortest paths from vertex `1` to vertex `N`.

Write a program that counts the edges that belong to **at least one** shortest path from vertex `1` to vertex `N`. If vertex `N` cannot be reached from vertex `1`, the answer is `0`.

## Input
- The first line contains two integers `N` and `M`: the number of vertices and the number of edges.
- Each of the next `M` lines contains three integers `A`, `B` and `T`: an edge of length `T` joins vertices `A` and `B`.

## Output
A single integer: the number of edges that belong to at least one shortest path from vertex `1` to vertex `N`.

## Constraints
- 1 ≤ N ≤ 5,000
- 0 ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N and A ≠ B; two vertices may be joined by several edges, which count separately
- 1 ≤ T ≤ 1,000

## Hints
1. A single run of Dijkstra from vertex `1` gives one shortest path, not all of them. Running one computation per edge is far too slow.
2. Run Dijkstra twice: once from vertex `1`, once from vertex `N`. You then know `d1[v]` and `dN[v]` for every vertex `v`.
3. An edge `A – B` of length `T` is on a shortest path if you can go from `1` to `A` along a shortest path, take the edge, then go from `B` to `N` along a shortest path, without exceeding the distance `d1[N]`. Don't forget the other direction.

## Solution
Compute with **Dijkstra** the distances `d1[v]` from vertex `1` and `dN[v]` from vertex `N` (the graph is undirected, so `dN[v]` is also the distance from `v` to `N`). Let `D = d1[N]`.

A path from `1` to `N` that uses the edge `A – B` in the direction `A → B` has length at least `d1[A] + T + dN[B]`, and this value is reached by gluing a shortest path from `1` to `A`, the edge, and a shortest path from `B` to `N`. So the edge is on a shortest path if and only if
`d1[A] + T + dN[B] = D` or `d1[B] + T + dN[A] = D`.

The glued path never visits the same vertex twice: otherwise it could be shortened, and its length would not be `D`. Testing each edge once is enough. If `N` cannot be reached, the answer is `0`.

Complexity: **O(M log M)** for the two runs of Dijkstra, plus O(M) for the test.

Why the other ideas fail:
- Following Dijkstra's shortest-path tree gives only **one** path: in the first example there are three, which use six edges in total.
- Keeping the edges that are "tight" from `1` (those where `d1[A] + T = d1[B]`) also counts edges that lead to vertices from which `N` cannot be reached along a shortest path.
- Running Dijkstra again for each edge costs O(M² log M): far too slow.

Pitfalls:
- An edge can be used in both directions: test both.
- Two parallel edges with the same minimal length both count (second example).
- With `N = 1`, the shortest path has no edge: the answer is `0`.
