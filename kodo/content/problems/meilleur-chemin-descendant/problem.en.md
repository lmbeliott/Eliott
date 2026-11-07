---
title: Best downward path
---

## Statement
A grid has `R` rows and `C` columns: each cell is forbidden, or contains a digit from `0` to `9`.

A **downward path** starts on any non-forbidden cell of the first row. At each move, it goes down one row: to the cell just below, or diagonally to the cell below on the left or on the right. It never goes over a forbidden cell, never leaves the grid, and finishes on the last row. The **value** of a path is the sum of the digits of all the cells visited, including the first and the last.

Write a program that computes the largest possible value of a downward path and the number of different downward paths that reach it. Two paths are different if they don't go through exactly the same cells.

## Input
- The first line contains two integers `R` and `C`.
- The next `R` lines, from the top row to the bottom row, each contain `C` characters: a digit from `0` to `9`, or `#` for a forbidden cell.

## Output
Two integers separated by a space: the maximum value, then the number of paths that reach it, modulo `1 000 000 007`. If there is no downward path, print only `-1`.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. There are up to `C × 3ᴿ⁻¹` paths: impossible to try them all. But to reach a cell in the best way, it doesn't matter how you got to the cells of the row above, only their best value matters.
2. Compute, row by row, `meilleur[i][j]` ("best"): the best value of a partial path that ends on cell `(i, j)`. It follows from the three cells above.
3. At the same time, compute `nombre[i][j]` ("number"): the number of partial paths that reach `meilleur[i][j]`. It is the sum of the `nombre` of the cells above whose best value equals the maximum, and only of those.

## Solution
A partial path ending on cell `(i, j)` came just before through `(i - 1, j - 1)`, `(i - 1, j)` or `(i - 1, j + 1)`. To get the best value at `(i, j)`, you must arrive through one of these cells with the best possible value. Hence, for a cell that is not forbidden:

- `meilleur[i][j] = digit(i, j) + max(meilleur[i - 1][k])` for `k` among `j - 1, j, j + 1`, ignoring forbidden cells, cells outside the grid and unreachable cells;
- `nombre[i][j] = sum of nombre[i - 1][k]` over the `k` that **achieve this maximum**.

On the first row, `meilleur[0][j]` is the cell's digit and `nombre[0][j] = 1`. A cell none of whose three upper cells is reachable is itself unreachable. At the end, the answer is the maximum of `meilleur` over the last row, and the number of paths is the sum of the `nombre` of the last-row cells that reach this maximum.

Each cell is computed in constant time: **O(R × C)**. We only keep the previous row, so the memory is O(C).

Why the naive enumeration is out of the question: with `R = 300`, a single starting cell already has up to 3²⁹⁹ paths.

Traps:
- Only add up the `nombre` of the cells that reach **exactly** the maximum; adding those of the other cells gives too many paths.
- Tell "unreachable" apart from "value 0": a reachable cell with digit `0` is valid. Use a special value (for example `-1`) for unreachable cells.
- The number of paths becomes huge (on a grid without forbidden cells, there are billions of billions of them): take the modulo at each addition. The value, on the other hand, stays small (at most `9 × R`).
- If a whole row is forbidden, there is no path at all: print `-1`.
