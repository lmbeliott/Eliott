---
title: The crevasse field
---

## Statement
On the Valcorde glacier, the guides have spotted all the crevasses. Their map is a grid where a crevasse is written `*` and a cell of safe ice is written `.`.

To help hikers, Awa wants to make a new map: each safe cell is replaced by the number of crevasses among its **eight** neighbouring cells (above, below, left, right and the four diagonals). Crevasses stay written as `*`.

Write a program that prints Awa's map.

## Input
- The first line contains two integers `H` and `W`: the number of rows and columns.
- The next `H` lines each contain `W` characters, `*` or `.`: the guides' map.

## Output
`H` lines of `W` characters: Awa's map. Each `*` stays a `*`, and each `.` is replaced by a digit between `0` and `8`.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50

## Hints
1. Handle the cells one by one. For a safe cell `(i, j)`, its eight neighbours are the cells `(i + di, j + dj)` where `di` and `dj` are each `-1`, `0` or `1`, except `di = dj = 0` (that's the cell itself).
2. A cell on the edge of the map has fewer than eight neighbours. Before reading `grid[i + di][j + dj]`, check that the row is between `0` and `H - 1` and that the column is between `0` and `W - 1`.
3. Build each row of the new map in a string, adding either `*` or the number of crevasses converted to text (`str(count)` in Python, `(char)('0' + count)` in C++), then print it.

## Solution
For each cell `(i, j)`:
- if it's a crevasse, we write `*`;
- otherwise, we count the neighbouring crevasses with two small loops on `di` and `dj` going from `-1` to `1`. We skip the case `di = dj = 0`, then check that the neighbour `(i + di, j + dj)` really is inside the map before looking whether it's a `*`.

This way, we build each row of the new map and print it.

The traps:
- **the edges**: in Python, `grid[-1]` doesn't cause an error but means the last row! The program would be wrong without telling you. In C++, reading outside the array can give anything. The bounds check is essential;
- don't count the cell itself: it makes no difference here (the cell is safe), but it's a good habit;
- don't change the guides' map while you go through it: a digit written too early would be read again as a cell. Write the result into a new map (or print it directly).
