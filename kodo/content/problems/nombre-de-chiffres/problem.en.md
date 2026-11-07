---
title: Number of digits
---

## Statement
Print the number of digits of the integer `N`, written normally in base 10, without useless leading zeros.

## Input
A single line containing the integer `N`.

## Output
A single integer: the number of digits of `N`.

## Constraints
- 0 ≤ N ≤ 10¹⁸ (in C++, use a `long long`)

## Hints
1. `N // 10` (in C++, `N / 10`) removes the last digit of `N`. How many times can you apply it before reaching `0`?
2. Count the turns of a `while` loop that goes on as long as `N > 0`.
3. The number `0` is written with one digit, but the loop then makes no turn.

## Solution
Each integer division by 10 removes exactly one digit. So you count the turns of a loop `while n > 0: n = n // 10`. For `2026`, `n` goes through 202, 20, 2 and 0: four turns, four digits.

The case `N = 0` is the trap: the loop makes no turn and the counter stays at 0, while `0` is written with one digit. Handle it separately with an `if`.

In C++, `10¹⁸` does not fit in an `int` (limited to about 2 × 10⁹): you need a `long long`.
