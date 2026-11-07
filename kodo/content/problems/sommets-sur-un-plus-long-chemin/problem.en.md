---
title: Vertices on a longest path
---

## Statement
You are given a tree with `N` vertices, numbered from `1` to `N`. The **length** of a path is its number of edges; the **diameter** of the tree is the largest length of a path between two vertices.

Write a program that counts the vertices that lie on at least one path whose length equals the diameter (endpoints included).

## Input
- The first line contains an integer `N`.
- The second line contains `N - 1` integers: the parent of each of the vertices `2, 3, …, N`, in this order, when the tree is rooted at vertex `1`. It is empty if `N = 1`.

## Output
A single integer: the number of vertices that lie on at least one longest path.

## Constraints
- 1 ≤ N ≤ 20 000

## Hints
1. The diameter is found with two breadth-first searches: the vertex `a` farthest from any vertex is an end of a longest path, and the vertex `b` farthest from `a` is the other end. But a vertex can be on a longest path without being on the one from `a` to `b`: in the first example, there are three arms of length `2`.
2. All the longest paths go through the **middle** of the path from `a` to `b`: one vertex if the diameter `D` is even, two neighbouring vertices if it is odd.
3. Run a breadth-first search from this centre (or these centres). A vertex is on a longest path exactly when its subtree (seen from the centre) contains a vertex at distance `⌊D / 2⌋` from the centre.

## Solution
**The diameter.** A breadth-first search from vertex `1` gives the farthest vertex `a`; it is always an end of a longest path. A second search from `a` gives the vertex `b` farthest from `a` and the diameter `D = dist(a, b)`. The path from `b` to `a` is recovered by following the parents of the search.

**The centre.** Let `h = ⌊D / 2⌋`. If `D` is even, the centre is the middle vertex of the path, at distance `h` from each end. If `D` is odd, it is the two middle vertices, which are neighbours. Every longest path goes through the centre (through the edge between the two centres if `D` is odd): otherwise, it could be combined with one half of the path from `a` to `b` to get a path longer than `D`. Each of its two halves goes down to distance exactly `h` from the centre, in two different branches.

**Counting.** Run a breadth-first search from the centre or centres at once (both centres are sources at distance `0`, and the edge between them is never used). For each vertex `v`, compute `lowest[v]`, the largest distance to the centre in the subtree of `v`, going through the search order backwards. Then `v` is on a longest path exactly when `lowest[v] = h`:
- if so, go down from `v` to a vertex at distance `h`, and complete with half a longest path in **another** branch (there always is one, since at least two branches reach `h`);
- otherwise, no path through `v` can have both halves of length `h`.

Complexity: **O(N)**, three breadth-first searches.

Why the other ideas fail:
- Testing `dist(a, v) + dist(v, b) = D` only finds the vertices of the path from `a` to `b` and its "twins". In the first example, this method does not count the third arm of length `2`.
- Computing all the distances between pairs of vertices (one search from each vertex) costs O(N²): 4 × 10⁸ visits for `N = 20,000`.

Pitfalls:
- With `N = 1`, the diameter is `0` and the only vertex counts: the answer is `1`.
- When `D` is odd, both centres always count, and `h = (D - 1) / 2`.
- The numbers do not follow the hierarchy: a vertex may have a smaller number than its parent.
