---
title: Change of a balance between two days
---

## Statement
An account records one movement per day for `N` days: on day `i`, the balance changes by `Mᵢ` euros (positive for a deposit, negative for a withdrawal). Answer `Q` questions: for two days `L ≤ R`, by how much did the balance change in total from day `L` to day `R` included? In other words, what is `M_L + … + M_R`?

## Input
The first line contains `N` and `Q`. The second line contains `M₁, …, M_N`. Each of the next `Q` lines contains two integers `L` and `R`.

## Output
`Q` lines: the answer to each question, in order.

## Constraints
- 1 ≤ N ≤ 50,000
- 1 ≤ Q ≤ 10,000
- -999 ≤ Mᵢ ≤ 999
- 1 ≤ L ≤ R ≤ N

## Hints
1. Adding the movements from `L` to `R` for each question costs up to N operations per question: up to 500 million in total.
2. Compute once and for all `P[i] = M₁ + … + Mᵢ`, with `P[0] = 0`.
3. The sum from `L` to `R` is the difference of two values of `P`.

## Solution
Compute the array of **prefix sums**: `P[0] = 0` and `P[i] = P[i − 1] + Mᵢ`, so that `P[i]` is the sum of the first `i` movements. For a question `(L, R)`, `P[R] = (M₁ + … + M_{L−1}) + (M_L + … + M_R) = P[L − 1] + (M_L + … + M_R)`, so the answer is `P[R] − P[L − 1]`.

**Cost.** N additions to build `P`, then one subtraction per question: about N + Q operations, instead of N × Q, up to 500 million, for the direct method. The trap is the index: with `P[0] = 0`, the answer is `P[R] − P[L − 1]`, and the case `L = 1` needs no special handling.
