---
title: Smallest number with K divisors
---

## Statement
For each of the `T` given integers `K`, print the smallest positive integer that has exactly `K` divisors.

For example, 12 has six divisors (1, 2, 3, 4, 6, 12) and no smaller integer has exactly six.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains an integer `K`.

## Output
`T` lines: for each `K`, the smallest integer with exactly `K` divisors.

## Constraints
- 1 ≤ T ≤ 3,000
- 1 ≤ K ≤ 10⁶
- each answer is guaranteed to be at most 10¹⁸

## Hints
1. If `n = p₁^e₁ × p₂^e₂ × … × p_r^e_r`, its number of divisors is `(e₁ + 1)(e₂ + 1)…(e_r + 1)`.
2. For the smallest answer, the primes used are the first ones: 2, 3, 5, 7…, and the exponents are decreasing. Swapping two exponents shows it.
3. Explore the exponents of 2, then of 3, then of 5… with backtracking: each exponent `e` must be at most the previous one, `e + 1` must divide what remains of `K`, and give up as soon as the number built exceeds the best known answer.

## Solution
**Number of divisors.** A divisor of `n = p₁^e₁ × … × p_r^e_r` is written `p₁^f₁ × … × p_r^f_r` with `0 ≤ f_i ≤ e_i`: there are `(e₁ + 1) × … × (e_r + 1)` of them.

**Shape of the answer.** Let `n` be the smallest answer. *Its primes are the smallest*: if `n` uses a prime `q` but not a prime `p < q`, replacing `q` with `p` keeps the exponents, hence the number of divisors, and decreases `n`. *Its exponents decrease*: if `p < q` with an exponent of `p` smaller than that of `q`, swapping both exponents keeps the number of divisors and decreases `n` (it is multiplied by `(p/q)^(difference)`, less than 1). So `n = 2^e₁ × 3^e₂ × 5^e₃ × …` with `e₁ ≥ e₂ ≥ e₃ ≥ …`. Since the product of the first 16 primes exceeds 10¹⁸, at most 15 primes are used: 2, 3, …, 47.

**Exploration.** **Backtracking** chooses the exponent of 2, then that of 3, and so on. Keep `reste`, the part of `K` still to be obtained: an exponent `e` is possible only if `e + 1` divides `reste`, and it does not exceed the previous exponent. When `reste = 1`, the number built has exactly `K` divisors. **Pruning**: as soon as the number built reaches the best answer found, increasing the exponent or going on can only make it larger, so this branch stops.

**Complexity.** Branches are few: decreasing exponents, whose `e + 1` divide `K`, with a product at most 10¹⁸. In practice a few hundred nodes per question. Trying integers one by one is impossible: the answer often exceeds 10¹⁷.

**Pitfalls.** In C++, test `valeur > (meilleur − 1) / p` **before** multiplying, otherwise the product overflows. `K = 1` gives `1`. When `K` is prime, the only possible shape is `2^(K − 1)`.
