---
title: Rectangles with area at most K
---

## Statement
A grid has `N` rows and `M` columns of square cells. A **rectangle** of the grid is a block of cells made of consecutive rows and consecutive columns; its area is its number of cells. Two rectangles are different if they don't cover exactly the same cells.

Count the rectangles of the grid whose area is at most `K`.

For example, in a grid of 2 rows and 3 columns, with `K = 2`, there are 6 rectangles of one cell, 4 horizontal rectangles of 2 cells and 3 vertical rectangles of 2 cells: the answer is 13.

## Input
A single line containing three integers `N`, `M` and `K` separated by spaces.

## Output
A single integer: the number of rectangles with area less than or equal to `K`.

## Constraints
- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 500
- 1 ≤ K ≤ 250,000
- The answer can exceed 10⁹: in C++, use a `long long`.

## Hints
1. Trying every position of every rectangle takes four nested loops and billions of turns: far too many. Group the rectangles by dimensions.
2. In how many places can a rectangle of height `h` and width `w` be placed? Count the possible positions of its top row, then of its left column.
3. There are `(N - h + 1) × (M - w + 1)` rectangles of height `h` and width `w`. Two nested loops on `h` and `w` are enough: add that number when `h × w ≤ K`.

## Solution
Group the rectangles by their dimensions: a height `h` (from 1 to `N`) and a width `w` (from 1 to `M`). A rectangle of height `h` has its top row between row 1 and row `N - h + 1`: that's `N - h + 1` choices. Likewise, its left column has `M - w + 1` choices. Each choice of top row combines with each choice of left column, so there are `(N - h + 1) × (M - w + 1)` rectangles of dimensions `h × w`.

The program runs two nested loops on `h` and `w` and, when `h × w ≤ K`, adds that number to the total. That's at most 500 × 500 = 250,000 turns. Check on the example (`N = 2`, `M = 3`, `K = 2`): `1 × 1` gives `2 × 3 = 6`, `1 × 2` gives `2 × 2 = 4`, `2 × 1` gives `1 × 3 = 3`, and the other dimensions have an area above 2. Total: 13.

The direct method, which tries each rectangle with four loops (top row, bottom row, left column, right column), would take about 15 billion turns in the worst case: far too slow. Grouping the objects to count by "type" and counting each type with a computation is a very common idea.

In C++, the answer reaches about 1.6 × 10¹⁰ when `K` is large: you need a `long long` for the total.
