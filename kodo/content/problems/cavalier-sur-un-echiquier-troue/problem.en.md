---
title: Knight on a board with holes
---

## Statement
A board with `R` rows and `C` columns contains free squares and holes. A knight, placed on square `S`, must reach square `T`. As in chess, it moves two squares in one direction (horizontal or vertical) then one square in the perpendicular direction: from a square, it has up to 8 destinations. It jumps over the intermediate squares, holes included, but can never stop on a hole or leave the board.

Compute the minimum number of moves to go from `S` to `T`, or print `-1` if it is impossible.

## Input
- The first line contains two integers `R` and `C`.
- Each of the next `R` lines contains `C` characters: `.` for a free square, `#` for a hole, `S` for the start and `T` for the target.

The board contains exactly one `S` and one `T`, on different squares.

## Output
A single integer: the minimum number of moves, or `-1`.

## Constraints
- 1 ≤ R, C ≤ 200
- 2 ≤ R × C

## Hints
1. Each free square is a vertex; each possible knight move is an edge. The answer is a distance in this graph.
2. The 8 moves can be written as a list of offsets `(dr, dc)`: `(±1, ±2)` and `(±2, ±1)`.
3. As on a chessboard, a knight changes square colour at every move: if the answer exists, its parity is known in advance, which helps checking results by hand.

## Solution
The graph has the free squares as vertices and the knight moves as edges. It is not built: from a square `(r, c)`, the 8 neighbours are `(r + dr, c + dc)` for the 8 offsets `(±1, ±2)`, `(±2, ±1)`, provided they stay on the board and do not land on a hole.

A breadth-first search from `S`, with a distance array initialised to `-1`, gives the distance of each reachable square; the answer is that of `T`. By the lesson, it is indeed the minimum number of moves.

**Complexity.** Each square enters the queue at most once and examines 8 neighbours: O(R × C), at most 320,000 examinations.

**Remark.** The knight changes chessboard colour at every move: if `S` and `T` have the same colour, the answer is even. On a board with 2 rows, each move shifts the knight by exactly 2 columns, so the parity of its column never changes; on a 3 × 3 board, the central square is unreachable. These are good tests.
