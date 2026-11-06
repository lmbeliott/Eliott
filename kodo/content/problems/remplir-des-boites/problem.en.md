---
title: Filling boxes
---

## Statement
We put `N` objects into boxes that each hold exactly `K` objects. The objects that aren't enough to fill a whole box are left over.

Write a program that reads `N` and `K`, then prints the number of full boxes, and the number of objects left over.

## Input
A single line containing two integers `N` and `K` separated by a space: the number of objects, then the number of objects in a full box.

## Output
Two lines:
- on the first one, the number of full boxes;
- on the second one, the number of objects left over.

## Constraints
- 0 ≤ N ≤ 10,000
- 1 ≤ K ≤ 100

## Hints
1. The number of full boxes is the number of times `K` "fits" into `N`. It's a division… but without decimals.
2. In Python, `//` gives the whole-number quotient of a division and `%` gives its remainder: `20 // 6` is `3` and `20 % 6` is `2`. In C++, `/` between two integers already gives the whole-number quotient, and `%` gives the remainder.
3. There are `N // K` full boxes and `N % K` objects left over.

## Solution
It's a division with a remainder, just like at school: with 20 objects, you can fill 3 boxes of 6 (3 × 6 = 18), and 2 objects are left. The number of full boxes is the **quotient** of `N` divided by `K`, and the leftover objects are the **remainder**.

The classic trap in Python: writing `N / K`. The `/` operator does a division "with decimals", and `20 / 6` prints `3.3333333333333335`, which is not a number of boxes. Use `//` to get the whole-number quotient.

In C++, when you divide two `int`s, `/` directly gives the whole-number quotient: `20 / 6` is `3`.

When `N` is smaller than `K`, there is no full box: the quotient is `0` and all the objects are left over.
