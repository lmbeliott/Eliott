---
title: Price rounded to the cent
---

## Statement
An item costs `P` cents before tax. Print its price including a tax of `T` %, in euros. The price is rounded to the nearest cent; an exact half cent is rounded up.

For example, with `P = 1999` and `T = 20`, the exact price is 2,398.8 cents, rounded to 2,399 cents: print `23.99`.

## Input
A single line containing `P` and `T`, separated by a space.

## Output
The price including tax in euros, with exactly two digits after the dot.

## Constraints
- 1 ≤ P ≤ 10⁹
- 0 ≤ T ≤ 100

## Hints
1. The exact price, in cents, is `P × (100 + T) / 100`. Half cents happen often: `round` and the `.2f` format do not always round them up.
2. Do the whole computation in cents, with integers. Rounding `a / b` to the nearest, half up, is `(2 * a + b) // (2 * b)`.
3. Once the integer number of cents `c` is known, `c / 100` printed with two decimals gives the price in euros.

## Solution
Work in cents, with integers. The exact price is `P × (100 + T) / 100` cents. Its rounding to the nearest, half up, is `c = (2 × P × (100 + T) + 100) // 200` (the formula `(2a + b) // (2b)` with `a = P × (100 + T)` and `b = 100`).

It remains to print `c` cents in euros: `c / 100` with two decimals. This last step through a float is safe, because `c / 100` has exactly two decimals and is at most 2 × 10⁹ euros: with about 16 significant digits, the approximation error stays more than ten thousand times smaller than a cent, and rounding to two decimals lands on the right value.

The trap: computing `P * (100 + T) / 10000` directly as a float and printing it with `.2f`. With `P = 1` and `T = 50`, the exact price is 1.5 cents, which must be rounded to 2; the float 0.015 is actually stored as 0.01499999…, and `.2f` prints `0.01` instead of `0.02`.
