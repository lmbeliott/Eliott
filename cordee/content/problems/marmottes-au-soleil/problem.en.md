---
title: Will the marmots come out?
---

## Statement
On the Valcorde mountain pasture, Théo has been watching the marmots for years. He has noticed that they only come out of their burrow when it is at least 8 degrees. Every morning, he reads the temperature on his thermometer to know whether he has a chance to see them.

Write a program that reads the temperature `T`. If `T` is greater than or equal to `8`, print `SORTIE` (French for "out"); otherwise, print `TERRIER` (French for "burrow").

## Input
A single line containing an integer `T`: the temperature in degrees. It can be negative.

## Output
A single word, in capital letters: exactly `SORTIE` or `TERRIER`, written as in the statement.

## Constraints
- −30 ≤ T ≤ 40

## Hints
1. There are two possible cases: that's a job for an `if` followed by an `else`.
2. "Greater than or equal to 8" is written `t >= 8`.
3. Check what your program prints when it is exactly 8 degrees.

## Solution
We read `T`, then test the condition `T >= 8`: if it is true, we print `SORTIE`, otherwise `TERRIER`.

The classic trap: writing `t > 8` instead of `t >= 8`. Both conditions give the same result for almost every temperature… except at 8 degrees, when the marmots do come out! When a statement says "at least", "at most" or "strictly", take the time to choose the right operator, and always test the boundary value.
