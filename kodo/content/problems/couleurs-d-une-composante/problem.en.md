---
title: Colours of a component
---

## Statement
A graph has `N` vertices numbered from `1` to `N` and `M` edges. Vertex `i` has a colour `c[i]`. Each edge joins two vertices `u` and `v` and has a weight `w`. An edge may join a vertex to itself, and two vertices may be joined by several edges.

We ask `Q` questions. Question `(v, t)` is: keeping only the edges of weight **at most** `t`, how many different colours are there in the connected component of vertex `v`?

Write a program that answers every question.

## Input
The first line contains four integers `N`, `M`, `Q` and `G`.

**If `G = 0`**, the data is written out in full:
- the second line contains the `N` colours `c[1]`, …, `c[N]`;
- the next `M` lines each contain three integers `u`, `v` and `w`: an edge;
- the next `Q` lines each contain two integers `v` and `t`: a question.

**If `G > 0`**, the second line contains four integers `A`, `B`, `W` and `K`, and the data is produced by a generator. Start with `x = G`, and each call to `next()` does:
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴`;
- then returns `x` divided by `2³³` (integer division).

In this order:
- for `i` from `1` to `N`: `c[i] = 1 + (next() mod K)`;
- for each edge: `u = 1 + (next() mod A)`, then `v = 1 + (next() mod B)`, then `w = 1 + (next() mod W)`;
- for each question: `v = 1 + (next() mod N)`, then `t = 1 + (next() mod W)`.

In the second example (`G = 3`), the colours are `4 4 4 3 1 4` and the first edge joins `2` and `6` with weight `9`. In C++, computing modulo 2⁶⁴ is automatic with `unsigned long long`. In Python, use `% 2**64`.

## Output
`Q` lines: the answer to each question, in order.

## Constraints
- 1 ≤ N ≤ 50 000
- 1 ≤ M, Q ≤ 100 000
- 1 ≤ c[i] ≤ N
- 1 ≤ w, t ≤ 10⁹
- 1 ≤ A, B ≤ N, 1 ≤ W ≤ 10⁹ and 1 ≤ K ≤ N

## Hints
1. If you answer the questions by increasing `t`, edges are only ever added. Sort the edges and the questions, and merge components with union-find: this is **offline** processing.
2. You also need the colours of each component. Keep a set of colours per root and join the sets when merging.
3. Joining naively can cost O(N²): a large set copied again and again. Always pour the **smaller** set into the larger one. An element then only changes set when the size of its set at least doubles, so at most log₂ N times.

## Solution
**Offline.** The questions only depend on the edges of weight `≤ t`. We handle them by increasing `t`, after sorting the edges by weight. Before answering `(v, t)`, we add every edge of weight `≤ t` not yet added. Components are managed with **union-find**. We answer in sorted order, then print the answers in input order.

**Colours.** Each root keeps the set of colours of its component, and the answer is the size of this set. When two components merge, one set is poured into the other.

**Small into large.** We always pour the smaller set into the larger one. A copied colour goes into a set at least twice as large as the one it leaves. So a given entry can only be copied `log₂ N` times, and the total number of copies is O(N log N). The simplest is to make the root of the larger set the new root.

Complexity: **O((M + Q) log(M + Q) + N log N)** for the sorts and the copies (with a sorted set in C++, one more `log N` factor).

Why simple ideas fail:
- One graph search per question costs O(N + M) per question, 10¹⁰ operations in total.
- Pouring the set of the edge's first endpoint into that of the second (or always the reverse) goes badly on a star. The large central set is copied for each new leaf, about N²/2 = 1.25 × 10⁹ copies. Two tests are stars, one in each direction.

Traps:
- `t` is inclusive: an edge of weight exactly `t` is kept.
- An edge whose endpoints are already in the same component changes nothing (and neither does a loop `u = v`).
- Keep the original index of each question to print the answers in order.
