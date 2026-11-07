---
title: Cells covered by rectangles
---

## Statement
A grid has N rows, numbered from 1 to N, and M columns, numbered from 1 to M. Q rectangles are placed on it. Rectangle (R1, C1, R2, C2) covers every cell whose row is between R1 and R2 and whose column is between C1 and C2 (inclusive). Rectangles can overlap: a cell can be covered several times.

Write a program that counts the cells covered by **at least** K rectangles.

## Input
- The first line contains four integers N, M, Q and K.
- Each of the next Q lines contains four integers R1, C1, R2 and C2: a rectangle.

## Output
A single integer: the number of cells of the grid covered by at least K rectangles.

## Constraints
- 1 ≤ N, M ≤ 1,000
- 1 ≤ Q ≤ 5,000
- 1 ≤ K ≤ 5,000
- 1 ≤ R1 ≤ R2 ≤ N and 1 ≤ C1 ≤ C2 ≤ M

## Hints
1. Adding 1 to every cell of every rectangle can cost Q × N × M = 5 × 10⁹ operations. You need to handle each rectangle in constant time, then compute the coverage of all the cells in a single pass over the grid.
2. In one dimension, to add 1 from cell L to cell R, you write `+1` at L and `−1` at R + 1, then take running sums. In two dimensions, the coverage of a cell (r, c) will be the sum of the marks of the cells (x, y) with x ≤ r and y ≤ c: where should you put marks so that a rectangle only counts for its own cells?
3. For rectangle (R1, C1, R2, C2), write `+1` at (R1, C1), `−1` at (R1, C2 + 1), `−1` at (R2 + 1, C1) and `+1` at (R2 + 1, C2 + 1). Then the two-dimensional running sum can be computed row by row: coverage of (r, c) = coverage of (r − 1, c) + sum of the marks of row r, from column 1 to c.

## Solution
**The idea: a two-dimensional difference array.** We keep a grid `diff`, with one extra row and one extra column, filled with 0. For each rectangle (R1, C1, R2, C2), we write four marks:
- `+1` at (R1, C1);
- `−1` at (R1, C2 + 1) and `−1` at (R2 + 1, C1);
- `+1` at (R2 + 1, C2 + 1).

The coverage of a cell (r, c) is then the sum of the `diff[x][y]` for x ≤ r and y ≤ c. Let's check it for one rectangle: if (r, c) is inside, only the `+1` mark at (R1, C1) is in the zone, and the sum is 1. If r > R2 and the column is within the rectangle, the marks `+1` at (R1, C1) and `−1` at (R2 + 1, C1) cancel out. If r > R2 and c > C2, all four marks are in the zone: 1 − 1 − 1 + 1 = 0. The other cases are checked the same way.

**Computing all the sums at once.** We go through the grid row by row. For row r, we keep `cumul`, the sum of the marks of this row from column 1 to c, and the coverage of (r, c) is the coverage of (r − 1, c) plus `cumul`. Only the previous row needs to be kept in memory. At each cell, we compare the coverage with K.

In the first example, rectangles (1, 1, 3, 3) and (2, 2, 4, 5) overlap on the 4 cells of rows 2 and 3, columns 2 and 3, and the small rectangle (3, 1, 3, 1) covers a cell already covered by the first one: 5 cells are covered at least twice.

**Complexity.** O(1) per rectangle, then one pass over the grid: O(Q + N × M), about one million operations.

**Why the naive solution is too slow.** Filling each rectangle cell by cell costs up to N × M = 10⁶ additions per rectangle, that is 5 × 10⁹ for 5,000 large rectangles: several seconds even in C++, far too much in Python.

**Traps.**
- The `diff` grid needs a row N + 1 and a column M + 1, because R2 + 1 and C2 + 1 can go one cell past the grid.
- Forgetting the fourth mark `+1` at (R2 + 1, C2 + 1): the cells below and to the right of the rectangle would have a coverage of −1.
- We count the cells covered **at least** K times, not exactly K times.
