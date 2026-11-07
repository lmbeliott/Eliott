---
title: Maximum-sum rectangle
---

## Statement
A grid of `R` rows and `C` columns contains integers, positive or negative. Find a rectangle of cells (at least one cell), made of consecutive rows and consecutive columns, whose sum of values is as large as possible. Print this sum.

## Input
- The first line contains `R` and `C`.
- Each of the next `R` lines contains `C` integers.

## Output
The largest sum of a rectangle.

## Constraints
- 1 ≤ R ≤ 25
- 1 ≤ C ≤ 1,000
- The values are between −99 and 99.

## Hints
1. With a single row, this is the best-stretch problem of the lesson, solved in one pass.
2. Fix the first row `top` and the last row `bottom` of the rectangle. If each column is replaced by the sum of its cells between `top` and `bottom`, what does the problem become?
3. When `bottom` increases by 1, each column sum increases by the value of the new row: no need to recompute everything.

## Solution
A rectangle is determined by its first row `top`, its last row `bottom`, its first column `l` and its last column `r`. Fix `top` and `bottom`, and let `col[j]` be the sum of the cells of column `j` between rows `top` and `bottom`. The sum of the rectangle is then `col[l] + col[l + 1] + … + col[r]`: the sum of a stretch of the array `col`. So the best rectangle on rows `top` to `bottom` is obtained with the lesson's `best_stretch` function, applied to `col`: a single pass over `C` cells.

Try every pair `top ≤ bottom`: for each `top`, start from `col` filled with zeros, then move `bottom` down from `top` to `R − 1`, adding row `bottom` to `col` each time. This array thus always equals the column sums between `top` and `bottom`, without ever recomputing everything. Since every rectangle has a first and a last row, it is examined for its pair `(top, bottom)`, and the largest of the results is the answer.

**Cost.** There are `R × (R + 1) / 2` pairs of rows, that is 325 for `R = 25`, and each one takes two passes over the `C` columns: about 650,000 steps. Trying every rectangle and adding up its cells would take billions of operations. The best rectangle can be negative (all cells negative): as in the lesson, initialise the maximum with a real cell, not with 0. The small dimension `R ≤ 25` is the one in the double loop: it is the one that gets repeated.
