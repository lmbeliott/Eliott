---
title: Write a number in base B
---

## Statement
In base 10, `347 = 3 × 100 + 4 × 10 + 7 × 1`: the digits are the coefficients of the powers of 10. In **base B**, you use the powers of `B` (1, `B`, `B × B`, …) and digits between `0` and `B - 1`. For example, in base 2, `13 = 1 × 8 + 1 × 4 + 0 × 2 + 1 × 1` is written `1101`, with the digits `1`, `1`, `0` and `1`.

Print the number of digits of `N` written in base `B`, then these digits, from the most significant (left) to the least significant (right). The writing never starts with `0`, except for the number `0` itself, which is written with a single digit `0`.

## Input
A single line containing two integers `N` and `B` separated by a space.

## Output
- On the first line, the number `K` of digits of `N` in base `B`.
- On the next `K` lines, the digits, one per line, from left to right. Each digit is written as a base-10 number: in base 16, the digit worth eleven is written `11`.

## Constraints
- 0 ≤ N ≤ 10¹²
- 2 ≤ B ≤ 16
- In C++, use `long long`.

## Hints
1. `N % B` gives the least significant digit (the rightmost one) and `N // B` removes it, exactly like `% 10` and `// 10` in base 10. But then you get the digits from right to left, and you must print them from left to right.
2. Start by finding the largest power of `B` that does not exceed `N`: start from `p = 1` and multiply by `B` as long as `p × B ≤ N`. The number of digits is the number of powers visited.
3. Then, as long as `p > 0`: the current digit is `N // p`, remove its contribution with `N = N % p`, then move to the next power with `p = p // B`.

## Solution
The problem takes two `while` loops, one after the other.

**First loop: find the leftmost digit.** Start from `p = 1` and `K = 1`, and as long as `p × B ≤ N`, multiply `p` by `B` and add 1 to `K`. At the end, `p` is the largest power of `B` that does not exceed `N`, and `K` is the number of digits. For `N = 13` and `B = 2`, `p` goes through 1, 2, 4 and 8, and `K` is 4. For `N = 0`, the loop makes no turn: `p = 1` and `K = 1`, which is correct.

**Second loop: extract the digits from left to right.** As long as `p > 0`, the digit in front of `p` is `N // p`; print it, remove its contribution with `N = N % p`, then divide `p` by `B`. For `13`: `13 // 8 = 1` (remainder 5), `5 // 4 = 1` (remainder 1), `1 // 2 = 0` (remainder 1), `1 // 1 = 1`. You print the digits `1`, `1`, `0` and `1`.

A tempting idea is to build the "reversed" number with `r = r × B + digit`, then split it again. It fails when `N` ends with zeros in base `B`: those zeros move to the front of the reversed number and disappear. For example, `4` is written `100` in base 2, but its reverse is just `1`.

In C++, `p × B` can exceed the limit of an `int`: use `long long`.
