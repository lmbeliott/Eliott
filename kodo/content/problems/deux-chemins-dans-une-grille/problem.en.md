---
title: Two paths in a grid
---

## Statement
A grid has `R` rows and `C` columns: each cell is forbidden, or contains a digit from `0` to `9`. A **path** starts at the top-left cell and ends at the bottom-right cell; at each move, it goes to the cell on the right or to the cell below, never stepping on a forbidden cell.

You choose **two** paths, which may cross, share cells or even be identical. Their **value** is the sum of the digits of all cells visited by at least one of the two paths: a cell visited by both paths counts only once.

Write a program that computes the largest possible value of two paths.

## Input
- The first line contains two integers `R` and `C`.
- The next `R` lines, from top to bottom, each contain `C` characters: a digit from `0` to `9`, or `#` for a forbidden cell.

## Output
A single integer: the largest value of two paths, or `-1` if there is no path at all.

## Constraints
- 1 ≤ R, C ≤ 100

## Hints
1. Taking the best path, then the best path among the remaining digits, does not work: look at the second example. Both paths must be chosen **together**.
2. Move both paths **at the same time**, one move each. After `s` moves, each path is on a cell whose row plus column equals `s`: knowing the two rows is enough.
3. A cell `(i, j)` is always reached after exactly `i + j` moves. If both paths go through the same cell, they are there at the same time: with synchronized paths, shared cells are easy to spot.

## Solution
**Why a greedy fails.** In the second example, the best single path is worth `0 + 6 + 2 + 8 + 4 = 20`. After it, what is left is the `2` at the top right and the `5` at the bottom middle, and no path can take both: you get `25`. Yet the paths `0 6 2 5 4` (down, right, down, right) and `0 0 2 8 4` (right, right, down, down) visit every cell except the `0` at the bottom left, for a value of `27`, the sum of the whole grid.

**Moving together.** Number rows and columns from `0`. A cell `(i, j)` is reached after exactly `i + j` moves, whatever the path. So we move both paths together: after `s` moves, the first one is at `(i₁, s − i₁)` and the second at `(i₂, s − i₂)`. Two paths go through a same cell if and only if, at some time `s`, they have the same row `i₁ = i₂`. So we do not need to remember the visited cells: we just count the cell once when `i₁ = i₂`.

**The dynamic programming.** Let `best[s][i₁][i₂]` be the largest value of the beginnings of paths after `s` moves, the first on row `i₁` and the second on row `i₂`. By symmetry, we can require `i₁ ≤ i₂`. Each path comes from the cell above (row `i − 1`) or from the cell on the left (same row): there are four possible previous states.

`best[s][i₁][i₂] = max of the four best[s − 1][p₁][p₂] + digit(i₁, s − i₁) + (digit(i₂, s − i₂) if i₂ ≠ i₁)`

States where a cell is forbidden or outside the grid are impossible. At the start, `best[0][0][0]` is the digit of the top-left cell; the answer is `best[R + C − 2][R − 1][R − 1]`, or `-1` if this state is impossible. We only keep layer `s − 1` to compute layer `s`.

**Complexity.** There are `R + C − 1` layers of at most `R × (R + 1) / 2` states, each computed from 4 states: about 10⁶ states for a `100 × 100` grid, that is **O((R + C) × R²)**.

**Why the naive solution is too slow.** A `100 × 100` grid has more than 10⁵⁸ paths: trying every pair is impossible. A dynamic programming on the two cells `(i₁, j₁, i₂, j₂)` without synchronizing the paths cannot spot shared cells, and it has 10⁸ states.

**Pitfalls.**
- When `i₁ = i₂`, both paths are on the same cell: its digit counts only once. The first example has only one possible path (the `4` is in a dead end), and the answer is `11`, not `22`.
- If the start or end cell is forbidden, or if no path crosses the grid, the answer is `-1` (third example).
- With `i₁ ≤ i₂`, the previous state `(p₁, p₂)` may have `p₁ > p₂` (when `i₁ = i₂`): store it as `(min, max)`.
