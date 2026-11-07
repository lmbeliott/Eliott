---
title: Safest path in L steps
---

## Statement
A grid with `R` rows and `C` columns contains a non-negative integer in each cell: its **safety**. A cell with safety `0` is forbidden.

You start from the top-left cell and must reach the bottom-right cell in **at most `L` moves**. A move goes from a cell to a neighbouring cell (up, down, left, right) that is not forbidden. The safety of a path is the smallest safety among the cells it visits, start and end included.

Write a program that computes the greatest possible safety of a path, or prints `-1` if the end can't be reached in at most `L` moves.

## Input
- The first line contains three integers `R`, `C` and `L`.
- The next `R` lines each contain `C` integers: the safeties of the cells.

The start and end cells are not forbidden.

## Output
A single integer: the greatest safety of a path with at most `L` moves, or `-1`.

## Constraints
- 1 ≤ R, C ≤ 150
- 0 ≤ L ≤ R × C
- 0 ≤ safety ≤ 99 999

## Hints
1. Fix a threshold `s`. Is there a path of at most `L` moves that only goes through cells with safety at least `s`? A breadth-first search answers in O(R × C).
2. If the answer is yes for `s`, it is also yes for every smaller threshold. Find the greatest good threshold by binary search.
3. The answer is always one of the values in the grid: binary search over the sorted list of distinct values, about 15 breadth-first searches.

## Solution
**Fixing the answer.** For a threshold `s`, keep only the cells with safety at least `s`. A path with safety at least `s` is a path in these cells. The shortest one is found with a **breadth-first search** from the start: the test answers "yes" if the end is at most `L` steps away.

**Binary search.** Lowering the threshold removes no cell: if the test succeeds for `s`, it succeeds for every `s' < s`. The safety of the best path is the greatest value `s` for which the test succeeds. It is one of the values in the grid, since it is the safety of some cell. We sort the distinct values and binary search for the last one that succeeds. If even the smallest one fails, the answer is `-1`.

Complexity: **O(R × C × log(R × C))**, about 15 breadth-first searches over 22 500 cells.

Why simple ideas fail:
- Trying every threshold one by one costs one search per distinct value, up to 22 500 searches. One test puts the start in a large area, closed by a single door of medium safety: every attempt goes through the whole area again.
- The "maximum-safety path" without a length limit (a Dijkstra variant, or union-find by decreasing values) ignores `L`. The best path may be too long, and one test requires a trade-off between length and safety.
- A search over the states (cell, number of steps) costs O(R × C × L): far too much.

Traps:
- Stop the search as soon as the distance reaches `L` without arriving, but check for the end when you **add** a cell to the queue: several cells are at distance `L`, and the end isn't necessarily the first one.
- With `R = C = 1`, the start is the end: the answer is its safety, even for `L = 0`.
