---
title: Dominant values
---

## Statement
You are given a list of `N` integers. A value of the list is **dominant** if it is strictly greater than all the values placed after it. The last value is always dominant, since nothing follows it.

Write a program that prints the number of dominant values, then their positions. Positions are numbered from 1.

## Input
- The first line contains the integer `N`.
- The second line contains `N` integers separated by spaces: the list.

## Output
- On the first line, the number of dominant values.
- On the second line, their positions, in increasing order, separated by spaces.

## Constraints
- 1 ≤ N ≤ 20 000
- Each value is between 0 and 100 000.

## Hints
1. Comparing each value with all the values that follow it takes far too many comparisons when the list is long: up to 200 million for 20 000 values. You need a single pass.
2. Go through the list **starting from the end**. Keep in a variable the largest value seen so far, that is, the largest value placed after the cell you are on.
3. A value is dominant if it is strictly greater than this maximum. Store its position in a list, then update the maximum. Since you found the positions from right to left, print this list in reverse.

## Solution
A value is dominant if it is strictly greater than the **maximum of everything that follows it**. This maximum can be computed as you go, by walking through the list from right to left.

Keep a variable `largest`, which starts at `-1` (smaller than every value, so the last value is always dominant). For each position `i`, from `N - 1` down to `0`:
- if `list[i] > largest`, the value is dominant: add position `i + 1` to a list `positions`, and set `largest` to `list[i]`;
- otherwise, nothing changes.

The positions are found from right to left: print them in reverse so that they come in increasing order.

Example with `5 9 3 7 7 2 6 1`: starting from the end, `1` is dominant (maximum `1`), so is `6` (maximum `6`), `2` is not, the `7` at position 5 is (maximum `7`), the `7` at position 4 is not, because it is not **strictly** greater than the other `7`, `3` is not, `9` is, `5` is not. The positions are 8, 7, 5, 2, printed in order: `2 5 7 8`.

Pitfalls:
- using `>=` instead of `>`: two equal values are not both dominant, only the last one is;
- comparing each value with all the following ones: the answer is right, but for a decreasing list of 20 000 values this takes about 200 million comparisons, which is much too slow. The pass from the end only takes 20 000.
