---
title: The refuge logbook
---

## Statement
At the refuge du Lac Noir, Inès, the hut keeper, writes in her logbook how many hikers arrive in the morning and how many arrive in the afternoon. In the evening, she has to tell the village the total number of people sleeping at the refuge.

Write a program that reads the two numbers written down by Inès and prints their sum.

## Input
A single line containing two integers `A` and `B` separated by a space: the number of hikers who arrived in the morning, then in the afternoon.

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
