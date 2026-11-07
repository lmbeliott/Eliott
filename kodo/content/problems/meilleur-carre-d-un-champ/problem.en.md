---
title: Best square of a field
---

## Statement
A field is divided into `N` rows and `M` columns of plots; each plot holds between 0 and 9 trees. We want to buy a square of `K × K` plots holding as many trees as possible.

Print this number of trees, then the row and the column of the top-left plot of such a square. If several squares are possible, choose the one with the smallest row, then, for equal rows, the one with the smallest column. Rows and columns are numbered from 1.

## Input
The first line contains `N`, `M` and `K`. Each of the next `N` lines contains `M` digits, without spaces.

## Output
Three integers on one line: the number of trees, the row and the column of the top-left corner.

## Constraints
- 1 ≤ N, M ≤ 300
- 1 ≤ K ≤ min(N, M)

## Hints
1. There are up to 90,000 positions for the square, and each can hold 22,500 plots: adding cell by cell is far too slow.
2. In two dimensions, `S[i][j]` = number of trees in the rectangle of rows 1 to `i` and columns 1 to `j`, with zeros on row 0 and column 0.
3. It is computed by `S[i][j] = S[i−1][j] + S[i][j−1] − S[i−1][j−1] + champ[i][j]`, and a rectangle is obtained from four values of `S`.

## Solution
Compute the **two-dimensional prefix sums**: `S[i][j]` is the number of trees in the rectangle of rows 1 to `i` and columns 1 to `j`. With `S[0][j] = S[i][0] = 0`, `S[i][j] = S[i−1][j] + S[i][j−1] − S[i−1][j−1] + champ[i][j]`: the two neighbouring rectangles overlap on the rectangle `S[i−1][j−1]`, counted twice, which is removed once.

The square whose bottom-right corner is `(i, j)` covers rows `i − K + 1` to `i` and columns `j − K + 1` to `j`. By the same inclusion-exclusion argument, it holds `S[i][j] − S[i−K][j] − S[i][j−K] + S[i−K][j−K]` trees. Go through the corners `(i, j)` row by row, then column by column, and only keep a square if it is **strictly** better than the previous one: the first optimal square met is the one with the smallest row, then the smallest column. The top-left corner is `(i − K + 1, j − K + 1)`.

**Cost.** About N × M operations for `S`, then four reads per square: a little over 10⁵ operations in total. The direct method makes up to (N − K + 1)² × K² additions, that is about 5 × 10⁸ for N = M = 300 and K = 150. The traps: indices shifted by 1, and a forgotten `+ S[i−K][j−K]`.
