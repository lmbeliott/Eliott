---
title: Strictly increasing triplets
---

## Statement
You are given a sequence of `N` integers `A[1], A[2], …, A[N]`.

Write a program that counts the triplets of indices `(i, j, k)` such that `i < j < k` and `A[i] < A[j] < A[k]`.

## Input
- The first line contains an integer `N`.
- The second line contains `N` integers `A[1] … A[N]`.

## Output
A single integer: the number of triplets.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ A[i] ≤ 10⁶

## Hints
1. Three nested loops, or even two, take far too many operations for `N = 20,000`.
2. Fix the middle element `j`. The number of triplets of which it is the middle is (number of `i < j` with `A[i] < A[j]`) × (number of `k > j` with `A[k] > A[j]`).
3. Both numbers can be computed with a Fenwick tree indexed by the values, as for inversions: one pass from left to right, then one from right to left.

## Solution
Fix the **middle** element `j`. The choice of `i` on its left and that of `k` on its right are independent: if `L[j]` is the number of `i < j` with `A[i] < A[j]`, and `R[j]` the number of `k > j` with `A[k] > A[j]`, then `j` is the middle of `L[j] × R[j]` triplets. The answer is the sum of these products.

Compute `L` with a **Fenwick tree** indexed by the values. Go through the sequence from left to right: before inserting `A[j]`, the sum of the counters of the values `1 … A[j] - 1` gives `L[j]`. Then go from right to left with a new tree: among the `N - 1 - j` elements already seen (indices from 0 to N - 1), those that are **strictly** greater are `N - 1 - j` minus those with a value at most `A[j]`.

You can replace each value by its rank among the distinct values (compression): the tree then has at most `N` cells, and it stays small even if the values were very large.

Complexity: **O(N log N)**.

Why the naive methods fail: listing the triplets costs O(N³). Counting `L[j]` and `R[j]` with two loops costs O(N²), that is 4 × 10⁸ comparisons for `N = 20,000`: far too slow in Python.

Pitfalls:
- The inequalities are **strict**: with equal values, `L[j]` counts the values up to `A[j] - 1`, and `R[j]` excludes the values equal to `A[j]` (second example).
- The answer can exceed 2³¹ (up to about 1.3 × 10¹²): use `long long` in C++, including for the product.
