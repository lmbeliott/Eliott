---
title: Number with the most divisors
---

## Statement
Among `N` given integers, find the one with the most divisors. For example, `12` has 6 divisors (`1, 2, 3, 4, 6, 12`) and `13` has 2.

If several integers have the same maximal number of divisors, choose the smallest of them.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer.

## Output
A single line with two integers separated by a space: the chosen integer, then its number of divisors.

## Constraints
- 1 ≤ N ≤ 100
- Each integer is between 1 and 1,000,000.

## Hints
1. For each integer `x` read, count its divisors with an inner loop. Testing every `d` from 1 to `x` takes up to 100 million turns in total: too slow.
2. Divisors come in pairs: if `d` divides `x`, so does `x // d`. It's enough to go through the `d` such that `d × d ≤ x`, and count 2 divisors each time `d` divides `x`.
3. Watch out for squares: if `d × d == x`, both divisors of the pair are the same number, which must be counted only once.

## Solution
For each integer `x`, count its divisors **in pairs**. If `d` divides `x`, then `e = x // d` also divides `x`, and one of them is less than or equal to the other. So you only go through the `d` such that `d × d ≤ x`: each time `d` divides `x`, count `d` and `x // d`, that is 2 divisors, unless `d × d == x`, where they are equal and count only once. For `12`, you find the pairs `(1, 12)`, `(2, 6)` and `(3, 4)`: 6 divisors. For `36`, the pair `(6, 6)` counts only once: 9 divisors.

The inner loop makes at most 1,000 turns per integer, so at most 100,000 turns in total.

Then keep the best one, as for a maximum: if the number of divisors of `x` is strictly greater than the best known, or if it's equal and `x` is smaller than the integer kept, keep `x`.

The traps: the divisor counter must be reset to 0 for each new integer, and the tie case must compare the integers themselves (not their order of arrival). The number `1` has a single divisor.
