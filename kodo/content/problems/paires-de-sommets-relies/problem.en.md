---
title: Pairs of joined vertices
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. Count the pairs of vertices `{U, V}`, with `U ≠ V`, such that a path joins `U` to `V`. The pair `{U, V}` and the pair `{V, U}` are the same pair.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two integers `A` and `B`: an edge joins vertices `A` and `B`.

An edge may join a vertex to itself, and two vertices may be joined by several edges.

## Output
A single integer: the number of pairs of vertices joined by a path.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. Running a search from every vertex costs O(N × (N + M)): far too slow for N = 100,000.
2. Two vertices are joined exactly when they lie in the same connected component.
3. A component with `s` vertices contains `s × (s − 1) / 2` pairs.

## Solution
Two vertices are joined by a path if and only if they lie in the same **connected component**. A component with `s` vertices therefore provides `s(s − 1)/2` pairs, and two vertices from different components never form a joined pair. The answer is the sum of `s(s − 1)/2` over all components.

The size of each component is computed with the loop of the lesson: for each vertex not yet visited, a depth-first search (with an explicit stack, since a component may be a long path) visits its whole component and counts its vertices.

**Complexity.** O(N + M): each vertex is visited once and each neighbour list scanned once. The naive approach, one search from each vertex, takes about N² = 10¹⁰ operations.

**Remark.** A connected component with `s` vertices contains at least `s − 1` edges (see the lesson). With `M ≤ 10,000`, a component therefore has at most 10,001 vertices, and the answer does not exceed 10,001 × 10,000 / 2 = 50,005,000.
