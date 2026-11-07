---
title: Multiples of K in an interval
---

## Statement
Count the multiples of `K` between `A` and `B`, both included. A multiple of `K` is an integer of the form `K × q`, with `q` an integer, possibly negative or zero: `0`, `-6` and `9` are multiples of 3.

## Input
A single line containing `A`, `B` and `K`, separated by spaces.

## Output
A single integer: the number of multiples of `K` between `A` and `B`.

## Constraints
- −10¹⁸ ≤ A ≤ B ≤ 10¹⁸
- 1 ≤ K ≤ 10¹⁸

## Hints
1. The intervals are far too large to try every integer. Start by counting the multiples of `K` between 1 and `B`, when `B` is positive: there are `B // K` of them.
2. More generally, the floor of `B / K` is the number `q` of the largest multiple `K × q` that does not exceed `B`. The multiples in `[A, B]` are those that do not exceed `B`, minus those that do not exceed `A − 1`.
3. So the answer is the floor of `B / K` minus that of `(A − 1) / K`. In Python, `//` directly gives the floor, even for negative numbers. In C++, `/` truncates towards zero: the quotient must be corrected when the remainder is negative.

## Solution
For an integer `x`, write `f(x)` for the floor of `x / K`. The multiple `K × q` does not exceed `x` exactly when `q ≤ x / K`, that is when `q ≤ f(x)`. The multiples of `K` in `[A, B]` are those whose number `q` satisfies `f(A − 1) < q ≤ f(B)`: there are `f(B) − f(A − 1)` of them.

In Python, `f(x)` is written `x // k`, which rounds down even when `x` is negative. In C++, `x / k` truncates towards zero: for `x = -7` and `K = 2`, it gives `-3` instead of `-4`. So compute `q = x / k`, then subtract 1 if `x % k` is negative (which happens exactly when `x` is negative and not a multiple of `K`).

Values go up to 10¹⁸: you need `long long` in C++, and certainly no floats. The answer can reach 2 × 10¹⁸ + 1 (for `K = 1`), which still fits in a `long long`.
