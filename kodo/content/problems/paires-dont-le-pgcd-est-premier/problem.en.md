---
title: Pairs with a prime GCD
---

## Statement
You are given a list of N positive integers A₁, A₂, …, A_N. Several numbers of the list may be equal.

Write a program that counts the pairs of positions (i, j), with i < j, such that GCD(Aᵢ, Aⱼ) is a prime number.

## Input
- The first line contains an integer N.
- The second line contains N integers A₁, A₂, …, A_N.

## Output
A single integer: the number of pairs (i, j) with i < j and GCD(Aᵢ, Aⱼ) prime.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ Aᵢ ≤ 100,000

## Hints
1. Trying every pair costs N × (N − 1) / 2 GCD computations, that is 2 × 10⁸ for N = 20,000: too slow. Reason instead about the possible values of the GCD, which are at most 100,000.
2. For an integer d, count m(d), the number of values of the list that are multiples of d. The m(d) × (m(d) − 1) / 2 pairs made of two multiples of d are exactly the pairs whose GCD is a multiple of d.
3. Let E(d) be the number of pairs whose GCD is exactly d. Then E(d) = m(d) × (m(d) − 1) / 2 − E(2d) − E(3d) − …: compute the E(d) starting from the largest d, then add up E(p) for prime p.

## Solution
**Reasoning about the GCD rather than the pairs.** Let V be the largest value of the list. The GCD of a pair is an integer d between 1 and V. Let E(d) be the number of pairs whose GCD is **exactly** d: the answer is the sum of E(p) over primes p, and a sieve of Eratosthenes up to V gives the primes.

**Counting multiples.** Let m(d) be the number of positions i such that Aᵢ is a multiple of d. A pair has a GCD that is a multiple of d if and only if both its values are multiples of d: so there are m(d) × (m(d) − 1) / 2 such pairs. To get m(d), we count how many times each value appears, then add these counts for d, 2d, 3d… up to V.

**Removing GCDs that are too large.** Among the pairs of multiples of d, the GCD is d, or 2d, or 3d… So E(d) = m(d) × (m(d) − 1) / 2 − E(2d) − E(3d) − … We compute the E(d) for d going from V down to 1: when we handle d, all the E(kd) are already known.

In the first example (4, 6, 8, 12, 7): the multiples of 2 are 4, 6, 8 and 12, which gives 6 pairs. The multiples of 4 are 4, 8 and 12: 3 pairs, and none of them has a GCD that is a multiple of 8 or 12 (these numbers have only one multiple in the list), so E(4) = 3. The multiples of 6 are 6 and 12, so E(6) = 1. Hence E(2) = 6 − E(4) − E(6) = 6 − 3 − 1 = 2: these are the pairs (4, 6) and (6, 8). No pair has a GCD equal to 3, 5 or 7, and the answer is 2.

**Complexity.** For each d, we go through the multiples of d up to V: V / 1 + V / 2 + … + V / V ≈ V × ln V operations, about 1.2 million for V = 100,000, twice. With the sieve and the input, this is O(N + V log V).

**Why the naive solution is too slow.** Testing every pair takes 2 × 10⁸ GCD computations for N = 20,000: far too slow in Python, and borderline even in C++.

**Pitfalls.**
- Adding, for each prime p, the number of pairs of multiples of p does not work: a pair with GCD 4 would be counted for p = 2, and a pair with GCD 6 twice (for 2 and for 3). In the first example, you would get 7 instead of 2.
- A pair of two equal numbers counts: GCD(7, 7) = 7 is prime. Count positions, not distinct values.
- 1 is not prime: a pair with GCD 1 does not count.
- The answer can reach 2 × 10⁸; in C++, compute the products m × (m − 1) with `long long`.
