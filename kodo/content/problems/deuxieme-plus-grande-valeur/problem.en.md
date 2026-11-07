---
title: Second largest value
---

## Statement
Read `N` integers and print the second largest value, that is, the one in second position when the values are sorted from largest to smallest. So if the largest value appears several times, the answer is that same value.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer.

## Output
A single integer: the second largest value.

## Constraints
- 2 ≤ N ≤ 1 000
- −1 000 000 000 ≤ each value ≤ 1 000 000 000

## Hints
1. Keep two variables: `first`, the largest value seen so far, and `second`, the second largest.
2. To start, read the first two values, store the larger one in `first` and the other one in `second`.
3. A new value `x` can beat `first` (and then the old `first` becomes `second`), or only `second`, or nothing at all.

## Solution
Keep the two largest values seen so far up to date, with `first ≥ second`. At the start, read two values and put them in the right order. Then, for each new value `x`:
- if `x > first`, the old first moves to second place: `second = first`, then `first = x`;
- otherwise, if `x > second`, `x` only takes second place: `second = x`;
- otherwise, nothing changes.

The order of the two assignments in the first case matters: if you write `first = x` first, the old value of `first` is lost.

This reasoning also handles repeated values. With `9, 4, 9`, the third `9` is not larger than `first`, but it is larger than `second` (4): it takes second place, and the answer is `9`, as required. Also be careful not to start from `0`: all the values can be negative.
