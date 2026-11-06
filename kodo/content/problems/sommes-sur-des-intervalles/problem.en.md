---
title: Range sums
---

## Statement
A sensor records one whole number between `0` and `9` every day. Its N values are written one after the other, without spaces: the i-th digit is the value of day i.

Write a program that answers Q questions of the form: "What is the sum of the values from day A to day B, both included?"

## Input
- The first line contains two integers N and Q.
- The second line contains N digits written together: the values of days 1 to N, in order.
- Each of the next Q lines contains two integers A and B: one question.

## Output
Q lines: for each question, in the order of the input, the sum of the values from day A to day B (both included).

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A ≤ B ≤ N

## Hints
1. Adding up the values from A to B for each question can cost up to N × Q = 500 million additions: far too many. You need to do the heavy work only once, before reading the questions.
2. Build an array `cumul` (French for "running total") where `cumul[i]` is the sum of the first i values, with `cumul[0] = 0`.
3. The sum from day A to day B is the sum of the first B days minus the sum of the first A − 1 days: `cumul[B] - cumul[A - 1]`.

## Solution
**The idea: prefix sums.** We compute `cumul[i]`, the total of the first i days, once and for all: `cumul[0] = 0` and `cumul[i] = cumul[i − 1] + (value of day i)`. After that, each question is answered with a single subtraction: the total of days A to B is `cumul[B] − cumul[A − 1]`.

On the example `3015002`, we get `cumul = 0 3 3 4 9 9 9 11`. For the question "days 2 to 4", we compute `cumul[4] − cumul[1] = 9 − 3 = 6`.

**Complexity.** O(N) to build `cumul`, then O(1) per question: O(N + Q) in total, about 100 000 operations.

**Why the naive solution is too slow.** Redoing the addition for every question costs up to N operations per question, so N × Q = 5 × 10⁸ operations in the worst case: several tens of seconds in Python. Even `sum(int(c) for c in chiffres[a-1:b])` has to copy and scan hundreds of millions of cells.

**Traps.**
- Days are numbered from 1. Thanks to the cell `cumul[0] = 0`, the formula `cumul[B] − cumul[A − 1]` also works when A = 1, with no special case.
- The values are characters: you must convert each digit to a number (`int(c)` in Python, `c - '0'` in C++).
- With thousands of lines, read the whole input at once with `sys.stdin` rather than with `input()`.
