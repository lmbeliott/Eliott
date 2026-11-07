---
title: Generations of the game of life
---

## Statement
The **game of life** is played on a grid of `N` rows and `M` columns whose cells are alive `#` or dead `.`. The neighbours of a cell are the cells touching it by a side or a corner; everything outside the grid is dead. At each generation, all cells change **at the same time**:
- a live cell stays alive if it has 2 or 3 live neighbours, and dies otherwise;
- a dead cell becomes alive if it has exactly 3 live neighbours, and stays dead otherwise.

Print the grid after `K` generations.

## Input
- The first line contains three integers `N`, `M` and `K`.
- Each of the next `N` lines contains `M` characters `#` or `.`.

## Output
`N` lines of `M` characters: the grid after `K` generations.

## Constraints
- 1 ≤ N ≤ 25 and 1 ≤ M ≤ 25
- 0 ≤ K ≤ 100

## Hints
1. Write a function `live_neighbours(g, i, j)` that counts the live neighbours of a cell among the 8, ignoring those outside the grid.
2. Write a function `generation(g)` that **returns a new grid**, computed only from the old one.
3. Modifying the grid in place during the computation gives a wrong result: the next cells would count neighbours that have already changed.

## Solution
The program splits into two functions. `live_neighbours(g, i, j)` goes through the 8 moves `(a, b)` with `a` and `b` between -1 and 1, except `(0, 0)`, and counts the neighbours that are inside the grid and alive. `generation(g)` creates a new grid and, for each cell, writes the new state into it according to the rules, reading only the old grid `g`. The main program repeats `g = generation(g)` `K` times, then prints `g`. If `K = 0`, the grid is printed as is.

The key point is that all cells change **at the same time**. If you wrote the new state directly into `g`, a cell examined later would count among its neighbours cells that have already moved on to the next generation. So you need a second grid. In Python, create it with a new row per turn of a loop; beware of `h = g`, which copies nothing, and of `[["."] * M] * N`, whose rows are all the same list.

A few patterns to try: a 2 × 2 square never changes; a bar of 3 cells alternates between horizontal and vertical; the "glider" (`.#.`, `..#`, `###`) reproduces itself identically every 4 generations, shifted by one cell diagonally, and ends up stuck against the edge of the grid.

Each generation needs `N × M × 8` reads, at most 5,000; for 100 generations, that's 500,000 reads.
