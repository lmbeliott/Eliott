---
title: Sum of the gaps over all pairs
---

## Statement
A sequence of `N` integers `A₁, …, A_N` is given. Compute the sum of the gaps `|Aᵢ − Aⱼ|` over all pairs of positions `i < j`.

For example, for `4 1 3`, the gaps are `3`, `1` and `2`, and their sum is `6`.

## Input
The first line contains `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the sum of the gaps.

## Constraints
- 1 ≤ N ≤ 20,000
- 0 ≤ Aᵢ ≤ 10⁶

## Hints
1. There are N × (N − 1) / 2 pairs, that is 200 million: too many to examine one by one in Python.
2. The sum does not depend on the order of the values: you may sort them. Once sorted, `|Bᵢ − Bⱼ| = Bⱼ − Bᵢ` for `i < j`.
3. How many times is `Bⱼ` counted with a `+` sign? With a `−` sign?

## Solution
Swapping two elements of the sequence does not change the set of pairs, hence not the sum: sort the sequence, `B₀ ≤ B₁ ≤ … ≤ B_{N−1}` (numbered from 0). For `i < j`, the gap is then `Bⱼ − Bᵢ`, without absolute value.

Fix `j`. The pairs where `Bⱼ` is the larger value are those with `i = 0, 1, …, j − 1`. They contribute `(Bⱼ − B₀) + … + (Bⱼ − B_{j−1}) = j × Bⱼ − (B₀ + … + B_{j−1})`. So go through the sorted sequence keeping in a variable `deja` ("already") the sum of the values already seen, and add `j × Bⱼ − deja` to the total before adding `Bⱼ` to `deja`.

Grouping terms also gives a direct formula: `Bⱼ` is counted `j` times with a `+` sign and `N − 1 − j` times with a `−` sign, so the total is the sum of the `(2j − N + 1) × Bⱼ`.

**Cost.** One sort, then a single pass: a few tens of thousands of operations instead of 200 million. The total can reach 10⁶ × 2 × 10⁸ = 2 × 10¹⁴: in C++, `long long` is required, including for the product `j × Bⱼ`.
