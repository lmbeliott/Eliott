---
title: Rolling a die
---

## Statement
A six-sided die is placed on square `S` of a grid with `R` rows and `C` columns. As on any die, two opposite faces add up to 7. At the start, face `1` is on top, face `2` faces north (the top of the grid) and face `3` faces east (the right).

A move **tips** the die over one of its bottom edges, onto a neighbouring square (north, south, east or west) that is not a wall. When tipping east, for example, the west face comes on top, the top face goes east, the east face goes underneath and the bottom face goes west; the north and south faces do not move.

Compute the minimum number of moves for the die to stand on square `T` with face `F` on top, or print `-1` if it is impossible.

## Input
- The first line contains three integers `R`, `C` and `F`.
- Each of the next `R` lines contains `C` characters: `.` for a free square, `#` for a wall, `S` for the start and `T` for the target.

The grid contains exactly one `S` and one `T`, on different squares.

## Output
A single integer: the minimum number of moves, or `-1`.

## Constraints
- 1 ≤ R, C ≤ 50
- 2 ≤ R × C
- 1 ≤ F ≤ 6

## Hints
1. The square alone does not describe the situation: you also need to know how the die is turned. Three faces (top, north, east) are enough, the three others are their opposites.
2. Write the new faces (top, north, east) after tipping in each of the 4 directions, using the fact that the face opposite `x` is `7 − x`.
3. A die can be turned in 24 ways: there are at most 24 × 50 × 50 = 60,000 states. A breadth-first search over the states `(row, column, top, north, east)` gives the answer.

## Solution
A state is the position of the die and its **orientation**. The orientation is described by three faces: `h` (top), `n` (north) and `e` (east); the bottom is `7 − h`, the south `7 − n` and the west `7 − e`. Tipping gives:
- north: `(h, n, e) → (7 − n, h, e)` (the south face comes up, the top goes north);
- south: `(h, n, e) → (n, 7 − h, e)`;
- east: `(h, n, e) → (7 − e, n, h)`;
- west: `(h, n, e) → (e, n, 7 − h)`.

Run a breadth-first search in the implicit graph of states `(i, j, h, n, e)`, from `(S, 1, 2, 3)`, refusing walls. Each state is encoded by an integer (`((h × 7 + n) × 7 + e) × R × C + i × C + j`, always below 343 × R × C) so that a distance array can be used. The answer is the distance of the first dequeued state lying on `T` with `h = F`. It is indeed a minimum, since each sequence of tips corresponds to a path of the state graph, of the same length.

**Complexity.** A die has exactly 24 orientations: 6 choices for the top face, then 4 for the north face. The search visits at most 24 × R × C = 60,000 states, with 4 neighbours each.

**Remarks.** In a corridor of a single row, the die only rolls east or west: the north face never changes, and face `2` never comes on top. On a 2 × 2 grid, only three faces can come on top: `1`, `2` and `4` if `S` is in the top-left corner. On a large grid, every face can come on top on every square, but the search shows that only 12 of the 24 orientations are possible on a given square. From the starting orientation, rolling around a 2 × 2 block of squares east, south, west then north brings the die back to its place with face `4` on top; in the other direction, face `5` ends on top.
