---
title: The torrent in flood
---

## Statement
A violent storm makes the Valcorde torrent overflow while Théo is picking blueberries in the small valley. The water floods the valley cell by cell, and Théo must take shelter in a refuge before it catches him. The refuges are built on rocks: water never gets into them.

The valley is a grid. At minute `0`, the water covers exactly the source cells and Théo is on his starting cell. Then, every minute:
- the water spreads from each flooded cell to its neighbouring cells (up, down, left, right), except rocks and refuges;
- Théo must move to a neighbouring cell that is not a rock.

Théo can enter a refuge at any minute. He can enter any other cell at minute `t` only if the water reaches it **strictly after** minute `t` (or never reaches it).

Write a program that computes the first minute at which Théo can enter a refuge, or prints `-1` if he can't reach any.

## Input
- The first line contains two integers `R` and `C`: the number of rows and columns.
- The next `R` lines each contain `C` characters: `.` for a free cell, `#` for a rock, `E` for a water source (*eau* in French), `R` for a refuge and `T` for Théo's starting cell.

The map contains exactly one `T` and at least one `R`. It may contain no `E` at all.

## Output
A single integer: the first minute at which Théo enters a refuge, or `-1` if that is impossible.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. The water's progress doesn't depend on Théo. Start by computing, for each cell, the minute at which the water reaches it.
2. That computation is a breadth-first search starting from all the sources at once. Rocks and refuges stop it.
3. Then run a breadth-first search from Théo: from a cell reached at minute `t`, a neighbour can be reached at minute `t + 1` only if it is a refuge, or if the water gets there strictly after `t + 1`.

## Solution
The water's movement doesn't depend on Théo, so we compute it first. A **multi-source breadth-first search**, starting from all the `E` cells at minute `0` and going through neither rocks nor refuges, gives for each cell the minute `eau[x]` at which it is flooded (`eau` means "water"; infinity if it is never flooded).

We then run a **second breadth-first search**, from Théo's cell. When we take out of the queue a cell reached at minute `t`, each neighbour `v` that is not a rock and not yet reached can be reached at minute `t + 1`:
- if `v` is a refuge, the answer is `t + 1`: the BFS handles cells by increasing minute, so this is the earliest possible minute;
- otherwise, `v` is reached only if `t + 1 < eau[v]`.

Why keeping the **earliest** arrival minute for each cell is enough: arriving earlier in a cell is never a disadvantage, since the constraint "arrive before the water" is easier to satisfy the earlier you arrive. For the same reason, Théo would never gain anything by waiting.

Both searches cost **O(R × C)**. Simulating, minute by minute, the water and the set of Théo's possible positions would cost O(R × C) **per minute**, and the answer can exceed 40 000 minutes in a long corridor: far too slow.

Traps:
- The inequality is **strict**: if Théo and the water reach a cell at the same minute, Théo cannot enter it.
- Refuges stop the water: they must not spread the flood.
- A cell that is never flooded must get a value larger than every possible minute (a big number), not `-1`.
