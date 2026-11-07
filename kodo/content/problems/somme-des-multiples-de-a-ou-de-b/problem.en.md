---
title: Sum of the multiples of A or B
---

## Statement
Compute the sum of the integers from 1 to N that are multiples of A, or of B, or of both. For example, for N = 10, A = 3 and B = 5, these integers are 3, 5, 6, 9 and 10, with sum 33.

## Input
One line containing N, A and B.

## Output
The requested sum.

## Constraints
- 1 ≤ N ≤ 10⁹
- 1 ≤ A, B ≤ 10⁹

## Hints
1. A loop from 1 to N makes up to a billion iterations: too slow, even in C++. A formula is needed.
2. The multiples of A up to N are A, 2A, …, kA with k = ⌊N/A⌋. Their sum is A × (1 + 2 + … + k) = A × k(k + 1)/2.
3. When adding the sum of the multiples of A and that of the multiples of B, the common multiples are counted twice. The common multiples of A and B are exactly the multiples of their LCM.

## Solution
Let S(d) be the sum of the multiples of d between 1 and N. With k = ⌊N/d⌋, they are d, 2d, …, kd, so S(d) = d × k(k + 1)/2 (formula for the sum 1 + 2 + … + k).

An integer that is a multiple of A or of B is counted once in S(A) + S(B) if it is a multiple of only one of them, and twice if it is a multiple of both. So the sum of the common multiples is subtracted. An integer is a multiple of both A and B if and only if it is a multiple of their **LCM**, equal to A × B / gcd(A, B). The answer is S(A) + S(B) − S(lcm(A, B)). This is the **inclusion-exclusion** principle.

**Cost.** Computing the GCD with Euclid's algorithm takes a few dozen steps; everything else is constant. We go from a billion operations to fewer than a hundred: the complexity is O(log(min(A, B))) instead of O(N).

**Overflows in C++.** The answer can reach N(N + 1)/2 ≈ 5 × 10¹⁷: `long long` is needed. The LCM can be 10¹⁸: compute it as `A / gcd(A, B) * B`, dividing first. If it exceeds N, there is no common multiple and k = 0. Finally, compute `k * (k + 1) / 2` before multiplying by d: since d × k ≤ N, the product stays below 10¹⁸.
