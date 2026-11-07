---
title: Three roundings of a division
---

## Statement
For two integers `A` and `B`, print three roundings of the quotient `A / B`: the floor, the ceiling, then the nearest integer. For the latter, a quotient that falls exactly halfway between two integers (like 2.5) is rounded up.

## Input
A single line containing `A` and `B`, separated by a space.

## Output
A single line with three integers separated by spaces: the floor, the ceiling and the nearest integer of `A / B`.

## Constraints
- 0 ≤ A ≤ 10¹⁸
- 1 ≤ B ≤ 10¹⁸

## Hints
1. With numbers up to 10¹⁸, floats are not precise enough: `math.ceil(A / B)` can be wrong. Everything can be computed with integer division.
2. The ceiling is `(A + B - 1) // B`.
3. Rounding to the nearest means adding one half then taking the floor: A/B + 1/2 = (2A + B) / (2B).

## Solution
Apply the three integer formulas from the lesson:
- floor: `A // B`;
- ceiling: `(A + B - 1) // B`. If `A` is a multiple of `B`, adding `B − 1` does not change the quotient; otherwise, it crosses exactly the next multiple;
- nearest: `(2A + B) // (2B)`, because it is the floor of A/B + 1/2. An exact half does give the upper integer.

The trap is going through floats. With `A = 10¹⁸ − 1` and `B = 1`, `A / B` is the float 10¹⁸, and all three answers would be wrong. In C++, `2A + B` can reach 3 × 10¹⁸: this fits in a `long long` (up to about 9.2 × 10¹⁸).
