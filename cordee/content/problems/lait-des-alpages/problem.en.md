---
title: Milk from the high pastures
---

## Statement
All summer long, the Valcorde cows graze on the high mountain pastures. Every evening, Malik, the herder, brings the milk down to the cheese dairy and writes in his notebook how many liters he delivered. At the end of the season, he wants to know the total number of liters delivered.

Write a program that reads the number of days `N`, then the amount of milk delivered on each of these days, and prints the total amount.

## Input
- The first line contains the integer `N`, the number of days.
- Each of the next `N` lines contains an integer: the number of liters delivered on that day.

## Output
A single integer: the total number of liters delivered during the `N` days.

## Constraints
- 1 ≤ N ≤ 1,000
- Each day, between 0 and 1,000 liters are delivered.

## Hints
1. You need a loop that runs `N` times; at each turn, it reads one line.
2. Create a variable `total` equal to `0` **before** the loop. At each turn, add the number you've just read to it.
3. Print `total` only once, **after** the loop.

## Solution
This is the **accumulator** pattern: a variable `total` starts at `0` before the loop; at each turn, we read the amount for the day and add it to `total` (`total = total + litres`, or `total += litres`). When the loop is over, `total` contains the sum of all the days, and we print it.

The classic traps:
- putting `total = 0` **inside** the loop: the total would be reset to zero at every turn, and we would only print the last day;
- putting the `print` inside the loop: we would print the running total after each day, instead of a single number;
- forgetting to read `N` first: the first line is not an amount of milk, it's the number of days.
