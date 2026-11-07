---
title: Read a grid in a spiral
---

## Statement
You are given a grid of `H` rows and `W` columns filled with letters. It is read **in a spiral**, clockwise: start from the top-left cell and move to the right. As soon as the next cell is outside the grid or has already been read, turn a quarter turn to the right (right, then down, then left, then up, then right again…), and keep going until every cell has been read, each exactly once.

For example, the grid

```
abcd
efgh
ijkl
```

is read `abcd`, then `hl` going down, then `kji` going left, then `e` going up, then `fg` going right.

Write a program that prints the letters of the grid in the order of this reading.

## Input
- The first line contains two integers `H` and `W`: the number of rows and the number of columns.
- Each of the next `H` lines contains `W` lowercase letters: the grid.

## Output
A single line of `H × W` letters: the grid read in a spiral.

## Constraints
- 1 ≤ H ≤ 100
- 1 ≤ W ≤ 100

## Hints
1. Keep the position `(r, c)` of the cell being read and a direction `(dr, dc)`. Store the four directions in the order you turn: `(0, 1)`, `(1, 0)`, `(0, -1)`, `(-1, 0)`. Turning a quarter turn means moving on to the next direction in this list.
2. Also keep a grid of booleans `seen`, to know which cells have already been read.
3. Run exactly `H × W` loop iterations: read the cell, mark it, then look at the next cell in the current direction. If it is outside the grid or already read, turn before moving.

## Solution
Simulate the reading cell by cell, exactly as the statement describes it.

The four directions are stored in the order you turn: right `(0, 1)`, down `(1, 0)`, left `(0, -1)`, up `(-1, 0)`. The current direction is a number `d` between 0 and 3, and turning a quarter turn means `d = (d + 1) % 4`.

Start from `(0, 0)` with `d = 0`, and repeat `H × W` times:
1. add the letter of cell `(r, c)` to the result and mark the cell in `seen`;
2. compute the next cell `(r + dr, c + dc)`;
3. if it is outside the grid or already marked, turn, and compute the next cell again with the new direction;
4. move.

Why is a single quarter turn always enough? After turning, the new direction leads to a cell that has not been read yet, as long as some are left. And on the very last loop iteration, you compute a next cell without using it: it does not matter if it is outside the grid.

With the two-column grid `ab`, `cd`, `ef`, `gh`, you read `ab`, go down `dfh`, go left `g`, and go up `ec`: the answer is `abdfhgec`.

Pitfalls:
- reading a cell twice, or forgetting one, when the grid has a single row or a single column, or when a single row is left in the middle: the `seen` grid handles all these cases at once;
- turning the wrong way: after right comes down;
- stopping when you are stuck instead of counting the cells: you know you must read exactly `H × W` of them.

Another method reads the grid layer by layer, keeping the numbers of the first and last row and column not read yet. It works too, but needs more care with layers made of a single row or a single column.
