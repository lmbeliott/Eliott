---
title: Count the market days
---

## Statement
Days are numbered 1, 2, 3, and so on. A market takes place every `K` days: the first one is on day `S`, the next one on day `S + K`, then on day `S + 2 × K`, and so on, without ever stopping.

Write a program that prints the number of market days between day `A` and day `B`, both included.

This problem can be solved without `if` and without loops: with computations only.

## Input
A single line containing four integers `S`, `K`, `A` and `B` separated by spaces.

## Output
A single integer: the number of market days `d` such that `A ≤ d ≤ B`.

## Constraints
- 1 ≤ S ≤ A ≤ B ≤ 1 000 000 000
- 1 ≤ K ≤ 1 000 000 000

## Hints
1. Start with a simpler question: how many market days are there from day 1 to day `X`? Try with `S = 3`, `K = 7` and `X = 30`: the markets are on days 3, 10, 17 and 24.
2. From day 1 to day `X`, the number of markets is `(X - S) // K + 1` as soon as `X ≥ S`. Then, the markets between `A` and `B` are the markets up to day `B`, minus those that took place up to day `A - 1`.
3. Be careful when `A = S`: day `A - 1` is then before the first market, and the formula of hint 2 must give 0. Add `K` inside the brackets to avoid negative numbers: `(X - S + K) // K` gives the same result when `X ≥ S`, and 0 when `X = S - 1`.

## Solution
First, count the markets from day 1 to day `X`. The market days are `S`, `S + K`, `S + 2 × K`… If `X ≥ S`, the last market before `X` is `S + q × K`, with `q = (X - S) // K`, and there are `q + 1` markets in all (numbers 0 to `q`).

The markets between `A` and `B` are those that take place up to day `B`, except those that take place up to day `A - 1`. So the answer is the difference of the two counts.

The trap is the case `A = S`: you must count the markets up to day `S - 1`, and there are none. But `X - S` is then `-1`, a negative number, and integer division of negative numbers doesn't behave the same way in both languages: in Python, `-1 // 7` is `-1`, but in C++, `-1 / 7` is `0`. To avoid depending on this detail, write the count as `(X - S + K) // K`: it's the same as `(X - S) // K + 1` (we added `K` exactly once before dividing by `K`), but the number being divided is never negative, and for `X = S - 1` you indeed get `(K - 1) // K = 0`.

Example: `S = 3`, `K = 7`, `A = 10`, `B = 40`. Up to day 40, there are `(40 - 3 + 7) // 7 = 6` markets (3, 10, 17, 24, 31, 38); up to day 9, there is `(9 - 3 + 7) // 7 = 1`. The answer is 6 - 1 = 5.

With numbers up to a billion, you can't test the days one by one: you need the formula. The largest number computed, `B - S + K`, stays below 2 billion: it fits in an `int` in C++.
