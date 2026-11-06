---
title: The cable car cabin
---

## Statement
The Valcorde cable car goes up from the village to the col des Aiguilles, a mountain pass. Before each departure, Yanis, the driver, counts the passengers already sitting in the cabin. A small screen at the ticket office then tells the people waiting how many places are still free.

Write a program that reads the capacity `C` of the cabin and the number `P` of passengers already on board, then prints the number of places that are still free.

## Input
Two lines:
- the first one contains the integer `C`, the number of places in the cabin;
- the second one contains the integer `P`, the number of passengers already on board.

## Output
A single integer: the number of places still free in the cabin.

## Constraints
- 1 ≤ C ≤ 200
- 0 ≤ P ≤ C

## Hints
1. The two numbers are on two different lines: you need to read twice, one line each time.
2. In Python, `int(input())` reads one line and turns it into a number. In C++, `cin >> c >> p;` reads both numbers, even when they are on two lines.
3. The number of free places is `C - P`. Store it in a variable, then print it.

## Solution
We read `C`, then `P`, each on its own line, converting them to integers. The number of free places is the difference `C - P`, which we print.

The classic trap in Python: calling `input()` only once. Each call reads only **one** line; since the two numbers are on two lines, you need two calls. And `map(int, input().split())` doesn't work here, because it looks for several numbers on the same line.

Another trap: printing something other than the number you were asked for, for example `Free places: 15`. Your output is compared word by word with the expected answer, so print only the number.
