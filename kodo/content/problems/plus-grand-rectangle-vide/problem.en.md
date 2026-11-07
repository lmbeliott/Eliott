---
title: Largest empty rectangle
---

## Statement
A plot of land is divided into a grid of L rows and C columns. Each cell is free (`.`) or occupied (`#`). We want to build a rectangular building on it, with sides parallel to the edges of the grid, covering only free cells.

Find the largest possible area, in number of cells.

## Input
The first line contains L and C. The next L lines each contain C characters `.` or `#`.

## Output
The largest area of a rectangle made only of free cells, or `0` if every cell is occupied.

## Constraints
- 1 ≤ L, C ≤ 300

## Hints
1. There are about L² C² / 4 rectangles, 2 × 10⁹ for L = C = 300: impossible to try them all. First fix the bottom row of the rectangle.
2. For a fixed bottom row, let h[c] be the number of consecutive free cells in column c going up from this row. The problem becomes: in a histogram of heights h[0], …, h[C − 1], find the largest rectangle. And h is updated in O(C) from one row to the next.
3. The best rectangle of the histogram has the height of one of its columns, the lowest one. For each column c, it extends on both sides up to the first strictly lower column. A stack finds these columns for every c in O(C).

## Solution
**Fixing the bottom row.** Every free rectangle has a bottom row. For a bottom row l, compute h[c]: the number of consecutive free cells ending at (l, c) in column c. We have h[c] = 0 if cell (l, c) is occupied, and h[c] = (old h[c]) + 1 otherwise. A free rectangle with bottom row l, covering columns g to d, has height at most min(h[g], …, h[d]), and this height is reachable. So what remains is to find, for each row, the largest rectangle under the histogram h.

**Largest rectangle in a histogram.** In an optimal rectangle, the height is that of its lowest column, say c, and the rectangle extends as far as possible: on the left up to the first column g < c lower than h[c] (excluded), and on the right up to the first column d > c lower than h[c] (excluded). Its area is h[c] × (d − g − 1). These bounds are computed for every column with a **stack** of columns of increasing heights. Go through c from 0 to C, with a fake column of height 0 at C. While the top t of the stack has height ≥ h[c], pop it: c is the first column on its right that is at least as low, and the new column on top of the stack is the last one on its left that is strictly lower; compute the area h[t] × (c − top − 1) (with top = −1 if the stack is empty). Then push c.

**Correctness.** For a column t, the right bound used is the first column on its right with height ≤ h[t], not strictly lower. But if several columns of an optimal rectangle have the same minimal height, the rightmost of them gives the complete rectangle: the maximum area is indeed obtained.

**Cost.** Each column is pushed and popped once per row: O(C) per row, O(L × C) in total, about 90,000 cells handled a few times. Trying every pair of columns for each bottom row, while keeping the minimum of the heights up to date, would cost O(L × C²) ≈ 2.7 × 10⁷: too much for Python.
