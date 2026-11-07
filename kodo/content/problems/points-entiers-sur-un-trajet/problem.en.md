---
title: Integer points on a path
---

## Statement
A path joins N points of the plane in order: it starts at point P_1, goes in a straight line to point P_2, then in a straight line to P_3, and so on up to P_N. The coordinates of the points are integers.

Write a program that counts how many times the path goes through a point **with integer coordinates**, including the starting point. If the path goes through the same point several times, every pass counts. The end point of a segment is also the start of the next one: at that place, it only counts once.

## Input
- The first line contains an integer N.
- Each of the next N lines contains two integers x and y: the coordinates of the points P_1, P_2, …, P_N.

## Output
A single integer: the number of times the path goes through points with integer coordinates.

## Constraints
- 2 ≤ N ≤ 5,000
- −10⁹ ≤ x, y ≤ 10⁹
- Two consecutive points are always different.

## Hints
1. Handle the segments one by one. On the segment from P_i to P_(i+1), count the points with integer coordinates **without** P_i (already counted), but with P_(i+1).
2. Move along a segment in small equal steps. With differences dx and dy (in absolute value), the smallest step that lands on an integer point again is (dx / g, dy / g), where g = GCD(dx, dy).
3. So a segment with differences dx and dy contains g + 1 integer points, endpoints included. Compute the GCD with Euclid's algorithm: trying every x-coordinate one by one is far too slow when the coordinates are large.

## Solution
**The idea: the GCD of the differences.** Take a segment from P_i to P_(i+1), with `dx = |x_(i+1) − x_i|` and `dy = |y_(i+1) − y_i|`, and let `g = GCD(dx, dy)`. Starting from P_i, we move in steps of (dx / g, dy / g) in the right direction: these are integers, so each step lands on an integer point, and it takes exactly g steps to reach P_(i+1).

There is no other integer point on the segment: an integer point of the segment is at an offset (a, b) from P_i, with a / dx = b / dy. Since dx / g and dy / g have no common divisor left, (a, b) must be a multiple of (dx / g, dy / g). So the segment contains g + 1 integer points, g of them without counting P_i.

The answer is `1 + GCD(dx_1, dy_1) + GCD(dx_2, dy_2) + …`: the starting point, then, for each segment, its integer points without its starting point. A vertical or horizontal segment works too: `GCD(0, dy) = dy`.

In the first example, the segment from (0, 0) to (6, 4) has g = 2 (it goes through (3, 2)), and the one from (6, 4) to (6, −2) has g = 6: the answer is 1 + 2 + 6 = 9.

**Complexity.** Euclid's algorithm takes at most about fifty steps for numbers up to 2 × 10⁹. Overall: O(N log M), where M is the largest difference.

**Why the naive solution is too slow.** Trying every x-coordinate between x_i and x_(i+1) and checking whether the matching y-coordinate is an integer costs up to 2 × 10⁹ operations for a single segment.

**Traps.**
- Differences go up to 2 × 10⁹ and the answer up to about 10¹³: use `long long` in C++.
- Take the absolute values of the differences before computing the GCD.
- Do not count twice the points shared by two consecutive segments.
