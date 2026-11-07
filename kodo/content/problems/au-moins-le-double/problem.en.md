---
title: At least double
---

## Statement
A sequence of N integers a₁, a₂, …, a_N is built by a formula, to keep the input short: a₁ = X, then a_{i+1} = (aᵢ × B + C) mod M for i ≥ 1.

Count the pairs of indices (i, j), with i < j, such that the larger of the two values aᵢ and aⱼ is **at least double** the smaller one.

For example, with N = 5, X = 2, B = 3, C = 5 and M = 7, the values are 2, 4, 3, 0, 5. Six pairs are valid: {2, 4}, {2, 0}, {2, 5}, {4, 0}, {3, 0} and {0, 5}, since every value is at least double 0. The pair {4, 5} is not valid, since 5 < 8.

## Input
A single line: the five integers N, X, B, C and M.

## Output
The number of pairs.

## Constraints
- 2 ≤ N ≤ 200,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Hints
1. The order of the values in the sequence does not matter: you can sort it.
2. In the sorted list b₀ ≤ b₁ ≤ …, for a fixed position i, the positions j > i that work are those where b_j ≥ 2 × b_i. They form a block at the end of the list: a binary search gives its start.
3. Beware of b_i = 0: the first index where b_j ≥ 0 is 0, which is not after i.

## Solution
**Sort.** The condition "the larger is at least double the smaller" does not depend on the order of the two values, so the answer does not change if we sort the sequence. In the sorted list b₀ ≤ b₁ ≤ … ≤ b_{N−1}, a pair of positions i < j is valid if and only if b_j ≥ 2 × b_i.

**One search per position.** For a fixed i, let p be the first index such that b_p ≥ 2 × b_i (`bisect_left(b, 2 * b[i])` in Python, `lower_bound` in C++). Since the list is sorted, the indices j with b_j ≥ 2 × b_i are exactly p, p + 1, …, N − 1. We also need j > i: the valid indices go from max(p, i + 1) to N − 1, that is N − max(p, i + 1) pairs. The max is not decoration: when b_i = 0, we have 2 × b_i = 0 and p = 0, which is before i.

**Cost.** Sorting costs O(N log N), then N binary searches in O(log N) each: O(N log N) overall, a few million operations. Comparing every pair would take N(N − 1)/2 ≈ 2 × 10¹⁰ comparisons for N = 200,000: far too many, even in C++. The answer can exceed 2³¹: use a `long long` in C++.
