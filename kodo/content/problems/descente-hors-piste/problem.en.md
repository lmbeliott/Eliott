---
title: The off-piste run
---

## Statement
Hugo, a ski instructor at the Valcorde resort, is planning an off-piste run on the north face. His map divides the slope into `R` rows of `C` cells: each cell is a rock, or a snowfield rated from `0` to `9` according to the quality of the powder.

Hugo starts on any cell of the first row that is not a rock. At each move, he goes down one row: to the cell just below, or diagonally to the cell below on the left or on the right. He must never go over a rock or leave the map, and he finishes on the last row. The **score** of a run is the sum of the ratings of all the cells visited, including the first and the last.

Write a program that computes the best possible score and the number of different runs that reach it. Two runs are different if they don't go through exactly the same cells.

## Input
- The first line contains two integers `R` and `C`.
- The next `R` lines, from the top row to the bottom row, each contain `C` characters: a digit from `0` to `9` for a snowfield, `#` for a rock.

## Output
Two integers separated by a space: the best score, then the number of runs that reach it, modulo `1 000 000 007`. If no run exists, print only `-1`.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. There are up to `C × 3ᴿ⁻¹` runs: impossible to try them all. But to reach a cell in the best way, it doesn't matter how you got to the cells of the row above, only their best score matters.
2. Compute, row by row, `meilleur[i][j]` ("best"): the best score of a partial run that ends on cell `(i, j)`. It follows from the three cells above.
3. At the same time, compute `nombre[i][j]` ("number"): the number of partial runs that reach `meilleur[i][j]`. It is the sum of the `nombre` of the cells above whose best score equals the maximum, and only of those.

## Solution
A partial run ending on cell `(i, j)` came just before through `(i - 1, j - 1)`, `(i - 1, j)` or `(i - 1, j + 1)`. To get the best score at `(i, j)`, you must arrive through one of these cells with the best possible score. Hence, for a cell that is not a rock:

- `meilleur[i][j] = rating(i, j) + max(meilleur[i - 1][k])` for `k` among `j - 1, j, j + 1`, ignoring rocks, cells outside the map and unreachable cells;
- `nombre[i][j] = sum of nombre[i - 1][k]` over the `k` that **achieve this maximum**.

On the first row, `meilleur[0][j]` is the cell's rating and `nombre[0][j] = 1`. A cell none of whose three upper cells is reachable is itself unreachable. At the end, the answer is the maximum of `meilleur` over the last row, and the number of runs is the sum of the `nombre` of the last-row cells that reach this maximum.

Each cell is computed in constant time: **O(R × C)**. We only keep the previous row, so the memory is O(C).

Why the naive enumeration is out of the question: with `R = 300`, a single starting cell already has up to 3²⁹⁹ runs.

Traps:
- Only add up the `nombre` of the cells that reach **exactly** the maximum; adding those of the other cells gives too many runs.
- Tell "unreachable" apart from "score 0": a reachable cell rated `0` is valid. Use a special value (for example `-1`) for unreachable cells.
- The number of runs becomes huge (on a map without rocks, there are billions of billions of them): take the modulo at each addition. The score, on the other hand, stays small (at most `9 × R`).
- If a whole row is blocked, there is no run at all: print `-1`.
