---
title: Remove every cycle
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. A **cycle** is a path of at least one edge that comes back to its starting point without using the same edge twice. A loop (an edge from a vertex to itself) is therefore a cycle on its own, and two edges joining the same two vertices form a cycle.

Compute the smallest number of edges to remove so that the graph no longer contains any cycle.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two integers `A` and `B`: an edge joins vertices `A` and `B`.

## Output
A single integer: the minimum number of edges to remove.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. A connected graph with `s` vertices and no cycle (a tree) has exactly `s − 1` edges.
2. A graph with no cycle made of `c` connected components therefore has exactly `N − c` edges. What happens to the components when edges are removed?
3. The answer only depends on `N`, `M` and the number of connected components of the initial graph.

## Solution
Let `c` be the number of connected components of the graph. The answer is `M − (N − c) = M − N + c`.

**No better is possible.** Removing edges never merges two components: the resulting graph has `c' ≥ c` components. If it has no cycle left, each of its components is a tree, and a component with `s` vertices has `s − 1` edges; in total `N − c' ≤ N − c` edges remain. So at least `M − (N − c)` edges were removed.

**This value can be reached.** A search started from each unvisited vertex builds, in each component, the tree made of the edges through which each vertex was discovered. These trees have `N − c` edges, no cycle, and keep the same components. Remove all the other edges, that is `M − N + c`.

The program therefore counts the components with the loop of the lesson (depth-first search with a stack), then prints `M − N + c`. Loops and multiple edges are handled automatically: they never discover a new vertex.

**Complexity.** O(N + M).
