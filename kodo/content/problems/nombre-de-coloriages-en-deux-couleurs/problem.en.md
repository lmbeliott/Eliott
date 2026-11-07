---
title: Number of two-colourings
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. Each vertex must be painted white or black, so that the two endpoints of every edge have different colours.

Count the suitable colourings. Two colourings are different if at least one vertex does not have the same colour. Since this number can be very large, print its remainder modulo 1,000,000,007.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two integers `A` and `B`: an edge joins vertices `A` and `B`.

An edge may join a vertex to itself, and two vertices may be joined by several edges.

## Output
A single integer: the number of suitable colourings, modulo 1,000,000,007.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. In a connected component, once the colour of one vertex is chosen, the colour of every other vertex is forced.
2. Each connected component therefore has either exactly 2 colourings, or none.
3. If every component can be coloured, the answer is 2 to the power of the number of components. A loop makes any colouring impossible.

## Solution
In a connected component, choose the colour of a vertex `s`. For each vertex `v` of the component, a path `s → … → v` forces the colours along the path: they alternate, so the colour of `v` is forced. A component thus has at most 2 colourings (one per colour of `s`), and if it has one, swapping the two colours gives a second one: it has 0 or 2.

Components are coloured independently of each other. If one of them has no colouring, the answer is 0; otherwise, with `c` components, it is `2^c`.

For each component, a breadth-first search paints the start vertex white, then each discovered neighbour with the colour opposite to the dequeued vertex. If an already painted neighbour has the same colour as the dequeued vertex, the component cannot be coloured: the lesson shows that it then contains a cycle of odd length. A loop `A A` is detected the same way, since `A` has the same colour as itself. Along the way, the answer is multiplied by 2, modulo 1,000,000,007, for each new component.

**Complexity.** O(N + M). Trying the `2^N` colourings is impossible as soon as `N` exceeds 30.
