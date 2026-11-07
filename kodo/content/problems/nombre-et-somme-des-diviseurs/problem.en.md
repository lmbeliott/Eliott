---
title: Number and sum of divisors
---

## Statement
For an integer N ≥ 1, print its number of divisors and the sum of its divisors. For example, 12 has divisors 1, 2, 3, 4, 6 and 12: it has 6 of them, with sum 28.

Each test contains T questions.

## Input
The first line contains T. Each of the next T lines contains an integer N.

## Output
T lines: for each N, its number of divisors and the sum of its divisors, separated by a space.

## Constraints
- 1 ≤ T ≤ 4
- 1 ≤ N ≤ 10¹²

## Hints
1. Trying every possible divisor from 1 to N costs 10¹² operations. You must first factorize N into primes.
2. To factorize N, try the divisors d = 2, 3, 4, … while d × d ≤ N, dividing N by d as many times as possible. What remains at the end, if it is larger than 1, is prime.
3. If N = p₁^e₁ × … × p_k^e_k, the number of divisors is (e₁ + 1) × … × (e_k + 1), and their sum is the product of the (1 + pᵢ + pᵢ² + … + pᵢ^eᵢ).

## Solution
**Factorizing.** Try d = 2, 3, 4, … while d × d ≤ N (where N is the current value, divided along the way). When d divides N, divide it as many times as possible and record the exponent. A d dividing N at that moment is necessarily prime: its prime factors, smaller, have already been removed. At the end, if the rest N is larger than 1, it is prime: a composite number has a prime factor at most its square root, which would have been found. It is enough to test 2 and then the odd numbers.

**The formulas.** If N = p₁^e₁ × … × p_k^e_k, a divisor of N is written p₁^f₁ × … × p_k^f_k with 0 ≤ fᵢ ≤ eᵢ, and each choice of exponents gives a different divisor (uniqueness of the factorization). So there are (e₁ + 1) × … × (e_k + 1) divisors. Expanding the product of the sums (1 + pᵢ + … + pᵢ^eᵢ) gives each divisor exactly once: it is their sum.

**Cost.** At most √N ≈ 10⁶ divisions per question, half of them when testing only odd numbers. Listing the divisors from 1 to N would be impossible. The sum of divisors stays below 5 × 10¹²: `long long` in C++.
