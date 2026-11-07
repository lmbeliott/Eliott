---
title: Minimum and maximum
---

## Statement
Read `N` integers and print the smallest one, then the largest one.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer.

## Output
A single line containing two integers separated by a space: the smallest value, then the largest.

## Constraints
- 1 ≤ N ≤ 1 000
- −1 000 000 000 ≤ each value ≤ 1 000 000 000

## Hints
1. Keep two variables: the smallest value seen so far, and the largest.
2. Both start from the first value read. What would happen if they started at 0 and all the values were negative?
3. For each new value, two independent tests: is it smaller than the minimum? Is it larger than the maximum?

## Solution
Read the first value and store it both in `low` and in `high`. Then, for each of the `N − 1` following values, compare it with both: if it is smaller than `low`, it becomes the new `low`; if it is larger than `high`, it becomes the new `high`.

The trap is to start from `0`: if all the values are positive, the printed minimum would be `0`, which is not in the input; if they are all negative, the maximum would be wrong. With `N = 1`, the loop runs zero times, and the only value is both the minimum and the maximum.
