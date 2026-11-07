---
title: First alignment
---

## Statement
A vertical grid of `H` rows and `W` columns is empty at the start. Two players drop tokens into it in turn, player 1 going first. At each move, the player chooses a column, and their token falls down to the lowest free cell of that column.

A player forms an **alignment** when at least `K` of their tokens follow each other without a gap on the same straight line: horizontal, vertical, or along one of the two diagonals.

You are given the list of moves played. Write a program that prints the number of the first move after which the player who just played forms an alignment, or `0` if this never happens. Moves are numbered from 1; odd moves are played by player 1, even moves by player 2.

## Input
- The first line contains three integers `H`, `W` and `K`.
- The second line contains the integer `M`, the number of moves.
- The third line contains `M` integers between 1 and `W`: the chosen columns, in the order of the moves (columns are numbered from 1 to `W`, from left to right).

No move is played in a column that is already full. The moves that come after the first alignment are still given: ignore them.

## Output
A single integer: the number of the first move that forms an alignment, or `0`.

## Constraints
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- 1 ≤ K ≤ 50
- 1 ≤ M ≤ H × W

## Hints
1. Keep, for each column, the number of tokens it already holds: this directly gives the row where the new token falls. If row 0 is at the top, a token dropped into a column that already holds `n` tokens falls on row `H - 1 - n`.
2. No need to look for alignments in the whole grid after each move: if a new one appears, it must go through the token that was just placed.
3. For each of the four directions (for example `(0, 1)` for horizontal, `(1, 1)` and `(1, -1)` for the diagonals), start from the new token and count the tokens of the same player that follow it without a gap in one direction, then in the opposite direction. The new token is part of a line of `1 + before + after` tokens.

## Solution
Simulate the game move by move. The grid holds `0` for an empty cell, `1` or `2` for a token. An array `height` gives the number of tokens in each column: the token played in column `c` falls on row `H - 1 - height[c]` (row 0 being at the top), then `height[c]` goes up by 1.

In the reference solutions, the grid is called `grille`, the array `hauteur`, and the row index `l` (for *ligne*, French for "row").

After each move, only look at the token that was just placed, since any new alignment goes through it. For each of the four directions `(dr, dc)` — `(0, 1)`, `(1, 0)`, `(1, 1)` and `(1, -1)` — move step by step from the token as long as you stay inside the grid and find a token of the same player, then do the same in the opposite direction `(-dr, -dc)`. The number of aligned tokens is 1 (the new token) plus those found on both sides. As soon as it reaches `K`, print the move number and stop.

The traps:
- counting in only one direction: a token placed **in the middle** joins two pieces, as in the fifth test, where the token in column 3 completes `1 2 _ 4`;
- forgetting a diagonal: there are two of them, one going up to the right and the other going up to the left;
- getting the player wrong: the token just placed belongs to player 1 if the move number is odd;
- going on after the first alignment: print the **first** winning move, even if other alignments appear later;
- `K = 1`: the very first token already forms an alignment.

Each move takes at most a few hundred steps, and there are at most 2 500 moves: it's very fast. Checking the whole grid after each move would also work on small grids, but would take much more work.
