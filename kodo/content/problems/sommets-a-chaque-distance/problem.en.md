---
title: Vertices at each distance
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. The **distance** from a vertex `V` to vertex `1` is the minimum number of edges of a path joining `1` to `V`; vertex `1` is at distance `0` from itself.

For each possible distance `k`, count the vertices at distance exactly `k` from vertex `1`, then count the vertices that no path joins to vertex `1`.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two integers `A` and `B`: an edge joins vertices `A` and `B`.

An edge may join a vertex to itself, and two vertices may be joined by several edges.

## Output
- On the first line, `D + 1` integers separated by spaces, where `D` is the largest distance of a vertex joined to vertex `1`: the number of vertices at distance `0`, then at distance `1`, …, then at distance `D`.
- On the second line, the number of vertices that no path joins to vertex `1`.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. A breadth-first search from vertex `1` computes the distance of every vertex.
2. Initialise every distance to `-1`: a vertex still at `-1` at the end is not joined to vertex `1`.
3. No number on the first line is zero: if some vertex is at distance `k`, the second-to-last vertex of a shortest path to it is at distance `k − 1`.

## Solution
Run a **breadth-first search** from vertex `1`, with an array `dist` initialised to `-1`. When a vertex `u` is dequeued, each neighbour `v` still at `-1` gets `dist[u] + 1` and enters the queue. The lesson shows that `dist[v]` is then exactly the length of a shortest path from `1` to `v`.

Then count the vertices of each distance in an array of size `D + 1`, and the vertices still at `-1`. Loops and multiple edges cause no trouble: an already marked neighbour is simply ignored.

**Complexity.** Each vertex enters the queue at most once, and each neighbour list is scanned once: O(N + M).

**Pitfalls.** Add each edge to both lists (the graph is undirected), and mark a vertex when it enters the queue, not when it leaves it, otherwise it may enter several times.
