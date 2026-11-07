---
title: Divisors of a binomial coefficient
---

## Statement
For two integers 0 ≤ K ≤ N, the binomial coefficient C(N, K) is the number of ways to choose K objects among N. It equals

C(N, K) = N! / (K! × (N − K)!)

where n! = 1 × 2 × … × n, and 0! = 1. For example, C(6, 2) = 720 / (2 × 24) = 15.

Write a program that computes the number of divisors of C(N, K). As this number can be huge, print its remainder in the division by 1,000,000,007.

## Input
A single line with two integers N and K.

## Output
A single integer: the number of divisors of C(N, K), modulo 1,000,000,007.

## Constraints
- 0 ≤ K ≤ N ≤ 1,000,000

## Hints
1. If n = p₁^e₁ × p₂^e₂ × … is the prime factorization of n, then n has exactly (e₁ + 1) × (e₂ + 1) × … divisors: a divisor picks, for each pᵢ, an exponent between 0 and eᵢ. So you only need the exponent of each prime in C(N, K).
2. The primes that divide C(N, K) are at most N: a sieve up to N gives all of them. The exponent of p in C(N, K) is the exponent of p in N!, minus those in K! and in (N − K)!.
3. In n!, each multiple of p brings one factor p, each multiple of p² brings one more, and so on: the exponent of p in n! is n // p + n // p² + n // p³ + …

## Solution
**Counting divisors from the exponents.** If n = p₁^e₁ × … × p_r^e_r, a divisor of n is p₁^f₁ × … × p_r^f_r with 0 ≤ fᵢ ≤ eᵢ, and each choice of exponents gives a different divisor: n has (e₁ + 1) × … × (e_r + 1) divisors. We do not need C(N, K) itself, only the exponent of each prime in its factorization.

**The exponent of p in n!.** Among 1, 2, …, n there are n // p multiples of p, each bringing at least one factor p; among them, n // p² are multiples of p² and bring one more factor; and so on. The exponent of p in n! is therefore `n // p + n // p² + n // p³ + …`, a sum that stops as soon as the power exceeds n. We compute it by dividing n by p while something is left.

**The exponent of p in C(N, K).** Since C(N, K) × K! × (N − K)! = N!, exponents add up: the exponent of p in C(N, K) is e = (exponent in N!) − (exponent in K!) − (exponent in (N − K)!). Every prime factor of C(N, K) divides N!, so it is at most N. We run a sieve of Eratosthenes up to N and, for each prime p, multiply the answer by e + 1, modulo 1,000,000,007. When p does not divide C(N, K), e = 0 and the factor is 1: no special case needed.

In the second example, C(10, 5) = 252. For p = 2: 10 // 2 + 10 // 4 + 10 // 8 = 8, and 5 // 2 + 5 // 4 = 3 for each of the two 5!, so e = 8 − 3 − 3 = 2. Likewise, e = 2 for p = 3, 0 for p = 5 and 1 for p = 7: 252 = 2² × 3² × 7 has (2 + 1) × (2 + 1) × (1 + 1) = 18 divisors.

**Complexity.** The sieve costs O(N log log N). There are 78,498 primes up to 10⁶, and each exponent takes O(log N) divisions: a few hundred thousand operations in total.

**Why the naive solution is too slow.** C(10⁶, 500,000) has more than 300,000 digits. Computing it is already heavy, and finding its prime factors by dividing it takes millions of divisions of this giant number.

**Pitfalls.**
- Reduce the answer modulo 1,000,000,007 as you go, but not the exponents: they are small exact integers that must not be reduced.
- The number of divisors of C(N, K) is not the number of divisors of N! divided by those of K! and (N − K)!: the exponents are subtracted, not the divisor counts.
- N = 0 or K = 0 gives C(N, K) = 1, which has a single divisor. Be careful with the sieve when N is 0 or 1.
