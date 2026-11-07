---
title: Most frequent digit
---

## Statement
Print the digit that appears most often in the writing of the integer `N`, then its number of occurrences. If several digits appear the same maximal number of times, choose the smallest.

For example, in `3141592653`, the digits `3`, `1` and `5` each appear twice: the answer is `1 2`.

## Input
A single line containing the integer `N`.

## Output
A single line with two integers separated by a space: the most frequent digit, then its number of occurrences.

## Constraints
- 0 ≤ N ≤ 10¹⁸ (in C++, use `long long`)

## Hints
1. Without an array, you can't count the ten digits in a single pass. But you can make ten passes: one for each digit `c` from 0 to 9.
2. For a given digit `c`, go through the digits of `N` with `% 10` and `// 10` in a `while` loop, and count those equal to `c`. Work on a copy of `N`, since you need it for each of the ten passes.
3. The number `0` is written with one digit `0`: the `while` loop then makes no turn, so handle that case separately.

## Solution
An outer loop tries each digit `c` from 0 to 9. For each one, an inner loop goes through the digits of a **copy** `m` of `N` (with `m % 10` and `m // 10`) and counts those equal to `c`. Then keep the best: if the count of `c` is strictly greater than the best known count, remember `c`. Since the digits are tried in increasing order and the comparison is strict, the smallest digit wins in case of a tie.

The copy is essential: the inner loop brings `m` down to 0, and you must start again from `N` for the next digit. The number of turns is at most 10 × 19 = 190.

The case `N = 0` is handled separately: the inner loop makes no turn and all the counts would be 0, while the answer is `0 1`.
