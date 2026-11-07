---
title: Sum of squares and cubes
---

## Statement
Print the sum of the squares of the integers from 1 to 100, that is 1 × 1 + 2 × 2 + … + 100 × 100, then, on a second line, the sum of their cubes, 1 × 1 × 1 + 2 × 2 × 2 + … + 100 × 100 × 100.

## Input
None: the program reads nothing.

## Output
Two lines: the sum of the squares, then the sum of the cubes.

## Hints
1. Two accumulators, initialised to 0 before the loop, and updated at each iteration.
2. A single loop is enough: at each iteration, add `i * i` to the first one and `i * i * i` to the second one.
3. Printing is done after the loop, only once.

## Solution
Create two variables `carres` and `cubes`, equal to 0 before the loop. For `i` from 1 to 100, add `i * i` to `carres` and `i * i * i` to `cubes`. After the loop, print both totals: 338350 and 25502500.

The sum of the cubes, 25,502,500, fits in a C++ `int` (the limit is about 2.1 × 10⁹). A curiosity: it equals 5050 × 5050, the square of the sum 1 + 2 + … + 100. This is no accident: for every n, the sum of the cubes from 1 to n is the square of the sum of the integers from 1 to n.

The traps: initialising the accumulators inside the loop (they are reset to 0 at every iteration), printing inside the loop (100 lines instead of 2), or stopping at 99 with `range(1, 100)`.
