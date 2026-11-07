---
title: Divisors of a product
---

## Statement
We are given N integers a₁, …, a_N, and P denotes their product. Print the number of divisors of P and the sum of the divisors of P, each modulo 1,000,000,007.

For example, with 4, 6 and 5, P = 120 = 2³ × 3 × 5: it has 16 divisors, with sum 360.

## Input
The first line contains N. The second line contains the N integers.

## Output
Two integers on one line: the number of divisors of P and the sum of the divisors of P, modulo 1,000,000,007.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ aᵢ ≤ 10⁶

## Hints
1. P can have tens of thousands of digits: do not compute it. Its prime factorization is obtained by adding the exponents of those of the aᵢ.
2. To factorize 10,000 numbers at most 10⁶ quickly, compute once the smallest prime factor of every integer up to 10⁶, with a sieve.
3. The sum of divisors involves 1 + p + … + p^e = (p^(e+1) − 1) / (p − 1). Modulo a prime, dividing by p − 1 means multiplying by its inverse, given by Fermat's little theorem.

## Solution
**Factorizing without computing P.** If each aᵢ is factorized into primes, the exponent of a prime p in P is the sum of its exponents in the aᵢ. First compute, with a sieve, the smallest prime factor pf[x] of each x ≤ 10⁶: for each prime p, go through its multiples from p² on and record p in those that have no factor yet. Then, factorizing x amounts to dividing by pf[x] while x > 1: at most 20 divisions, since each division divides x by at least 2.

**The formulas.** If P = p₁^e₁ × … × p_k^e_k, its number of divisors is (e₁ + 1) × … × (e_k + 1), and the sum of its divisors is the product of the Sᵢ = 1 + pᵢ + … + pᵢ^eᵢ. Exponents reach 200,000: compute everything modulo M = 1,000,000,007, which is prime.

**Dividing modulo M.** Write Sᵢ = (pᵢ^(eᵢ+1) − 1) / (pᵢ − 1). Since M is prime and 1 ≤ pᵢ − 1 < M, Fermat's little theorem gives the inverse of pᵢ − 1: (pᵢ − 1)^(M−2). So Sᵢ mod M is (pᵢ^(eᵢ+1) − 1) × (pᵢ − 1)^(M−2) mod M, with two fast exponentiations. In C++, add M to pᵢ^(eᵢ+1) − 1 before taking the remainder, so as never to handle a negative remainder.

**Cost.** O(V log log V) for the sieve with V = 10⁶, then at most 20 divisions per number, then two fast exponentiations per prime of P. Computing P and then looking for its divisors would be hopeless.
