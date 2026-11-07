---
title: Edges that can be added without an odd cycle
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges, with no loop and no multiple edge. You want to add **one** edge between two distinct vertices `U` and `V` that are not already joined by an edge.

Count the pairs `{U, V}` for which the resulting graph contains no cycle of odd length.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge joins vertices `A` and `B`. No two edges join the same two vertices.

## Output
A single integer: the number of suitable pairs `{U, V}`.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ M ≤ 10,000
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. A graph has no odd cycle if and only if its vertices can be coloured with two colours, the two endpoints of every edge having different colours. If the initial graph already has an odd cycle, the answer is `0`.
2. Colour each connected component. If `U` and `V` are in the same component, when does the edge `U–V` create an odd cycle? And if they are in two different components?
3. In a component with `x` white vertices and `y` black vertices, there are `x × y` pairs of different colours, some of which are already edges. The result can exceed 2³¹.

## Solution
Colour each connected component with a breadth-first search, as in the lesson. If a conflict appears, the graph already contains an odd cycle, which no addition removes: the answer is `0`.

Otherwise, each component `i` has `x_i` white vertices and `y_i` black vertices, and there are two cases for an unjoined pair `{U, V}`.
- **Same component.** If `U` and `V` have the same colour, a path from `U` to `V` has even length (colours alternate and come back to the same one), and the edge `U–V` closes an odd cycle. If they have different colours, the colouring stays valid: no odd cycle. The good pairs are the `x_i × y_i` pairs of different colours, minus those that are already edges. Every edge of the graph joins two vertices of different colours in the same component: so `M` must be subtracted in total.
- **Different components.** The two colours can be swapped in the component of `V`: the colouring stays valid for the graph, and `U`, `V` now have different colours; the addition creates no odd cycle. All these pairs are suitable: there are `N(N − 1)/2 − Σ s_i(s_i − 1)/2` of them, where `s_i = x_i + y_i` is the size of component `i`.

The answer is therefore `Σ x_i y_i − M + N(N − 1)/2 − Σ s_i(s_i − 1)/2`.

**Complexity.** One search of the whole graph: O(N + M). Trying each pair and redoing a colouring test would cost O(N² × (N + M)).

**Pitfall.** With `N = 100,000`, there are nearly 5 × 10⁹ pairs: `long long` is needed in C++.
