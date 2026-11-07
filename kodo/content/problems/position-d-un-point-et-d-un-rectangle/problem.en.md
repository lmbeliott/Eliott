---
title: Position of a point and a rectangle
---

## Statement
A rectangle has its sides parallel to the axes: its bottom-left corner is the point `(X1, Y1)` and its top-right corner the point `(X2, Y2)`. Tell whether the point `(X, Y)` is strictly inside the rectangle, on its border, or outside.

## Input
- The first line contains four integers `X1`, `Y1`, `X2` and `Y2`.
- The second line contains two integers `X` and `Y`.

## Output
`DEDANS` (inside) if the point is strictly inside, `BORD` (border) if it is on one of the four sides, `DEHORS` (outside) otherwise.

## Constraints
- −1 000 ≤ all coordinates ≤ 1 000
- X1 < X2 and Y1 < Y2

## Hints
1. The point is in the rectangle, border included, when `X` is between `X1` and `X2` **and** `Y` is between `Y1` and `Y2` (bounds included).
2. It is strictly inside when these four comparisons are strict.
3. If the point is in the rectangle border included, but not strictly inside, it is on the border.

## Solution
Compute two booleans:
- `inside_wide`: `X1 <= X <= X2` and `Y1 <= Y <= Y2`, that is, four comparisons joined by `and`;
- `inside_strict`: the same comparisons with `<` instead of `<=`.

If `inside_strict` is true, print `DEDANS`; otherwise, if `inside_wide` is true, the point is in the rectangle without being inside: `BORD`; otherwise `DEHORS`. The order of the tests matters, because a point strictly inside also satisfies `inside_wide`.

The trap is to test only one coordinate for the border: the point `(X1, Y)` is on the border only if `Y` is between `Y1` and `Y2`. Otherwise, it is outside, on the extension of the side. In C++, do not write `x1 <= x <= x2`, which is always true: you need `x1 <= x && x <= x2`.
