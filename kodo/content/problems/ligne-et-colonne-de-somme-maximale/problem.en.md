---
title: Row and column with the largest sum
---

## Statement
A grid of `N` rows and `M` columns contains integers. Find the row whose values have the largest sum, and the column whose values have the largest sum.

Rows are numbered from 1 to `N` from top to bottom, columns from 1 to `M` from left to right. In case of a tie, choose the smallest number.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `N` lines contains `M` integers, separated by spaces.

## Output
- On the first line, the number of the row with the largest sum.
- On the second line, the number of the column with the largest sum.

## Constraints
- 1 ≤ N ≤ 100 and 1 ≤ M ≤ 100
- The values are between -1,000 and 1,000.

## Hints
1. Read the grid line by line into a list of lists.
2. For the sum of column `j`, fix `j` and let `i` go from 0 to `N - 1`.
3. To follow the tie rule, only replace the best one if the new sum is **strictly** larger. Careful: the sums can be negative.

## Solution
Read the grid, then compute each row sum with a loop on `j`, and each column sum with an outer loop on `j` and an inner loop on `i`.

To keep the best one, keep the first sum computed (while the best index is still -1), then only replace it if a sum is strictly larger: in case of a tie, the smallest number is kept. Initialising the best sum to 0 would be wrong, because all the sums can be negative.

Don't forget to print the numbers starting from 1: index `i` of the program is row `i + 1`. Finally, the grid is not necessarily square: the column loop goes up to `M`, the row loop up to `N`.
