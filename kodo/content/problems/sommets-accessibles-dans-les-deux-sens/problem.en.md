---
title: Vertices reachable both ways
---

## Statement
You are given a **directed** graph with `N` vertices and `M` arcs: the arc `A B` lets you go from `A` to `B`, but not from `B` to `A`. A vertex `V` is **reachable** from `U` if there is a path from `U` to `V` that follows the arcs in their direction; every vertex is reachable from itself.

Compute three numbers:
- the number of vertices reachable from vertex `1`;
- the number of vertices from which vertex `1` is reachable;
- the number of vertices that satisfy both conditions at once.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of arcs.
- Each of the next `M` lines contains two integers `A` and `B`: an arc goes from vertex `A` to vertex `B`.

An arc may go from a vertex to itself, and the same arc may appear several times.

## Output
The three numbers on one line, separated by spaces, in the order of the statement.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. The first number comes from a single search from vertex `1`.
2. For the second one, running a search from every vertex is far too slow. How can you find in one go which vertices can reach `1`?
3. Reverse all the arcs: a path from `V` to `1` in the graph becomes a path from `1` to `V` in the reversed graph.

## Solution
A breadth-first search from `1`, following the arcs in their direction, marks the vertices reachable from `1`.

For the second number, build the **reversed graph**: for each arc `A → B`, add the arc `B → A`. A path `V → … → 1` of the original graph, read backwards, is a path `1 → … → V` of the reversed graph, and conversely. The vertices that can reach `1` are therefore exactly those that a search from `1` reaches in the reversed graph.

The third number counts the vertices marked by both searches. It is at least `1`, because of vertex `1` itself.

**Complexity.** Two searches: O(N + M). Running a search from each of the `N` vertices to test whether it reaches `1` would cost O(N × (N + M)).

**Pitfall.** In a directed graph, the arc `A B` is added to the list of `A` only. Adding it to the list of `B` as well means working on another graph.
