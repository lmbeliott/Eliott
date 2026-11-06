---
title: The cheese dairy crates
---

## Statement
At the Valcorde cheese dairy, Chloé packs the day's tommes, the round cheeses of the valley, for the local markets. She puts them in crates that each hold exactly `K` tommes. The tommes that aren't enough to fill a whole crate stay at the dairy until the next day.

Write a program that reads the number `N` of tommes and the size `K` of a crate, then prints the number of full crates Chloé can prepare, and the number of tommes left at the dairy.

## Input
A single line containing two integers `N` and `K` separated by a space: the number of tommes, then the number of tommes in a full crate.

## Output
Two lines:
- on the first one, the number of full crates;
- on the second one, the number of tommes left at the dairy.

## Constraints
- 0 ≤ N ≤ 10,000
- 1 ≤ K ≤ 100

## Hints
1. The number of full crates is the number of times `K` "fits" into `N`. It's a division… but without decimals.
2. In Python, `//` gives the whole-number quotient of a division and `%` gives its remainder: `20 // 6` is `3` and `20 % 6` is `2`. In C++, `/` between two integers already gives the whole-number quotient, and `%` gives the remainder.
3. There are `N // K` full crates and `N % K` tommes left over.

## Solution
It's a division with a remainder, just like at school: with 20 tommes, you can fill 3 crates of 6 (3 × 6 = 18), and 2 tommes are left. The number of full crates is the **quotient** of `N` divided by `K`, and the leftover tommes are the **remainder**.

The classic trap in Python: writing `N / K`. The `/` operator does a division "with decimals", and `20 / 6` prints `3.3333333333333335`, which is not a number of crates. Use `//` to get the whole-number quotient.

In C++, when you divide two `int`s, `/` directly gives the whole-number quotient: `20 / 6` is `3`.

When `N` is smaller than `K`, there is no full crate: the quotient is `0` and all the tommes stay at the dairy.
