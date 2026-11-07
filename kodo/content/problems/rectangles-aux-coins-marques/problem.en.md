---
title: Rectangles with marked corners
---

## Statement
You are given a grid of `H` rows and `W` columns. Each cell is marked (`#`) or empty (`.`).

We are looking for the rectangles whose sides follow the rows and columns of the grid, and whose **four corners** are marked cells. Such a rectangle is given by two different rows and two different columns: its corners are the four cells where they cross. Only the corners matter: the other cells of the rectangle can be marked or empty.

Write a program that prints the number of these rectangles.

## Input
- The first line contains two integers `H` and `W`.
- Each of the next `H` lines contains `W` characters among `#` and `.`: the grid.

## Output
A single integer: the number of rectangles whose four corners are marked.

## Constraints
- 1 ≤ H ≤ 200
- 1 ≤ W ≤ 200

## Hints
1. Trying every pair of rows and every pair of columns is too slow: for a fully marked 200 × 200 grid, there are almost 400 million rectangles to count one by one.
2. Fix only the two rows of the rectangle, the top one and the bottom one. Which columns can then be used as sides?
3. If `k` columns have a marked cell on both chosen rows, any pair of these columns forms a valid rectangle. There are `k × (k - 1) / 2` pairs.

## Solution
First choose the top row and the bottom row of the rectangle. A column can be used as a side if it has a marked cell on **both** rows; call `k` the number of such columns. Any pair of these `k` columns gives a rectangle whose four corners are marked, and no other choice of columns works. The number of pairs of columns is `k × (k - 1) / 2`: `k` choices for the first column, `k - 1` for the second, divided by 2 because the order of the two columns does not matter.

So the program goes through every pair of rows `top < bottom`. For each one, it counts `k` by going through the columns, then adds `k × (k - 1) / 2` to the total.

With the second sample grid:

```
##.##
#.###
.####
##..#
```

Rows 1 and 2 have three marked columns in common (the 1st, the 4th and the 5th), which gives 3 rectangles. Pairs (1, 3), (1, 4) and (2, 3) also give 3 rectangles each, and pairs (2, 4) and (3, 4) give only one. The total is 3 + 3 + 3 + 3 + 1 + 1 = 14.

There are about `H² / 2` pairs of rows, and each one takes `W` steps: for a 200 × 200 grid, that is about 4 million steps. Also trying every pair of columns would multiply this work by about 100: much too slow, especially in Python.

Pitfalls:
- counting the rectangles completely filled with `#`: only the corners matter;
- counting a rectangle of zero height or zero width: the two rows must be different, and so must the two columns. That is why you take `bottom > top`, and `k × (k - 1) / 2` pairs of **different** columns;
- counting each rectangle twice, by taking the two rows in both orders.
