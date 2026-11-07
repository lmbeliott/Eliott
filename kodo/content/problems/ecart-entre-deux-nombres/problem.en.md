---
title: Gap between two numbers
---

## Statement
Two points lie on a number line, at positions `A` and `B`. Print the distance between them, that is, the larger of the two numbers minus the smaller one.

## Input
A single line containing two integers `A` and `B` separated by a space.

## Output
A single integer: the distance between `A` and `B`, always zero or positive.

## Constraints
- −1 000 000 ≤ A, B ≤ 1 000 000

## Hints
1. `A − B` is the right answer when `A` is the larger one. What about the other case?
2. An `if` chooses between `A − B` and `B − A` depending on the comparison `A > B`.

## Solution
If `A ≥ B`, the distance is `A − B`; otherwise, it is `B − A`. An `if` followed by an `else` picks the right computation. When `A = B`, both formulas give `0`, so it does not matter on which side the tie goes.

The trap is to always print `A − B`, which is negative when `B` is larger. Note also that positions can be negative: the distance between `−3` and `4` is 7.
