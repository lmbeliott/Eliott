---
title: Connect numbers sharing a factor
---

## Statement
There are `N` objects; object `i` holds the integer `A_i`. A link between two objects `i` and `j` can be built only if `A_i` and `A_j` have a common prime factor, and it then costs `A_i + A_j`.

Print the minimum total cost of a set of links that connects all objects together (directly or through other objects), or `-1` if it is impossible.

For example, with `6 10 15 35 4`, link `4 – 6` (10), `4 – 10` (14), `6 – 15` (21) and `10 – 35` (45): the total cost is 90.

## Input
- The first line contains `N`.
- The second line contains `A₁ … A_N`.

## Output
A single integer: the minimum cost, or `-1`.

## Constraints
- 1 ≤ N ≤ 25,000
- 2 ≤ A_i ≤ 100,000

## Hints
1. This is a minimum spanning tree, but the graph can have 300 million edges (if all numbers are even).
2. Fix a prime `p` and the objects whose number is a multiple of `p`. They can all be linked to each other. Among these links, which ones can be useful in a minimum tree?
3. If `m` is the object with the smallest number among the multiples of `p`, the link `x – y` costs at least as much as `m – x` and `m – y`: by the cycle property, it can be forgotten. At most 6 links per object remain, then Kruskal.

## Solution
**Grouping by prime factor.** Two objects can be linked if they share a prime factor `p`. For each prime `p`, the objects that are multiples of `p` form a **clique** (all pairwise linkable). Factorise each `A_i` with a smallest-prime-factor sieve; a number at most 100,000 has at most 6 distinct prime factors.

**One star is enough in each clique.** Let `m` be the object with the smallest number among the multiples of `p`. For two other multiples `x` and `y`, the cycle `x – m – y – x` contains `m – x` (cost `A_m + A_x ≤ A_y + A_x`) and `m – y` (cost `A_m + A_y ≤ A_x + A_y`): link `x – y` is the most expensive of this cycle (possibly tied). By the **cycle property**, it can be removed without increasing the minimum weight; since the links `m – x` are kept, all links `x – y` can be removed at once. What remains, for each `p`, is a **star** centred at `m`: at most 6 links per object in total. A link possible for several primes appears several times: this does no harm.

**Kruskal.** Sort these links by cost and apply Kruskal with a Union-Find. If fewer than `N − 1` links were kept, the graph is not connected: `-1`.

**Complexity.** Sieve in O(V log log V) with `V = 100,000`, then O(6N log N) for sorting and Kruskal. Testing all pairs would cost `N² / 2 ≈ 3 × 10⁸` GCD computations.

**Pitfalls.** The total cost exceeds 2³¹ (25,000 links at nearly 200,000): `long long` in C++. Equal numbers can be linked together (they share all their factors). For `N = 1`, the answer is `0`.
