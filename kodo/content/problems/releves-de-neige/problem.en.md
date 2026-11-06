---
title: The snow records
---

## Statement
At the weather station on the Valcorde pass, Awa measures the fresh snow that fell during the night every morning: between `0` and `9` centimetres. To save space, she writes her N records one after the other, without spaces: the i-th digit is the snow that fell during night number i.

The ski school instructors ask her Q questions of the form: "How many centimetres of snow fell in total from night A to night B, both included?"

Write a program that answers all their questions.

## Input
- The first line contains two integers N and Q.
- The second line contains N digits written together: the records of nights 1 to N, in order.
- Each of the next Q lines contains two integers A and B: one question.

## Output
Q lines: for each question, in the order of the input, the total number of centimetres of snow that fell from night A to night B (both included).

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A ≤ B ≤ N

## Hints
1. Adding up the records from A to B for each question can cost up to N × Q = 500 million additions: far too many. You need to do the heavy work only once, before reading the questions.
2. Build an array `cumul` (French for "running total") where `cumul[i]` is the snow that fell during the first i nights, with `cumul[0] = 0`.
3. The snow that fell from night A to night B is the snow of the first B nights minus the snow of the first A − 1 nights: `cumul[B] - cumul[A - 1]`.

## Solution
**The idea: prefix sums.** We compute `cumul[i]`, the total of the first i nights, once and for all: `cumul[0] = 0` and `cumul[i] = cumul[i − 1] + (record of night i)`. After that, each question is answered with a single subtraction: the total of nights A to B is `cumul[B] − cumul[A − 1]`.

On the example `3015002`, we get `cumul = 0 3 3 4 9 9 9 11`. For the question "nights 2 to 4", we compute `cumul[4] − cumul[1] = 9 − 3 = 6`.

**Complexity.** O(N) to build `cumul`, then O(1) per question: O(N + Q) in total, about 100 000 operations.

**Why the naive solution is too slow.** Redoing the addition for every question costs up to N operations per question, so N × Q = 5 × 10⁸ operations in the worst case: several tens of seconds in Python. Even `sum(releves[a-1:b])` has to copy and scan hundreds of millions of cells.

**Traps.**
- Nights are numbered from 1. Thanks to the cell `cumul[0] = 0`, the formula `cumul[B] − cumul[A − 1]` also works when A = 1, with no special case.
- The records are characters: you must convert each digit to a number (`int(c)` in Python, `c - '0'` in C++).
- With thousands of lines, read the whole input at once with `sys.stdin` rather than with `input()`.
