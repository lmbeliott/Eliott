---
title: Integers with exactly three divisors
---

## Statement
Some integers have exactly three divisors: for example 4 (divisors 1, 2 and 4) and 25 (divisors 1, 5 and 25), but not 6 or 16.

Answer Q questions: how many integers n with L ≤ n ≤ R have exactly three divisors?

## Input
The first line contains Q. Each of the next Q lines contains two integers L and R.

## Output
Q lines: for each question, the number of integers of [L, R] with exactly three divisors.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ L ≤ R ≤ 10¹²

## Hints
1. With the formula for the number of divisors, (e₁ + 1) × … × (e_k + 1) = 3: what does the factorization of such a number look like?
2. They are exactly the squares of primes. n = p² is in [L, R] if and only if p is between ⌈√L⌉ and ⌊√R⌋.
3. A sieve of Eratosthenes up to 10⁶, then an array giving for each x the number of primes at most x.

## Solution
**Finding the property.** If n = p₁^e₁ × … × p_k^e_k, its number of divisors is (e₁ + 1) × … × (e_k + 1). This product is 3, which is prime, if and only if there is a single factor, equal to 3: k = 1 and e₁ = 2. The integers with exactly three divisors are therefore the squares of primes, p², with divisors 1, p and p².

**Counting.** p² is in [L, R] if and only if L ≤ p² ≤ R, that is p ≤ ⌊√R⌋ and p > ⌊√(L − 1)⌋. The answer is π(⌊√R⌋) − π(⌊√(L − 1)⌋), where π(x) is the number of primes at most x. Integer square roots are computed without floating point, by binary search (previous chapter): a float can be off by one near 10¹², and the tests contain squares of primes at the bounds.

**The sieve.** Since √R ≤ 10⁶, compute once the primes up to 10⁶ with the sieve of Eratosthenes, then π(x) for every x ≤ 10⁶ by prefix sums. Each question then costs two integer roots and two array reads.

**Cost.** O(M log log M) for the sieve, with M = 10⁶, plus O(log R) per question. Testing every integer of [L, R] would be impossible.
