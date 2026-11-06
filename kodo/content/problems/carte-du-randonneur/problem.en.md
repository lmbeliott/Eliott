---
title: The hiker's map
---

## Statement
Yanis has wandered a little away from the trail. Luckily, he has a grid map of the alpine pasture: his position is marked with a `Y` and the refuge's position with an `R`. All the other cells are grass, written `.`.

At each step, Yanis moves from one cell to a neighbouring cell: up, down, left or right (never diagonally). There are no obstacles on the pasture.

Write a program that prints the minimum number of steps Yanis needs to reach the refuge.

## Input
- The first line contains two integers `H` and `W`: the number of rows and the number of columns of the map.
- The next `H` lines each contain `W` characters: the map. It contains exactly one `Y` and exactly one `R`; all the other cells are `.`.

## Output
A single integer: the minimum number of steps to go from `Y` to `R`.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- The map has at least two cells.

## Hints
1. Start by finding the row and the column of `Y`, then those of `R`, by going through all the cells with two nested loops.
2. With no obstacles, Yanis has to make as many vertical steps as the gap between the two rows, and as many horizontal steps as the gap between the two columns.
3. The gap between two numbers `a` and `b` is `abs(a - b)`: it is always positive, whether the refuge is above or below, to the left or to the right.

## Solution
We go through the map with two nested loops: row `i` from `0` to `H - 1` and column `j` from `0` to `W - 1`. When the cell `(i, j)` is `Y`, we remember `(i, j)` as Yanis's position; when it is `R`, as the refuge's position. (In the reference solutions, the map is called `carte`, French for "map".)

Since there are no obstacles, Yanis can first make all his vertical steps, then all his horizontal steps. He can't do better, because each step changes only the row **or** the column, and only by 1. So the answer is `abs(rowY - rowR) + abs(colY - colR)`. It's called the **Manhattan distance**, after the grid-shaped streets of that city.

The trap: writing `rowR - rowY` without the absolute value. The result is wrong (and sometimes negative) as soon as the refuge is above Yanis or to his left.
