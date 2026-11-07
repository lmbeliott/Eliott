---
title: Checking a magic square
---

## Statement
A square grid of `N` rows and `N` columns is a **magic square** if:
- each integer from 1 to `N × N` appears in it exactly once;
- all rows, all columns and both diagonals have the same sum.

Tell whether a given grid is a magic square.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains `N` integers, separated by spaces.

## Output
`OUI` (yes) if the grid is a magic square, `NON` (no) otherwise.

## Constraints
- 1 ≤ N ≤ 50
- Each value is between 1 and `N × N`.

## Hints
1. To check that each integer appears once, use a list of `N × N + 1` booleans: a value already marked that comes back is a duplicate.
2. Compute the sum of the first row, then compare all the other sums with it: rows, columns, diagonal `g[i][i]` and anti-diagonal `g[i][N - 1 - i]`.
3. Don't forget the diagonals: a grid whose rows and columns have the same sum is not necessarily magic.

## Solution
Check both conditions one after the other; a boolean function for each one makes the program clear.

For the values, create a list `seen` of `N × N + 1` booleans set to `False`. For each cell with value `v`, if `seen[v]` is already true, the value appears twice and the grid is not magic; otherwise, set `seen[v]` to true. Since there are exactly `N × N` cells and each value is between 1 and `N × N`, having no duplicate guarantees that each integer appears exactly once.

For the sums, take the sum of the first row as reference, then compare all the sums of rows, columns and both diagonals with it. You can also notice that the common sum must be `N × (N × N + 1) / 2`: the sum of all integers from 1 to `N × N` is split equally between the `N` rows. For `N = 3`, it is 15.

The first condition is essential: a 3 × 3 grid filled with 5 has all its sums equal to 15, but it is not a magic square. The second one too: swapping two rows of a magic square keeps the row and column sums, but usually breaks the diagonals.

Special cases: the grid `1` of size 1 is magic; no grid of size 2 is.
