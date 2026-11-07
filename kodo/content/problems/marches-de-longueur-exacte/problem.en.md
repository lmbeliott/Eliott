---
title: Walks of exact length
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. A **walk** of length `K` is a sequence of vertices `v₀, v₁, …, v_K` in which two consecutive vertices are always linked by an edge. A walk may go through the same vertex or the same edge as many times as it wants. A walk of length `0` contains only its starting vertex.

Write a program that answers `Q` questions. Each question gives a vertex `V` and an integer `K`, and asks whether there is a walk of length **exactly** `K` that starts at vertex `1` and ends at vertex `V`.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge links vertices `A` and `B`.
- The next line contains an integer `Q`.
- Each of the next `Q` lines contains two integers `V` and `K`.

Two vertices may be linked by several edges.

## Output
`Q` lines: for each question, in order, `OUI` if there is a walk of length exactly `K` from vertex `1` to vertex `V`, `NON` otherwise.

## Constraints
- 1 ≤ N ≤ 5,000
- 0 ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N and A ≠ B
- 1 ≤ Q ≤ 5,000
- 1 ≤ V ≤ N
- 0 ≤ K ≤ 10⁹

## Hints
1. Moving step by step for `K` steps is impossible for `K = 10⁹`. If you have a walk of length `d` from `1` to `V`, how can you get a walk of length `d + 2` that also ends at `V`?
2. Going back and forth along the last edge makes the walk `2` longer. So it is enough to know, for each vertex, the smallest **even** length and the smallest **odd** length of a walk that reaches it from `1`.
3. Run a breadth-first search on the **states** (vertex, parity of the length): from state `(u, p)`, each edge `u – v` leads to state `(v, 1 − p)`. Watch out for the case where vertex `1` has no edge.

## Solution
**Making a walk longer.** If a walk of length `d ≥ 1` goes from `1` to `V`, its last edge links some vertex `u` to `V`. By appending `u` then `V`, we get a walk of length `d + 2` that still ends at `V`. Repeating this gives all lengths `d + 2`, `d + 4`, … So, if `even[V]` and `odd[V]` are the smallest even and odd lengths of a walk from `1` to `V`, there is a walk of length `K` if and only if the smallest length with the same parity as `K` exists and is at most `K`.

**Computing the two smallest lengths.** We build a graph of **states**: state `(v, p)` means "being at `v` after a walk whose length has parity `p`". Each edge `u – v` of the graph links `(u, 0)` to `(v, 1)` and `(u, 1)` to `(v, 0)`. A walk of length `d` from `1` to `V` corresponds exactly to a path of `d` steps from `(1, 0)` to `(V, d mod 2)`. A breadth-first search from `(1, 0)` therefore gives `even[V]` and `odd[V]` for all vertices at once. There are `2N` states and `4M` transitions.

**When the start is isolated.** Making a walk longer uses its last edge: it does not work for the walk of length `0`, which has no edge. If vertex `1` has at least one edge, we go back and forth along it. If it has none, the only possible walk is the one of length `0`, and the answer is `OUI` only for `V = 1` and `K = 0`.

In the second example, the triangle `1 – 2 – 3` lets you come back to `1` in `3` steps: `odd[1] = 3`, so `(1, 1)` gives `NON` and `(1, 3)` gives `OUI`. For vertex `4`, `even[4] = 2` (through `1 – 3 – 4`) and `odd[4] = 3` (through `1 – 2 – 3 – 4`). In the first example, the graph can be colored with two colors (`1`, `3` and `5` on one side, `2` and `4` on the other): each step changes color, so every walk from `1` to `5` has even length, and `odd[5]` does not exist.

**Complexity.** One breadth-first search on `2N` states, then `O(1)` per question: **O(N + M + Q)**.

**Why the naive solution is too slow.** Computing the set of vertices reached after `1`, `2`, …, `K` steps costs `K × (N + M)`: impossible for `K = 10⁹`. Running a new search for each question costs `Q × (N + M)`, around 10⁸ operations.

**Pitfalls.**
- The usual distance is not enough: in the second example, the distance from `1` to `1` is `0`, but there is a walk of length `3`. The parity of `K − distance` is not enough either: in the first example, `5` is at distance `2` but is reached by no walk of odd length.
- A walk of length `0` always exists from `1` to `1`, even if vertex `1` is isolated; but then no longer walk exists (third example).
