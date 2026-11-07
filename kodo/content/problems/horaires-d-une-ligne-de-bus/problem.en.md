---
title: Bus line timetable
---

## Statement
The first bus of a line leaves at 6:00, then a bus leaves every 25 minutes. Print the departure times of the first 40 buses of the day.

## Input
None: the program reads nothing.

## Output
40 lines, in order. Each line contains the hour and then the minutes of the departure, separated by a space. The first three lines are `6 0`, `6 25` and `6 50`, the fourth one is `7 15`.

## Hints
1. It is simpler to count time in minutes since midnight: 6:00 is 360 minutes.
2. A variable `t` starts at 360 and increases by 25 for each bus.
3. To get the hour and the minutes back from `t`, use the quotient and the remainder of the division by 60.

## Solution
Represent a time of day with a single number: the number of minutes elapsed since midnight. The first departure is at `t = 360`. For each of the 40 buses, print `t // 60` (the number of whole hours) and `t % 60` (the remaining minutes), then add 25 to `t`.

For instance, the fourth bus leaves at t = 360 + 3 × 25 = 435 minutes: 435 // 60 = 7 and 435 % 60 = 15, that is 7:15. The last one leaves at 360 + 39 × 25 = 1335 minutes, that is `22 15`.

Adding 25 to the minutes and handling the change of hour yourself is possible, but needs conditions; with a single variable in minutes, the quotient and the remainder do this work automatically. This is a very common technique: compute in the smallest unit, and convert only when printing.
