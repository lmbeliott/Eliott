---
title: Count peaks and valleys
---

## Statement
The altitude is measured at `N` points along a trail, in order. A measurement is a **peak** if it is strictly higher than both its neighbours, and a **valley** if it is strictly lower than both its neighbours. The first and last measurements have only one neighbour: they are never a peak or a valley. Print the number of peaks and the number of valleys.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer: an altitude.

## Output
A single line containing two integers separated by a space: the number of peaks, then the number of valleys.

## Constraints
- 3 ≤ N ≤ 1 000
- 0 ≤ each altitude ≤ 10 000

## Hints
1. To know whether a value is a peak, you need the value before it **and** the value after it. So you can only decide after reading the next value.
2. Keep two variables: `before` and `middle`. When you read a new value `after`, examine `middle`.
3. After the examination, the variables move forward by one: `before` takes the value of `middle`, then `middle` that of `after`.

## Solution
Slide a window of three consecutive values along the sequence. Read the first two values into `before` and `middle`, then run `N − 2` iterations. At each iteration, read `after` and examine `middle`:
- if `middle > before and middle > after`, it is a peak;
- if `middle < before and middle < after`, it is a valley.

Then shift: `before = middle`, and `middle = after`. The order of these two assignments matters: the other way round, the old value of `middle` would be lost.

The traps: with non-strict comparisons (`>=`), a plateau such as `2 5 5 3` would give two peaks, while there is none; and the first and last measurements must not be examined.
