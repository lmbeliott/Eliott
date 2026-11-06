---
title: The nearest shelters
---

## Statement
The Valcorde ski patrol is preparing a safety map of the Aiguilles plateau. The map is a grid: each cell is a meadow, an impassable rock or an emergency shelter. In bad weather, a hiker must be able to reach the nearest shelter quickly, moving from a cell to a neighbouring cell (up, down, left or right) without crossing any rock.

For each meadow cell, its **shelter distance** is the minimum number of moves needed to reach a shelter, any of them. Write a program that computes the largest shelter distance among the meadows from which a shelter can be reached, and the number of meadows from which no shelter can be reached.

## Input
- The first line contains two integers `R` and `C`: the number of rows and columns of the map.
- The next `R` lines each contain `C` characters: `.` for a meadow, `#` for a rock, `A` for a shelter (*abri* in French).

The map contains at least one shelter.

## Output
Two lines:
- the largest shelter distance among the meadows from which a shelter can be reached (`0` if there is no such meadow);
- the number of meadows from which no shelter can be reached.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. A breadth-first search from **one** shelter gives the distance from each cell to that shelter. But running one search per shelter is expensive when there are thousands of shelters.
2. Imagine that all the shelters start their search at the same time, at the same pace: the first wave that reaches a cell comes from the nearest shelter.
3. Put **all** the shelters in the queue at the start, with distance `0`, then run a single ordinary breadth-first search. The meadows never reached are those with no reachable shelter.

## Solution
We run a **multi-source breadth-first search**: at the start, the queue contains all the shelters, each at distance `0`. After that, it is an ordinary BFS: we take a cell out of the queue, and each free neighbour not yet reached gets the cell's distance plus one and joins the queue.

Why this is correct: it is exactly as if we added an imaginary cell linked to every shelter and ran a BFS from it. The queue first holds the cells at distance `0`, then all those at distance `1`, then `2`… so each cell is reached for the first time from its nearest shelter.

Each cell enters the queue at most once and has four neighbours: the complexity is **O(R × C)**, about 360 000 operations at most.

The naive solution runs a BFS from each shelter and keeps the minimum: with `K` shelters, this costs O(K × R × C). With a few thousand shelters on a 300 × 300 map, that is more than 10⁸ operations.

Traps:
- Cells from which no shelter can be reached keep their "not visited" mark: they must not be counted in the maximum.
- To avoid checking the borders at every step, you can surround the map with a border of rocks.
- Mark a cell as reached as soon as you put it in the queue, not when you take it out.
