---
title: Smallest solution of a congruence
---

## Statement
We look for the integers x such that A × x and B have the same remainder when divided by M; we write A × x ≡ B (mod M). For example, 4 × x ≡ 2 (mod 6) has solutions 2 and 5 between 0 and 5, since 4 × 2 = 8 and 4 × 5 = 20 have remainder 2.

Answer T questions: for given A, B and M, print the smallest solution x between 0 and M − 1 and the number of solutions between 0 and M − 1, or `-1` if there is no solution.

## Input
The first line contains T. Each of the next T lines contains three integers A, B and M.

## Output
T lines: for each question, the smallest solution and the number of solutions in [0, M − 1], separated by a space, or `-1`.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ A, B < M

## Hints
1. Let g = GCD(A, M). If A × x ≡ B (mod M), then B = A × x − k × M is a multiple of g. If it is not, there is no solution.
2. Otherwise, divide everything by g: (A/g) × x ≡ B/g (mod M/g), and A/g is coprime with M/g, so it has an inverse modulo M/g, given by the extended Euclidean algorithm.
3. The solutions are x₀, x₀ + M/g, x₀ + 2M/g, …: there are g of them between 0 and M − 1.

## Solution
**Existence condition.** Let g = GCD(A, M). If A × x ≡ B (mod M), there is k such that B = A × x − k × M, and g divides A and M, hence divides B. If B is not a multiple of g, print `-1`.

**Reducing to an inverse.** Otherwise, let a = A/g, b = B/g and m = M/g. Then A × x ≡ B (mod M) is equivalent to a × x ≡ b (mod m): M divides A × x − B if and only if m divides a × x − b, dividing by g. Since GCD(a, m) = 1, the extended Euclidean algorithm gives u and v with a × u + m × v = 1: u is an **inverse** of a modulo m. The solutions are exactly the x ≡ u × b (mod m): if a × x ≡ b, multiply by u; conversely, a × (u × b) ≡ b.

**The answer.** The smallest solution is x₀ = (u × b) mod m, between 0 and m − 1. The solutions between 0 and M − 1 are x₀, x₀ + m, …, x₀ + (g − 1) × m: there are g of them. Special cases: for A = 0, g = M, and there are M solutions if B = 0 (and none otherwise); for M = 1, every x works and the answer is `0 1`.

**Traps.** Extended Euclid can return a negative u: in C++, `%` keeps the sign, and we add m to come back between 0 and m − 1. The product u × b reaches 10¹⁸: it fits in a `long long`, provided u is reduced modulo m first. **Cost**: O(log M) per question. Trying every x from 0 to M − 1 would cost up to 10⁹ operations per question.
