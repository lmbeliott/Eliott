---
title: Segments with sum divisible by K
---

## Statement
A sequence of `N` integers `A₁, …, A_N`, positive or negative, and an integer `K ≥ 1` are given. Count the **segments** `Aₗ, …, Aᵣ` (with `l ≤ r`) whose sum is divisible by `K`. A zero sum is divisible by `K`.

For example, with `K = 3` and the sequence `1 2 3`, the segments `1 2`, `3` and `1 2 3` work: the answer is 3.

## Input
The first line contains `N` and `K`. The second line contains `A₁, …, A_N`, separated by spaces.

## Output
A single integer: the number of segments.

## Constraints
- 1 ≤ N ≤ 25,000
- 1 ≤ K ≤ 10⁹
- -999 ≤ Aᵢ ≤ 999

## Hints
1. There are N × (N + 1) / 2 segments, more than 300 million: too many to examine one by one.
2. With the prefix sums `P[0] = 0`, `P[i] = A₁ + … + Aᵢ`, the sum of segment `[l, r]` is `P[r] − P[l − 1]`. When is a difference divisible by `K`?
3. `P[r] − P[l − 1]` is divisible by `K` exactly when `P[r]` and `P[l − 1]` have the same remainder when divided by `K`. Count, for each remainder, how many prefixes already have it.

## Solution
With the prefix sums `P[0] = 0` and `P[i] = P[i − 1] + Aᵢ`, segment `[l, r]` has sum `P[r] − P[l − 1]`. Two integers have a difference divisible by `K` if and only if they have the same remainder when divided by `K`. So the wanted segments correspond exactly to the pairs of indices `j < i` (with `j = l − 1` and `i = r`, between 0 and `N`) such that `P[j]` and `P[i]` have the same remainder.

Go through `i = 0, 1, …, N`, computing `P[i]` along the way and keeping a dictionary `vus` ("seen"): `vus[c]` is the number of indices `j < i` whose remainder is `c`. For each `i`, add `vus[remainder of P[i]]` to the answer, then increase this counter by 1. Do not forget `P[0] = 0`, which counts for the segments starting at position 1.

**Negative remainders.** Sums can be negative. In Python, `x % K` is always between 0 and `K − 1`. In C++, `x % K` is negative when `x` is: `-7 % 3` is `-1`, while the mathematical remainder is 2. So write `((x % K) + K) % K`. Without this fix, `-1` and `2` would be counted as two different remainders.

**Cost.** One pass, with one dictionary operation per index: about N operations, instead of N² / 2. The answer can exceed 3 × 10⁸: `long long` in C++. Remark: if there are more indices than possible remainders (`N + 1 > K`), two prefixes necessarily have the same remainder, so the answer is at least 1: this is the **pigeonhole principle**.
