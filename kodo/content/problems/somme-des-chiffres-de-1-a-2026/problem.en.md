---
title: Sum of the digits from 1 to 2026
---

## Statement
We write all the integers from `1` to `2026` one after the other. Print the sum of all the digits written. For instance, for the integers from 1 to 12, the sum would be 1 + 2 + … + 9 + (1 + 0) + (1 + 1) + (1 + 2) = 51.

## Input
None: the program reads nothing.

## Output
A single integer: the sum of the digits of all the integers from 1 to 2026.

## Hints
1. For a number `n`, `n % 10` is its units digit, and `n // 10 % 10` its tens digit.
2. All the numbers from 1 to 2026 have at most 4 digits. For a number with fewer than 4 digits, the "missing" digits computed this way are 0, which does not change the sum.
3. An accumulator receives, at each iteration, the sum of the 4 digits of the current number.

## Solution
For an integer `n` with at most 4 digits, its digits are:

- the units: `n % 10`;
- the tens: `n // 10 % 10` (remove the last digit, then take the last digit of the result);
- the hundreds: `n // 100 % 10`;
- the thousands: `n // 1000`.

For instance, for n = 2026: 2026 % 10 = 6, 2026 // 10 % 10 = 202 % 10 = 2, 2026 // 100 % 10 = 20 % 10 = 0 and 2026 // 1000 = 2. For a shorter number such as 47, the hundreds and thousands are 0: the formula works for every number in the loop.

Go through `n` from 1 to 2026, and add these four digits to an accumulator initialised to 0. The result is 28189. In C++, the `/` operator on `int`s gives the integer quotient, like `//` in Python.
