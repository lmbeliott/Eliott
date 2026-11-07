---
title: Periodic connections
---

## Statement
A network has `N` vertices and `M` one-way connections. Connection `A B F P T` leaves vertex `A` at times `F`, `F + P`, `F + 2P`, `F + 3P`, … and arrives at vertex `B` exactly `T` time units after each of its departures. It can only be taken at one of its departure times.

You leave vertex `1` at time `0`. You may wait as long as you like on a vertex, and take a departure that happens at the very time you arrive. Write a program that computes the earliest arrival time at vertex `N`, or prints `-1` if it cannot be reached.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `M` lines contains five integers `A`, `B`, `F`, `P` and `T`: a connection.

## Output
A single integer: the earliest arrival time at vertex `N`, or `-1`.

## Constraints
- 1 ≤ N ≤ 4 000
- 0 ≤ M ≤ 4 500
- 1 ≤ A, B ≤ N and A ≠ B
- 0 ≤ F ≤ 10⁶
- 1 ≤ P, T ≤ 10⁶

## Hints
1. If you arrive at vertex `A` at time `d`, the first possible departure of the connection is `F` if `d ≤ F`, and otherwise the smallest `F + kP` greater than or equal to `d`, with `k = ⌈(d - F) / P⌉`.
2. Arriving earlier at a vertex is never a disadvantage: you can always wait. The "cost" of a connection depends on the arrival time, but leaving later never makes you arrive earlier.
3. So Dijkstra's algorithm works as it is, replacing `d + length` with `departure(d) + T`.

## Solution
Apply **Dijkstra's algorithm**, computing the cost of each connection at the moment it is used. Keep `arrival[v]`, the best known time to reach `v`, and a heap. When you remove vertex `u`, reached at time `d`, for each connection `u → v`:
- the first departure is `F` if `d ≤ F`, otherwise `F + ⌈(d - F) / P⌉ × P`;
- you reach `v` at time `departure + T`, which you compare with `arrival[v]`.

Why Dijkstra is still correct: its proof only uses two properties. Taking a connection never goes back in time (you arrive after time `d`), and the function "arrival time at the end of the connection" is **non-decreasing** in `d`: arriving earlier at the start never makes you arrive later at the end. So when a vertex leaves the heap with time `d`, no other path can reach it earlier. This would be false if, for example, some connections arrived earlier when you left later.

Complexity: **O(M log M)**.

Why the other ideas fail:
- Simulating time unit by unit is out of the question: times go beyond a billion.
- First looking for the path with the smallest travel time, then adding the waits, is wrong: on the first example, the trip `1 → 3 → 4` only takes `2`, but you must wait for connection `3 → 4` until time `8`. The trip `1 → 2 → 4`, longer, arrives at time `6`.
- Relaxing all the connections in a loop until nothing changes (Bellman-Ford) costs O(N × M) when the connections are given in the wrong order: too slow in Python.

Pitfalls:
- Computing the next departure: if `d ≤ F`, the departure is `F`, no formula needed. Otherwise, `⌈x / P⌉` is written `(x + P - 1) // P` with positive integers. A departure at the exact arrival time counts.
- Times can exceed 2³¹: use `long long` in C++, including for `F`, `P` and `T` in the computations.
- With `N = 1`, the answer is `0`.
