---
title: Free seats
---

## Statement
A room has `C` seats, and `P` of these seats are already taken.

Write a program that reads `C` and `P`, then prints the number of seats that are still free.

## Input
Two lines:
- the first one contains the integer `C`, the number of seats in the room;
- the second one contains the integer `P`, the number of seats already taken.

## Output
A single integer: the number of seats that are still free.

## Constraints
- 1 ≤ C ≤ 200
- 0 ≤ P ≤ C

## Hints
1. The two numbers are on two different lines: you need to read twice, one line each time.
2. In Python, `int(input())` reads one line and turns it into a number. In C++, `cin >> c >> p;` reads both numbers, even when they are on two lines.
3. The number of free seats is `C - P`. Store it in a variable, then print it.

## Solution
We read `C`, then `P`, each on its own line, converting them to integers. The number of free seats is the difference `C - P`, which we print.

The classic trap in Python: calling `input()` only once. Each call reads only **one** line; since the two numbers are on two lines, you need two calls. And `map(int, input().split())` doesn't work here, because it looks for several numbers on the same line.

Another trap: printing something other than the number you were asked for, for example `Free seats: 15`. Your output is compared word by word with the expected answer, so print only the number.
