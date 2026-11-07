---
title: Gap to the maximum
---

## Statement
For each of the `N` given integers, print how much it lacks to reach the largest of them, that is the difference between the maximum and this integer.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single line with `N` integers separated by spaces: for each integer, in input order, the gap between the maximum and it.

## Constraints
- 1 ≤ N ≤ 10,000
- Each integer is between −10⁹ and 10⁹.

## Hints
1. The maximum is known only after reading every value: you must keep them in an array.
2. A first traversal finds the maximum, a second one prints the gaps.
3. Initialise the maximum with the first element, not with 0: all the values can be negative.

## Solution
Store the values in an array, then make two passes. The first computes the maximum `m`: start from `t[0]`, and each larger element replaces it. The second prints `m - x` for each element `x`, in order.

The classic trap is initialising the maximum to 0: if all values are negative, the maximum found would be 0, which is not in the array. The gaps go up to 2 × 10⁹, which exceeds an `int` in C++: you need `long long`.
