---
title: Celsius-Fahrenheit table
---

## Statement
A temperature of C degrees Celsius is F = C × 9 / 5 + 32 degrees Fahrenheit. Print a conversion table for all Celsius temperatures from `-40` to `100` included, going up by 5.

## Input
None: the program reads nothing.

## Output
One line per temperature, in increasing order: the temperature in degrees Celsius, a space, then the corresponding temperature in degrees Fahrenheit. The first line is `-40 -40` and the last one `100 212`.

## Hints
1. A loop with step 5 gives the Celsius temperatures; the Fahrenheit temperature is computed inside the print, using the loop variable.
2. Since C is always a multiple of 5, C × 9 is a multiple of 5: the division is exact. You must multiply by 9 **before** dividing by 5.

## Solution
The loop `for c in range(-40, 101, 5)` goes through the Celsius temperatures, and each iteration prints `c` and `c * 9 // 5 + 32`. In C++, write `c * 9 / 5 + 32` with `int`s.

The order of operations matters: `c * 9 // 5` first computes c × 9, which is a multiple of 45, then divides it by 5, with no remainder. Writing `c // 5 * 9` would give the same result here, but `9 // 5 * c` would give `1 * c`, since 9 // 5 is 1. In Python, do not use `/`, which prints decimal numbers such as `-40.0`.

Notice along the way that −40 °C = −40 °F: it is the only temperature written the same way on both scales.
