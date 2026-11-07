---
title: Sum of products of neighbours
---

## Statement
A sequence of `N` integers is given, one per line. Multiply each value by the next one, then print the sum of all these products. For the sequence `2, 3, -1, 4`, the result is 2 × 3 + 3 × (−1) + (−1) × 4 = 6 − 3 − 4 = −1.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains one integer of the sequence, in order.

## Output
A single integer: the sum of the `N − 1` products of two neighbouring values.

## Constraints
- 2 ≤ N ≤ 1 000
- −1 000 ≤ each value ≤ 1 000

## Hints
1. When you read a value, you still need to know the value read just before it.
2. Read the first value before the loop and store it in a variable `previous`. The loop then reads the remaining `N − 1` values.
3. At each iteration: read `x`, add `previous × x` to the sum, then `x` becomes the new `previous`.

## Solution
You do not keep the whole sequence: remembering the last value read is enough. Read the first value into `previous`, then run `N − 1` iterations. At each iteration, read the value `x`, add `previous × x` to the sum, and replace `previous` with `x` for the next iteration.

The order of the last two statements matters: if you write `previous = x` before computing the product, you compute `x × x` instead of the product of two neighbours.

The number of iterations is also a trap: the first value has already been read, so the loop only reads `N − 1` more. With `N` iterations, Python stops with an `EOFError` while looking for a line that does not exist.
