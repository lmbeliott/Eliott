---
title: Colouring a graph with the fewest colours
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. Each vertex must get a colour so that the two endpoints of each edge have different colours: for example, scheduling exams in time slots, two exams sharing a candidate being unable to take place at the same time.

Compute the smallest number of colours needed (called the **chromatic number** of the graph).

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge joins vertices `A` and `B`. No two edges join the same two vertices.

## Output
A single integer: the minimum number of colours.

## Constraints
- 1 ≤ N ≤ 30
- 0 ≤ M ≤ N(N − 1)/2

## Hints
1. For `k` = 1, 2, 3…, ask whether `k` colours are enough, with a backtracking search that colours the vertices one by one, trying only the colours absent from the already coloured neighbours. The first `k` that works is the answer.
2. Colours are interchangeable: swapping red and blue in a colouring gives another, equally valid one. To avoid exploring the same colouring `k!` times, a vertex may only receive a colour already used or the **first** colour never used yet.
3. Colouring the vertices of largest degree first makes conflicts appear earlier.

## Solution
Test `k = 1, 2, 3, …` and stop at the first `k` for which a colouring exists. For a given `k`, the function `colour(i, used)` colours the `i`-th vertex of the list, knowing that colours `0` to `used − 1` have already been used. It tries each colour `c < min(k, used + 1)` that appears on no already coloured neighbour, calls itself on the next vertex, and undoes its choice on failure. It returns true as soon as a complete colouring is found: we look for **one** colouring, not all of them.

**Breaking the symmetry.** In a colouring, renaming the colours gives another colouring. The rule "a new colour is always the smallest never used" keeps only one representative of each family of colourings that differ by a renaming: the one where colours appear in the order 0, 1, 2… along the list of vertices. No colouring is lost, and the tree shrinks by a factor of up to `k!`. This matters most when the answer is "no": to prove that `k − 1` colours are not enough, the whole tree must be visited.

**Vertex order.** Vertices of large degree are the most constrained: colouring them first cuts doomed branches closer to the root.

**Correctness.** The backtracking search tries every possible colour for each vertex, up to symmetry: it finds a `k`-colouring if one exists. Since the values of `k` are tested in increasing order, the first success gives the minimum. Known cases come back: 1 colour if `M = 0`, 2 if the graph is bipartite with an edge, 3 for an odd cycle.

**Size of the tree.** It depends a lot on the graph. Hard cases are those where one must prove that some `k` is not enough without it being visible locally: the Mycielski graph with 23 vertices has no triangle but needs 5 colours, and proving that 4 are not enough visits a few tens of thousands of nodes.
