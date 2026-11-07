---
title: Maximum distance of a robot
---

## Statement
A robot starts at point `(0, 0)` of a grid and executes `N` orders. Each order is a direction, `N` (north: `y` increases), `S` (south: `y` decreases), `E` (east: `x` increases) or `O` (west: `x` decreases), followed by a number of steps `K`.

The **distance** of the robot to the starting point is the minimal number of steps to get back there along the grid: `|x| + |y|`, where `|x|` is the value of `x` without its sign.

Print the final position of the robot, then the largest distance to the starting point reached during the whole trip.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains a letter (`N`, `S`, `E` or `O`) and an integer `K`, separated by a space.

## Output
A single line with three integers separated by spaces: `x` and `y` at the end of the trip, then the largest distance to the starting point reached.

## Constraints
- 1 ≤ N ≤ 1,000
- 1 ≤ K ≤ 1,000,000

## Hints
1. Keep the position `(x, y)` in two variables and update them after each order. To read an order in Python: `d, k = input().split()`, then `k = int(k)`.
2. To compute `|x|` without a function, use an `if`: if `x` is negative, its value without sign is `-x`.
3. During an order, the robot moves in a straight line: its distance to the start always changes in the same direction, or decreases then increases. So it is largest at the start or at the end of the order, never in the middle: it's enough to look at it after each order.

## Solution
Simulate the trip order by order: depending on the letter, add `K` to `y` (`N`), subtract it from `y` (`S`), add it to `x` (`E`) or subtract it from `x` (`O`). Compare whole words: `d == "N"`.

After each order, compute the distance `|x| + |y|` (with two `if` to remove the signs) and update the maximum, which starts at 0.

Why is it enough to look at the end of each order? During an order to the east, for example, `y` doesn't change and `x` increases. The value `|x|` decreases as long as `x` is negative, then increases: it can't be larger in the middle of the move than at its two ends. Since the start of an order is the end of the previous one (or the start, at distance 0), all the ends are examined.

The letter `N` is used both for the number of orders and for a direction: that's not a problem, since the number of orders is on the first line and the directions on the following ones.
