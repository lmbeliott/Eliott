---
title: Keys and doors
---

## Statement
A grid with `R` rows and `C` columns contains free squares, walls, keys and doors. You start on square `S` and want to reach square `T`; a move goes from a square to a neighbouring one (up, down, left, right), never into a wall.

Keys are written with the letters `a` to `f`, doors with the letters `A` to `F`. Stepping on a key square picks up that key, which is then kept forever. A door `A` can only be entered after picking up at least one key `a`, and likewise for the other letters. The same letter may appear on several keys and several doors.

Compute the minimum number of moves to reach `T`, or print `-1` if it is impossible.

## Input
- The first line contains two integers `R` and `C`.
- Each of the next `R` lines contains `C` characters among `.` (free square), `#` (wall), `S`, `T`, `a` to `f` and `A` to `F`.

The grid contains exactly one `S` and one `T`.

## Output
A single integer: the minimum number of moves, or `-1`.

## Constraints
- 1 ≤ R, C ≤ 40
- 2 ≤ R × C

## Hints
1. The position alone does not describe the situation: going twice through the same square can be useful, if a key was picked up in between.
2. A state is a triple (row, column, keys picked up). The set of keys picked up among 6 is encoded by an integer from 0 to 63: bit `k` is 1 if the key of the `k`-th letter has been picked up.
3. There are at most 40 × 40 × 64 = 102,400 states: a breadth-first search over these states, with a distance array indexed by an integer code, is fast enough.

## Solution
The graph of squares is not enough: you may have to go back after picking up a key (this happens in the second example). So the state is enriched: a vertex of the implicit graph is a triple `(i, j, keys)`, where `keys` is an integer from 0 to 63 whose bit `k` tells whether the key of letter `k` (`a` for 0, `b` for 1…) has been picked up.

From `(i, j, keys)`, try the 4 neighbouring squares: skip a wall, and a door whose bit in `keys` is 0; on a key square, the new set is `keys | (1 << k)`. Each state is encoded by the integer `(keys × R + i) × C + j`, which allows a plain distance array of size `64 × R × C`. A breadth-first search from `(S, 0)` gives the answer: the distance of the first dequeued state lying on `T`.

**Why it is correct.** A path in the grid that follows the rules corresponds exactly to a path in this state graph, of the same length: the set of keys picked up is entirely determined by the squares already visited. The shortest distance in the state graph is therefore the minimum number of moves.

**Complexity.** O(64 × R × C) states, with 4 neighbours each: about 400,000 examinations at most.
