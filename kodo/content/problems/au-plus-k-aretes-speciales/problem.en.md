---
title: At most K special edges
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. Each edge has a length and a type: it is either **normal** or **special**.

Write a program that computes the minimum length of a path from vertex `1` to vertex `N` that uses a special edge at most `K` times (each traversal counts), or prints `-1` if there is no such path.

## Input
- The first line contains three integers `N`, `M` and `K`: the number of vertices, the number of edges and the maximum number of traversals of a special edge.
- Each of the next `M` lines contains four integers `A`, `B`, `T` and `C`: an edge of length `T` links vertices `A` and `B`; `C` is `0` for a normal edge and `1` for a special edge.

## Output
A single integer: the minimum length of a path from vertex `1` to vertex `N` with at most `K` traversals of a special edge, or `-1` if that is impossible.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ K ≤ 10
- 1 ≤ A, B ≤ N and A ≠ B
- 1 ≤ T ≤ 1 000

## Hints
1. The vertex you are on doesn't fully describe your situation: two arrivals at the same vertex, one having used fewer special edges than the other, can't be compared.
2. Describe the situation by a **state**: (vertex, number of special traversals already made). From state `(u, k)`, a normal edge leads to `(v, k)` and a special edge to `(v, k + 1)`, if `k + 1 ≤ K`.
3. Run Dijkstra on this state graph, which has `N × (K + 1)` vertices, from `(1, 0)`. The answer is the smallest distance among the states `(N, k)`.

## Solution
Keeping a single distance per vertex is not enough: reaching a vertex with length `30` after using up all your special traversals is not necessarily better than reaching it with length `40` with traversals to spare. So we enrich the state: we build a **state graph** whose vertices are the pairs `(vertex, special traversals used)`, with `0 ≤ special traversals used ≤ K`.

- A normal edge `A — B` of length `T` links `(A, k)` to `(B, k)` and `(B, k)` to `(A, k)`, for every `k`.
- A special edge `A — B` of length `T` links `(A, k)` to `(B, k + 1)` and `(B, k)` to `(A, k + 1)`, for every `k < K`.

All the weights are positive: we apply **Dijkstra's algorithm** from state `(1, 0)`. The first state `(N, k)` taken out of the heap, whatever `k` is, gives the answer. If the heap empties before that, no path works: we print `-1`.

The state graph has `N × (K + 1)` vertices (at most 55 000) and about `2 × M × (K + 1)` arcs (at most 176 000), which there is no need to build: we compute them on the fly from the graph's adjacency lists. Complexity: **O(M × K × log(M × K))**.

Why simpler ideas fail:
- A Dijkstra on the vertices alone, counting special traversals along the way, keeps the shortest path for each vertex, even if it used up all the traversals; it can then miss the right solution (on the first example, it finds `53` instead of `30`).
- The greedy approach "take the shortest path without special edges, then shorten it with the `K` most useful special edges" is wrong: the best path with special edges may go through completely different vertices.
- Trying every choice of `K` special edges among thousands is out of the question.

Traps:
- A special edge can be used in both directions, like a normal edge.
- `K` is a maximum: you don't have to make `K` special traversals. With `K = 0`, only normal edges are allowed.
- If `N = 1`, the answer is `0`.
