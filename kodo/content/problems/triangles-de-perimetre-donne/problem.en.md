---
title: Triangles with a given perimeter
---

## Statement
Count the triangles whose three sides are positive integers and whose perimeter is `P`. Two triangles with the same side lengths, in a different order, count only once.

Three lengths `a ≤ b ≤ c` form a real triangle when `a + b > c` (otherwise the sides don't meet, or the triangle is flat).

For example, for `P = 12`, there are 3 triangles: `2 5 5`, `3 4 5` and `4 4 4`.

## Input
A single line containing the integer `P`.

## Output
A single integer: the number of triangles with perimeter `P`.

## Constraints
- 1 ≤ P ≤ 3,000

## Hints
1. To count each triangle only once, require the order `a ≤ b ≤ c`.
2. It's enough to choose `a` and `b`: then `c = P - a - b` is forced. Two nested loops are enough.
3. For each couple `(a, b)` with `a ≤ b`, compute `c`, then check `b ≤ c` and `a + b > c`.

## Solution
Count each triangle in the form `a ≤ b ≤ c`, which avoids counting the same triangle several times in different orders.

Once `a` and `b` are chosen, the third side is forced: `c = P - a - b`. So run two nested loops, `a` from 1 to `P` and `b` from `a` to `P`, and count the couples for which `b ≤ c` and `a + b > c`. The condition `b ≤ c` also guarantees `c ≥ 1`.

You can shrink the loops: since `a` is the smallest of the three sides, `3 × a ≤ P`; and since `b ≤ c`, `a + 2 × b ≤ P`. With these bounds, there are about `P × P / 12` couples, that is 750,000 for `P = 3,000`.

Check for `P = 12`: with `a = 2`, only `b = 5` gives `c = 5` and `2 + 5 > 5`; with `a = 3`, `b = 4` gives `c = 5`; with `a = 4`, `b = 4` gives `c = 4`. The other couples fail, like `1 5 6` (`1 + 5 = 6`, a flat triangle). Total: 3.
