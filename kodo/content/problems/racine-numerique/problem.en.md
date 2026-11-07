---
title: Digital root
---

## Statement
The **digital root** of a non-negative integer is obtained by replacing the number with the sum of its digits, again and again, until a single digit is left. For example, 9875 gives 9 + 8 + 7 + 5 = 29, then 2 + 9 = 11, then 1 + 1 = 2: the digital root of 9875 is 2.

Compute the digital root of several numbers.

## Input
- The first line contains the integer `Q`, the number of numbers.
- Each of the next `Q` lines contains an integer `N`.

## Output
`Q` lines: the digital root of each number, in the order of the input.

## Constraints
- 1 ≤ Q ≤ 1,000
- 0 ≤ N ≤ 10¹⁸

## Hints
1. Write a function `digit_sum(n)` that returns the sum of the digits of `n`.
2. As long as the number has at least two digits, that is as long as it is at least 10, replace it with `digit_sum` of itself.
3. In C++, `N` can reach 10¹⁸: use `long long`.

## Solution
The function `digit_sum(n)` is the one from the lesson: add `n % 10` to a sum and divide `n` by 10, while `n > 0`. A second function, `root(n)`, calls the first one while `n ≥ 10`, then returns `n`. The main program reads `Q`, then calls `root` on each number read.

A number with at most 19 digits has a digit sum of at most 9 × 19 = 171: after one turn, the number is already small, and two or three turns are always enough.

Special case: 0 has a single digit, its root is 0. Single-digit numbers are their own root: the loop then makes no turn.

To go further: a number and the sum of its digits have the same remainder in the division by 9 (because 10 = 9 + 1). The digital root of an integer `N ≥ 1` is therefore `1 + (N - 1) % 9`.
