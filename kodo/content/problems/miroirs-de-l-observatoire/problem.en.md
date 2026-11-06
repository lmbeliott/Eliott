---
title: The observatory mirrors
---

## Statement
At the Valcorde observatory, Sofia is adjusting a laser beam used to align the telescopes. The instrument room is a grid of `H` rows and `W` columns. Each cell is either empty (`.`) or holds a mirror placed diagonally (`/` or `\`).

The beam enters the room through the top-left cell, coming from the left: so it moves to the right. It moves forward one cell at a time in its direction. When it reaches a cell with a mirror, it changes direction like this, then goes on to the next cell:
- `/`: a beam going right goes up, going up goes right, going left goes down, going down goes left;
- `\`: a beam going right goes down, going down goes right, going left goes up, going up goes left.

Empty cells don't change the direction of the beam. The beam always ends up leaving the room.

Write a program that prints the number of different cells lit by the beam, that is, crossed at least once (cells with mirrors count too).

## Input
- The first line contains two integers `H` and `W`.
- The next `H` lines each contain `W` characters among `.`, `/` and `\`: the room, seen from above.

## Output
A single integer: the number of different lit cells.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50

## Hints
1. Keep the position of the beam (row, column) and its direction. A handy way to store the direction is a pair `(dr, dc)`: what you add to the row and to the column at each step. Going right is `(0, 1)`; going up is `(-1, 0)`.
2. Simulate the path with a loop "while the beam is in the room": mark the cell, change direction if it's a mirror, then move forward one cell.
3. The beam can go through the same cell several times (in the second example, it goes through the third cell of the first row again). Use a grid of booleans to count each cell only once.

## Solution
We simulate the beam step by step. Its position is `(r, c)`, `(0, 0)` at the start, and its direction is a pair `(dr, dc)`, `(0, 1)` at the start (to the right). While the position is inside the room:
1. if the cell isn't marked yet, we mark it and increase the counter;
2. if the cell holds a mirror, we change direction;
3. we move forward: `r += dr` and `c += dc`.

In the reference solutions, the row is called `l` (for *ligne*, French for "row"), so the direction is written `(dl, dc)`.

To change direction, you can write four `if`s, one for each possible direction. There is also a shortcut: with `/`, the new direction is `(-dc, -dr)`, and with `\`, it's `(dc, dr)`. Check it: with `\`, right `(0, 1)` becomes `(1, 0)`, which is down.

The traps:
- the very first cell may hold a mirror: you have to apply it before taking the first step (with `/` on the first cell, the beam leaves straight away through the top, and only one cell is lit);
- counting steps instead of different cells: the beam can cross its own path, or come back to a mirror from another side;
- in Python, `"\\"` is how you write the character `\`: the backslash on its own is used to write special characters (like `"\n"`). It's the same in C++ with `'\\'`;
- when changing direction, don't overwrite `dr` before using it to compute `dc`: in Python, `dr, dc = dc, dr` does the swap in one go; in C++, use a temporary variable.

Why does the beam always end up leaving? If you know the cell and the direction of the beam at some moment, you can work out where it was just before. So a beam going round in circles forever could never have entered its loop from outside the room.
