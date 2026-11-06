---
title: End time
---

## Statement
A machine starts at `H` hours and `M` minutes, then runs for `D` minutes without stopping. The clock shows the hours from `0` to `23`: after 23:59 comes 0:00.

Write a program that prints the time shown by the clock when the machine stops.

## Input
A single line containing three integers `H`, `M` and `D` separated by spaces: the hour and the minutes when the machine starts, then how long it runs, in minutes.

## Output
A single line containing two integers separated by a space: the hours (between `0` and `23`), then the minutes (between `0` and `59`) shown by the clock at the end.

Write the numbers normally, without a leading zero: for 1:05, print `1 5`.

## Constraints
- 0 ≤ H ≤ 23
- 0 ≤ M ≤ 59
- 0 ≤ D ≤ 1,000

## Hints
1. Hours and minutes don't mix well. It's easier to count everything in minutes: how many minutes have passed since midnight when the machine starts?
2. The start is `H * 60 + M` minutes after midnight, and the end is `D` minutes later. To get back to hours and minutes, use the quotient and the remainder of the division by 60.
3. If the hours go above 23, the clock has started again from 0 after midnight: the remainder of the division by 24 gives the hour on the clock.

## Solution
The trick is to convert everything into minutes since midnight:
- the start is `H * 60 + M` minutes after midnight;
- the end is `D` minutes after the start.

Then we go back to hours and minutes: the hours are the quotient of the end time by 60 (`// 60` in Python, `/ 60` in C++), and the minutes are the remainder (`% 60`). If the end comes after midnight, that number of hours is 24 or more; but the clock has started again from zero, so we take the remainder of the division by 24.

Example: the start is at 23:10, which is 1,390 minutes after midnight; the machine runs for 125 minutes; so it stops at 1,515 minutes, which is 25 hours and 15 minutes. The clock shows 25 % 24 = 1 hour, so the answer is `1 15`.

The classic trap: adding `D` to the minutes and stopping there. 23:10 plus 125 minutes is not "23:135"! The minutes must stay between 0 and 59, and going through the total number of minutes takes care of exactly that. No `if` needed: division and remainder do all the work.
