---
title: Longest busy period
---

## Statement
A room has been booked for `N` slots. Each slot goes from minute `D` to minute `F`: the room is busy during all that time. The slots are given in no particular order, and they can overlap.

A **busy period** is a stretch of time, as long as possible, during which the room is busy without any break. If one slot ends at minute 30 and another starts at minute 30, there's no break: they are part of the same period.

Write a program that prints the number of busy periods, and the length of the longest one.

## Input
- The first line contains the integer `N`, the number of slots.
- The next `N` lines each contain two integers `D` and `F`: the start and the end of a slot, in minutes.

## Output
A single line with two integers separated by a space: the number of busy periods, then the length, in minutes, of the longest one.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ D < F ≤ 1 000 000

## Hints
1. Sort the slots by start time. Then go through them in that order, keeping the start and the end of the current period.
2. When the next slot starts no later than the end of the current period, it's part of it: the period may get longer. Otherwise, there's a gap: the current period is over, and a new one starts with this slot.
3. Watch out for slots that lie entirely inside the current period: with `(5, 100)` then `(20, 30)`, the period still goes up to 100, not 30. The new end is the larger of the two ends. And don't forget to count the last period after the loop.

## Solution
Once the slots are sorted by start time, each busy period corresponds to a group of **consecutive** slots in the sorted list. So go through them in order, keeping `start` and `end`, the bounds of the current period, set from the first slot. For each next slot `(d, f)`:
- if `d ≤ end`, the slot starts before the end of the period, or exactly at the end: it's part of it, and the period now goes up to `max(end, f)`;
- otherwise, there is a gap between `end` and `d`: count the current period, compare its length `end - start` with the longest one so far, then a new period starts with `(d, f)`.

In the reference solutions, `start` and `end` are called `debut` and `fin`.

After the loop, the last period hasn't been counted yet: do it before printing.

Why is sorting enough? After sorting, no slot further in the list can start before `d`. If `d` is after `end`, no remaining slot can fill the gap between `end` and `d`: the current period really is over.

The traps:
- replacing the end with `f` instead of taking the maximum: in the second example, the slot `(20, 30)` is entirely inside `(5, 100)`, and the period goes up to 100, then up to 110 thanks to `(90, 110)`;
- using `<` instead of `<=`: two slots that touch leave no gap;
- forgetting the last period, or forgetting to sort: the slots are given in no particular order.

Sorting takes most of the time, and the pass that follows looks at each slot only once.
