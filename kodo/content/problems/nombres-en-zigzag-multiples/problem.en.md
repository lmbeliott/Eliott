---
title: Zigzag multiples
---

## Statement
A positive integer is **zigzag** if, reading its digits from left to right, two neighbouring digits are always different and the changes alternate: a rise is followed by a fall, and a fall by a rise. For example, `7`, `31`, `152`, `9091` and `27583` are zigzag, but `122`, `123` and `1342` are not.

You are given an integer `M` and `T` intervals `[A, B]`. Write a program that counts, for each interval, the zigzag integers of `[A, B]` that are multiples of `M`.

## Input
- The first line contains two integers `M` and `T`.
- The next `T` lines each contain two integers `A` and `B`.

## Output
`T` lines: for each interval, in order, the number of zigzag multiples of `M` between `A` and `B` included.

## Constraints
- 1 ≤ M ≤ 500
- 1 ≤ T ≤ 2 000
- 1 ≤ A ≤ B ≤ 10¹⁸

## Hints
1. Count the good numbers of `[1, X]` with a function `count(X)`. The answer for `[A, B]` is `count(B) - count(A - 1)`.
2. Dynamic programming on digits: choose the digits from left to right. For what follows, you only need the last digit, the direction imposed on the next step (up or down), the remainder modulo `M` and the number of digits left.
3. Redoing the dynamic programming for each bound costs about 2 × 10⁶ operations, and there are 4 000 bounds: too slow. The number of ways to complete `L` digits **freely** doesn't depend on the bound. Compute it once, then answer each bound by only going through its digits.

## Solution
**Free suffixes.** Let `g[L][d][s][r]` be the number of sequences of `L` digits that can come after digit `d` without breaking the zigzag, when the first step must go in direction `s` (up or down), and whose value (with its leading zeros) is `r` modulo `M`. If the sequence starts with `e`, the rest must go back in the other direction. Its value is `e × 10^(L-1)` plus the value of the remaining sequence:

`g[L][d][up][r] = sum over e > d of g[L-1][e][down][r - e × 10^(L-1)]`, and the same for down with `e < d`. We start from `g[0][d][s][0] = 1`.

This table has `19 × 10 × 2 × M` cells and is computed only once, in O(19 × 10 × 10 × M).

**Counting up to X.** Let `k` be the number of digits of `X`.
- Numbers of length `ℓ < k`: for each first digit `f` (from 1 to 9), the rest is a free sequence of `ℓ - 1` digits, in both possible directions, with value `≡ -f × 10^(ℓ-1)` modulo `M`.
- Numbers with `k` digits: we follow the digits of `X`. At position `i`, we try each digit `c` smaller than that of `X` (except `0` in front) that extends the zigzag of the prefix. The number is then already smaller than `X`, and the remaining `k - 1 - i` digits are free. We read their count in `g`, with the direction imposed by the last two digits and the required remainder. We stop as soon as the prefix of `X` itself is no longer zigzag. Otherwise, we test `X` at the end.

Each bound costs O(19 × 10) table reads: the total is **O(190 × M × 10 + T × 190 × 10)**.

Why simple ideas fail: going through `[A, B]` is impossible (up to 10¹⁸ numbers). The classic digit DP, redone for each bound with a memoization table reset to zero, costs about `19 × 10 × 2 × M × 10 ≈ 2 × 10⁶` operations per bound. With 4 000 bounds, that's 8 × 10⁹: far too much. The key is that the "free" part doesn't depend on the bound.

Traps:
- `10¹⁸` has 19 digits.
- Numbers shorter than `X` don't start with `0`: handle them separately, and don't count leading zeros as digits of the zigzag.
- With `M = 1`, the answers exceed 2³¹: in C++, use `long long`.
- A multiple of 100 is never zigzag (it ends with `00`): for `M = 500`, every answer is `0`.
