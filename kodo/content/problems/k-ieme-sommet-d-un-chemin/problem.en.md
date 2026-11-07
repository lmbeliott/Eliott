---
title: K-th vertex of a path
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`, rooted at vertex `1`. Between two vertices `U` and `V`, there is a unique path `U = x₀, x₁, …, x_d = V` that never visits the same vertex twice; `d` is the distance between `U` and `V`.

Write a program that answers `Q` questions: for each question `U V K`, print the vertex `x_K` of this path, that is the vertex located `K` edges away from `U` when going towards `V`, or `-1` if `K > d`.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order. It is empty if `N = 1`.
- Each of the next `Q` lines contains three integers `U`, `V` and `K`: a question.

## Output
`Q` lines: for each question, in order, the number of the requested vertex, or `-1`.

## Constraints
- 1 ≤ N ≤ 12 000
- 1 ≤ Q ≤ 6 000
- 1 ≤ U, V ≤ N (`U` and `V` may be equal)
- 0 ≤ K ≤ N

## Hints
1. The path from `U` to `V` goes up from `U` to their **lowest common ancestor** `W`, then down to `V`. With the depths, its length is `depth(U) + depth(V) - 2 × depth(W)`.
2. If `K ≤ depth(U) - depth(W)`, the answer is the ancestor of `U` located `K` levels higher. Otherwise, it is an ancestor of `V`, located `d - K` levels above `V`.
3. Climbing level by level is too slow on a deep tree. Precompute `up[j][v]`, the ancestor of `v` located `2ʲ` levels higher: `up[j][v] = up[j-1][up[j-1][v]]`. Climbing `K` levels is then done by following the bits of `K`; the common ancestor is also found in O(log N).

## Solution
First compute the depth of each vertex with a breadth-first search from the root.

**Binary lifting.** Build the table `up[j][v]`: the ancestor of `v` located `2ʲ` levels higher, or `0` if you leave the tree. Row `0` holds the parents, and `up[j][v] = up[j-1][up[j-1][v]]`: climbing `2ʲ` levels means climbing `2ʲ⁻¹` levels twice. You need `⌈log₂ N⌉ ≈ 14` rows.

- **Ancestor at distance `k`**: write `k` in binary and, for each bit `j` set to `1`, do `v = up[j][v]`. O(log N).
- **Lowest common ancestor** of `u` and `v`: first lift the deeper of the two to the depth of the other. If they are equal, you are done. Otherwise, for `j` from the largest power down to `0`, if `up[j][u] ≠ up[j][v]`, lift both. At the end, `u` and `v` are two different children of the common ancestor, which is their parent. O(log N).

**Answering a question** `U V K`. Let `W` be the common ancestor, `a = depth(U) - depth(W)` the length of the way up and `b = depth(V) - depth(W)` that of the way down; `d = a + b`.
- if `K > d`, the answer is `-1`;
- if `K ≤ a`, it is the ancestor of `U` at distance `K`;
- otherwise, the vertex is on the way down, `d - K` edges away from `V`: it is the ancestor of `V` at distance `d - K`.

Complexity: **O(N log N)** for the table, **O(log N)** per question.

Why the naive method fails: climbing the parents one by one to build the path costs up to `2N` steps per question on a deep tree, about 10⁸ steps for 6,000 questions, too many for Python.

Pitfalls:
- `U = V` is allowed: the distance is `0`, the answer is `U` for `K = 0` and `-1` otherwise.
- On the way down, count from `V`: the vertex you want is `d - K` levels above `V`, not `K - a`.
- The table must allow climbing up to `N - 1` levels: check that `2^(number of rows)` exceeds the largest depth.
