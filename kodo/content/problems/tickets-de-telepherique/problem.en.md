---
title: The cable car tickets
---

## Statement
Lucas wants to go from station `1` (the village) to station `N` (the glacier) of the Valcorde ski area. The stations are linked by connections that can be used in both directions: some are **trails**, free of charge, and others are **cable cars**, much faster. Each cable car ride costs one ticket, and Lucas only has `K` tickets in his pocket.

Write a program that computes the minimum duration of Lucas's trip, using at most `K` cable car rides, or prints `-1` if station `N` cannot be reached.

## Input
- The first line contains three integers `N`, `M` and `K`: the number of stations, the number of connections and the number of tickets.
- Each of the next `M` lines contains four integers `A`, `B`, `T` and `C`: a connection links stations `A` and `B` in `T` minutes; `C` is `0` for a trail and `1` for a cable car.

## Output
A single integer: the minimum duration of the trip from station `1` to station `N` with at most `K` cable car rides, or `-1` if that is impossible.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ K ≤ 10
- 1 ≤ A, B ≤ N and A ≠ B
- 1 ≤ T ≤ 1 000

## Hints
1. The station where Lucas is doesn't fully describe his situation: two arrivals at the same station, one with more tickets left than the other, can't be compared.
2. Describe the situation by a **state**: (station, number of tickets already used). From state `(u, k)`, a trail leads to `(v, k)` and a cable car to `(v, k + 1)`, if `k + 1 ≤ K`.
3. Run Dijkstra on this state graph, which has `N × (K + 1)` vertices, from `(1, 0)`. The answer is the smallest distance among the states `(N, k)`.

## Solution
Keeping a single distance per station is not enough: arriving at a station in 30 minutes after spending all your tickets is not necessarily better than arriving in 40 minutes with tickets to spare. So we enrich the state: we build a **state graph** whose vertices are the pairs `(station, tickets used)`, with `0 ≤ tickets used ≤ K`.

- A trail `A — B` of duration `T` links `(A, k)` to `(B, k)` and `(B, k)` to `(A, k)`, for every `k`.
- A cable car `A — B` of duration `T` links `(A, k)` to `(B, k + 1)` and `(B, k)` to `(A, k + 1)`, for every `k < K`.

All the weights are positive: we apply **Dijkstra's algorithm** from state `(1, 0)`. The first state `(N, k)` taken out of the heap, whatever `k` is, gives the answer. If the heap empties before that, station `N` is unreachable: we print `-1`.

The state graph has `N × (K + 1)` vertices (at most 55 000) and about `2 × M × (K + 1)` arcs (at most 176 000), which there is no need to build: we compute them on the fly from the stations' adjacency lists. Complexity: **O(M × K × log(M × K))**.

Why simpler ideas fail:
- A Dijkstra on the stations alone, counting tickets along the way, keeps the fastest trip for each station, even if it used up the tickets; it can then miss the right solution (on the first example, it finds `53` instead of `30`).
- The greedy approach "take the shortest path on foot, then replace the `K` stretches where the cable car saves the most time" is wrong: the best trip with cable cars may go through completely different stations.
- Trying every choice of `K` cable cars among thousands is out of the question.

Traps:
- A connection can be used in both directions, by cable car as well as on foot.
- The number of tickets is a maximum: you don't have to use them all. With `K = 0`, only trails are allowed.
- If `N = 1`, the answer is `0`.
