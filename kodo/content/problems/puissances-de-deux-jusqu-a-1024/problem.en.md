---
title: Powers of two up to 1024
---

## Statement
A sequence starts with `1`, and each following number is twice the previous one. Print, on a single line, all the numbers of this sequence from the first one up to `1024` included, then, on a second line, the same numbers in reverse order.

## Input
None: the program reads nothing.

## Output
Two lines. The first one contains the numbers of the sequence, from `1` to `1024`, in increasing order, separated by a space. The second one contains the same numbers, from `1024` down to `1`.

## Hints
1. First compute the numbers on paper: 1, 2, 4, 8… up to 1024. How many are there?
2. In Python, `print(a, b, c)` prints several values on the same line, separated by a space. In C++, you have to write the spaces yourself: `cout << a << " " << b`.

## Solution
Doubling from 1, you get 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024: 11 numbers. These are the **powers of two**, which come up very often in computer science.

Each line is printed with a single instruction containing the 11 numbers. The traps: forgetting the `1` at the start (the sequence starts at 1, not 2), stopping at 512, or, in C++, forgetting the spaces between the numbers, which glues them together.
