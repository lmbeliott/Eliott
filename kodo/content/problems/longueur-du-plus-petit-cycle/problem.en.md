---
title: Length of the shortest cycle
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges, with no loop and no multiple edge. A **cycle** of length `k ≥ 3` is a sequence of `k` distinct vertices `v₁, v₂, …, v_k` such that each vertex is joined to the next one and `v_k` is joined to `v₁`.

Compute the length of the shortest cycle of the graph (called its **girth**), or print `-1` if the graph has no cycle.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge joins vertices `A` and `B`. No two edges join the same two vertices.

## Output
A single integer: the length of the shortest cycle, or `-1`.

## Constraints
- 1 ≤ N ≤ 400
- 0 ≤ M ≤ 1,000
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. Listing all cycles is out of the question: there can be exponentially many. However, a breadth-first search from **every** vertex is affordable.
2. During a breadth-first search from `s`, an edge `u–v` that is not part of the search tree closes a cycle of length at most `dist[u] + dist[v] + 1`.
3. If `s` lies on a shortest cycle, of length `g`, at least one edge of that cycle is not in the search tree. What is `dist[u] + dist[v] + 1` for that edge?

## Solution
For each vertex `s`, run a breadth-first search from `s`, recording the `parent` of each vertex (the one that discovered it). When an edge `u–v` is examined with `v` already discovered and `v ≠ parent[u]`, the edge is not in the search tree, and the value `dist[u] + dist[v] + 1` is recorded. The answer is the smallest recorded value, over all `s`.

**Every recorded value is at least the girth `g`.** The tree paths from `s` to `u` and from `s` to `v` share a common part, from `s` to a last common vertex `w`. The two pieces `w → u` and `w → v`, plus the edge `u–v` (which lies in neither), form a genuine cycle, of length at most `dist[u] + dist[v] + 1`.

**The value `g` is reached.** Let `C` be a shortest cycle, and `s` one of its vertices. The search tree from `s` has no cycle, so some edge `u–v` of `C` is not in the tree. On `C` without the edge `u–v`, what remains is a path from `u` to `v` through `s`: its part `s → u` and its part `s → v` have lengths adding up to `g − 1`. Since `dist` gives shortest distances, `dist[u] + dist[v] + 1 ≤ g`. This edge is indeed examined: when the first of its two vertices is dequeued, the other one is already discovered (otherwise the edge would be in the tree) and is not its parent.

**Complexity.** `N` breadth-first searches: O(N × (N + M)), about 10⁶ operations here.
