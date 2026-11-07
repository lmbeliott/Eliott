---
title: Completing a six-digit grid
---

## Statement
A 6 × 6 grid is cut into six **blocks** of 2 rows and 3 columns. It is **complete** when each row, each column and each block contains each digit from 1 to 6 exactly once.

Some squares are already filled. Count the ways to fill the empty squares to get a complete grid. If two digits already written are incompatible, the answer is 0.

## Input
6 lines of 6 characters: a digit from `1` to `6` for a filled square, `.` for an empty square. The blocks are made of rows 1-2, 3-4 and 5-6, and of columns 1-3 and 4-6.

## Output
A single integer: the number of completions.

## Constraints
- The answer does not exceed 5,000.

## Hints
1. A backtracking search fills the empty squares one by one, trying only the digits missing from the row, the column and the block of the square; it goes back when a square has no possible digit left.
2. To know quickly which digits are possible, keep for each row, each column and each block an integer whose bit `d` is 1 if digit `d` is already there.
3. Fill first the square with the **fewest** possible digits: a square with no choice cuts the branch right away, a square with a single choice creates no branch.

## Solution
Keep three arrays of **masks**: `row[i]`, `column[j]` and `block[b]`, where bit `d` is 1 if digit `d` is already present. The possible digits for square `(i, j)` are the bits set in `0b1111110 & ~(row[i] | column[j] | block[b])`, with `b = (i // 2) × 2 + j // 3`. While reading the grid, also check that no given digit appears twice; otherwise print 0.

The recursive function `count()` looks, among the empty squares, for the one with the fewest possible digits. If there is no empty square left, the grid is complete: it returns 1. Otherwise, for each possible digit of that square, it writes it, updates the three masks, calls itself, then **undoes** those changes; it returns the sum of the results. If the chosen square has no possible digit, the loop does nothing and the branch returns 0.

**Correctness.** Each completion is obtained exactly once: at each call, the branches correspond to different digits for the same square, so they do not overlap, and no valid digit is forgotten.

**Why choose the most constrained square.** The filling order does not change the result, but it changes the size of the tree. A square with no possible digit makes the branch fail at once, instead of letting the program fill other squares before noticing, and a square with a single choice creates no branch. On the tests, this rule divides the number of nodes by 3 to 8 compared with filling in reading order. Checking the digits only once the grid is full would be hopeless: up to 6³⁴ grids to try.

**Complexity.** Each node costs O(36) to find the best square. The number of nodes depends on the grid; on the tests, it does not exceed 40,000.
