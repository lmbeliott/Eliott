---
title: Squares closest to each source
---

## Statement
A grid with `R` rows and `C` columns contains free squares, walls and **sources**, written as uppercase letters; several squares may carry the same letter. Moves go from a square to a neighbouring one (up, down, left, right), never into a wall.

For a non-wall square and a letter `L`, the distance from the square to `L` is the minimum number of moves to go from the square to one of the squares marked `L`. A square **belongs** to letter `L` if its distance to `L` is strictly smaller than its distance to every other letter. A square that no letter can reach belongs to nobody; a square whose smallest distance is achieved by several letters is **contested**.

For each letter present in the grid, count the squares that belong to it (its own sources included), then count the contested squares.

## Input
- The first line contains two integers `R` and `C`.
- Each of the next `R` lines contains `C` characters: `.` for a free square, `#` for a wall, an uppercase letter for a source.

The grid contains at least one source.

## Output
- One line per letter present in the grid, in alphabetical order: the letter, a space, then the number of squares that belong to it.
- Then a last line: the number of contested squares.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. One breadth-first search per letter costs up to 26 searches of the grid. A single search is enough, if it starts from **all** sources at once.
2. In this search, each square records its distance and its "owner": a letter, or "contested". What should happen when a square already discovered is reached again, at the same distance, from another owner?
3. A square at distance `d + 1` is contested exactly when its neighbours at distance `d` do not all have the same owner, or one of them is contested.

## Solution
Run a **multi-source breadth-first search**: at the start, all sources are in the queue, at distance 0, each with its letter as owner. The distance obtained for each square is the smallest distance to a source, all letters together (this is the search of the lesson, with a "super-start" joined to every source).

The owner spreads as follows: when `u` is dequeued and a neighbour `v` is examined:
- if `v` is not discovered, it gets `dist[u] + 1` and the owner of `u`;
- if `v` is already discovered with `dist[v] = dist[u] + 1` and an owner different from that of `u`, it becomes contested.

**Why it is correct.** Call "closest letters" of `v` the set of letters achieving its minimum distance `D(v)`. For `D(v) ≥ 1`, a letter is among the closest of `v` if and only if it is among the closest of a neighbour `u` with `D(u) = D(v) − 1`: just look at the second-to-last square of a shortest path. The set of `v` is therefore the union of the sets of its neighbours in the previous layer. The search handles every square at distance `d` before dequeuing a square at distance `d + 1`: when `v` is dequeued, it has received the contribution of all its neighbours in the previous layer, and its owner is the single letter of that union, or "contested" if the union contains at least two letters.

**Complexity.** A single search: O(R × C), instead of 26 searches.
