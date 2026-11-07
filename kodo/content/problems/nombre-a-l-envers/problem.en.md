---
title: Number reversed
---

## Statement
You reverse an integer `N` by reading its digits from right to left; the zeros that end up in front disappear. For example, `1203` reversed is `3021`, and `4500` gives `54`.

Print `N` reversed, then tell whether `N` is a **palindrome**, that is, whether it is equal to its reverse.

## Input
A single line containing the integer `N`.

## Output
- On the first line, `N` reversed.
- On the second line, `OUI` if `N` is equal to its reverse, `NON` otherwise.

## Constraints
- 0 ≤ N ≤ 10¹⁸ (in C++, use `long long`)

## Hints
1. Build the reverse digit by digit, in a variable `r` that starts at 0. To add a digit `c` on the right of `r`, compute `r * 10 + c`.
2. You get the digits of `N` from right to left with `% 10` and `// 10`, in a `while` loop.
3. The loop destroys `N`. To compare `N` with its reverse at the end, keep a copy of `N` before the loop.

## Solution
Go through the digits of `N` from right to left: the last digit is `n % 10`, then remove it with `n // 10`. Each digit is added **on the right** of the reversed number `r`: `r = r * 10 + digit`. For `1203`, `r` is successively 3, 30, 302 then 3021.

The zeros at the end of `N` land at the front of `r`, where they don't count: for `4500`, `r` is 0, 0, 5 then 54. That's exactly what the statement asks for.

To know whether `N` is a palindrome, compare the reverse with the original number. Since the loop brought `n` down to 0, you must have copied `N` into another variable before the loop: that's the main trap. The case `N = 0` works without special handling: the loop makes no turn, `r` is 0, and `0` is a palindrome.
