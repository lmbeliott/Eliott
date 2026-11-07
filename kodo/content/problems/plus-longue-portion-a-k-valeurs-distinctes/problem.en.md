---
title: Longest segment with K distinct values
---

## Statement
A sequence of `N` integers `A₁, …, A_N` and an integer `K` are given. Find the longest **segment** (run of consecutive cells) containing at most `K` different values.

Print its length, then the position of its first cell. If several segments have the maximum length, choose the one starting earliest.

## Input
The first line contains `N` and `K`. The second line contains `A₁, …, A_N`, separated by spaces.

## Output
Two integers on one line: the maximum length, then the position (from 1) of the start of the segment.

## Constraints
- 1 ≤ N ≤ 30,000
- 1 ≤ K ≤ N
- 1 ≤ Aᵢ ≤ 1,000

## Hints
1. For each start, extending the segment as long as it has at most `K` different values costs up to N² / 2 operations when segments are long.
2. If a segment has at most `K` different values, so do all the segments it contains. When the end moves forward, the best start never moves back.
3. Sliding window: move the end `d` forward one cell at a time; while the window has more than `K` different values, move the start `g` forward. A counting array gives the number of copies of each value in the window.

## Solution
Slide a **window** `[g, d]`. An array `cpt` counts the copies of each value in the window, and `differentes` ("different") the number of values with `cpt > 0`. For each end `d` from left to right:

1. add `A[d]` (if its counter goes from 0 to 1, `differentes` increases);
2. while `differentes > K`, remove `A[g]` (if its counter drops to 0, `differentes` decreases) and move `g` forward;
3. the window `[g, d]` is valid; if it is **strictly** longer than the best found so far, keep it.

**Why.** Invariant: after step 2, `g` is the smallest start such that `[g, d]` has at most `K` different values. Indeed, a segment shorter than a valid segment is valid, and a segment containing an invalid one is invalid. So when `d` increases, the smallest valid start can only increase: you never need to move `g` back. For each end `d`, the best segment ending at `d` is `[g, d]`, and all ends are examined. With the strict comparison, you keep the first segment of maximum length found; it is the one starting earliest, since segments of the same length are found by increasing start.

**Cost.** `d` moves forward N times and `g` moves forward at most N times in total: about 2N operations. The direct method can make N² / 2 = 450 million.
