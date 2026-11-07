---
title: Total elevation gain
---

## Statement
A GPS has recorded the altitude of `N` points along a route, in the order of the route. Between two points that follow each other, the route goes up, goes down or stays flat.

Write a program that computes the **elevation gain** of the route: the sum of all the climbs between two points that follow each other. Descents don't count: they are not added to the total, and they are not subtracted from it either.

## Input
- The first line contains the integer `N`, the number of points.
- The second line contains `N` integers separated by spaces: the altitudes of the points, in meters, in the order of the route.

## Output
A single integer: the elevation gain, in meters.

## Constraints
- 1 ≤ N ≤ 1,000
- Each altitude is between 500 and 4,800.

## Hints
1. Between point `i - 1` and point `i`, the route climbs `alt[i] - alt[i - 1]` meters when this number is positive.
2. The first point has no point before it: make `i` go from `1` to `N - 1`.
3. Keep a total that starts at `0`, and add the difference to it only when the difference is strictly positive.

## Solution
We store the altitudes in a list, then look at each pair of points that follow each other: point `i - 1` and point `i`, for `i` going from `1` to `N - 1`. If `alt[i] > alt[i - 1]`, the route climbs `alt[i] - alt[i - 1]` meters, and we add this climb to the total. Otherwise, we add nothing.

For example, for the altitudes 1200, 1500, 1400, 1700, 1650: we go up 300, down 100, up 300, down 50. The elevation gain is 300 + 300 = 600.

The classic traps:
- only computing "last altitude minus first altitude": that gives 450 on the example, because the descents have been subtracted;
- starting `i` at `0`: in C++, `alt[-1]` doesn't exist; in Python, `alt[-1]` is the **last** element of the list, so the program doesn't crash, but it counts an imaginary climb between the last point and the first one.
