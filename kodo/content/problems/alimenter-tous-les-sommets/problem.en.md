---
title: Power every vertex
---

## Statement
There are `N` vertices, numbered from `1` to `N`, to be powered. Two means are available, and they can be combined:
- install a **source** on vertex `i`, at cost `P[i]`;
- build a **link** among `M` possible links: link `A B C` connects vertices `A` and `B` at cost `C`.

A vertex is **powered** if it has a source, or if it is connected by a sequence of built links to a vertex that has a source. Write a program that computes the minimum total cost so that every vertex is powered.

## Input
- The first line contains two integers `N` and `M`.
- The second line contains `N` integers `P[1] … P[N]`.
- Each of the next `M` lines contains three integers `A`, `B` and `C`: a possible link.

## Output
A single integer: the minimum total cost.

## Constraints
- 1 ≤ N ≤ 3 000
- 0 ≤ M ≤ 4 500
- 1 ≤ A, B ≤ N and A ≠ B; two vertices may have several possible links
- 1 ≤ P[i], C ≤ 10⁶

## Hints
1. If a single source were allowed, already installed, you would have to connect all the vertices at minimum cost: that is a **minimum spanning tree**, given by Kruskal's algorithm (sort the links, take each one if it connects two different groups of the union-find).
2. Add a dummy vertex `0`, "the power plant". Installing a source on `i` amounts to building a link `0 — i` of cost `P[i]`.
3. With this extra vertex, a choice is valid exactly when the `N + 1` vertices are connected. The answer is the weight of a minimum spanning tree of the graph with `N + 1` vertices.

## Solution
Add a **dummy vertex** `0`, and for each vertex `i` an edge `0 — i` of cost `P[i]`. A choice of sources and links powers everybody exactly when, in this new graph, every vertex is connected to vertex `0`, that is when the `N + 1` vertices are all connected to each other. So the minimum cost is that of a **minimum spanning tree** of this graph: an optimal solution never contains a cycle, since the most expensive edge of the cycle could be removed.

Apply **Kruskal's algorithm**: sort the `M + N` edges by increasing cost, then go through them while keeping the groups of already connected vertices in a **union-find**. An edge that connects two different groups is taken and merges them; an edge inside a group is ignored. Stop after `N` edges have been taken.

Why it is correct: at each step, the cheapest edge connecting two different groups can always be part of an optimal solution. If an optimal solution does not contain it, adding it creates a cycle that contains another edge between these two groups, at least as expensive: swap the two.

Complexity: **O((N + M) log(N + M))**, dominated by the sort.

Why the other ideas fail:
- Building the minimum spanning tree of the links, then installing a source on the cheapest vertex of each group, is wrong. On the first example it costs `2 + 4 + 7 + 3 = 16`, whereas it is better not to build the link of cost `7` and to install a second source of cost `5`: total `14`.
- Trying every possible set of sources costs 2ᴺ spanning trees.
- Kruskal without union-find, checking with a traversal whether two vertices are already connected, costs O(M × N): too slow in Python.

Pitfalls:
- The graph of links may be disconnected: each part needs at least one source, which the dummy vertex guarantees on its own.
- The total cost can exceed 2³¹: use `long long` in C++.
- A link may appear several times with different costs: Kruskal naturally keeps the cheapest one.
