---
title: Maximum gap between K primes
---

## Statement
We want to choose `K` different primes between `A` and `B`, so that the smallest gap between two chosen numbers is as large as possible. Print this largest minimum gap, or `-1` if there are fewer than `K` primes between `A` and `B`.

For example, between 1 and 30, with `K = 4`, we can choose 2, 11, 19 and 29: the gaps are 9, 8 and 10, the smallest is 8, and we cannot do better.

## Input
One line: three integers `A`, `B` and `K`.

## Output
A single integer: the largest possible minimum gap, or `-1`.

## Constraints
- 1 ≤ A ≤ B ≤ 1,000,000
- 2 ≤ K ≤ 100,000

## Hints
1. The sieve of Eratosthenes gives the list of primes between `A` and `B`.
2. A simpler question: can we choose `K` primes with gaps **all at least** `D`? If yes for `D`, then also for any smaller `D`: the largest `D` can be found by binary search.
3. For a fixed `D`, a greedy choice is enough: take the smallest prime, then each time the smallest one at distance at least `D` from the last one taken.

## Solution
Compute the primes between `A` and `B` with a **sieve**: O(B log log B). If there are fewer than `K`, the answer is `-1`.

**Test for a gap `D`.** Take the smallest prime, then, as long as more are needed, the smallest prime at least equal to the last one taken plus `D` (a binary search in the sorted list finds it). `D` is possible if we reach `K` numbers. *Why the greedy choice is enough* (exchange argument): let `c₁ < c₂ < … < c_K` be any valid choice and `g₁, g₂, …` the greedy choices. By induction, `g_i ≤ c_i`: true for `i = 1`, and if `g_i ≤ c_i`, then `c_(i+1) ≥ c_i + D ≥ g_i + D`, so `c_(i+1)` was a candidate for the greedy algorithm, which took the smallest: `g_(i+1) ≤ c_(i+1)`. So the greedy algorithm does not stop before `K`.

**Binary search on the answer.** If a choice has all its gaps at least `D`, they are also at least `D − 1`: the property is monotone. Look for the largest possible `D` between `1` (always possible when there are `K` primes) and `B − A`.

**Complexity.** The sieve, then about 20 binary-search steps, each with at most `K` searches in O(log P), where `P` is the number of primes (78,498 up to 10⁶). Trying every value of `D` one by one with a greedy pass over the list would cost up to 10⁶ × 78,498 operations.

**Pitfalls.** `1` is not prime. Take the middle upwards (`(low + high + 1) / 2`) when keeping `low = middle` on success, otherwise the loop never stops. If `A = B`, there are no two different numbers: `-1`.
