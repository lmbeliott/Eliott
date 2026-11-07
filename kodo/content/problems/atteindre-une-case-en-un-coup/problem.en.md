---
title: Reach a square in one move
---

## Statement
On a very large chessboard, rows and columns are numbered starting from 1. A queen stands on the square in row `L1` and column `C1`. In one move, the queen goes in a straight line as many squares as she wants, in one of eight directions:
- along her row (only the column changes);
- along her column (only the row changes);
- diagonally: at each square, the row and the column both change by 1.

Only one other piece is on the board: an obstacle, on the square in row `L3` and column `C3`. The queen can neither stop on the obstacle nor jump over it.

Write a program that prints `OUI` (French for "yes") if the queen can reach the square in row `L2` and column `C2` in a single move, and `NON` ("no") otherwise.

## Input
- The first line contains two integers `L1` and `C1`: the square of the queen.
- The second line contains two integers `L2` and `C2`: the square to reach.
- The third line contains two integers `L3` and `C3`: the square of the obstacle.

The three squares are different.

## Output
A single word: `OUI` if the queen can reach the square in one move, `NON` otherwise.

## Constraints
- 1 ≤ L1, C1, L2, C2, L3, C3 ≤ 1,000,000,000

## Hints
1. Forget about the obstacle at first. Let `DL = L2 - L1` and `DC = C2 - C1`. For each of the three kinds of moves, what can you say about `DL` and `DC`? Careful, a diagonal can go up or down.
2. On a diagonal, `DL = DC` in one direction, and `DL = -DC` in the other one. If none of the four conditions `DL = 0`, `DC = 0`, `DL = DC`, `DL = -DC` is true, the answer is `NON`.
3. What remains is to know whether the obstacle is in the way. Handle each kind of move separately. For example, along a row: the obstacle blocks if it is on the same row (`L3 = L1`) and if its column is between `C1` and `C2`. For a diagonal, the obstacle must be on **the same** diagonal as the queen, and its row between `L1` and `L2`.

## Solution
Let `DL = L2 - L1` and `DC = C2 - C1` be the move to make, and likewise `OL = L3 - L1` and `OC = C3 - C1` the position of the obstacle seen from the queen.

**Is the square in one of the queen's directions?** Along a row, `DL = 0`. Along a column, `DC = 0`. On a diagonal, the row and the column change by the same number of squares: either in the same direction (`DL = DC`) or in opposite directions (`DL = -DC`). If none of these four conditions is true, the answer is `NON`.

**Is the obstacle in the way?** It must be on the same line as the move, and between the queen and the target square:
- along a row (`DL = 0`): `OL = 0`, and `C3` is between `C1` and `C2`;
- along a column (`DC = 0`): `OC = 0`, and `L3` is between `L1` and `L2`;
- on the diagonal `DL = DC`: `OL = OC`, and `L3` is between `L1` and `L2`;
- on the diagonal `DL = -DC`: `OL = -OC`, and `L3` is between `L1` and `L2`.

"`X` is between `A` and `B`" is written `(A < X and X < B) or (B < X and X < A)`, because you don't know which of `A` and `B` is the smaller one. Since the three squares are different, strict inequalities are fine.

Example: the queen on `(4, 4)` and the square `(8, 8)`. We have `DL = DC = 4`: it's the diagonal. The obstacle on `(6, 6)` satisfies `OL = OC = 2`, and its row 6 is between 4 and 8: it blocks, the answer is `NON`.

The traps:
- trying only one of the two diagonals;
- only checking whether the obstacle is between both squares "inside the rectangle": on `(5, 7)`, it is between the queen `(4, 4)` and the square `(8, 8)` both by rows and by columns, but it is not on the diagonal, and it blocks nothing;
- forgetting that the obstacle can be on the right line, but **behind** the target square, or behind the queen: then it is not in the way.

A board with a billion rows can't be walked square by square: a few comparisons are enough.
