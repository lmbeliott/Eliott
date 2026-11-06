---
title: Cells visited by a robot
---

## Statement
A robot moves around a grid. Each cell is either free (`.`) or holds an obstacle (`#`). The cell `D` is the free cell where the robot starts.

The robot follows a list of orders, each one a letter: `N` (north: go up one row), `S` (south: go down one row), `E` (east: go one column to the right) or `O` (west, *ouest* in French: go one column to the left). If the target cell is an obstacle or is outside the grid, the order is ignored and the robot doesn't move.

Write a program that prints the number of **different** cells visited by the robot, including the starting cell.

## Input
- The first line contains two integers `H` and `W`: the number of rows and columns of the grid.
- The next `H` lines each contain `W` characters among `.`, `#` and `D`: the grid. There is exactly one `D`.
- The last line contains the list of orders, written one after the other with no spaces.

## Output
A single integer: the number of different visited cells.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- The list contains between 1 and 1,000 orders, each one among `N`, `S`, `E`, `O`.

## Hints
1. Keep the robot's position in two variables: its row and its column. For each order, first compute the target cell, then check that it's inside the grid and isn't an obstacle before moving the robot.
2. The same cell can be visited several times, but it must only count once. How can you know whether the robot has already been somewhere?
3. Use a second grid, the same size as the first one, filled with `False` (`false` in C++). When the robot arrives on a cell that is still `False`, set it to `True` and increase your counter.

## Solution
We simulate the path order by order. The robot's position is a pair (row, column). For each order, we compute the target cell: `N` subtracts 1 from the row, `S` adds 1 to the row, `E` adds 1 to the column, `O` subtracts 1 from the column. If this cell is inside the grid and isn't a `#`, the robot moves there; otherwise, nothing happens.

To count the different cells, we keep a grid of booleans, `False` everywhere at the start except on the starting cell (in the reference solutions, it's called `visitee`, French for "visited"). At each move, if the new cell wasn't visited yet, we mark it and increase the counter.

The traps:
- **the meaning of the letters**: `N` makes the robot go *up* in the grid, so it decreases the row number (row `0` is at the top);
- check that the cell is inside the grid **before** reading it, otherwise you read outside the array (in Python, an index `-1` would even silently read the last row);
- count the starting cell, even if the robot never moves;
- counting the moves instead of the different cells: in the first example, the robot makes 9 moves but visits only 8 cells.

To create the grid of booleans in Python, add a new list `[False] * w`, `h` times. Careful: `[[False] * w] * h` doesn't work. The `h` rows would all be **the same** list, and ticking one cell would tick the whole column.
