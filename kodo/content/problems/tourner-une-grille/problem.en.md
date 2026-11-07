---
title: Rotate a grid
---

## Statement
You are given a grid of `H` rows and `W` columns. Write a program that prints this grid after turning it a quarter turn **clockwise**.

After the rotation, the grid has `W` rows and `H` columns. The first column of the starting grid, read from bottom to top, becomes the first row of the new grid. For example:

```
abc        da
def   →    eb
           fc
```

## Input
- The first line contains two integers `H` and `W`: the number of rows and the number of columns.
- The next `H` lines each contain `W` characters: lowercase letters, `.` or `#`.

## Output
`W` lines of `H` characters each: the rotated grid.

## Constraints
- 1 ≤ H ≤ 100
- 1 ≤ W ≤ 100

## Hints
1. Try it on paper with the example `abc` / `def`. Where does the bottom-left cell, `d`, end up? And the top-left cell, `a`?
2. Row `i` of the new grid is made of column `i` of the old grid, read **from bottom to top**: starting from row `H - 1` down to row 0.
3. Build each new row character by character: for `i` from 0 to `W - 1`, go through `r` from `H - 1` down to 0, add `grid[r][i]`, then print the row you got.

## Solution
Let's see where each cell goes. When you turn a quarter turn to the right, the left column lies down and becomes the top row: its bottom cell (`d` in the example) ends up on the far left, and its top cell (`a`) on the far right. More generally, row `i` of the new grid is column `i` of the old one, read from bottom to top.

So the program uses two nested loops:
- the outer loop picks the new row `i`, from 0 to `W - 1` (one per column of the old grid);
- the inner loop goes through the rows `r` of the old grid, from `H - 1` down to 0, and adds `grid[r][i]` to the new row.

Print each new row as soon as it's finished. As a formula: the character in row `i` and column `j` of the new grid is `grid[H - 1 - j][i]`.

In the reference solutions, the grid is called `grille` and the row index `l` (for *ligne*, French for "row").

The traps:
- swapping the dimensions: the new grid has `W` rows of `H` characters, not the other way round; a grid that isn't square shows it straight away;
- turning the wrong way: reading the columns from top to bottom gives a grid flipped as in a mirror, not rotated. Always check on a small example.
