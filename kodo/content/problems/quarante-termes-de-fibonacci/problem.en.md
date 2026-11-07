---
title: Forty Fibonacci terms
---

## Statement
A sequence starts with `1` and `1`, and each following term is the sum of the two terms before it: 1, 1, 2, 3, 5, 8, 13… Print the first 40 terms of this sequence.

## Input
None: the program reads nothing.

## Output
40 lines: the first 40 terms, in order, one per line.

## Hints
1. You only need to remember the last two terms, in two variables `a` and `b`.
2. At each iteration, print `a`, then shift: the new `a` is the old `b`, and the new `b` is the old `a + b`.
3. Mind the order of the assignments: after `a = b`, the old value of `a` is lost. A temporary variable solves the problem.

## Solution
Keep two variables: `a`, the term to print, and `b`, the next term. At the start, `a = 1` and `b = 1`. At each iteration, print `a`, then move one step forward in the sequence: first compute `c = a + b` (the term after `b`), then `a = b` and `b = c`. After 40 iterations, you have printed the first 40 terms; the last one is 102334155.

The trap is writing `a = b` then `b = a + b`: at the time of the second computation, `a` already contains the new value, and you get `b + b` instead of `a + b`. The printed sequence then becomes 1, 1, 2, 4, 8, 16… The temporary variable `c` stores the result before the old values are overwritten.

This sequence is the famous **Fibonacci sequence**. Its terms grow fast: the 40th exceeds one hundred million, and the 47th no longer fits in a C++ `int`.
