---
title: Largest GCD of increasing parts
---

## Statement
We want to write the integer `N` as a sum of `K` positive integers that are **all different**, `a₁ < a₂ < … < a_K`, so that their GCD is as large as possible. Print this largest GCD, or `-1` if no such decomposition exists.

For example, `24 = 4 + 8 + 12` has a GCD of 4, and no decomposition of 24 into three different parts does better.

## Input
One line: two integers `N` and `K`.

## Output
A single integer: the largest possible GCD, or `-1`.

## Constraints
- 1 ≤ N ≤ 10¹²
- 1 ≤ K ≤ 10⁹

## Hints
1. If all parts are multiples of `g`, then `g` divides `N`. So the answer is a divisor of `N`.
2. The parts are `a_i = g × b_i` with different positive `b_i`: the sum of the `b_i` is at least `1 + 2 + … + K`. Conversely, if `N / g` reaches this value, can the parts always be built?
3. Go through the divisors of `N` in pairs `(d, N / d)` with `d ≤ √N`, and keep the largest `g` such that `N / g ≥ K (K + 1) / 2`.

## Solution
Let `S = K (K + 1) / 2 = 1 + 2 + … + K`.

**Necessary condition.** If the parts have GCD `g`, write `a_i = g × b_i` with positive integers `b₁ < b₂ < … < b_K`. Then `g` divides `N`, and `N / g = b₁ + … + b_K ≥ 1 + 2 + … + K = S`, since `b_i ≥ i`.

**Sufficient condition.** If `g` divides `N` and `N / g ≥ S`, the parts `g, 2g, …, (K − 1) g` and `g × (N / g − (K − 1) K / 2)` work: the last one is at least `K g` (because `N / g ≥ S`), so they are strictly increasing, they add up to `N`, and their GCD is a multiple of `g`. A greedy construction: the first `K − 1` parts as small as possible, the rest in the last one.

So the answer is the largest divisor `g` of `N` such that `N / g ≥ S`, or `-1` if there is none (that is, if `S > N`). Enumerate the divisors by testing `d` from `1` to `√N`: each `d` dividing `N` gives the two divisors `d` and `N / d`.

**Complexity.** O(√N), one million divisions for `N = 10¹²`. Trying every `g` from `1` to `N` would be a million times longer.

**Pitfalls.** `S` exceeds 10¹⁷ for `K = 10⁹`, and the product `g × S` can exceed the capacity of a `long long`: compare `N / g` with `S` instead. For `K = 1`, the answer is `N`. Do not forget either of the two divisors `d` and `N / d`.
