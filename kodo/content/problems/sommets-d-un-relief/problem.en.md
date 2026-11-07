---
title: Peaks of a relief map
---

## Statement
A relief map is a grid of `N` rows and `M` columns; each cell holds an altitude, a digit from `0` to `9`. A cell is a **peak** if its altitude is **strictly** greater than that of each of its neighbours. The neighbours of a cell are the cells touching it by a side or a corner (up to 8). A border cell has fewer neighbours; a grid with a single cell is a peak.

Count the peaks.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `N` lines contains `M` digits, without spaces.

## Output
The number of peaks.

## Constraints
- 1 ≤ N ≤ 100 and 1 ≤ M ≤ 100

## Hints
1. Read each line as a string: `g[i][j]` is a character, and `int(g[i][j])` its altitude. Directly comparing the characters `"0"` to `"9"` actually gives the same result.
2. Go through the 8 moves `(a, b)` with `a` and `b` between -1 and 1, except `(0, 0)`.
3. A neighbour outside the grid is ignored: test `0 <= i + a < N` and `0 <= j + b < M` before reading the cell.

## Solution
For each cell `(i, j)`, a function `is_peak(g, i, j)` goes through the 8 moves `(a, b)`, with `a` and `b` equal to -1, 0 or 1, except `(0, 0)` which is the cell itself. For each neighbour `(i + a, j + b)` **inside the grid**, if its altitude is greater than or equal to that of the cell, it is not a peak: the function returns `False`. If no neighbour prevents it, it returns `True`. Count the cells for which the function returns `True`.

Checking the bounds is essential. In Python, forgetting `0 <= i + a` causes no error on row 0: index -1 refers to the last row, which would wrongly be compared. Forgetting `i + a < N` causes an `IndexError`.

The word "strictly" matters: two neighbouring cells with the same altitude are both not peaks. A completely flat grid with more than one cell therefore has no peak, whereas a grid with a single cell, without neighbours, has one.

There are at most 10,000 cells and 8 neighbours per cell: the program is very fast.
