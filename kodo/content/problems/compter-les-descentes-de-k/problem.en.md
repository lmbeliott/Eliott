---
title: Counting drops of K
---

## Statement
A curve starts at height 0 and moves forward step by step: at each step, a symbol says whether it goes up by 1 (`+`), goes down by 1 (`-`) or stays at the same level (`=`). The points of the curve are numbered from 0 to N: point 0 is the start, and point i is reached just after the i-th step.

Write a program that counts the pairs of points (i, j), with i < j, such that point j is exactly K lower than point i.

## Input
- The first line contains two integers N and K.
- The second line contains N symbols written together, each one `+`, `-` or `=`.

## Output
A single integer: the number of pairs (i, j) with 0 ≤ i < j ≤ N such that the height of point i minus the height of point j is exactly K.

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ N

## Hints
1. First compute the height of every point, starting from `0` for point 0. Testing every pair of points would take about 5 billion comparisons: you need something better.
2. Go through the points in order. For a point j at height h, the possible starting points are the points already seen at height h + K. So it is enough to know how many points already seen have each height.
3. Keep a dictionary `vues` (French for "seen"): `vues[h]` = number of points already met at height h. For each point j, add `vues[h + K]` to the total, then increase `vues[h]` by 1. Careful, the answer can be very large.

## Solution
**The idea: running heights and counting.** The height of point i is a prefix sum: the number of `+` minus the number of `-` among the first i steps. We want to count the pairs i < j with `hauteur[i] = hauteur[j] + K` (*hauteur* means "height").

We go through the points from 0 to N while updating a dictionary `vues`, where `vues[h]` is the number of points already visited that are at height h. When we reach point j, at height h, the possible starting points are exactly the earlier points at height h + K: we add `vues[h + K]` to the answer. Only then do we add point j to the dictionary. This order guarantees that we only count pairs with i < j, and each of them only once.

On the example `+--=+-` with K = 1, the heights of points 0 to 6 are `0 1 0 -1 -1 0 -1`. Point 6 (height −1) forms a pair with points 0, 2 and 5 (height 0), which makes 3 pairs; in total we find 9.

**Complexity.** A single loop of N + 1 steps, with constant-time dictionary operations: O(N).

**Why the naive solution is too slow.** Testing every pair of points takes about N²/2 = 5 × 10⁹ comparisons for N = 100 000: several minutes in Python, and around the time limit in C++.

**Traps.**
- The answer can exceed 2³¹ (for example, 45 000 points at height 0 followed by 55 000 points at height −K give almost 2.5 billion pairs): use a `long long` in C++.
- Heights can be negative. A dictionary has no problem with that; in C++, you can also use an array of size 2N + 1 and shift the indices by N, checking that h + K ≤ N before reading `vues[h + K]` (otherwise there is no possible start).
- Point 0 counts too: don't forget to add it to the dictionary before the first step.
