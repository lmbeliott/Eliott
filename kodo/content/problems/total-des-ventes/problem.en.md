---
title: Total sales
---

## Statement
Every evening, a shop writes down the number of items sold during the day.

Write a program that reads the number of days `N`, then the number of items sold on each of these days, and prints the total number of items sold.

## Input
- The first line contains the integer `N`, the number of days.
- Each of the next `N` lines contains an integer: the number of items sold on that day.

## Output
A single integer: the total number of items sold during the `N` days.

## Constraints
- 1 ≤ N ≤ 1,000
- Each day, between 0 and 1,000 items are sold.

## Hints
1. You need a loop that runs `N` times; at each turn, it reads one line.
2. Create a variable `total` equal to `0` **before** the loop. At each turn, add the number you've just read to it.
3. Print `total` only once, **after** the loop.

## Solution
This is the **accumulator** pattern: a variable `total` starts at `0` before the loop; at each turn, we read the sales of the day and add them to `total` (`total = total + sales`, or `total += sales`). When the loop is over, `total` contains the sum of all the days, and we print it.

The classic traps:
- putting `total = 0` **inside** the loop: the total would be reset to zero at every turn, and we would only print the last day;
- putting the `print` inside the loop: we would print the running total after each day, instead of a single number;
- forgetting to read `N` first: the first line is not a number of sales, it's the number of days.
