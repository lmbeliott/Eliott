---
title: The chain of summits
---

## Statement
Chloé is preparing to climb the Grand Pic of Valcorde. The alpine club's logbook describes `N` summits of the valley by their altitude and their difficulty grade. To train step by step, Chloé wants a **programme**: a sequence of different summits, picked from the logbook in any order she likes, where each summit is both **strictly higher** and **strictly harder** than the previous one.

Write a program that computes the maximum number of summits in such a programme.

## Input
- The first line contains an integer `N`.
- Each of the next `N` lines contains two integers `A` and `D`: the altitude and the difficulty of a summit.

Several summits may have the same altitude, the same difficulty, or both.

## Output
A single integer: the maximum number of summits in a programme.

## Constraints
- 1 ≤ N ≤ 15 000
- 1 ≤ A, D ≤ 10 000

## Hints
1. If the summits are sorted by increasing altitude, a programme is a subsequence of the sorted list. What must happen to the difficulties along this subsequence?
2. What remains is to find the longest strictly increasing subsequence of the difficulties. The O(N²) version is too slow: for each length `k`, keep the smallest possible difficulty of the last summit of a subsequence of length `k`. This array is sorted, and you can update it with a binary search.
3. Beware of summits with the same altitude: they cannot follow each other in a programme. Sort them by **decreasing** difficulty when altitudes are equal: this way, two of them can never form a strictly increasing subsequence.

## Solution
**Reducing to one dimension.** We sort the summits by increasing altitude. A programme, read in order, has strictly increasing altitudes: so it is a subsequence of the sorted list whose difficulties are strictly increasing. The problem becomes the **longest strictly increasing subsequence** (LIS) of the difficulties.

**The trick for ties.** Two summits with the same altitude cannot follow each other. If we sort them by **decreasing** difficulty when altitudes are equal, their difficulties never form an increasing sequence, so the LIS can't take two of them. With an increasing sort for equal altitudes, the LIS could chain `(1500, 2)` then `(1500, 5)`, which is forbidden.

**The LIS in O(N log N).** The direct dynamic programming ("`lis[i]` = longest programme ending with summit `i`, computed from all `j < i`") costs O(N²), about 10⁸ comparisons for `N = 15 000`: too slow. Instead, we maintain an array `fin` ("end"), where `fin[k]` is the smallest possible difficulty for the last summit of a strictly increasing subsequence of length `k + 1`. This array is strictly increasing. For each difficulty `d`, in order:
- we binary search for the first position `k` such that `fin[k] ≥ d`;
- if it doesn't exist, `d` extends the longest subsequence: we append it at the end;
- otherwise, we replace `fin[k]` with `d`: we get a subsequence of length `k + 1` that ends lower.

The answer is the final length of `fin`. Complexity: **O(N log N)** for the sort and the `N` binary searches.

Traps:
- For a **strictly** increasing sequence, look for the first element `≥ d` (`bisect_left` in Python, `lower_bound` in C++). With `> d` (`bisect_right`, `upper_bound`), you would allow two equal difficulties.
- The array `fin` is not a valid programme in itself: only its length is meaningful.
