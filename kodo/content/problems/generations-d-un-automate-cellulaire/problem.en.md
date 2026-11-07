---
title: Generations of a cellular automaton
---

## Statement
A grid of `R` rows and `C` columns contains live cells (`#`) and dead cells (`.`). The **neighbours** of a cell are the 8 cells that touch it, by a side or by a corner; cells outside the grid count as dead.

At each generation, all the cells change **at the same time**, according to the number of their live neighbours:
- a live cell stays alive if it has 2 or 3 live neighbours, otherwise it dies;
- a dead cell becomes alive if it has exactly 3 live neighbours, otherwise it stays dead.

Print the grid after `K` generations.

## Input
The first line contains `R`, `C` and `K`. Each of the next `R` lines contains `C` characters `#` or `.`.

## Output
The grid after `K` generations: `R` lines of `C` characters.

## Constraints
- 1 ≤ R, C ≤ 30
- 0 ≤ K ≤ 50

## Hints
1. Write a function `voisins_vivants(grille, i, j)` ("live neighbours") that counts the live neighbours of cell `(i, j)`, ignoring the positions outside the grid.
2. The changes are simultaneous: compute the next generation in a **new** grid, without modifying the old one during the computation.
3. A second function `generation_suivante(grille)` ("next generation") returns the new grid; all that's left is to call it `K` times.

## Solution
Split the problem into two functions.

`voisins_vivants(grille, i, j)` goes through the offsets `di` and `dj` in `{-1, 0, 1}`, except `(0, 0)` which is the cell itself. For each neighbour `(i + di, j + dj)`, first check that it is inside the grid (`0 ≤ i + di < R` and `0 ≤ j + dj < C`), then that it is alive. Testing the position **before** reading the cell avoids an `IndexError`, and above all, in Python, prevents an index `-1` from silently reading the last row.

`generation_suivante(grille)` builds a new grid, row by row. A cell is alive in it if it has 3 live neighbours, or if it has 2 and was already alive: this is a compact way of writing both rules.

The main trap is to modify the grid in place: a cell changed too early distorts the count of its neighbours that haven't been handled yet. With a new grid, each generation is computed entirely from the previous one.

The program makes at most 50 × 30 × 30 × 8, that is 360,000 neighbour tests: it's fast.
