---
title: Increasing subsequence with bounded jumps
---

## Statement
You are given two arrays `A[1..N]` and `W[1..N]`, and an integer `D`. You must choose indices `i₁ < i₂ < … < iₖ` (with `k ≥ 1`) that follow two rules:
- the values are strictly increasing: `A[i₁] < A[i₂] < … < A[iₖ]`;
- two consecutive chosen indices are close: `iₜ₊₁ - iₜ ≤ D` for every `t`.

The **weight** of the choice is `W[i₁] + W[i₂] + … + W[iₖ]`. Write a program that prints the largest possible weight.

## Input
- The first line contains the integers `N` and `D`.
- The second line contains the `N` integers `A[1]`, …, `A[N]`.
- The third line contains the `N` integers `W[1]`, …, `W[N]`.

## Output
A single integer: the largest possible weight.

## Constraints
- 1 ≤ D ≤ N ≤ 12 000
- 0 ≤ A[i] ≤ 1 000 000
- 1 ≤ W[i] ≤ 1 000

## Hints
1. Let `f[i]` be the largest weight of a choice that ends with index `i`. Then `f[i] = W[i] + max(f[j])`, over the `j` in `[i - D, i - 1]` such that `A[j] < A[i]` (or `+ 0` if there is none). Computing it directly costs O(N × D), too much when `D` is large.
2. You need a maximum over the `j` that satisfy **two** conditions: one on the index (the window), one on the value. Handle the window by adding and removing elements as `i` moves forward, and the value with a structure indexed by value.
3. Sort the indices by `(A, index)` to give each one a different rank. A segment tree (maximum) over the ranks holds `f[j]` for the `j` in the window and `0` elsewhere. Before handling `i`, reset the cell of `i - D - 1` to `0`. The values strictly smaller than `A[i]` fill a beginning of the sorted order: a prefix maximum.

## Solution
**The recurrence.** Let `f[i]` be the largest weight of a choice whose last index is `i`. The previous index `j`, if any, satisfies `i - D ≤ j < i` and `A[j] < A[i]`. So `f[i] = W[i] + max(0, max f[j])` over these `j`, and the answer is the maximum of the `f[i]`.

**Two conditions at once.** The condition on the index is handled by a **sweep**: handle `i` in order and keep in a structure only the `j` of the window `[i - D, i - 1]`. When `i` moves forward by one, index `i - D - 1` leaves the window and is removed. The condition on the value is handled by a **segment tree** indexed by value.

**Ranks.** Sort the indices by `(A[j], j)` and let `rank[j]` be the place of `j` in this order. Each index has its own cell, even when values are equal: removing `j` touches no other index. The indices with a value strictly smaller than `A[i]` have exactly the ranks `0` to `p - 1`, where `p` is the first place with a value `≥ A[i]` in the sorted order (a binary search).

**The algorithm.** The segment tree stores, for each rank, `f[j]` if `j` is in the window, `0` otherwise. For each `i`: reset the cell of `i - D - 1` to `0`, read the maximum over ranks `0` to `p - 1`, compute `f[i]`, then write it at cell `rank[i]`. Since all weights are positive, `0` correctly plays the role of "nothing before".

Complexity: **O(N log N)**.

Why simple ideas fail:
- Going through the whole window for each `i` costs O(N × D), about 7 × 10⁷ operations when `D` is close to `N`.
- A Fenwick tree for the maximum cannot **remove** an element from the window (a maximum cannot be "subtracted"). A segment tree accepts replacing a cell with `0`.
- A sliding maximum (monotonic queue) over the window ignores the condition on the values, and the longest increasing subsequence is not necessarily the heaviest.

Traps:
- The increase is **strict**: two equal values never follow each other. With ranks sorted by `(A, index)`, you must stop before the **first** value equal to `A[i]`, not after the last one.
- The window contains `i - D`: it is `i - D - 1` that is removed before handling `i`.
