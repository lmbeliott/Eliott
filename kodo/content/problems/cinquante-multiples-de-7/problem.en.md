---
title: Fifty multiples of 7
---

## Statement
Print the first 50 positive multiples of 7, in increasing order: `7`, `14`, `21`, and so on.

## Input
None: the program reads nothing.

## Output
50 lines: the multiples of 7, from `7` up to the fiftieth one, one per line.

## Hints
1. Two consecutive multiples of 7 are 7 apart: that is the step of the loop.
2. The fiftieth multiple of 7 is 50 × 7 = 350. Which bound should you give to `range` so that 350 is printed?

## Solution
A loop with step 7 starting at 7 produces exactly the multiples of 7: `range(7, 351, 7)` in Python, `for (int i = 7; i <= 350; i += 7)` in C++.

The last wanted multiple is 350; since the bound of `range` is excluded, you must give a bound strictly greater than 350 (and at most 357, so as not to include the next multiple). With `range(7, 350, 7)`, you would stop at 343 and get only 49 numbers. A good habit: check the first number, the last one, and the number of iterations.
