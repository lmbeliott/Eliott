---
title: Robot on a grid of arrows
---

## Statement
Each cell of a grid of `R` rows and `C` columns contains an arrow: `^` (up), `v` (down), `<` (left) or `>` (right). A robot starts from the top-left cell. At each move, it advances one cell in the direction of the arrow of the cell it is on. If it leaves the grid through an edge, it reappears on the opposite edge, in the same row or the same column.

After `K` moves, print the position of the robot and the number of different cells it has been through, starting cell included.

For example, in the grid `vv<>` / `>>^<` / `<<<^`, the robot goes through the cells (1, 1), (2, 1), (2, 2), (2, 3), (1, 3), (1, 2), then comes back to (2, 2) and goes round in circles over 4 cells. After 3 moves, it is at (2, 3) and has seen 4 cells.

## Input
The first line contains `R`, `C` and `K`. Each of the next `R` lines contains `C` arrows.

## Output
On the first line, the row and column of the robot after `K` moves, numbered from 1. On the second line, the number of different cells visited.

## Constraints
- 1 ≤ R, C ≤ 200
- 0 ≤ K ≤ 10¹⁸ (in C++, use `long long`)

## Hints
1. Simulating `K` moves is impossible when `K` is 10¹⁸. But the robot only has `R × C` possible cells: after at most `R × C` moves, it goes through a cell already visited, and from then on it repeats exactly the same route.
2. Record the path in a list (`chemin[t]` is the cell after `t` moves) and, in a dictionary, the first time each cell was reached. When the next cell is already in the dictionary, you know the start of the cycle and its length.
3. If the cycle starts at time `d` and has length `L`, the position at time `K ≥ d` is `chemin[d + (K - d) % L]`. Watch out for the case where `K` is reached before finding the cycle.

## Solution
The route of the robot only depends on its cell: two visits to the same cell are followed by exactly the same moves. Since there are only `R × C ≤ 40,000` cells, the robot ends up going through a cell already seen, and its route then becomes periodic. The path has the shape of a "tail" followed by a **cycle**.

Split the program into simple pieces:
- a function `case_suivante(grille, i, j)` ("next cell") returns the cell the arrow points to, with `% R` and `% C` to come out on the other side (in C++, a negative remainder means you must add `R` or `C` before taking the remainder again);
- a list `chemin` ("path") where `chemin[t]` is the cell occupied after `t` moves;
- a dictionary `instant` that maps each cell, identified by the pair `(i, j)`, to the time of its first visit.

Extend the path as long as time `K` has not been reached and the next cell is new. Two cases then arise.

1. Time `K` is reached without going through a cell twice: the answer is `chemin[K]`, and the robot has seen `K + 1` different cells.
2. The next cell is already in `instant`: the cycle starts at `d = instant[cell]` and its length is `L = len(chemin) - d`. For `K ≥ d`, the position at time `K` is the same as at time `d + (K - d) % L`, since the robot comes back to the same place every `L` moves. All the cells of the path have been visited, and no other one will be: the answer is `len(chemin)`.

The simulation makes at most 40,000 moves, whatever the value of `K`. The dictionary is essential: with an `in` test on the list `chemin`, each move would go through the whole path so far, up to 800 million comparisons on a 200 × 200 grid. A grid of booleans of the same size as the grid of arrows would also work, since cells are small pairs of integers.

The traps: confusing "number of moves" and "number of cells" (after `K` moves, the robot has occupied `K + 1` positions); forgetting that the cycle does not necessarily start at the starting cell; using an `int` for `K` in C++.
