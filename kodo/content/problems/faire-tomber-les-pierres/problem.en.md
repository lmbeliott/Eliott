---
title: Making stones fall
---

## Statement
A vertical grid of `N` rows and `M` columns contains stones `o`, fixed blocks `#` and empty cells `.`. The stones fall down: each one goes down as long as the cell just below it is empty. It stops on the bottom of the grid, on a fixed block or on a stone that has already stopped. Fixed blocks do not move.

Print the grid once no stone can move any more.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `N` lines contains `M` characters among `o`, `#` and `.`. The first line is the top of the grid.

## Output
`N` lines of `M` characters: the final grid.

## Constraints
- 1 ≤ N ≤ 100 and 1 ≤ M ≤ 100

## Hints
1. Columns are independent: a stone never leaves its column.
2. In a column, go through the cells **from bottom to top**, keeping the row `free` where the next stone met will land.
3. At the start, `free` is the last row. A block `#` on row `i` gives `free = i - 1`; a stone is moved to row `free`, then `free` goes up by one row.

## Solution
A stone never changes column, and in a column, the stones that are above the same fixed block (or the bottom), with no other block between them, end up piled on that block. So each column is handled separately.

Read the grid as lists of characters (`list(input())`) to be able to modify it. For a column `j`, go through `i` from `N - 1` down to 0 keeping `free`, the lowest row still available, which is `N - 1` at the start:
- if the cell is a block `#`, nothing can go below it: `free = i - 1`;
- if it is a stone, remove it from row `i` and put it on row `free`, then decrease `free` by 1;
- if the cell is empty, do nothing.

Since you go from bottom to top, `free` is always greater than or equal to `i` when you meet a stone: you move it down or leave it in place. You must remove the stone **before** putting it down, otherwise a stone already in place (`free == i`) would be erased.

Another method, slower but correct: repeat "each stone with an empty cell below goes down by one cell" until nothing moves. It may need `N` passes over the whole grid, up to a million operations, which is still acceptable here.
