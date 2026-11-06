---
title: Sum of two numbers
---

## Statement
Write a program that reads two integers `A` and `B`, written on the same line, and prints their sum.

## Input
A single line containing two integers `A` and `B` separated by a space.

## Output
A single integer: `A + B`.

## Constraints
- 0 ≤ A, B ≤ 1,000

## Hints
1. First you need to read the line, then split it into two numbers.
2. In Python, `input().split()` cuts the line into pieces, and `int(...)` turns a piece of text into a number.
3. `a, b = map(int, input().split())` reads both numbers at once; all that's left is to print `a + b` with `print`.

## Solution
We read the line, split it into two pieces, convert them to integers, then print their sum.

The classic trap in Python: `input()` returns **text**. Without converting it, `"3" + "4"` gives `"34"`, not `7`. So you have to convert each piece with `int`.

In C++, `cin >> a >> b;` directly reads two integers separated by spaces.
