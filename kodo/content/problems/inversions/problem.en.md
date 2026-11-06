---
title: Inversions
---

## Statement
You are given a permutation `P[1], P[2], …, P[N]` of the integers from `1` to `N`. An **inversion** is a pair of positions `i < j` such that `P[i] > P[j]`.

Write a program that counts the inversions of the permutation.

## Input
- The first line contains an integer `N`.
- The second line contains `N` distinct integers between `1` and `N`: `P[1]`, `P[2]`, …, `P[N]`.

## Output
A single integer: the number of inversions.

## Constraints
- 1 ≤ N ≤ 20 000

## Hints
1. Comparing every pair means about 2 × 10⁸ comparisons: far too many in Python.
2. Go through the permutation from left to right. When you reach value `d`, how many inversions does it form with the values already seen? You only need to know how many values already seen are **larger** than `d`.
3. Maintain a Fenwick tree over the values: cell `d` is `1` if value `d` has already been seen. A prefix sum then gives the number of values already seen that are smaller than `d`.

## Solution
We go through the permutation from left to right. When we reach value `d` in position `i` (counting from `0`), `i` values have already been seen. Those larger than `d` are placed before it: each of them forms an inversion with `d`. Adding this number for every position counts each inversion exactly once (when we see the second element of the pair).

So we need to answer quickly "how many values already seen are smaller than `d`?" while adding the values one by one. That is exactly what a **Fenwick tree** over the array `vu[1..N]` does (`vu`, "seen": `vu[d] = 1` if `d` has already been seen):
- `somme(d)` ("sum") gives the number of values already seen between `1` and `d`, in O(log N);
- `ajoute(d)` ("add") sets `vu[d]` to `1`, in O(log N).

The number of inversions that `d` forms with the values placed before it is `i - somme(d)`. Total complexity: **O(N log N)**.

The naive algorithm compares every pair: N(N - 1)/2, that is 2 × 10⁸ comparisons for `N = 20 000`.

A modified merge sort can also count the inversions in O(N log N).

Traps:
- The result can reach N(N - 1)/2 ≈ 2 × 10⁸: it fits in a 32-bit `int`, but not by much; a `long long` is safer.
- The Fenwick tree is indexed from `1`: with index `0`, `i & -i` is `0` and the loop in `ajoute` never stops.
