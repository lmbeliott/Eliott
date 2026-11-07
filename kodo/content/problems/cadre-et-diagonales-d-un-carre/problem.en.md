---
title: Frame and diagonals of a square
---

## Statement
Draw a square of `N` lines and `N` columns of characters. A character is `#` if it is on the border of the square or on one of its two diagonals, and `.` otherwise.

## Input
A single line containing the integer `N`.

## Output
`N` lines of `N` characters each, `#` or `.`, without spaces.

## Constraints
- 1 ≤ N ≤ 50

## Hints
1. Number the lines `i` and the columns `j` from 0 to `N - 1`, and go through all the cells with two nested loops.
2. Write down the coordinates of the `#` cells for `N = 5` and look for what they have in common. The border is made of the cells where `i` or `j` is `0` or `N - 1`.
3. One diagonal is made of the cells where `i == j`, the other of the cells where `i + j == N - 1`. A single condition with `or` is enough.

## Solution
Two nested loops go through the cells `(i, j)`, with `i` and `j` from 0 to `N - 1`. A cell is `#` if one of these conditions is true:
- it is on the border: `i == 0`, `i == N - 1`, `j == 0` or `j == N - 1`;
- it is on the diagonal going down to the right: `i == j`;
- it is on the other diagonal: `i + j == N - 1`.

Combine them with `or` in a single `if`. Print each character without a line break, and move to the next line at the end of each line.

To find the condition of the other diagonal, look at its cells for `N = 5`: `(0, 4)`, `(1, 3)`, `(2, 2)`, `(3, 1)`, `(4, 0)`. The sum `i + j` is always 4, that is `N - 1`.
