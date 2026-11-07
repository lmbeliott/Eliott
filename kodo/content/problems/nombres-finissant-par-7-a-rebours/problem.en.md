---
title: Numbers ending in 7, backwards
---

## Statement
Print, from largest to smallest, all the integers between `1000` and `2000` whose last digit is `7`.

## Input
None: the program reads nothing.

## Output
The requested numbers, one per line, in decreasing order.

## Hints
1. What is the largest of these numbers? The smallest?
2. What is the gap between two consecutive numbers ending in 7?
3. The step is negative, and the bound is excluded: it must be a bit smaller than the last number to print.

## Solution
The largest number below 2000 ending in 7 is 1997, the smallest one above 1000 is 1007. Two consecutive numbers ending in 7 are 10 apart (1997, 1987, 1977…). So the loop starts at 1997 with a step of −10.

For 1007 to be printed but not 997, the bound must be between 997 and 1006: for instance `range(1997, 1000, -10)`. In C++: `for (int i = 1997; i >= 1007; i -= 10)`. There are 100 numbers in all: one per ten, and 100 tens between 1000 and 2000.
