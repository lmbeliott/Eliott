---
title: Multiplication table
---

## Statement
Print the multiplication table with `N` lines and `M` columns: the cell in line `i` and column `j` (numbered from 1) contains `i × j`. Then print, on a last line, the sum of all the numbers of the table.

## Input
A single line containing two integers `N` and `M` separated by a space.

## Output
- `N` lines: line `i` contains the `M` numbers `i × 1`, `i × 2`, …, `i × M`, separated by spaces.
- A last line with a single integer: the sum of all the numbers printed.

## Constraints
- 1 ≤ N ≤ 30
- 1 ≤ M ≤ 30

## Hints
1. A loop on the lines `i` from 1 to `N`, and inside it a loop on the columns `j` from 1 to `M`.
2. In Python, `print(x, end=" ")` prints `x` without a line break; a `print()` after the inner loop ends the line.
3. The sum is computed in the inner loop, but it is set to 0 only once, before both loops.

## Solution
Two nested loops: the outer loop goes through the lines `i` from 1 to `N`, the inner loop through the columns `j` from 1 to `M`. In the inner loop, print `i × j` followed by a space and add it to the sum. After the inner loop, move to the next line.

The sum is about the whole table: it is initialised before the outer loop, not at the start of each line. Print it at the very end.
