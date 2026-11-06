---
title: Nearest marked cell
---

## Statement
A grid with `R` rows and `C` columns contains free cells, walls and marked cells. You move from a cell to a neighbouring cell (up, down, left or right), never entering a wall.

For each free cell, its **mark distance** is the minimum number of moves needed to reach a marked cell, any of them. Write a program that computes the largest mark distance among the free cells from which a marked cell can be reached, and the number of free cells from which no marked cell can be reached.

## Input
- The first line contains two integers `R` and `C`: the number of rows and columns of the grid.
- The next `R` lines each contain `C` characters: `.` for a free cell, `#` for a wall, `*` for a marked cell.

The grid contains at least one marked cell.

## Output
Two lines:
- the largest mark distance among the free cells from which a marked cell can be reached (`0` if there is no such cell);
- the number of free cells from which no marked cell can be reached.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. A breadth-first search from **one** marked cell gives the distance from each cell to it. But running one search per marked cell is expensive when there are thousands of them.
2. Imagine that all the marked cells start their search at the same time, at the same pace: the first wave that reaches a cell comes from the nearest marked cell.
3. Put **all** the marked cells in the queue at the start, with distance `0`, then run a single ordinary breadth-first search. The free cells never reached are those from which no marked cell can be reached.

## Solution
We run a **multi-source breadth-first search**: at the start, the queue contains all the marked cells, each at distance `0`. After that, it is an ordinary BFS: we take a cell out of the queue, and each neighbour that is not a wall and not yet reached gets the cell's distance plus one and joins the queue.

Why this is correct: it is exactly as if we added an imaginary cell linked to every marked cell and ran a BFS from it. The queue first holds the cells at distance `0`, then all those at distance `1`, then `2`… so each cell is reached for the first time from its nearest marked cell.

Each cell enters the queue at most once and has four neighbours: the complexity is **O(R × C)**, about 360 000 operations at most.

The naive solution runs a BFS from each marked cell and keeps the minimum: with `K` marked cells, this costs O(K × R × C). With a few thousand marked cells on a 300 × 300 grid, that is more than 10⁸ operations.

Traps:
- Cells from which no marked cell can be reached keep their "not visited" mark: they must not be counted in the maximum.
- To avoid checking the borders at every step, you can surround the grid with a border of walls.
- Mark a cell as reached as soon as you put it in the queue, not when you take it out.
