---
title: Largest almost empty square
---

## Statement
You are given a grid with N rows and M columns. Each cell is either free (`.`) or marked (`#`).

Write a program that finds the largest integer K such that the grid contains a square of K × K cells with **at most T** marked cells. The square must lie entirely inside the grid, with its sides parallel to the borders.

## Input
- The first line contains three integers N, M and T.
- Each of the next N lines contains M characters written together, `.` or `#`.

## Output
A single integer: the largest possible side K. Print `0` if every cell is marked and T is `0`.

## Constraints
- 1 ≤ N, M ≤ 400
- 0 ≤ T ≤ N × M

## Hints
1. Counting the marked cells of a square one by one costs K² operations. With two-dimensional prefix sums, `pref[i][j]` = number of marked cells in the first i rows and the first j columns, this count takes O(1).
2. If a square of side K contains at most T marked cells, so do the smaller squares inside it. So there is no need to try every size at every cell: you only need to know whether you can **beat** the best side found so far.
3. Go through the cells as bottom-right corners. At each cell, as long as the square of side `meilleur + 1` (*meilleur* means "best") ending there fits in the grid and contains at most T marked cells, increase `meilleur`. The total number of increases is at most min(N, M).

## Solution
**Counting the cells of a square quickly.** We compute `pref[i][j]`, the number of marked cells in the rectangle made of the first i rows and the first j columns (with `pref[0][j] = pref[i][0] = 0`). The square of side k whose bottom-right corner is cell (i, j) then contains
`pref[i][j] − pref[i − k][j] − pref[i][j − k] + pref[i − k][j − k]`
marked cells: we remove the band above and the band on the left, then add back the top-left corner, which was removed twice. The array is filled row by row: `pref[i][j] = pref[i − 1][j] + (marked cells among the first j of row i)`.

**Never going back.** If a square of side k works, the square of side k − 1 with the same bottom-right corner lies inside it, so it works too. We go through the cells (i, j) as bottom-right corners, keeping `meilleur`, the largest side found so far. At each cell, we only test the square of side `meilleur + 1`: if it works (and fits in the grid), we increase `meilleur` and try again; otherwise we move on to the next cell.

Why this is correct: take an optimal square of side K and its bottom-right corner c. When we reach c, if `meilleur < K`, the square of side `meilleur + 1` ending at c is inside the optimal square, so it works: `meilleur` goes up to K. And `meilleur` never goes above K, since we only increase it after finding a square that works.

**Complexity.** The `pref` array takes O(N × M). After that, each cell does one test that fails, plus successful tests that increase `meilleur`; there are at most min(N, M) of those in total. Overall: O(N × M), about 160,000 operations.

**Why the naive solution is too slow.** For each size K and each position, counting the cells of the square one by one costs about N × M × K² per size: billions of operations for N = M = 400. Even with prefix sums, trying every size at every cell makes N × M × min(N, M) ≈ 6 × 10⁷ tests: fine in C++, but far too slow in Python. A binary search on K (a square of side K that works proves that K − 1 works too) gives O(N × M × log(min(N, M))), another good solution.

**Traps.**
- The indices of `pref` are shifted by 1 compared to the grid: `pref[i][j]` covers rows 0 to i − 1 of the grid.
- The square of side k only fits in the grid if k ≤ i and k ≤ j: check this before reading `pref[i − k]`.
- The answer can be `0`: when T is `0` and every cell is marked.
