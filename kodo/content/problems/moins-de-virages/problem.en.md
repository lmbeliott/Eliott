---
title: Path with the fewest turns
---

## Statement
A grid with `R` rows and `C` columns contains free cells and walls, a start cell `S` and a target cell `T`. You move from a cell to a neighbouring cell (up, down, left or right), never entering a wall or leaving the grid.

A **turn** is a change of direction between two consecutive moves. The direction of the first move is free and does not count as a turn.

Write a program that computes the minimum number of turns of a path from `S` to `T`, or prints `-1` if there is no path. The length of the path does not matter.

## Input
- The first line contains two integers `R` and `C`.
- Each of the next `R` lines contains `C` characters: `.` for a free cell, `#` for a wall, `S` for the start and `T` for the target.

The grid contains exactly one `S` and one `T`, which behave like free cells.

## Output
A single integer: the minimum number of turns, or `-1` if the target cannot be reached.

## Constraints
- 1 ≤ R, C ≤ 200
- 2 ≤ R × C

## Hints
1. The shortest path in number of cells is not necessarily the one that turns the least. And the cell alone does not describe the situation: to know whether the next step costs a turn, you need to know which direction you are going in.
2. Take the **states** `(cell, direction)` as vertices. Moving one cell straight ahead costs `0` turns; turning a quarter turn on the spot costs `1`. You are looking for a shortest path in a graph whose edges weigh `0` or `1`.
3. **0-1 BFS** solves this case: a double-ended queue, where states reached by an edge of cost `0` are added at the **front** and states reached by an edge of cost `1` at the **back**.

## Solution
Build a graph of **states**: a state is a pair `(cell, direction)`, with four directions, so at most `4 × R × C = 160,000` states. From state `(x, d)`:
- move forward: if the next cell `y` in direction `d` is free, go to `(y, d)` at cost `0`;
- turn: go to `(x, d')` at cost `1`, where `d'` is one of the two directions perpendicular to `d`. A U-turn is never useful: it leads back to cells already seen.

At the start, the four states `(S, d)` are at distance `0`, since the first direction is free. The answer is the smallest distance of a state `(T, d)`.

The costs are `0` or `1`: a **0-1 BFS** is enough. Use a double-ended queue. A state reached by an edge of cost `0` goes to the front, a state reached by an edge of cost `1` to the back. This way the queue stays sorted by distance, like Dijkstra's heap, but each operation costs O(1). A state may be added twice: ignore it when it is removed after it has already been processed. The first state of `T` removed gives the answer.

Complexity: **O(R × C)**. Dijkstra's algorithm on the same state graph also gives the right answer, with an extra `log` factor.

Why the simple ideas fail:
- A plain BFS finds the shortest path **in cells**, which can make many more turns than a detour: in a grid with staircase walls, a detour along the border turns only 2 or 3 times.
- Keeping a single value per cell (the minimum number of turns to reach it, with the matching arrival direction) is wrong: arriving with one more turn, but in the right direction, can save turns later. In the grid below, the answer is `1` (go down, then right all the way to `T`), but this method may find `2`: two arrivals tie on the cell diagonally below and to the right of `S`, and keeping the wrong direction costs one more turn.

```
#.#..
.S.##
....T
```

- Enumerating the paths one by one is exponential.

Pitfalls:
- The first move does not count as a turn: the four starting directions are at distance `0`.
- With `sys.stdin.buffer`, each line of the grid is a `bytes` object: decode it, or compare its elements with `ord('#')`.
