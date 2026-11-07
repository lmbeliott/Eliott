---
title: Same colour on a checkerboard
---

## Statement
A very large checkerboard is made of black and white cells. Its rows and columns are numbered starting from 1. The cell in row 1 and column 1 is black, and two cells that share a side always have different colours.

Write a program that reads the position of two cells and prints `OUI` if they have the same colour, `NON` otherwise (`OUI` and `NON` are French for "yes" and "no").

## Input
- The first line contains two integers `L1` and `C1`: the row and the column of the first cell.
- The second line contains two integers `L2` and `C2`: the row and the column of the second cell.

Both cells may be the same cell.

## Output
A single word: `OUI` if both cells have the same colour, `NON` otherwise.

## Constraints
- 1 ≤ L1, C1, L2, C2 ≤ 1 000 000 000

## Hints
1. Draw the top-left corner of the board and write, in each cell, the sum of its row number and its column number. What do you notice about the black cells?
2. A cell is black when the sum `L + C` is even, and white when it is odd. The remainder of the division by 2 (`%`) tells you whether a number is even.
3. Two cells have the same colour when both sums are even, or both are odd: compare the remainders `(L1 + C1) % 2` and `(L2 + C2) % 2`.

## Solution
When you move one cell to the right, the column goes up by 1 and the colour changes. When you move one cell down, the row goes up by 1 and the colour changes too. In both cases, the sum `L + C` goes up by 1: it goes from even to odd, or from odd to even. Since cell `(1, 1)` is black and `1 + 1 = 2` is even, a cell is black exactly when `L + C` is even.

So you just compare the parity of both sums: if `(L1 + C1) % 2` is equal to `(L2 + C2) % 2`, the cells have the same colour and you print `OUI`, otherwise `NON`.

Drawing the whole board is impossible: it may have a billion rows. The remark about parity lets you answer with a single computation. In C++, the sum `L + C` can reach 2 billion, which just fits in an `int` (the limit is a little over 2.1 billion).
