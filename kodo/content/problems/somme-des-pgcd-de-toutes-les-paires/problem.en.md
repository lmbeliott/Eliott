---
title: Sum of the GCDs of all pairs
---

## Statement
There are N strictly positive integers a₁, …, a_N. Compute the sum of the GCDs of all pairs: the sum of gcd(aᵢ, aⱼ) over all pairs of positions i < j.

For example, with 4, 6, 9 and 12, the six pairs have GCDs 2, 1, 4, 3, 6 and 3: the sum is 19.

## Input
The first line contains N. The second line contains the N integers.

## Output
The sum of the GCDs of all pairs.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ aᵢ ≤ 100,000

## Hints
1. There are up to 2 × 10⁸ pairs: computing each GCD with Euclid's algorithm is far too slow. Instead, group the pairs by the value of their GCD: the answer is the sum of the d × E(d), where E(d) is the number of pairs whose GCD is exactly d.
2. Counting the pairs whose GCD is a **multiple** of d is easy: they are the pairs whose two elements are multiples of d. If there are c(d) such elements, this makes c(d)(c(d) − 1)/2 pairs. All the c(d) are computed with a frequency array, going through d, 2d, 3d…
3. The pairs whose GCD is a multiple of d have GCD d, or 2d, or 3d… So E(d) = c(d)(c(d) − 1)/2 − E(2d) − E(3d) − …: compute the E(d) from d = 100,000 down to d = 1.

## Solution
**Grouping by GCD.** Let M be the largest value, and E(d) the number of pairs i < j with gcd(aᵢ, aⱼ) = d. The answer is Σ d × E(d), for d from 1 to M.

**Counting multiples.** With a frequency array f (f[v] = number of positions with value v), the number of values that are multiples of d is c(d) = f[d] + f[2d] + f[3d] + … A pair has a GCD that is a multiple of d if and only if both its elements are multiples of d (d divides gcd(x, y) exactly when d divides x and y). So there are P(d) = c(d)(c(d) − 1)/2 such pairs.

**Inclusion-exclusion.** The pairs counted in P(d) have GCD d, 2d, 3d…, each exactly once: P(d) = E(d) + E(2d) + E(3d) + … Hence E(d) = P(d) − E(2d) − E(3d) − …, computed for decreasing d, from M down to 1: when E(d) is computed, the E(kd) with k ≥ 2 are already known. Correctness is proved by descending induction on d: for d > M/2, there is no term to subtract, and E(d) = P(d).

**Cost.** For each d, its multiples up to M are scanned twice, about 2 × M/d operations. The total is 2M × (1 + 1/2 + … + 1/M) ≈ 2M ln M, about 2.4 million operations for M = 10⁵: O(N + M log M) thanks to the harmonic series. The direct method computes N(N − 1)/2 ≈ 2 × 10⁸ GCDs, each in about ten steps: several seconds in C++, minutes in Python.

**Size of the result.** Up to 2 × 10⁸ pairs with GCD at most 10⁵: the sum can approach 2 × 10¹³, and c(d)² exceeds 2³¹: `long long` in C++.

**Going further.** The same scheme, counting multiples then removing the multiples of multiples, is used to count coprime pairs (E(1)), or pairs with a given GCD: it is a classic arithmetic tool in contests.
