---
title: Cut a rectangle into squares
---

## Statement
A rectangular sheet measures `A × B`. You cut out the largest possible square, whose side is the shorter side of the sheet. A smaller rectangular sheet remains, on which you start again. You stop when the remaining sheet is itself a square: it is the last square cut.

For example, a `5 × 3` sheet gives a square of side 3, leaving `2 × 3`: a square of side 2, leaving `2 × 1`: two squares of side 1. There are 4 squares, and the last one has side 1.

For each of the `T` sheets, print the number of squares cut and the side of the last one.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains two integers `A` and `B`.

## Output
For each sheet, one line with two integers: the number of squares and the side of the last square.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ A, B ≤ 10¹⁸

## Hints
1. Simulating the cuts one by one is too slow: a `10¹⁸ × 1` sheet gives 10¹⁸ squares.
2. On an `a × b` sheet with `a ≥ b`, how many squares of side `b` do you cut in a row? What remains afterwards?
3. This is Euclid's algorithm. What quantity does not change from one cut to the next?

## Solution
On an `a × b` sheet with `a ≥ b`, you cut squares of side `b` as long as the remaining length is at least `b`: you cut `q = a // b` of them in a row, and an `r × b` sheet remains, with `r = a % b`. If `r = 0`, the last square cut was the last one of all. Otherwise, start again with the `b × r` sheet. So the squares are counted in batches: the total number is the sum of the quotients of Euclid's algorithm applied to `(A, B)`.

Write the loop `while b != 0: squares += a // b; a, b = b, a % b`, starting from `(a, b) = (A, B)`. If `A < B`, the first turn gives a zero quotient and simply swaps the two numbers.

**Invariant.** At the start of each turn, the uncut part of the sheet is an `a × b` rectangle, and `squares` is the number of squares already cut. Moreover, the GCD of `a` and `b` does not change: a common divisor of `a` and `b` divides `r = a − q × b`, and conversely. At the end, `b = 0`, and `a` is the side of the last square, but also `GCD(a, 0) = a`. So the last square has side `GCD(A, B)`.

**Termination and cost.** `b` is a positive integer that strictly decreases at each turn, since `r < b`: the loop stops. It even makes very few turns: the lesson shows that `a` is at least halved every two turns, hence fewer than 2 × 60 turns for numbers below 10¹⁸ ≈ 2⁶⁰. The number of squares can reach 10¹⁸: in C++, `long long` is needed.
