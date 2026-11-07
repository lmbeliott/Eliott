---
title: Squares attacked by queens
---

## Statement
A board of `N` rows and `M` columns contains queens `D`, obstacles `#` and empty cells `.`. A queen attacks in a straight line in the 8 directions (horizontal, vertical and diagonal), cell after cell, up to the edge of the board or up to the first non-empty cell, which blocks its view.

Count the **empty** cells attacked by at least one queen.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `N` lines contains `M` characters among `D`, `#` and `.`.

## Output
The number of empty cells attacked by at least one queen.

## Constraints
- 1 ≤ N ≤ 40 and 1 ≤ M ≤ 40

## Hints
1. A cell can be attacked by several queens: to count it only once, mark it in a grid of booleans, then count the marked cells at the end.
2. Store the 8 directions in two lists `di` and `dj`. For each queen and each direction, move step by step as long as the next cell is on the board and empty.
3. The moving loop is written with a `while` whose condition checks the bounds first, then the content of the cell.

## Solution
Create a grid `attacked` of `N × M` booleans set to `False`, with a new row per turn of a loop (and not `[[False] * M] * N`, which would make all rows the same list).

For each queen at `(i, j)` and each direction `d` among the 8, start from the neighbouring cell `(i + di[d], j + dj[d])` and move on as long as the cell is on the board and empty: mark it, then go to the next one in the same direction. The loop stops at the edge or on the first occupied cell (queen or obstacle), which is not counted since it is not empty.

The order of the tests in the `while` condition matters: check `0 <= a < N and 0 <= b < M` **before** reading `g[a][b]`. Thanks to `and`, the cell is only read if it exists. Without the test `0 <= a`, Python would silently read the last row with index -1, and the queen would "go through" the edge.

All that's left is to count the marked cells. The program makes at most 8 × 40 steps per queen, and there are at most 1,600 queens: about 500,000 steps, which is fast.
