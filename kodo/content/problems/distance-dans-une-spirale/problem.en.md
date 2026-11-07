---
title: Distance in a spiral
---

## Statement
The integers 1, 2, 3… are written in the cells of an infinite grid, in a spiral: `1` is in a cell, `2` in the cell to its right, then the spiral turns anticlockwise: `3` above `2`, `4` and `5` to the left, `6` and `7` downwards, `8`, `9` and `10` to the right, and so on. Here is the centre of the grid:

```
17 16 15 14 13
18  5  4  3 12
19  6  1  2 11
20  7  8  9 10
21 22 23 24 25
```

The **distance** between two numbers is the minimum number of steps to go from the cell of one to the cell of the other, moving at each step from a cell to a cell that shares a side with it (left, right, up or down). For example, the distance between `12` and `21` is 7.

Write a program that answers `Q` questions: for each one, it prints the distance between two numbers `A` and `B`.

## Input
- The first line contains the integer `Q`, the number of questions.
- The next `Q` lines each contain two integers `A` and `B`.

## Output
`Q` lines: for each question, in order, the distance between `A` and `B`.

## Constraints
- 1 ≤ Q ≤ 10
- 1 ≤ A, B ≤ 1 000 000 000

## Hints
1. Write a function that gives the position of a number: its column `x` (positive to the right) and its row `y` (positive upwards), with `1` at `(0, 0)`. The distance between `A` and `B` is then `|xA - xB| + |yA - yB|`. Since a simple function returns only one value, you can write two: one for `x`, one for `y`. Careful: following the spiral cell by cell up to a billion would be far too slow.
2. Look at the odd squares: `9 = 3 × 3` is in the bottom-right corner of the 3 by 3 square around `1`, and `25 = 5 × 5` in the bottom-right corner of the 5 by 5 square. The numbers from `(2k - 1)² + 1` to `(2k + 1)²` form **ring** number `k`, the edge of the square of side `2k + 1`. A function `ring(n)` can find the smallest `k` such that `(2k + 1)² ≥ n`.
3. Ring `k` holds `8k` numbers, split into four sides of `2k` numbers: the right side (going up), the top side (going left), the left side (going down), then the bottom side (going right). Compute `m = n - (2k - 1)²`, the rank of `n` on its ring (from 1 to `8k`): on the right side, `m ≤ 2k`, and the position is `(k, -k + m)`.

## Solution
Split the problem into small functions:
- `ring(n)` finds the ring of `n`;
- `x(n)` and `y(n)` give the column and the row of `n`;
- `distance(a, b)` combines them: `|xa - xb| + |ya - yb|`.

In the reference solutions, these functions are called `anneau`, `abscisse`, `ordonnee` and `distance`.

For the ring: the square of side `2k + 1` centred on `1` holds exactly the numbers from 1 to `(2k + 1)²`, and the latter is in its bottom-right corner, at `(k, -k)`. So the ring of `n` is the smallest `k` such that `(2k + 1)² ≥ n`: a `while` loop finds it in at most 15 812 turns for a billion (far fewer than the 10⁹ steps needed to follow the spiral cell by cell).

For the position: the first number of ring `k`, `(2k - 1)² + 1`, is just to the right of the corner of the previous ring, at `(k, -k + 1)`. With `m = n - (2k - 1)²`, between 1 and `8k`:
- if `m ≤ 2k`: right side, going up, position `(k, -k + m)`;
- else if `m ≤ 4k`: top side, going left, position `(k - (m - 2k), k)`;
- else if `m ≤ 6k`: left side, going down, position `(-k, k - (m - 4k))`;
- otherwise: bottom side, going right, position `(-k + (m - 6k), -k)`.

The number `1` (ring 0) is a special case: its position is `(0, 0)`.

Example: for `21`, we have `k = 2` (since 9 < 21 ≤ 25) and `m = 21 - 9 = 12`. As 8 < 12 ≤ 12, it's the left side: `(-2, 2 - (12 - 8)) = (-2, -2)`. For `12`, `m = 3 ≤ 4`, right side: `(2, 1)`. The distance is `|2 - (-2)| + |1 - (-2)| = 7`.

Each function can be checked separately on the drawing in the statement, which helps find off-by-one mistakes quickly — they are very easy to make here. In C++, `(2k + 1)²` stays at most a little above a billion: an `int` is enough.
