---
title: Perimeter and area of a rectangle
---

## Statement
A rectangular field is `L` metres long and `W` metres wide. Print the length of the fence that goes around it (the perimeter), then its surface (the area).

## Input
A single line containing two integers `L` and `W` separated by a space.

## Output
Two lines: the perimeter, then the area.

## Constraints
- 1 ≤ L, W ≤ 10 000

## Hints
1. Both numbers are on the same line: you must split the line with `split()` before converting.
2. The perimeter is the sum of the four sides: two sides of length `L` and two of length `W`. The area is `L × W`.

## Solution
Read both integers at once with `map(int, input().split())` in Python, or `cin >> l >> w` in C++. The perimeter is `2 × (L + W)` and the area is `L × W`.

The trap is to write `int(input())`: the line holds two numbers separated by a space, and the conversion fails. Do not forget the parentheses either: `2 * L + W` counts the width only once.
