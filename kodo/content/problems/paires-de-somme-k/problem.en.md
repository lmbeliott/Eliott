---
title: Pairs with sum K
---

## Statement
A sequence of `N` integers `A₁, A₂, A₃…` and an integer `K` are given. Count the pairs of positions `(i, j)` with `i < j` such that `Aᵢ + Aⱼ = K`.

For example, with `K = 10` and the sequence `3 7 5 5 2 7 8`, there are 4 pairs: the `3` with each of the two `7`s, the two `5`s together, and the `2` with the `8`.

## Input
The first line contains `N` and `K`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the number of pairs.

## Constraints
- 1 ≤ N ≤ 30,000
- -10⁹ ≤ Aᵢ ≤ 10⁹
- -2 × 10⁹ ≤ K ≤ 2 × 10⁹

## Hints
1. Trying all pairs takes about N² / 2 = 450 million tests: far too many. You need a single pass.
2. When you read `x`, the values that form a pair with it are exactly those equal to `K - x`. How many times has `K - x` already appeared?
3. Keep a dictionary that maps each value to its number of occurrences among the values already read. Add `x` to the dictionary **after** counting its pairs.

## Solution
A pair `(i, j)` with `i < j` is counted when its second value `Aⱼ` is read. At that moment, you only need to know how many values already read are equal to `K - Aⱼ`: each of them forms a pair with `Aⱼ`.

So keep a dictionary `deja_vus` ("already seen") that maps each value to its number of occurrences among the values read before the current position. For each new value `x`:

1. add `deja_vus.get(K - x, 0)` to the number of pairs;
2. then increase `deja_vus[x]` by 1.

The order matters: if you added `x` first, a value `x` equal to `K - x` (that is, `x = K / 2`) would form a pair with itself. With the right order, `c` values equal to `K / 2` correctly give 0 + 1 + … + (c - 1) = c × (c - 1) / 2 pairs.

Each value takes two dictionary operations, whatever its size: about 60,000 operations instead of 450 million. The number of pairs can reach 30,000 × 29,999 / 2, about 4.5 × 10⁸, and `K - x` can reach 3 × 10⁹: in C++, use `long long`.
