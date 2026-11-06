---
title: Race against the spread
---

## Statement
A grid contains free cells, walls, exits, contaminated cells and the starting cell of a token. The contamination spreads through the grid while the token tries to reach an exit.

At minute `0`, the contamination covers exactly the source cells and the token is on its starting cell. Then, every minute:
- the contamination spreads from each contaminated cell to its neighbouring cells (up, down, left, right), except walls and exits;
- the token must move to a neighbouring cell that is not a wall.

The token can enter an exit at any minute. It can enter any other cell at minute `t` only if the contamination reaches that cell **strictly after** minute `t` (or never reaches it).

Write a program that computes the first minute at which the token can enter an exit, or prints `-1` if it can't reach any.

## Input
- The first line contains two integers `R` and `C`: the number of rows and columns.
- The next `R` lines each contain `C` characters: `.` for a free cell, `#` for a wall, `*` for a contamination source, `X` for an exit and `@` for the token's starting cell.

The grid contains exactly one `@` and at least one `X`. It may contain no `*` at all. The starting cell and the sources then behave like free cells.

## Output
A single integer: the first minute at which the token enters an exit, or `-1` if that is impossible.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. The spread doesn't depend on the token. Start by computing, for each cell, the minute at which the contamination reaches it.
2. That computation is a breadth-first search starting from all the sources at once. Walls and exits stop it.
3. Then run a breadth-first search from the token: from a cell reached at minute `t`, a neighbour can be reached at minute `t + 1` only if it is an exit, or if the contamination gets there strictly after `t + 1`.

## Solution
The spread doesn't depend on the token, so we compute it first. A **multi-source breadth-first search**, starting from all the `*` cells at minute `0` and going through neither walls nor exits, gives for each cell the minute `conta[x]` at which it is contaminated (infinity if it never is).

We then run a **second breadth-first search**, from the token's cell. When we take out of the queue a cell reached at minute `t`, each neighbour `v` that is not a wall and not yet reached can be reached at minute `t + 1`:
- if `v` is an exit, the answer is `t + 1`: the BFS handles cells by increasing minute, so this is the earliest possible minute;
- otherwise, `v` is reached only if `t + 1 < conta[v]`.

Why keeping the **earliest** arrival minute for each cell is enough: arriving earlier in a cell is never a disadvantage, since the constraint "arrive before the contamination" is easier to satisfy the earlier you arrive. For the same reason, the token would never gain anything by waiting.

Both searches cost **O(R × C)**. Simulating, minute by minute, the contamination and the set of the token's possible positions would cost O(R × C) **per minute**, and the answer can exceed 40 000 minutes in a long corridor: far too slow.

Traps:
- The inequality is **strict**: if the token and the contamination reach a cell at the same minute, the token cannot enter it.
- Exits stop the contamination: they must not spread it.
- A cell that is never contaminated must get a value larger than every possible minute (a big number), not `-1`.
