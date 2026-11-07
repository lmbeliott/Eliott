---
title: Compare two fractions
---

## Statement
Compare the fractions `A / B` and `C / D`. Print `<` if the first one is smaller, `>` if it is larger, and `=` if they are equal.

## Input
A single line containing `A`, `B`, `C` and `D`, separated by spaces.

## Output
A single symbol: `<`, `>` or `=`.

## Constraints
- −10⁹ ≤ A, C ≤ 10⁹
- 1 ≤ B, D ≤ 10⁹

## Hints
1. Computing `A / B` and `C / D` with floats is not enough: two different fractions can be so close that they give the same float.
2. Since `B` and `D` are strictly positive, multiplying an inequality by `B × D` does not change its direction.
3. `A / B < C / D` is equivalent to `A × D < C × B`. These products are integers, computed exactly.

## Solution
Go back to integers. The denominators `B` and `D` are strictly positive, so the product `B × D` is too, and multiplying both fractions by `B × D` keeps the order: comparing `A / B` and `C / D` amounts to comparing `A × D` and `C × B`. This is **cross-multiplication**.

The products reach at most 10¹⁸ in absolute value: they fit in a `long long` in C++.

The trap is comparing floats. For instance, 999,999,999 / 1,000,000,000 and 999,999,998 / 999,999,999 differ by about 10⁻¹⁸, whereas a float has only about 16 significant digits: both divisions give exactly the same float, and the program would answer `=` instead of `>`.
