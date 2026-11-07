---
title: Rearrange the digits and subtract
---

## Statement
We work with numbers written with exactly `D` digits, adding zeros in front if needed. A **step** transforms a number `x` as follows: arrange its `D` digits in decreasing order to form the largest possible number, in increasing order to form the smallest, and subtract the smallest from the largest.

For example, with `D = 4`, the step turns `3524` into `5432 - 2345 = 3087`, then `3087` into `8730 - 0378 = 8352`, then `8352` into `8532 - 2358 = 6174`, and `6174` into `7641 - 1467 = 6174`.

Starting from `X` and repeating the step, you necessarily end up on a number already obtained. Print the number of different values obtained, `X` included. In the example, they are `3524`, `3087`, `8352` and `6174`: the answer is 4.

## Input
A single line containing `D` and `X`.

## Output
A single integer: the number of different values of the sequence.

## Constraints
- 1 ≤ D ≤ 10
- 0 ≤ X < 10ᴰ (in C++, use `long long`)

## Hints
1. To get the `D` digits of `x`, leading zeros included, do `x % 10` then `x // 10` exactly `D` times.
2. No need to sort: count how many times each digit from 0 to 9 appears in a list of 10 counters. The largest number is obtained by writing the 9s, then the 8s, …, then the 0s; the smallest, in the reverse order.
3. Store the values already obtained in a set, and stop as soon as the current value is already in it.

## Solution
Write a function `etape(x, d)` ("step"). It extracts the `d` digits of `x` with `% 10` and `// 10`, exactly `d` times: leading zeros thus appear naturally (with `d = 4`, `378` gives the digits 8, 7, 3 and 0). Instead of sorting the digits, it **counts** them in a list `nb` of 10 cells. The largest number is built by going through the digits from 9 to 0 and writing each digit `c` `nb[c]` times (`grand = grand × 10 + c`); the smallest, by going from 0 to 9. It returns the difference, which still has at most `d` digits.

The main loop keeps a **set** `vus` of the values already obtained. As long as `x` is not in `vus`, add it and apply the step. When `x` is already in the set, the sequence will now go round in circles, and the size of the set is the answer.

Why does the sequence end up repeating? All its values are numbers from 0 to 10ᴰ − 1: there are only finitely many. In practice, the repetition comes very fast: a few dozen steps at most for numbers of this size. For `D = 4`, you always end up on `6174` or on `0`, and for `D = 3`, on `495` or `0`.

The trap is to forget leading zeros: reading the digits with `while x > 0`, the number `0378` would only have three digits, and the next step would give `873 - 378` instead of `8730 - 0378`.
