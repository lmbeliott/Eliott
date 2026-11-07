---
title: Largest set without neighbours
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. A set of vertices is **neighbour-free** if no edge joins two of its vertices: for example, guests among whom no couple quarrels.

Compute the largest number of vertices of a neighbour-free set.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge joins vertices `A` and `B`. No two edges join the same two vertices.

## Output
A single integer: the size of the largest neighbour-free set.

## Constraints
- 1 ≤ N ≤ 50
- 0 ≤ M ≤ N(N − 1)/2

## Hints
1. Trying the `2^50` sets is out of the question. A backtracking search picks a vertex `v` and explores two branches: `v` is taken (its neighbours become forbidden), or `v` is discarded.
2. Encode the set of vertices still available as an integer of `N` bits. If the current size plus the number of available vertices does not exceed the best known result, the branch is useless.
3. If a vertex `v` has no available neighbours left, or if its available neighbours are all joined to each other, it can be taken without trying the other branch. Why?

## Solution
Encode the neighbours of each vertex as a **mask** of `N` bits, and the set of vertices still available as a mask `remaining`. The function `search(remaining, size)` explores the sets completing the set already chosen (of size `size`).

**Forced choice rule.** If the available neighbours of `v` are pairwise neighbours (in particular if `v` has 0 or 1 available neighbour), `v` can be taken. **Exchange** argument: a neighbour-free set contains at most one vertex among `v` and its available neighbours, since they are all joined to each other. If it contains one, `u`, replace `u` with `v`: the neighbours of `v` are all among those of `u` or `u` itself, so the set stays neighbour-free and keeps its size. If it contains none, `v` can be added. So there is always a best solution containing `v`: take it, remove its neighbours, and repeat while the rule applies.

**Cut.** If `size` plus the number of bits of `remaining` does not exceed the best result found, this branch cannot do better: abandon it.

**Branching.** Otherwise, choose the available vertex `v` of largest degree, and try: taking `v` (remove `v` and its neighbours), then discarding `v` (remove only `v`). Taking a vertex of large degree removes many vertices at once.

**Size of the tree.** When branching, `v` has at least 2 available neighbours (otherwise the forced choice rule applies): the first branch removes at least 3 vertices, the second at least 1. The number of leaves `T(n)` therefore satisfies `T(n) ≤ T(n − 1) + T(n − 3)`, which gives `T(n) ≤ 1.47ⁿ` approximately, instead of `2ⁿ`. In practice, with the cut, the tree has at most a few thousand nodes on the tests.

**Remark.** This problem, **maximum independent set**, is known to be hard in general: no polynomial algorithm is known. Techniques of this kind (reduction rules, cuts, branching) are those used in practice.
