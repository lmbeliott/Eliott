---
title: Placing N queens
---

## Statement
You have a grid of N × N cells: some are blocked (`#`), the others are free (`.`). You must place exactly N queens on it, each on a free cell. As in chess, a queen attacks its whole row, its whole column and its two diagonals: so two queens must never be on the same row, the same column or the same diagonal.

Write a program that counts the number of ways to place the N queens.

## Input
- The first line contains an integer N.
- Each of the next N lines contains N characters `.` or `#`: the grid, row by row.

## Output
A single integer: the number of ways to place the N queens. Two ways are different if the sets of cells used are not the same.

## Constraints
- 1 ≤ N ≤ 11

## Hints
1. Since two queens cannot share a row, there is exactly one queen per row. Place them row by row, with a recursive function `placer(ligne)` ("place(row)").
2. For each free cell of the row, check that its column and its two diagonals are still free. If so, put the queen there, call `placer(ligne + 1)`, then remove it.
3. To check in constant time, keep three arrays of booleans: the occupied columns, the "/" diagonals (where `ligne + col` is constant) and the "\" diagonals (where `ligne − col` is constant).

## Solution
**The idea: backtracking.** We place one queen per row, from top to bottom. The function `placer(ligne)` tries each column of the row: if the cell is free and its column and diagonals are not already occupied, it puts the queen there, marks the column and the diagonals, calls `placer(ligne + 1)`, then **undoes** everything before trying the next column. When `ligne == N`, all the queens are placed: we count one solution.

Two cells (r₁, c₁) and (r₂, c₂) are on the same "/" diagonal if `r₁ + c₁ = r₂ + c₂`, and on the same "\" diagonal if `r₁ − c₁ = r₂ − c₂`. So we number the diagonals by `ligne + col` (from 0 to 2N − 2) and by `ligne − col + N` (to avoid negative indices).

**Why it is fast: pruning.** As soon as a queen cannot be placed anywhere on a row, we abandon the whole branch, without exploring the following rows. For N = 11 with no blocked cell, the function is called only about 170 000 times, for 2 680 solutions.

**Complexity.** Exponential in the worst case, but pruning shrinks the search tree enormously: a few tenths of a second in Python for N = 11.

**Why the naive solution is too slow.** Trying every way of choosing one column per row, then checking, means 11¹¹ ≈ 2.8 × 10¹¹ tries. Even when restricting to permutations (a different column for each row), there are 11! ≈ 40 million cases to check one by one: far too many for Python.

**Traps.**
- Don't forget to free the column and the diagonals after the recursive call, otherwise the following branches think they are still occupied.
- A row made only of blocked cells makes any placement impossible: the answer is then `0`.
- For N = 2 or N = 3, there is no solution, even without blocked cells.
