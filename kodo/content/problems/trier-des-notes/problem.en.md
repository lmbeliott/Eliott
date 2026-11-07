---
title: Sorting marks
---

## Statement
A class received `N` papers marked out of 20. Print the `N` marks in increasing order.

## Input
The first line contains `N`. The second line contains the `N` marks, integers between `0` and `20`, separated by spaces.

## Output
A single line: the `N` marks in increasing order, separated by spaces.

## Constraints
- 1 ≤ N ≤ 50,000
- 0 ≤ each mark ≤ 20

## Hints
1. A selection sort or an insertion sort makes about N² / 2 comparisons: more than a billion for N = 50,000. But marks only take 21 values: this can be exploited.
2. Count how many papers got 0, how many got 1, …, how many got 20.
3. Then print each mark as many times as it was counted, from 0 to 20.

## Solution
This is **counting sort**. An array `cpt` of 21 cells, filled in one pass over the marks, gives `cpt[v]` = number of papers marked `v`. Then go through the values `v` from 0 to 20 in increasing order and write `v` exactly `cpt[v]` times.

The result is correct: each mark is written as many times as it appears in the input, and the values come out in increasing order since they are visited in that order.

Counting costs N operations, rebuilding costs N + 21: about 2N operations in total, against about N² / 2 = 1.25 billion comparisons for a selection sort when N = 50,000. Python's `sorted` or C++'s `sort` would also be fast enough, but they do not take advantage of the small number of possible values.
