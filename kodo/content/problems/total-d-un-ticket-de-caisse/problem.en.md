---
title: Total of a receipt
---

## Statement
A receipt has `N` lines. Each line gives a quantity `Q` and a unit price `P` in cents: an item costing `P` cents was bought `Q` times. Print the total number of items bought, then the total amount to pay in cents.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains two integers `Q` and `P` separated by a space.

## Output
Two lines: the total number of items, then the total amount in cents.

## Constraints
- 1 ≤ N ≤ 1 000
- 1 ≤ Q ≤ 100
- 1 ≤ P ≤ 10 000

## Hints
1. Each line of the receipt holds two numbers: inside the loop, read both at once.
2. You need two accumulators: one for the items, one for the amount.
3. A line of the receipt costs `Q × P` cents and counts as `Q` items, not just one.

## Solution
Read `N`, then run `N` iterations. At each iteration, read `Q` and `P` on the same line, add `Q` to the number of items and `Q × P` to the amount. After the loop, print both totals.

The trap is to count a line of the receipt as a single item: a line `3 250` stands for three items, for 750 cents.

The amount stays below 1 000 × 100 × 10 000 = 10⁹, which fits in an `int` in C++.
