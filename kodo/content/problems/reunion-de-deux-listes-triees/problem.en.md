---
title: Union of two sorted lists
---

## Statement
Two lists of integers are given, each sorted in non-decreasing order (a value may repeat). Print, in strictly increasing order, all the values that appear in at least one of the two lists, each one only once.

## Input
- The first line contains `N`, the second the `N` integers of the first list.
- The third line contains `M`, the fourth the `M` integers of the second list.

## Output
- On the first line, the number of different values.
- On the second line, these values in strictly increasing order, separated by spaces.

## Constraints
- 1 ≤ N, M ≤ 12,000
- The values are between 0 and 100,000.

## Hints
1. This is a merge: move through both lists at the same time, with one index for each.
2. At each step, the smallest unused value of the two lists together is `A[i]` or `B[j]`: take the smaller of the two.
3. The values come out in increasing order: a value already written can only reappear immediately after. It is enough to compare it with the last value written.

## Solution
**Merge** the two lists with two indices `i` and `j`, pointing to the first unused values of `A` and `B`. At each step, take `A[i]` if list `B` is exhausted, or if `A` is not and `A[i] ≤ B[j]`; otherwise, take `B[j]`. Advance the index of the value taken.

Why the values come out in increasing order: at each step, the remaining values of `A` are all at least `A[i]` (the list is sorted), and those of `B` at least `B[j]`. So the smaller of the two is the smallest of all remaining values. By induction, the sequence of values taken is the sorted union of both lists, with repetitions.

To remove repetitions, only add a value to the result if it differs from the last value added. This is enough: in an increasing sequence, all the copies of a value are consecutive.

Cost: each step advances one of the two indices, so there are exactly `N + M` steps. Checking for each value whether it is already in the result by scanning it would take up to `(N + M)² / 2` comparisons, nearly 300 million.
