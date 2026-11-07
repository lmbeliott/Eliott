---
title: Components after each addition
---

## Statement
A graph has `N` vertices and no edges at first. We add `M` edges, one after the other. After each addition, print the number of connected components of the graph and the number of vertices of the largest component.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains two integers `A` and `B`: the added edge joins `A` and `B` (`A = B` is possible, and an edge may be added several times).

## Output
`M` lines: after the `i`-th addition, the number of components and the size of the largest one, separated by a space.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N

## Hints
1. Recounting components with a traversal after each addition costs `M × (N + M)` operations: 10⁹ here.
2. An edge between two vertices of the same component changes nothing. Otherwise, it merges two components: the number of components drops by 1.
3. Union-Find with union by size: the size of the new component is the sum of both sizes, and the largest size can only increase.

## Solution
Maintain the components with a **Union-Find** structure: `parent` (each vertex points to another vertex of its component, the root points to itself) and `taille` (the number of vertices, up to date for roots). At first each vertex is alone: `N` components, the largest of size 1.

For each edge `A – B`, find the roots `a` and `b`. If `a = b`, both vertices were already in the same component: nothing changes. Otherwise hang the root of the smaller component under the root of the larger one (**union by size**), add the sizes, the number of components decreases by 1, and the largest size becomes `max(largest, new size)`: a merge only makes a component bigger, so this maximum never decreases.

**Why it is correct.** Invariant: after each addition, two vertices have the same root exactly when they are joined by a path. A new edge creates a path between two vertices only if it joins their two components, which it merges: this is what the union does.

**Complexity.** With union by size and path compression, each operation takes nearly constant time: O(N + M) in practice. A full traversal after each addition would cost `M × (N + M)`, about 10⁹ operations.

**Pitfalls.** An edge `A – A` or a repeated edge changes nothing. Without union by size, the additions `1 – 2`, `2 – 3`, `3 – 4`… can build a chain of 10,000 vertices: searches become slow, and a recursive search exceeds the allowed recursion depth in Python. Hence union by size, and a search written with loops.
