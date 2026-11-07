---
title: Make a sequence strictly increasing
---

## Statement
You are given a sequence of `N` integers `a[1], a[2], …, a[N]`, all greater than or equal to `1`. You may **modify** as many values as you like: a modified value can be replaced with any integer greater than or equal to `1`.

Write a program that computes the minimum number of values to modify so that the sequence becomes **strictly increasing** (`a[1] < a[2] < … < a[N]`).

## Input
- The first line contains an integer `N`.
- The second line contains `N` integers: `a[1]` to `a[N]`.

## Output
A single integer: the minimum number of values to modify.

## Constraints
- 1 ≤ N ≤ 20 000
- 1 ≤ a[i] ≤ 10⁹

## Hints
1. Keeping the longest strictly increasing subsequence is not enough: in `1 2 2 3 4`, you cannot keep `1 2 3 4`, because there is no integer strictly between `2` and `3` to replace the second `2`.
2. You can keep `a[i]` and then `a[j]` (with `i < j`) only if there is enough room between them for the `j - i - 1` modified values: `a[j] - a[i] ≥ j - i`, that is `a[j] - j ≥ a[i] - i`. And before `a[i]`, you must place `i - 1` values between `1` and `a[i] - 1`.
3. Let `b[i] = a[i] - i`. The kept values are exactly a **non-decreasing** subsequence of `b` made of values `b[i] ≥ 0`. Find the longest one in O(N log N).

## Solution
Let's choose the positions we **keep**; all the others are modified. When can the sequence be completed?
- Between two consecutive kept positions `i < j`, you must place `j - i - 1` integers strictly between `a[i]` and `a[j]`: you need `a[j] - a[i] ≥ j - i`.
- Before the first kept position `i`, you need `i - 1` distinct integers between `1` and `a[i] - 1`: you need `a[i] ≥ i`.
- After the last kept position, there is no constraint: the values can grow as much as needed.

These conditions are enough: fill each gap with the integers that follow the kept value on its left (or `1, 2, 3…` at the start). With `b[i] = a[i] - i`, the first condition becomes `b[i] ≤ b[j]` and the second `b[i] ≥ 0`. So we are looking for the **longest non-decreasing subsequence** of `b`, using only the values `b[i] ≥ 0`. The answer is `N` minus its length.

For the longest subsequence, keep the array `ends`, where `ends[L]` is the smallest possible last value of a subsequence of length `L + 1`. This array stays sorted. For each value `b`, use **binary search** to find the first entry **strictly greater** than `b` (`bisect_right` in Python, `upper_bound` in C++): replace it with `b`, or append `b` at the end. The final length of `ends` is the length we want.

Complexity: **O(N log N)**.

Why the other ideas fail:
- `N` minus the longest strictly increasing subsequence of `a` is wrong: it ignores the room needed between two kept values (first hint).
- Forgetting the condition `b[i] ≥ 0` is wrong too: on `3 1 2`, you cannot keep `1 2`, because the first position would need an integer smaller than `1`. The answer is `2`, not `1`.
- The O(N²) dynamic programming, which tests every pair `i < j`, makes 2 × 10⁸ comparisons: too slow in Python.

Pitfalls:
- Ties between the `b[i]` are allowed: with `bisect_left` (or `lower_bound`), you would compute a strictly increasing subsequence of `b`, which is too short. On `1 2 3 4`, all the `b[i]` are `0` and you keep everything.
- Positions are counted from `1` in `b[i] = a[i] - i`: with indices starting at `0`, the condition becomes `a[i] - i ≥ 1`.
