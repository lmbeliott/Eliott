---
title: Recover a shortest path
---

## Statement
A **directed** graph has `N` vertices and `M` arcs; each arc has a length and can only be used in its direction. Print a shortest path from vertex `1` to vertex `N`: its length and the list of its vertices.

It is guaranteed that, if vertex `N` can be reached from vertex `1`, the shortest path is **unique**.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains three integers `A`, `B` and `L`: an arc of length `L` goes from `A` to `B`.

## Output
If vertex `N` cannot be reached, print `-1`. Otherwise print, on a first line, the length `D` of the shortest path and its number `K` of vertices, then, on a second line, the `K` vertices of the path, from `1` to `N`.

## Constraints
- 1 ≤ N ≤ 5,000
- 0 ≤ M ≤ 7,000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁶

## Hints
1. Dijkstra's algorithm gives the length. For the path, one more piece of information must be stored at each improvement of `dist[v]`.
2. Store `pred[v]`, the vertex `u` from which `dist[v]` was last improved. Starting from `N` and following `pred`, you walk back to `1`.
3. Walking back gives the path in reverse: reverse it.

## Solution
Run Dijkstra from vertex `1`. Each time an arc `u → v` improves `dist[v]`, set `pred[v] = u`. You can stop as soon as `N` leaves the heap with its final distance. Then start from `N` and follow `pred` down to `1`; reverse the list obtained.

**Why it is correct.** When a vertex `v` is processed, `pred[v] = u` was set by the last improvement, and `dist[v] = dist[u] + L` with `u` already processed, so `dist[u]` is final. By induction on the processing order, following `pred` from `v` reads a path of length exactly `dist[v]`: a shortest path. The walk back stops: the distances along `pred` strictly decrease (lengths are at least 1), and only vertex `1` has distance `0`.

**Complexity.** O((N + M) log M) for Dijkstra, plus O(N) for the walk back.

**Pitfalls.** The graph is directed: add the arc only to its starting vertex (second sample: `3 → 2` does not allow going from `2` to `3`). If `N = 1`, the path is just vertex `1`: print `0 1` then `1`. Update `pred[v]` **only** when `dist[v]` strictly decreases, otherwise the path walked back may no longer match the distance.
