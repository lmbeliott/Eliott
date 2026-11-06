---
title: Connected components
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. Two vertices are in the **same connected component** if you can go from one to the other by following edges, possibly through other vertices.

Write a program that computes the number of connected components of the graph and the number of vertices in the largest one.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two integers `A` and `B`: an edge links vertices `A` and `B`.

An edge may link a vertex to itself, and two vertices may be linked by several edges.

## Output
Two lines: the number of connected components, then the number of vertices in the largest component.

## Constraints
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Hints
1. Store the graph as **adjacency lists**: for each vertex, the list of its neighbours.
2. Starting from a vertex not yet visited, a traversal (depth-first or breadth-first) visits exactly its whole component. How many times do you start a new traversal?
3. Go through the vertices from `1` to `N`; each time you find one that hasn't been visited, it starts a new component: explore it while counting the vertices you visit. Watch the recursion depth if you write a recursive DFS.

## Solution
We build the adjacency lists, then go through the vertices from `1` to `N`. Each vertex not yet visited is the starting point of a **new component**: a depth-first traversal (with a stack) or a breadth-first traversal (with a queue) marks every vertex of this component, and we count how many it marked. The number of traversals started is the number of components; we keep the largest size.

Each vertex is marked only once and each edge is looked at twice (once from each end): the total complexity is **O(N + M)**.

A naive idea is to give each vertex a label, then repeat "for each edge, copy the smaller of the two labels onto the other end" until nothing changes. On a long chain of vertices, this takes up to `N` passes over the `M` edges, that is 10⁸ operations: far too slow in Python.

Traps:
- A **recursive** DFS on a chain of 10 000 vertices exceeds Python's recursion limit (1 000 by default). Use an explicit stack, or `sys.setrecursionlimit`.
- Mark a vertex as visited **when you add it** to the stack or the queue, otherwise it may be added several times.
- A vertex with no edge at all forms a component on its own.
