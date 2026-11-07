---
title: Seven rows of Pascal's triangle
---

## Statement
A triangle of numbers is built row by row. The first row contains only `1`. Each following row contains one more number than the previous one: it starts and ends with `1`, and every other number is the sum of the two numbers located just above it in the previous row (the one at the same position and the one before it).

Print the first 7 rows of this triangle.

## Input
None: the program reads nothing.

## Output
7 lines. Line number k (from 1 to 7) contains k numbers separated by a space.

## Hints
1. The first four rows are `1`, `1 1`, `1 2 1` and `1 3 3 1`. In `1 3 3 1`, the first `3` is 1 + 2 and the second one is 2 + 1.
2. Build each row on paper from the previous one, then check that it reads the same in both directions.

## Solution
Build the rows one by one. The fifth row is `1 4 6 4 1` (1 + 3, 3 + 3, 3 + 1), the sixth `1 5 10 10 5 1` and the seventh `1 6 15 20 15 6 1`.

Two quick checks avoid computation mistakes: each row is **symmetric** (it reads the same from left to right and from right to left), and the sum of the numbers in a row is twice the sum of the previous row (1, 2, 4, 8, 16, 32, 64). For instance 1 + 6 + 15 + 20 + 15 + 6 + 1 = 64.

This triangle is called **Pascal's triangle**. Its numbers count many things: row 7, for instance, gives the number of ways to choose 0, 1, 2… 6 objects among 6.
