---
title: Pyramid of hashes
---

## Statement
Draw a pyramid of height `N` with `#` characters, in a rectangle of `N` lines and `2 × N - 1` columns. The top is a single `#` in the middle of the first line; each line has two more `#` than the previous one, and the last line is completely filled. Empty cells are shown with `.`.

## Input
A single line containing the integer `N`.

## Output
`N` lines of `2 × N - 1` characters each, `#` or `.`, without spaces.

## Constraints
- 1 ≤ N ≤ 50

## Hints
1. Count, for line number `i` (starting from 1), the number of `.` on the left, the number of `#`, then the number of `.` on the right. Make a table for `N = 4`.
2. Line `i` contains `N - i` dots, then `2 × i - 1` hashes, then `N - i` dots.
3. For each line, three inner loops one after the other: one per group of characters.

## Solution
Look at the pyramid for `N = 4`:

- line 1: `...#...` (3 dots, 1 hash, 3 dots);
- line 2: `..###..` (2, 3, 2);
- line 3: `.#####.` (1, 5, 1);
- line 4: `#######` (0, 7, 0).

So line `i` contains `N - i` dots, `2 × i - 1` hashes and `N - i` dots. Check the total: `(N - i) + (2 × i - 1) + (N - i) = 2 × N - 1`, the expected width.

The program has an outer loop on the lines and, in its body, three successive loops (not nested in each other) that each print one group of characters. Another method is to go through the columns `j` from 1 to `2 × N - 1` and print `#` when `N - i < j` and `j ≤ N + i - 1`.
