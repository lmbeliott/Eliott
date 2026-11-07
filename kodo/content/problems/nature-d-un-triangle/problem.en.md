---
title: Kind of triangle
---

## Statement
We want to build a triangle whose sides measure `A`, `B` and `C`. This is possible only if each side is strictly shorter than the sum of the other two. Tell whether the triangle is impossible, and otherwise whether it is equilateral (three equal sides), isosceles (exactly two equal sides) or scalene (three different sides).

## Input
A single line containing three integers `A`, `B` and `C`.

## Output
A single word: `IMPOSSIBLE`, `EQUILATERAL`, `ISOCELE` (isosceles) or `QUELCONQUE` (scalene).

## Constraints
- 1 ≤ A, B, C ≤ 1 000 000

## Hints
1. The triangle is possible when `A < B + C` **and** `B < A + C` **and** `C < A + B`.
2. "At least two equal sides" is written `A == B or B == C or A == C`.
3. In which order should the cases be tested so that each triangle lands in the right category?

## Solution
First test whether the triangle is possible: the three inequalities `A < B + C`, `B < A + C` and `C < A + B` must all be true, which is written with two `and`s. If one of them is false, print `IMPOSSIBLE`.

Otherwise, classify the triangle, from the most specific case to the most general:
- if `A == B and B == C`, it is equilateral;
- otherwise, if `A == B or B == C or A == C`, it has exactly two equal sides (the case of three has already been handled): isosceles;
- otherwise, scalene.

The traps: a "flat" triangle, such as `2 3 5`, is not a real triangle, because 5 is not **strictly** smaller than 2 + 3; and an equilateral triangle also has two equal sides, so it must be recognised before testing for isosceles.
