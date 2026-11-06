---
title: The night snow groomer
---

## Statement
Every night, Nathan drives the snow groomer that prepares the slopes of the ski resort. The map of the resort is a grid: `.` is a snow cell, `#` is a fir tree, and `D` is the snow cell where the groomer starts.

Nathan follows a list of orders, each one a letter: `N` (go up one row), `S` (go down one row), `E` (go one column to the right) or `O` (go one column to the left). The letters come from the French words for the directions: *Nord*, *Sud*, *Est*, *Ouest*. If the target cell is a fir tree or is outside the map, Nathan ignores the order and the groomer doesn't move.

Every cell the groomer drives over is groomed, including the starting cell. Write a program that prints the number of **different** cells groomed at the end of the night.

## Input
- The first line contains two integers `H` and `W`: the number of rows and columns of the map.
- The next `H` lines each contain `W` characters among `.`, `#` and `D`: the map. There is exactly one `D`.
- The last line contains the list of orders, written one after the other with no spaces.

## Output
A single integer: the number of different groomed cells.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- The list contains between 1 and 1,000 orders, each one among `N`, `S`, `E`, `O`.

## Hints
1. Keep the groomer's position in two variables: its row and its column. For each order, first compute the target cell, then check that it's inside the map and isn't a fir tree before moving the groomer.
2. The same cell can be groomed several times, but it must only count once. How can you know whether the groomer has already been somewhere?
3. Use a second grid, the same size as the map, filled with `False` (`false` in C++). When the groomer arrives on a cell that is still `False`, set it to `True` and increase your counter.

## Solution
We simulate Nathan's night order by order. The groomer's position is a pair (row, column). For each order, we compute the target cell: `N` subtracts 1 from the row, `S` adds 1 to the row, `E` adds 1 to the column, `O` subtracts 1 from the column. If this cell is inside the map and isn't a `#`, the groomer moves there; otherwise, nothing happens.

To count the different cells, we keep a grid of booleans, `False` everywhere at the start except on the starting cell (in the reference solutions, it's called `damee`, French for "groomed"). At each move, if the new cell wasn't groomed yet, we mark it and increase the counter.

The traps:
- **the meaning of the letters**: `N` makes the groomer go *up* on the map, so it decreases the row number (row `0` is at the top);
- check that the cell is inside the map **before** reading it, otherwise you read outside the array (in Python, an index `-1` would even silently read the last row);
- count the starting cell, even if the groomer never moves;
- counting the moves instead of the different cells: in the first example, the groomer makes 9 moves but grooms only 8 cells.

To create the grid of booleans in Python, add a new list `[False] * w`, `h` times. Careful: `[[False] * w] * h` doesn't work. The `h` rows would all be **the same** list, and ticking one cell would tick the whole column.
