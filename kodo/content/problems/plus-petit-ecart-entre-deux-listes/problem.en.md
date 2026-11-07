---
title: Smallest gap between two lists
---

## Statement
Two lists of integers `A` and `B` are given, each sorted in non-decreasing order. Find the smallest gap `|A[i] − B[j]|` between a value of `A` and a value of `B`.

## Input
- The first line contains `N`, the second the `N` integers of `A`.
- The third line contains `M`, the fourth the `M` integers of `B`.

## Output
The smallest gap.

## Constraints
- 1 ≤ N, M ≤ 10,000
- The values are between 0 and 10⁶.

## Hints
1. Trying every pair would take up to 10⁸ computations: too slow. The lists are sorted, use it.
2. Move through both lists at the same time, as for a merge, with an index `i` in `A` and an index `j` in `B`.
3. If `A[i] < B[j]`, all the remaining values of `B` are at least `B[j]`: `A[i]` cannot do better than with `B[j]`. You can forget it and advance `i`.

## Solution
Go through both lists as for a merge, with `i` in `A` and `j` in `B`, both at 0 at the start. At each step, compare `|A[i] − B[j]|` with the best gap known, then advance the index of the smaller of the two values (`i` if `A[i] < B[j]`, otherwise `j`). Stop when one of the lists is exhausted.

**Why it is correct.** Suppose `A[i] < B[j]`. All the values `B[j']` with `j' ≥ j` satisfy `B[j'] ≥ B[j] > A[i]`, so `|A[i] − B[j']| = B[j'] − A[i] ≥ B[j] − A[i]`. So the best partner of `A[i]` among the remaining values of `B` is `B[j]`, and this pair has just been examined: `A[i]` can be dropped without losing anything. The case `A[i] ≥ B[j]` is symmetric. Thus, at every moment, any unexamined pair containing a dropped value is at least as bad as a pair already examined. When a list is exhausted, all its values have been dropped, and the best gap known is the smallest of all.

**Cost.** Each step advances one index: at most `N + M` steps, against `N × M` pairs when trying every pair, up to 10⁸. The trap: advancing the index of the **larger** value, which can miss the right pair.
