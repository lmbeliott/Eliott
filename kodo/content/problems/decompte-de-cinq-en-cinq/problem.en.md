---
title: Countdown by fives
---

## Statement
Print a countdown that starts at `150` and goes down by 5 down to `0` included, then the word `ZERO`.

## Input
None: the program reads nothing.

## Output
The numbers `150`, `145`, `140`, …, `5`, `0`, one per line, then a last line containing `ZERO`.

## Hints
1. To count down, the step of the loop is negative.
2. The loop stops just **before** the bound: for `0` to be printed, the bound must be smaller than 0.
3. The word `ZERO` is printed only once: it goes after the loop.

## Solution
The loop `range(150, -1, -5)` produces 150, 145, …, 5, 0: the next value would be −5, which is not strictly greater than the bound −1. In C++, write `for (int i = 150; i >= 0; i -= 5)`. After the loop, one instruction prints `ZERO`.

The main trap is writing `range(150, 0, -5)`, which stops at 5 and forgets the 0. The other one is indenting the line that prints `ZERO`, which is then repeated at every iteration.
