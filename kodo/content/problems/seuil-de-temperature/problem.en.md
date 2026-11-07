---
title: Temperature threshold
---

## Statement
A thermometer shows the temperature `T`, in degrees. We want to know whether it is at least 8 degrees.

Write a program that reads `T`. If `T` is greater than or equal to `8`, print `OUI` (French for "yes"); otherwise, print `NON` ("no").

## Input
A single line containing an integer `T`: the temperature in degrees. It can be negative.

## Output
A single word, in capital letters: exactly `OUI` or `NON`, written as in the statement.

## Constraints
- −30 ≤ T ≤ 40

## Hints
1. There are two possible cases: that's a job for an `if` followed by an `else`.
2. "Greater than or equal to 8" is written `t >= 8`.
3. Check what your program prints when it is exactly 8 degrees.

## Solution
We read `T`, then test the condition `T >= 8`: if it is true, we print `OUI`, otherwise `NON`.

The classic trap: writing `T > 8` instead of `T >= 8`. Both conditions give the same result for almost every temperature… except at 8 degrees, where the answer is indeed `OUI`! When a statement says "at least", "at most" or "strictly", take the time to choose the right operator, and always test the boundary value.
