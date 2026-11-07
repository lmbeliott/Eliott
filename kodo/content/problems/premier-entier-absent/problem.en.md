---
title: First missing integer
---

## Statement
Print the smallest non-negative integer that does not appear among `N` given integers.

For example, among `3 0 1 7 1`, the integers 0 and 1 are present but not 2: the answer is 2.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the smallest missing non-negative integer.

## Constraints
- 1 ≤ N ≤ 20,000
- Each integer is between 0 and 10⁹.

## Hints
1. Trying 0, then 1, then 2… while scanning the whole array each time works, but can take up to `N × N` = 400 million comparisons: too slow.
2. A presence array `vu`, where `vu[v]` is `True` if `v` appears, answers in a single operation. But you cannot create a billion cells.
3. With `N` integers, at most `N` different values are present: among 0, 1, …, `N`, one is necessarily missing. So the answer is at most `N`, and values larger than `N` are useless.

## Solution
The key remark is mathematical: the `N + 1` integers 0, 1, …, `N` cannot all appear among only `N` values. So the answer is between 0 and `N`. This is the **pigeonhole principle**: you cannot put `N + 1` objects into `N` drawers with at most one object per drawer.

Create an array `vu` of `N + 1` cells, all false. For each value `x` read, if `x ≤ N`, set `vu[x]` to true; larger values are ignored, because they can neither be the answer nor prevent it. It remains to find the first index `v` such that `vu[v]` is false, starting from 0.

The program makes two traversals of length about `N`: it is very fast. The trap is wanting an array as large as the largest value (10⁹ cells), or forgetting to test `x ≤ N` before writing `vu[x]`, which goes outside the array.
