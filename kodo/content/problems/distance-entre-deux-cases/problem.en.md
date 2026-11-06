---
title: Distance between two cells
---

## Statement
You are given a rectangular grid. One cell is marked `A`, another one is marked `B`, and all the other cells are `.`.

At each step, you move from one cell to a neighbouring cell: up, down, left or right (never diagonally). There are no obstacles in the grid.

Write a program that prints the minimum number of steps to go from cell `A` to cell `B`.

## Input
- The first line contains two integers `H` and `W`: the number of rows and the number of columns of the grid.
- The next `H` lines each contain `W` characters: the grid. It contains exactly one `A` and exactly one `B`; all the other cells are `.`.

## Output
A single integer: the minimum number of steps to go from `A` to `B`.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- The grid has at least two cells.

## Hints
1. Start by finding the row and the column of `A`, then those of `B`, by going through all the cells with two nested loops.
2. With no obstacles, you have to make as many vertical steps as the gap between the two rows, and as many horizontal steps as the gap between the two columns.
3. The gap between two numbers `a` and `b` is `abs(a - b)`: it is always positive, whether `B` is above or below `A`, to the left or to the right.

## Solution
We go through the grid with two nested loops: row `i` from `0` to `H - 1` and column `j` from `0` to `W - 1`. When the cell `(i, j)` is `A`, we remember `(i, j)` as the position of `A`; when it is `B`, as the position of `B`. (In the reference solutions, the grid is called `grille`, French for "grid".)

Since there are no obstacles, you can first make all the vertical steps, then all the horizontal steps. You can't do better, because each step changes only the row **or** the column, and only by 1. So the answer is `abs(rowA - rowB) + abs(colA - colB)`. It's called the **Manhattan distance**, after the grid-shaped streets of that city.

The trap: writing `rowB - rowA` without the absolute value. The result is wrong (and sometimes negative) as soon as `B` is above `A` or to its left.
