---
title: Last four digits of 7 to the power 2026
---

## Statement
The number 7²⁰²⁶, the product of 2026 factors equal to 7, is written with more than 1,700 digits. Print the number formed by its last four digits.

## Input
None: the program reads nothing.

## Output
A single integer: the number formed by the last four digits of 7²⁰²⁶ (it does not start with 0).

## Hints
1. The last four digits of a number `n` are given by `n % 10000`.
2. The last four digits of a product depend only on the last four digits of the factors. For instance, the last four digits of 123456 × 7 are those of 3456 × 7.
3. So you can multiply by 7 at each iteration, and keep only the last four digits of the result before the next iteration.

## Solution
Compute the power step by step, as for the powers of 3: a variable `p` equals 1, and each of the 2026 iterations multiplies it by 7. But instead of keeping the whole number, keep only its last four digits: `p = p * 7 % 10000`.

This is correct because the digits of a product beyond the last four have no influence on the last four digits of the next product: if p = 10000 × q + r, then p × 7 = 10000 × (7q) + 7r, so 7r has the same last four digits as p × 7. After 2026 iterations, `p` contains the last four digits of 7²⁰²⁶: 5649.

In C++, this is essential: 7²⁰²⁶ is far too large even for a `long long`, whereas here `p` stays below 10,000 and `p * 7` below 70,000. In Python, you could compute the whole number, but it is needlessly slow for very large exponents: reducing at each step keeps the numbers small. This technique, **modular computation**, is everywhere in algorithmics, as soon as a statement asks for a result "modulo" a number.
