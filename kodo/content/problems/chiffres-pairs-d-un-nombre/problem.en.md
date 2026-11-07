---
title: Even digits of a number
---

## Statement
Write a program that reads an integer `N` and prints how many even digits it has when written normally, without leading zeros. The even digits are `0`, `2`, `4`, `6` and `8`.

For example, `2026` has 4 even digits, and `305` has only one, the `0`.

## Input
A single line containing the integer `N`.

## Output
A single integer: the number of even digits of `N`.

## Constraints
- 0 ≤ N ≤ 1 000 000 000

## Hints
1. The last digit of `N` is the remainder of the division of `N` by 10: `N % 10`. And `N // 10` (in C++, `N / 10`) is the number `N` without its last digit.
2. Repeat with a `while` loop: look at the last digit, count it if it's even, then remove it. Go on as long as `N` is greater than 0.
3. Test your program with `N = 0`. The number `0` is written with one digit, and that digit is even: the answer is 1.

## Solution
You don't know in advance how many digits `N` has: that's a job for a `while` loop. At each step:
- take the last digit, `N % 10`;
- if it's even (its remainder in the division by 2 is 0), increase the counter;
- remove that digit: `N = N // 10`.

The loop stops when `N` is 0: there are no digits left to look at. For example, for `305`: we look at `5`, then `0` (counted), then `3`, and we get 1.

The trap is `N = 0`: the loop then doesn't run at all, and the counter stays at 0. But the number `0` is written with one even digit! You have to handle this case separately, with an `if` before the loop.

Also be careful not to confuse "even digits" with "even number": `2026` and `13` are not both even, but only the first one has even digits.
