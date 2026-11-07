---
title: Connect K vertices at minimum cost
---

## Statement
You are given an undirected connected graph with `N` vertices and `M` edges. Edge `j` joins two vertices and costs `C[j]`. Among the vertices, `K` are **required**.

You must choose edges so that, using only the chosen edges, you can go from any required vertex to any other. The paths may go through vertices that are not required.

Write a program that prints the smallest total cost of the chosen edges.

## Input
- The first line contains the integers `N`, `M` and `K`.
- The second line contains the `K` (distinct) numbers of the required vertices.
- The next `M` lines each contain three integers `u`, `v` and `C`: an edge of cost `C` between vertices `u` and `v`.

The vertices are numbered from `1` to `N`. There is no edge from a vertex to itself, and no two edges between the same vertices.

## Output
A single integer: the smallest total cost.

## Constraints
- 1 ≤ N ≤ 1 000
- 0 ≤ M ≤ 3 000
- 1 ≤ K ≤ 7 and K ≤ N
- 1 ≤ C ≤ 1 000 000
- The graph is connected.

## Hints
1. An optimal solution is a tree. Take one of its vertices `v`: starting from `v`, the tree splits into pieces that meet at `v`, each connecting `v` to some of the required vertices. With `K ≤ 7`, a subset of the required vertices is encoded by a bitmask.
2. Let `f[S][v]` be the minimal cost of a set of edges that connects `v` to all required vertices of the mask `S`. There are two ways to get it: either two trees for subsets `A` and `S \ A` meet at `v` (`f[A][v] + f[S \ A][v]`), or `v` is joined by a path to a vertex `u` where such a meeting happens (`f[S][u] + distance`).
3. Handle the masks in increasing order. For each `S`, first compute all meetings at each `v`, then run a Dijkstra that starts from **all** vertices at once, with `f[S][v]` as the starting distance: it extends along paths. The answer is `f[all][v]` for a required vertex `v`.

## Solution
**Why this is not a shortest path.** A minimum spanning tree does not answer the question: it connects all vertices, required or not. Connecting the required vertices with shortest paths, pairwise or one by one, does not work either: the best solution often goes through "junction" vertices that no shortest path between two required vertices uses. In the first sample, vertex `4` is such a junction.

**The state.** The required vertices are numbered from `0` to `K - 1`. For a mask `S` and a vertex `v`, `f[S][v]` is the minimal cost of a set of edges that connects `v` and all required vertices of `S`. Initially, `f[{t}][t] = 0` for each required vertex `t`.

**The recurrence.** Take an optimal tree for `(S, v)` with `|S| ≥ 2`. Start from `v` and follow the tree as long as it forms a simple path without a required vertex. Stop at a vertex `u` that is either required or a branching point. In both cases, the tree splits at `u` into two trees that connect `u` to two non-empty parts `A` and `S \ A`. Hence:
- **meeting**: `f[S][u] = min f[A][u] + f[S \ A][u]` over the non-empty subsets `A` different from `S`;
- **extension**: `f[S][v] = min f[S][u] + dist(u, v)`.

The extension is exactly a **multi-source Dijkstra**: put each vertex `u` in the heap with the starting distance `f[S][u]` given by the meetings, and relax the edges as usual.

**The order.** The parts `A` and `S \ A` are masks smaller than `S`: handle the masks in increasing order. To see each split only once, require `A` to contain the lowest bit of `S`. Enumerate the submasks with `A = (A - 1) & S`.

Complexity: **O(3ᴷ × N + 2ᴷ × M log N)**. The meetings cost about 3⁷ / 2 ≈ 1 100 passes over the `N` vertices in total, and there are 127 Dijkstras.

Why simple ideas fail:
- Trying every set of intermediate vertices is exponential in `N`.
- The minimum spanning tree of the distances between required vertices, or greedily adding the required vertex closest to the tree built so far, give costs that are too large: in the first sample, `16` instead of `15`. The tests are built so that they fail.
- Computing all distances with Floyd-Warshall costs N³ = 10⁹ operations.

Traps:
- With `K = 1`, the answer is `0`.
- In C++, a meeting adds two costs that can each approach 10⁹, and the "infinite" value gets added too: use `long long`, and an "infinite" value whose double does not overflow (for example 2⁶⁰).
