---
title: Longest plateau
---

## Statement
A sensor sends measurements, one per line, and ends with `-1`. A **plateau** is a group of consecutive measurements that are all equal; its length is its number of measurements. For example, in `4 4 7 7 7 2 7`, the plateaus are `4 4`, `7 7 7`, `2` and `7`.

Print the length of the longest plateau, then the value of its measurements. If several plateaus have the maximal length, choose the one that comes first.

## Input
Non-negative integers, one per line, followed by a line containing `-1`.

## Output
A single line with two integers separated by a space: the length of the longest plateau, then the value of its measurements.

## Constraints
- Between 1 and 10,000 measurements before the `-1`.
- Each measurement is between 0 and 10⁹.

## Hints
1. To know whether a measurement extends the current plateau, it is enough to compare it with the **previous** one. So you must keep the previous one in a variable.
2. A variable `longueur` gives the length of the current plateau: it increases by 1 if the measurement equals the previous one, and goes back to `1` otherwise (the new measurement starts a new plateau).
3. After each measurement, compare `longueur` with the best plateau found. Use `>` and not `>=` to keep the first one in case of a tie.

## Solution
Read the first measurement before the loop: it forms a plateau of length 1, which is also the best one so far. Then read the following measurements up to the sentinel `-1`.

For each new measurement `x`:
- if `x` equals the previous measurement, the current plateau grows: `longueur = longueur + 1`;
- otherwise, a new plateau starts: `longueur = 1`.

Then, if `longueur` is strictly greater than the best known length, remember this length and the value `x`. Finally, `x` becomes the previous measurement, and you read the next one.

The traps: resetting `longueur` to 0 instead of 1 when a plateau starts (the new measurement already counts), updating the best only when a plateau ends (you then forget the last plateau), and using `>=`, which would keep the last plateau of maximal length instead of the first.
