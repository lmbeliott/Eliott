---
title: Tiling with L-trominoes
---

## Statement
A grid of R rows and C columns contains free cells (`.`) and blocked cells (`#`). An **L-tromino** covers three of the four cells of a 2 × 2 square: it can be placed in any of its four orientations.

Tiling the grid means placing L-trominoes so that every free cell is covered by exactly one tromino, without covering a blocked cell or going outside the grid.

Write a program that counts the tilings of the grid. Two tilings are different if one contains a tromino (three specific cells) that the other does not contain.

## Input
- The first line contains two integers R and C.
- Each of the next R lines contains C characters `.` or `#`: the grid, row by row.

## Output
A single integer: the number of tilings of the grid (`0` if there is none).

## Constraints
- 1 ≤ R ≤ 8 and 1 ≤ C ≤ 8
- R × C ≤ 48
- The grid contains at least one free cell.

## Hints
1. Placing a tromino anywhere, then another one anywhere, and so on, finds each tiling several times (once per placing order): for 16 trominoes, that is 16! orders. You have to decide in which order the cells get covered.
2. Read the grid row by row, from left to right, and look at the **first free cell not covered yet**. It must be covered by a tromino. All the cells before it are already covered: so it is the first cell of this tromino in reading order.
3. With this cell at (0, 0), exactly four shapes remain: {(0, 0), (0, 1), (1, 0)}, {(0, 0), (0, 1), (1, 1)}, {(0, 0), (1, 0), (1, 1)} and {(0, 0), (1, 0), (1, −1)}. For each one that fits, place it, call the recursive function, then remove it.

## Solution
**The idea: always cover the first free cell.** The recursive function `count(pos)` looks for the first uncovered cell from position `pos` on (cells are numbered row by row). If there is none left, the grid is tiled: we count 1. Otherwise, this cell must be covered by a tromino, and all the cells before it already are. The tromino covering it therefore cannot use a higher cell, nor a cell further left on the same row: it is its first cell. A 2 × 2 square without one cell gives four shapes, and each has a single first cell: there are only four ways to place this tromino. For each one that fits in the grid on free, uncovered cells, we place it, add `count` on the rest, then remove it.

Each tiling is found **only once**: at each step, the tromino covering the first free cell is forced by the tiling.

In the first example (2 × 3, all free), the first cell is (0, 0). The shape {(0, 0), (0, 1), (1, 0)} leaves cells (0, 2), (1, 1) and (1, 2), which form an L: one tiling. The shape {(0, 0), (1, 0), (1, 1)} leaves (0, 1), (0, 2) and (1, 2), an L again: a second tiling. The shape {(0, 0), (0, 1), (1, 1)} leaves cell (1, 0) isolated, and the fourth shape goes outside the grid. The answer is 2.

**Pruning right away.** Each tromino covers 3 cells: if the number of free cells is not a multiple of 3, the answer is `0` without searching. Then, a branch stops by itself as soon as the first free cell cannot be covered by any of the four shapes: this often happens very quickly (a free cell isolated against an edge, for example).

**Complexity.** Exponential in the worst case, but each call makes only four attempts, and dead ends are detected early. For the allowed grids, there are at most about a hundred thousand calls: the empty 6 × 8 grid, which has 1,514 tilings, needs about 70,000.

**Why the naive solution is too slow.** Trying trominoes in any order finds each tiling of 16 trominoes 16! ≈ 2 × 10¹³ times. Even dividing at the end, the number of calls is astronomical. Fixing the cell to cover removes all these repetitions.

**Traps.**
- The shape {(0, 0), (1, 0), (1, −1)} goes down to the **left**: do not forget to check that column −1 exists.
- Always remove the tromino after the recursive call, otherwise the next attempts believe these cells are still covered.
- A tiling only exists if every free cell is covered: a grid with a single row has none.
