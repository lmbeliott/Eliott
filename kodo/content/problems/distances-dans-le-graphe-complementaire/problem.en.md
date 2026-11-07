---
title: Distances in the complement graph
---

## Statement
You are given an undirected graph `G` with `N` vertices and `M` edges. Its **complement graph** has the same vertices, and two distinct vertices are joined by an edge in it if and only if they are **not** joined in `G`.

For each vertex, compute its distance to vertex `1` in the complement graph, that is the minimum number of edges of a path of the complement going from vertex `1` to that vertex.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges of `G`.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge of `G` joins vertices `A` and `B`.

The same edge may appear several times.

## Output
One line of `N` integers separated by spaces: for `V` from `1` to `N`, the distance from vertex `1` to vertex `V` in the complement graph, or `-1` if no path of the complement joins them.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. The complement graph may have nearly 5 × 10⁹ edges: building its neighbour lists is impossible.
2. Run a breadth-first search without building the complement. Keep the list of vertices **not yet discovered**: when `u` is dequeued, those in that list that are not neighbours of `u` in `G` are discovered.
3. A vertex of the list that is not discovered while examining `u` is a neighbour of `u` in `G`. How many times can that happen in total?

## Solution
Run a breadth-first search in the complement **without building it**. Keep the list `remaining` of vertices not yet discovered. When a vertex `u` is dequeued:
- mark its neighbours in `G`;
- scan `remaining`: an unmarked vertex is a neighbour of `u` in the complement, it gets distance `dist[u] + 1` and enters the queue; a marked vertex stays in the list;
- clear the marks.

This is exactly the breadth-first search of the lesson, where among the neighbours of `u` in the complement, those not yet discovered are examined: the distances obtained are therefore correct.

**Complexity.** The work on `u` is proportional to its degree in `G` plus the length of `remaining`. Each vertex examined in `remaining` is either discovered, which happens once per vertex (at most `N` times in total), or kept, which only happens if it is a neighbour of `u` in `G` (at most `2M` times in total, once per edge endpoint). The total is O(N + M), whereas the complement has up to N(N − 1)/2 edges: building it would cost about 5 × 10⁹ operations.

This is an **amortised analysis** argument: a single pass over `remaining` can be long, but the sum of all passes is bounded.
