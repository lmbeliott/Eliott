---
title: Check digit of a code
---

## Statement
A code is made of `N` digits `C₁, C₂, …, C_N`. To detect typing errors, a check digit is added to it, computed as follows:
- compute the **weighted sum** `S = 1 × C₁ + 2 × C₂ + … + N × C_N`: each digit is multiplied by its position;
- the check digit is the digit `K`, between `0` and `9`, such that `S + K` is a multiple of 10.

Print `S`, then `K`.

## Input
- The first line contains the integer `N`.
- The second line contains the `N` digits of the code, separated by spaces.

## Output
Two lines: the weighted sum `S`, then the check digit `K`.

## Constraints
- 1 ≤ N ≤ 1 000
- Each digit is an integer between `0` and `9`.

## Hints
1. To multiply each digit by its position, count the digits as you read them: a variable `position` that grows by 1 at each iteration.
2. `S % 10` is the last digit of `S`. What must be added to `S` to reach the next multiple of 10?
3. If `S % 10` is `3`, you must add `7`. If `S % 10` is `0`, you must add `0`, not `10`.

## Solution
Read the digits one by one while keeping two variables up to date: `position`, which is 1 for the first digit, 2 for the second, and so on, and `S`, which receives `position × digit` at each iteration.

For the check digit, look at `r = S % 10`. If `r` is 0, `S` is already a multiple of 10 and `K = 0`. Otherwise, `10 − r` is missing to reach the next multiple of 10. Both cases merge into a single formula, with no condition: `K = (10 − r) % 10`. When `r = 0`, this gives `10 % 10 = 0`; when `r` is between 1 and 9, `10 − r` is already between 1 and 9 and the `% 10` changes nothing.

The trap is to write `K = 10 − S % 10`: when `S` is a multiple of 10, you get `10`, which is not a digit.
