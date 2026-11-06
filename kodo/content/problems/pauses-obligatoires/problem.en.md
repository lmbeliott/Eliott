---
title: The compulsory breaks
---

## Statement
Nathan, a mountain guide in Valcorde, has to lead a group from refuge `1` (the village) to refuge `N`. The refuges are linked by trails, each walked in a known time, in either direction. The park rules require a break in **every refuge the group passes through**: when going through refuge `i`, the group stops there for `P[i]` minutes (check-in, water, rest). There is no break at the starting refuge nor at the destination refuge.

Write a program that computes the minimum duration of the trip, breaks included, or prints `-1` if refuge `N` cannot be reached from refuge `1`.

## Input
- The first line contains two integers `N` and `M`: the number of refuges and the number of trails.
- The second line contains `N` integers `P[1] … P[N]`: the length of the break in each refuge.
- Each of the next `M` lines contains three integers `A`, `B` and `T`: a trail links refuges `A` and `B` in `T` minutes.

## Output
A single integer: the minimum duration of the trip from refuge `1` to refuge `N`, in minutes, or `-1` if there is no trip.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ P[i] ≤ 1 000
- 1 ≤ A, B ≤ N and A ≠ B; two refuges may be linked by several trails
- 1 ≤ T ≤ 1 000

## Hints
1. Without the breaks, this is a shortest path in a graph with positive weights: Dijkstra's algorithm.
2. The breaks belong to the refuges, not to the trails. Can you move them onto the trails? When you take a trail to **enter** a refuge, how much time does it cost in total?
3. The cost to go from `u` to `v` is `T + P[v]`, unless `v` is the destination refuge (no break). Run Dijkstra from refuge `1` with these costs.

## Solution
We move each break onto the trails that **enter** the refuge: taking the trail from `u` to `v` costs `T + P[v]`, except when `v = N`, where it costs only `T`. A trip `1 → … → N` then costs exactly the sum of the walking times plus the breaks of the intermediate refuges, since we enter each of them once. The start never pays its break: we never "enter" it.

These costs are positive: **Dijkstra's algorithm** with a priority queue (a heap) gives the shortest path. We keep `dist[v]`, the best known duration to reach `v`. We take out of the heap the refuge with the smallest distance; its distance is then final, and we try to improve that of each of its neighbours. If a refuge comes out of the heap with a distance larger than `dist`, it is an outdated entry: we ignore it.

Complexity: **O((N + M) log M)**. A Dijkstra without a heap (which finds the minimum by scanning all the refuges) costs O(N²), and the Bellman-Ford algorithm O(N × M), that is tens of millions of operations: too slow in Python. A breadth-first search, on the other hand, is wrong: it minimises the number of trails, not the duration.

Traps:
- No break at refuge `N`: on the first example, forgetting this adds 50 minutes.
- If `N = 1`, the group has already arrived: the answer is `0`.
- When refuge `N` is never reached, print `-1`.
