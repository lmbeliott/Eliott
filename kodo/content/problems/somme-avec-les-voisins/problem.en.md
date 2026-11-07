---
title: Sum with the neighbours
---

## Statement
Each element of a sequence of `N` integers is replaced by the sum of this element and its immediate neighbours, the one on the left and the one on the right. The first and last elements have only one neighbour. All computations use the original sequence.

For example, the sequence `1 2 3 4` becomes `3 6 9 7`.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single line with the `N` integers of the new sequence, separated by spaces.

## Constraints
- 1 ≤ N ≤ 1,000
- Each integer is between −1,000 and 1,000.

## Hints
1. You need the neighbours of each element: traverse the array by index.
2. The left neighbour `t[i - 1]` exists only if `i > 0`, and the right one `t[i + 1]` only if `i < N - 1`.
3. Store the results in a **new** array. If you modified `t` in place, the computation of the next element would use a value already changed.

## Solution
Go through the indices `i` from 0 to `N − 1`. Start from `s = t[i]`, add `t[i - 1]` if `i > 0` and `t[i + 1]` if `i < N − 1`, then append `s` to a new array, printed at the end.

Two traps. First the edges: without the two tests, `t[i + 1]` goes outside the array for the last element (`IndexError` in Python, absurd value in C++), and in Python `t[-1]` is the last element, which would silently add a fake neighbour to the first one. Then in-place modification: writing the result into `t[i]` would spoil the computation of `t[i + 1]`, which needs the old value. For `N = 1`, the element has no neighbour and stays unchanged.
