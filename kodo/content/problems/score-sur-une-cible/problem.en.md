---
title: Score on a target
---

## Statement
A target is made of five discs with the same centre `(0, 0)`, with radii 10, 20, 30, 40 and 50. A shot at point `(X, Y)` scores 10 points if it is in the disc of radius 10, 8 points if it is in the disc of radius 20 (but not in the previous one), then 6, 4 and 2 points for the discs of radii 30, 40 and 50. A shot on the edge of a disc counts as inside. Outside the disc of radius 50, the shot scores 0 points.

Print the total score of a series of `N` shots, then the number of shots that score 0 points.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains two integers `X` and `Y`: the coordinates of a shot.

## Output
A single line with two integers separated by a space: the total score, then the number of shots scoring 0 points.

## Constraints
- 1 ≤ N ≤ 1,000
- -100 ≤ X, Y ≤ 100

## Hints
1. The distance between `(X, Y)` and the centre is the square root of `X × X + Y × Y`. To avoid square roots and decimals, compare the squares: the shot is in the disc of radius `r` when `X × X + Y × Y ≤ r × r`.
2. Test the discs from the smallest to the largest with `if`, `elif`…: the first one that contains the shot gives the points.
3. Check a shot on an edge: `(6, 8)` is exactly at distance 10 from the centre, it scores 10 points.

## Solution
For each shot, compute `d = X × X + Y × Y`, the square of the distance to the centre. Comparing `d` with `r × r` is the same as comparing the distance with `r`, without square roots or decimals.

An `if / elif / else` chain tests the discs from the smallest to the largest: `d ≤ 100` gives 10 points, otherwise `d ≤ 400` gives 8, otherwise `d ≤ 900` gives 6, otherwise `d ≤ 1600` gives 4, otherwise `d ≤ 2500` gives 2, and otherwise the shot is missed: increase the counter of 0-point shots. The order of the tests matters: a shot in the disc of radius 10 is also in all the others, and the smallest disc gives the points.

The trap: using `<` instead of `≤`, which takes points away from shots lying exactly on an edge.
