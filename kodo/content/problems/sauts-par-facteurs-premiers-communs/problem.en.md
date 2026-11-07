---
title: Jumps through common prime factors
---

## Statement
A row of `N` cells, numbered from `1` to `N`, holds integers `A₁, …, A_N`. We start from cell `1` and want to reach cell `N`. Two moves are possible, in either direction:
- go from a cell to a neighbouring cell, at a cost `C`;
- jump from cell `i` to any cell `j` such that `A_i` and `A_j` have a common prime factor `p`; this jump costs `p`.

Print the minimum total cost.

For example, with `C = 10` and the numbers `4 15 49 10 35 21`, jump from `4` to `10` (factor 2, cost 2), from `10` to `15` (factor 5, cost 5), then from `15` to `21` (factor 3, cost 3): the total cost is 10.

## Input
- The first line contains `N` and `C`.
- The second line contains the `N` integers `A₁ … A_N`.

## Output
A single integer: the minimum cost to go from cell `1` to cell `N`.

## Constraints
- 2 ≤ N ≤ 15,000
- 1 ≤ C ≤ 10⁶
- 2 ≤ A_i ≤ 100,000

## Hints
1. Joining directly all pairs of cells that share a prime factor can give more than 10⁸ edges (think of numbers that are all even).
2. Add one vertex per prime `p`, a "hub": a cell whose number is a multiple of `p` enters it at a cost `p`, and leaves it for free towards any other cell that is a multiple of `p`.
3. The prime factors of each `A_i` are obtained quickly with a sieve that computes the smallest prime factor of every integer up to 100,000. Then Dijkstra, and beware of overflow.

## Solution
**Modelling.** The natural graph (an edge between two cells as soon as they share a prime factor) can have `N² / 2` edges. Instead, add one vertex per prime `p`, the **hub** of `p`. For each cell `i` and each prime factor `p` of `A_i`, create an arc `i → p` of cost `p` and an arc `p → i` of cost `0`. Keep the arcs `i ↔ i + 1` of cost `C`. A jump from `i` to `j` through the factor `p` corresponds exactly to the path `i → p → j`, of the same cost `p`; conversely, every passage through a hub `i → p → j` is an allowed jump, since `p` divides `A_i` and `A_j`. So the minimum costs are the same in both graphs. Run Dijkstra from cell `1`.

**Prime factors.** A sieve computes `spf[x]`, the smallest prime factor of each `x ≤ max(A)`: for each prime `i` with `i² ≤ max`, mark the multiples of `i` from `i²` on that have no factor yet. Then factorise `A_i` by dividing by `spf` as long as possible. A number at most 100,000 has at most 6 distinct prime factors (2 × 3 × 5 × 7 × 11 × 13 = 30,030, and × 17 exceeds 100,000).

**Complexity.** The sieve costs O(V log log V) with `V = max(A)`. The graph has at most `N + V` vertices and about `14 N` arcs: Dijkstra costs O((N + V + 14N) log N). The explicit graph would need up to 10⁸ edges.

**Pitfalls.** The hub must cost `p` on entry and `0` on exit (or the reverse), not `p` both ways, which would count each jump twice. Join a cell only to the **distinct** factors of its number. The cost can exceed 2³¹ (thousands of steps of cost 10⁶): `long long` in C++. A jump can also go backwards: the best route does not always move from left to right.
