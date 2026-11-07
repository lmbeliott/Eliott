---
title: Components of the GCD graph
---

## Statement
The vertices of a graph are the integers from `1` to `N`. For a threshold `T`, two different integers `a` and `b` are joined by an edge when `gcd(a, b) ≥ T`.

For each of the `Q` given thresholds, print the number of connected components of the graph.

For example, for `N = 10` and `T = 3`, the edges join 3, 6 and 9 (GCD 3), 4 and 8 (GCD 4), 5 and 10 (GCD 5); the components are `{3, 6, 9}`, `{4, 8}`, `{5, 10}`, `{1}`, `{2}` and `{7}`: there are 6 of them.

## Input
- The first line contains `N` and `Q`.
- The second line contains the `Q` thresholds `T₁ … T_Q`.

## Output
One line of `Q` integers: the number of components for each threshold, in order.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ Q ≤ 20,000
- 1 ≤ T_i ≤ N

## Hints
1. The graph can have billions of edges. If `gcd(a, b) = g ≥ T`, then `a` and `b` are both multiples of `g`: it is enough to join each `g ≥ T` to its multiples.
2. When the threshold decreases, edges are only added. Compute the answer for all thresholds at once, from `N` down to `1`.
3. At threshold `d`, join `d` to `2d`, `3d`, … with Union-Find, then record the number of components. The total number of joins is `N/1 + N/2 + … + N/N`, about `N ln N`.

## Solution
**Fewer edges, same components.** For a threshold `T`, let `H_T` be the graph joining each integer `d ≥ T` to its multiples `2d, 3d, …` up to `N`. Each edge of `H_T` is an edge of the graph of the statement, since `gcd(d, kd) = d ≥ T`. Conversely, if `gcd(a, b) = g ≥ T`, then `a` and `b` are multiples of `g`, so joined to `g` in `H_T` (or equal to `g`): the path `a – g – b` exists. So both graphs have the same components.

**All thresholds at once.** When `T` decreases by 1, `H_T` only gains the edges of `d = T`. So go through `d` from `N` down to `1` with a Union-Find: join `d` to each of its multiples, and record `reponse[d]`, the number of components at that moment. Each question is then read from this array. This is **connectivity evolving by additions**: the order of decreasing thresholds turns the problem into a sequence of unions.

**Complexity.** The number of unions is `N/1 + N/2 + … + N/N ≈ N ln N`, about 1.2 million for `N = 100,000`, each in nearly constant time. Recomputing the components for each question would cost `Q` times more.

**Pitfalls.** For `T = 1`, everything is joined (`gcd(a, b) ≥ 1` always): a single component. Vertex `1` has a neighbour only at threshold `1`. The order of the thresholds in the input is arbitrary, and a threshold may be asked several times.
