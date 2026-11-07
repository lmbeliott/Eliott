---
title: Numbers divisible by the sum of their digits
---

## Statement
Count the integers between `A` and `B` (inclusive) that are divisible by the sum of their digits.

For example, `18` fits, because `1 + 8 = 9` and 18 is divisible by 9; `19` does not, because `1 + 9 = 10` does not divide 19.

## Input
A single line containing two integers `A` and `B` separated by a space.

## Output
A single integer: the number of integers `n` such that `A ≤ n ≤ B` and `n` is divisible by the sum of its digits.

## Constraints
- 1 ≤ A ≤ B ≤ 100,000

## Hints
1. A `for` loop on the integers `n` from `A` to `B`, and for each one a `while` loop that computes the sum of its digits.
2. The `while` loop destroys the number it splits: work on a copy of `n`.
3. The sum of the digits must be reset to 0 for each new integer.

## Solution
Test each integer of the range. For an integer `n`, copy `n` into `m`, then compute the sum `s` of its digits with `while m > 0`, `s = s + m % 10` and `m = m // 10`. The integer fits if `n % s == 0`. Since `n ≥ 1`, the sum `s` is never zero, and the division is always possible.

The total number of turns is at most 100,000 × 6 = 600,000: it's fast.

The traps are those of nested loops: splitting `n` directly (the test `n % s` is then done on 0, and in C++ the `for` loop starts over from 1 forever), or initialising `s` only once before the outer loop.
