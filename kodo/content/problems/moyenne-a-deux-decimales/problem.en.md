---
title: Average with two decimals
---

## Statement
Print the average of `N` integers, rounded to the nearest hundredth, with exactly two digits after the dot.

The data are chosen so that rounding is never ambiguous: the exact average never falls exactly halfway between two hundredths.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single number: the average, written with exactly two decimals (for example `13.67` or `5.00`).

## Constraints
- 1 ≤ N ≤ 1,000
- Each integer is between 0 and 1,000,000.

## Hints
1. The average is the sum divided by `N`. You need a decimal division: `/` in Python, `(double) somme / n` in C++.
2. To print exactly two decimals: `f"{m:.2f}"` in Python, `printf("%.2f\n", m)` in C++. `round(m, 2)` is not enough: it prints `5.0` instead of `5.00`.

## Solution
Compute the sum of the integers with an accumulator, then the average with a decimal division. The `.2f` format rounds to the nearest hundredth and pads with zeros if needed.

The main trap in C++: writing `somme / n` with two integers gives an integer division, and the average loses its fractional part before it is even printed. One of the two must be converted to `double`. In Python, the trap is to use `round(moyenne, 2)` then `print`: the number of printed decimals is then not guaranteed.
