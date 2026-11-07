---
title: Route through required vertices
---

## Statement
An undirected graph has `N` vertices and `M` edges; each edge has a length. `K` vertices are **required**. Print the minimum length of a route that starts at vertex `1`, goes through all required vertices, in any order, and ends at vertex `N`, or `-1` if no such route exists.

A route may go through the same vertex or the same edge several times.

## Input
- The first line contains `N`, `M` and `K`.
- The second line contains the `K` required vertices, all different (it is empty if `K = 0`).
- Each of the next `M` lines contains three integers `A`, `B` and `L`: an edge of length `L` joins `A` and `B`.

## Output
A single integer: the minimum length, or `-1`.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ M ≤ 6,000
- 0 ≤ K ≤ 8
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁶

## Hints
1. Once the order of visit of the required vertices is fixed, the best route chains shortest paths between consecutive vertices of this order.
2. There are only `8! = 40,320` possible orders. But running Dijkstra for each order would be too long: which distances are really needed?
3. Only the distances from vertex `1` and from each required vertex are needed: `K + 1` runs of Dijkstra. Then each order is tested with `K + 1` additions.

## Solution
**Splitting the route.** Fix the order `s₁, s₂, …, s_K` in which the route first meets the required vertices. Between two consecutive stages, the route is free: the best choice is a shortest path. So the minimum length for this order is `d(1, s₁) + d(s₁, s₂) + … + d(s_K, N)`, and the answer is the minimum over all orders. A required vertex crossed "by chance" earlier does no harm: the corresponding order is also tried.

**The useful distances.** Run **Dijkstra** from vertex `1` and from each of the `K` required vertices. Since the graph is undirected, `d(s_K, N)` is read in the distance array from `s_K`.

**All orders.** Enumerate the `K!` permutations (with `itertools.permutations` in Python, `next_permutation` in C++, or backtracking), and for each add up `K + 1` distances. If one is infinite, the order is impossible.

**Complexity.** `(K + 1)` runs of Dijkstra in O((N + M) log N), plus `K! × (K + 1) ≈ 360,000` additions. Running Dijkstra again for each segment of each order would cost 40,320 × 9 runs.

**Pitfalls.** Vertex `1` or vertex `N` may be required: the formula remains correct (a zero distance). For `K = 0`, the answer is `d(1, N)`. Lengths add up beyond 2³¹: `long long`, and an "infinity" that does not overflow when nine terms are added: with 10¹⁸, the sum reaches 9 × 10¹⁸, just below the `long long` limit (about 9.2 × 10¹⁸); with one more term, each term would have to be tested before adding.
