---
title: Sorting by moving to the end
---

## Statement
You are given a list of `N` integers. An **operation** consists in taking an element of the list, any one, and moving it to the very end. For example, an operation on the `3` of the list `3 1 2 4` gives `1 2 4 3`.

Write a program that prints the minimum number of operations needed for the list to be sorted in increasing order. Values can repeat: a list like `1 1 2 2 3` is sorted.

## Input
- The first line contains the integer `N`.
- The second line contains `N` integers separated by spaces.

## Output
A single integer: the minimum number of operations.

## Constraints
- 1 ≤ N ≤ 20,000
- Each integer is between 1 and 1,000,000.

## Hints
1. Look instead at the elements that are **never** moved: they stay at the start of the list, in their original order, and all the moved elements end up behind them. You can always choose the order of the operations so that the moved elements arrive sorted. So you need to keep as many elements as possible.
2. The kept elements must already be in increasing order, and none of them can be larger than a moved element. If a copy of the value `v` is moved, no value larger than `v` can be kept; and all the values smaller than `v` must be kept entirely.
3. Sort the different values and go through them in increasing order, remembering the last position of the elements kept so far. If all the copies of the next value are after this position, keep them all. Otherwise, keep only the copies placed after this position, and stop.

## Solution
**Change the point of view.** Instead of looking for the elements to move, we look for those that stay in place. The elements that are never moved end up at the start of the final list, in their original order, and the moved elements are behind them, in the order in which they were moved. Since we choose that order, we can move them from smallest to largest: they arrive sorted. So the answer is `N` minus the largest number of elements we can keep.

**Which elements to keep?** The final list is sorted if and only if:
- the kept elements are in increasing order in the original list;
- no kept element is larger than a moved element.

The second condition gives the shape of the kept elements: all the copies of the smallest values, then possibly some of the copies of the next value, and nothing beyond.

**The algorithm.** We group the positions of each value with a dictionary, then go through the different values in increasing order, remembering `fin` (*end*), the last position of the elements kept so far (`-1` at the start). For the value `v`:
- if its first position is after `fin`, all its copies can stay: we keep them, and `fin` becomes the last position of `v`;
- otherwise, a copy of `v` is before `fin` and has to go. We still keep the copies of `v` placed after `fin` (an equal value can stay in front of a moved copy of `v`), then we stop: nothing more can be kept.

In the second example, `1 3 2 1 2 2`: the two `1`s (positions 0 and 3) are kept, `fin = 3`. The first `2` is at position 2, before `fin`: we keep the two `2`s at positions 4 and 5, and stop. We keep 4 elements, so 6 - 4 = 2 operations are needed: move the `2` at position 2, then the `3`.

**Traps.**
- The longest increasing subsequence does not give the answer: in `2 3 1`, `2 3` is already in order, but 2 operations are needed, because the `1` cannot come back to the front.
- Moving the elements that are not at their place in the sorted list does not work either: in `3 1 2 4`, only the `4` is at its place, and yet 2 operations are enough.
- With repeated values, do not stop too early: the copies of `v` placed after `fin` are still kept.

Sorting the different values takes most of the time; each position is then looked at only once.
