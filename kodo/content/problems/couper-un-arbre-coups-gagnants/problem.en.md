---
title: "Cutting a tree: winning moves"
---

## Statement
A tree has `N + 1` vertices numbered from `0` to `N`. Vertex `0` is the **ground**. For each `i` from `1` to `N`, an edge joins vertex `i` and its parent `P[i]`, with `P[i] < i`.

Two players take turns. A move consists of cutting an edge that is still present. Every edge that is no longer connected to the ground then disappears too. The player who can't move, because no edge is left, loses.

A first move is **winning** if, after it, the first player can win whatever the opponent does. Write a program that counts the winning first moves, that is the edges whose cut is a winning move. The answer is `0` if the first player loses whatever they do.

## Input
The first line contains two integers `N` and `G`.

**If `G = 0`**, the second line contains the `N` integers `P[1]`, …, `P[N]`.

**If `G > 0`**, the second line contains two integers `S` and `K`, and the parents are produced by a generator. Start with `x = G`, and each call to `next()` does:
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴`;
- then returns `x` divided by `2³³` (integer division).

For `i` from `1` to `N`, in order: `P[i] = max(0, i - S × (1 + (next() mod K)))`.

With `G = 7`, the first calls to `next()` return `1059165278`, `2052263231` and `1946856753`. In the second example (`N = 9`, `S = 2`, `K = 2`), the parents are `0 0 0 0 1 2 5 6 5`. In C++, computing modulo 2⁶⁴ is automatic with `unsigned long long`. In Python, use `% 2**64`.

## Output
A single integer: the number of winning first moves.

## Constraints
- 1 ≤ N ≤ 200 000
- 0 ≤ P[i] < i
- 1 ≤ S ≤ N and 1 ≤ K ≤ N

## Hints
1. The game splits into independent games, one per edge leaving the ground, and the Sprague-Grundy theorem applies: a position is losing for the player to move exactly when the XOR of the Grundy numbers of the pieces is `0`. Start with a single branch: a path of `k` edges standing on the ground behaves like a Nim heap of size `k`.
2. More generally, an edge standing on a vertex `c` behaves like a path whose length is `1 +` (the value of what stands above `c`). From the leaves down to the ground, this gives: `g(v) = XOR over the children c of (g(c) + 1)`. The first player wins if `g(0) ≠ 0`.
3. To count the winning moves, go from the ground up to the leaves computing `need(v)`: the value `g(v)` must take after the move for the ground to be worth `0`. Since `g(p)` depends on `g(v)` through a XOR, `need(v)` follows from `need(p)` in O(1). Cutting the edge `(p, v)` changes `g(p)` into `g(p) XOR (g(v) + 1)`.

## Solution
**Grundy numbers.** First cut the tree at ground level: each edge leaving the ground carries an independent piece, and a move only touches one piece. By the **Sprague-Grundy** theorem, the position is losing for the player to move if and only if the XOR of the Grundy numbers of the pieces is zero.

For a vertex `v`, let `g(v)` be the Grundy number of everything hanging above `v`. A classic result (the "colon principle") says that the edge `(v, c)` topped by the subtree of `c` is worth `g(c) + 1`. You can check it by induction: the possible moves are cutting `(v, c)` (which leads to `0`) or playing above `c`. The first gives `0`, the second all values `h + 1` where `h` ranges over the options of `c`, and the mex of all this is `g(c) + 1`. Hence:

`g(v) = XOR over the children c of v of (g(c) + 1)`,

computed by going through `v` from `N` down to `1`, since `P[v] < v`. The first player wins if and only if `g(0) ≠ 0`.

**Counting the winning moves.** A move is winning if it brings `g(0)` to `0`. Let `need(v)` be the value `g(v)` must have after a move played above `v` for the ground to drop to `0`, or `-1` if that is impossible. We have `need(0) = 0`. For a child `v` of `p`, a move above `v` changes `g(p)` into `g(p) XOR (g(v) + 1) XOR (g'(v) + 1)`. So we need `g'(v) + 1 = need(p) XOR g(p) XOR (g(v) + 1)`. If this number is `0`, it is impossible (`g'(v) + 1 ≥ 1`). Otherwise, `need(v)` is this number minus `1`. Finally, cutting the edge `(p, v)` itself gives `g'(p) = g(p) XOR (g(v) + 1)`: it is a winning move if this value equals `need(p)`. Since `P[v] < v`, we go through `v` from `1` to `N`.

Complexity: **O(N)**.

Why simple ideas fail:
- Exploring the game tree is exponential.
- After computing the `g` values, you can test each edge by recomputing the values along the path down to the ground. This costs O(N × depth), about 10¹⁰ operations on the tests shaped like long branches.

Traps:
- `g(v) + 1`, not `g(v)`: forgetting the `+ 1` gives the ordinary Nim XOR, which is wrong here.
- An impossible `need` (`-1`) spreads to the whole subtree: no move above it can win.
- The answer can be `0`: the starting position is then losing.
