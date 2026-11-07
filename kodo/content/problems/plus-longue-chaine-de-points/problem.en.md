---
title: Longest chain of points
---

## Statement
You are given `N` points, each described by two integers `X` and `Y`. A **chain** is a sequence of points chosen among them, in any order you like, where each point has **both** a strictly larger `X` and a strictly larger `Y` than the previous point.

Write a program that computes the maximum number of points in a chain.

## Input
- The first line contains an integer `N`.
- Each of the next `N` lines contains two integers `X` and `Y`: the coordinates of a point.

Several points may have the same `X`, the same `Y`, or both.

## Output
A single integer: the maximum number of points in a chain.

## Constraints
- 1 ≤ N ≤ 15 000
- 1 ≤ X, Y ≤ 10 000

## Hints
1. If the points are sorted by increasing `X`, a chain is a subsequence of the sorted list. What must happen to the `Y` values along this subsequence?
2. What remains is to find the longest strictly increasing subsequence of the `Y` values. The O(N²) version is too slow in Python (in C++, it still passes at this size). Instead, for each length `k`, keep the smallest possible `Y` of the last point of a subsequence of length `k`. This array is sorted, and you can update it with a binary search.
3. Beware of points with the same `X`: they cannot follow each other in a chain. Sort them by **decreasing** `Y` when their `X` are equal: this way, two of them can never form a strictly increasing subsequence.

## Solution
**Reducing to one dimension.** We sort the points by increasing `X`. A chain, read in order, has strictly increasing `X` values: so it is a subsequence of the sorted list whose `Y` values are strictly increasing. The problem becomes the **longest strictly increasing subsequence** (LIS) of the `Y` values.

**The trick for ties.** Two points with the same `X` cannot follow each other. If we sort them by **decreasing** `Y` when their `X` are equal, their `Y` values never form an increasing sequence, so the LIS can't take two of them. With an increasing sort for equal `X`, the LIS could chain `(1500, 2)` then `(1500, 5)`, which is forbidden.

**The LIS in O(N log N).** The direct dynamic programming ("`lis[i]` = longest chain ending with point `i`, computed from all `j < i`") costs O(N²), about 10⁸ comparisons for `N = 15 000`: too slow in Python. In C++ it still passes at this size, but the O(N log N) method is the one to know: it stays fast for hundreds of thousands of points. We maintain an array `fin` ("end"), where `fin[k]` is the smallest possible `Y` of the last point of a strictly increasing subsequence of length `k + 1`. This array is strictly increasing. For each value `y`, in order:
- we binary search for the first position `k` such that `fin[k] ≥ y`;
- if it doesn't exist, `y` extends the longest subsequence: we append it at the end;
- otherwise, we replace `fin[k]` with `y`: we get a subsequence of length `k + 1` that ends lower.

The answer is the final length of `fin`. Complexity: **O(N log N)** for the sort and the `N` binary searches.

Traps:
- For a **strictly** increasing sequence, look for the first element `≥ y` (`bisect_left` in Python, `lower_bound` in C++). With `> y` (`bisect_right`, `upper_bound`), you would allow two equal `Y` values.
- The array `fin` is not a valid chain in itself: only its length is meaningful.
