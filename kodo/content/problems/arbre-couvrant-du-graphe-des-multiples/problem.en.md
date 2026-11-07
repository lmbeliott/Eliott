---
title: Spanning tree of the multiples graph
---

## Statement
The vertices of a graph are the integers from `1` to `N`. For every integer `a` and every integer `k ≥ 2` such that `k × a ≤ N`, an edge of weight `k` joins `a` and `k × a`.

Print the weight of a minimum spanning tree of this graph.

For example, for `N = 6`, we can keep `1 – 2`, `2 – 4` and `3 – 6` (weight 2), `1 – 3` (weight 3) and `1 – 5` (weight 5): the total weight is 14.

## Input
One line: the integer `N`.

## Output
A single integer: the minimum weight of a spanning tree.

## Constraints
- 1 ≤ N ≤ 10,000,000

## Hints
1. The graph has about `N ln N` edges, 160 million for `N = 10⁷`: Kruskal on all edges is too slow. Computing the answer by hand or with Kruskal for small `N` helps to guess a formula.
2. An edge with a composite weight `k = u × v` (with `u, v ≥ 2`) is the heaviest of a cycle: `a → u a → u v a`. Only prime weights matter.
3. Each integer `r ≥ 2` can be joined to `r / p`, where `p` is its smallest prime factor, by an edge of weight `p`. This tree is minimal: the answer is the sum of the smallest prime factors of `2, 3, …, N`, which a sieve computes.

## Solution
**A candidate.** For each `r` from `2` to `N`, let `spf(r)` be its smallest prime factor, and join `r` to `r / spf(r)` by the edge of weight `spf(r)`. Each `r ≥ 2` is joined to a smaller integer: following these edges leads down to `1`. So these `N − 1` edges form a spanning tree, of weight `spf(2) + spf(3) + … + spf(N)`.

**It is minimal.** For an integer `t ≥ 2`, let `c(t)` be the number of components of the graph restricted to edges of weight `< t`. Every spanning tree must connect these `c(t)` components, so it contains at least `c(t) − 1` edges of weight `≥ t`. Now the weight of a tree is the sum, over `t = 1, 2, 3, …`, of the number of its edges of weight at least `t` (an edge of weight `w` is counted `w` times). So it is enough to show that our tree has **exactly** `c(t) − 1` edges of weight `≥ t` for each `t`.

Write `r = s × u`, where `s` only has prime factors `< t` and `u` only prime factors `≥ t`. An edge of weight `k < t` joins `a` and `k a`, which have the same part `u` since `k` only has factors `< t`. Conversely, `r` is connected to `u` by dividing by the prime factors of `s` one by one (edges of weight `< t`). So the components correspond to the possible values of `u`: `c(t)` is the number of integers `u ≤ N` whose prime factors are all `≥ t` (including `u = 1`). The edges of our tree with weight `≥ t` are those of the `r ≥ 2` with `spf(r) ≥ t`, that is, the `r ≥ 2` whose prime factors are all `≥ t`: there are exactly `c(t) − 1` of them.

**Computation.** A sieve goes through the primes `p` in increasing order; the multiples of `p` not yet marked are exactly the `r` with `spf(r) = p`: add `p` for each, then mark them. In Python, counting and marking a whole slice of a `bytearray` (`marque[p::p].count(0)`, then a slice assignment) does this work without an explicit loop; beyond `√N`, unmarked numbers are prime and are their own smallest factor.

**Complexity.** O(N log log N). The result exceeds 3 × 10¹² for `N = 10⁷`: `long long` in C++.

**Pitfalls.** For `N = 1`, the tree is empty: `0`. Kruskal on all edges, even restricted to prime weights, needs tens of millions of Union-Find operations: far too many in Python.
