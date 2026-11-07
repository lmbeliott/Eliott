---
title: Shortest path with vertex costs
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges; each edge has a length. Each vertex `i` also has a cost `P[i]`, which you pay when a path **passes through** this vertex: the starting vertex and the destination vertex cost nothing.

The **cost** of a path is the sum of the lengths of its edges and of the costs of its intermediate vertices. Write a program that computes the minimum cost of a path from vertex `1` to vertex `N`, or prints `-1` if there is no path.

## Input
- The first line contains two integers `N` and `M`: the number of vertices and the number of edges.
- The second line contains `N` integers `P[1] … P[N]`: the cost of each vertex.
- Each of the next `M` lines contains three integers `A`, `B` and `T`: an edge of length `T` links vertices `A` and `B`.

## Output
A single integer: the minimum cost of a path from vertex `1` to vertex `N`, or `-1` if there is no path.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ P[i] ≤ 1 000
- 1 ≤ A, B ≤ N and A ≠ B; two vertices may be linked by several edges
- 1 ≤ T ≤ 1 000

## Hints
1. Without the vertex costs, this is a shortest path in a graph with positive weights: Dijkstra's algorithm.
2. The costs belong to the vertices, not to the edges. Can you move them onto the edges? When you take an edge to **enter** a vertex, how much does it cost in total?
3. The cost to go from `u` to `v` is `T + P[v]`, unless `v` is the destination vertex (nothing to pay). Run Dijkstra from vertex `1` with these costs.

## Solution
We move the cost of each vertex onto the edges that **enter** it: taking the edge from `u` to `v` costs `T + P[v]`, except when `v = N`, where it costs only `T`. A path `1 → … → N` then costs exactly the sum of the lengths plus the costs of the intermediate vertices, since we enter each of them once. The start never pays its cost: we never "enter" it.

These costs are positive: **Dijkstra's algorithm** with a priority queue (a heap) gives the shortest path. We keep `dist[v]`, the best known cost to reach `v`. We take out of the heap the vertex with the smallest distance; its distance is then final, and we try to improve that of each of its neighbours. If a vertex comes out of the heap with a distance larger than `dist`, it is an outdated entry: we ignore it.

Complexity: **O((N + M) log M)**. A Dijkstra without a heap (which finds the minimum by scanning all the vertices) costs O(N²): about 25 million steps here, which still passes, but it quickly becomes too slow as `N` grows. The Bellman-Ford algorithm, in O(N × M), needs up to 40 million relaxations when the shortest path has thousands of edges: too slow in Python. A breadth-first search, on the other hand, is wrong: it minimises the number of edges, not the cost.

Traps:
- Vertex `N` costs nothing: on the first example, forgetting this adds `50`.
- If `N = 1`, the path is empty: the answer is `0`.
- When vertex `N` is never reached, print `-1`.
