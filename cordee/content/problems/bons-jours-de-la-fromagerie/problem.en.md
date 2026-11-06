---
title: The dairy's good days
---

## Statement
At the Valcorde cheese dairy, Nathan writes down every day the number of tommes made. At the end of the month, he wants to congratulate the team for the "good days": the days when production was strictly greater than the average of the month.

The average is the sum of the productions of all the days, divided by the number of days `N`. It isn't necessarily a whole number.

Write a program that reads the productions of the `N` days and prints the number of good days.

## Input
- The first line contains the integer `N`, the number of days.
- The second line contains `N` integers separated by spaces: the number of tommes made each day.

## Output
A single integer: the number of days when production was strictly greater than the average.

## Constraints
- 1 ≤ N ≤ 1,000
- Each day, between 0 and 500 tommes are made.

## Hints
1. To know whether a day is a good day, you need to know the average… so you must already have read **all** the days. Store the productions in a list.
2. Go through the list twice: the first time to compute the sum `S` of the productions, the second time to count the good days.
3. A day that produced `x` tommes is a good day if `x > S / N`. To stay with whole numbers, you can write the same condition without a division: `x * N > S`.

## Solution
You can't decide whether a day is good at the moment you read it, because the average also depends on the days that come after. That's exactly why we need a list: we keep all the productions in memory, then go through them **twice**.
- First pass: we compute the sum `S` of all the productions.
- Second pass: we count the days whose production `x` is strictly greater than the average `S / N`.

To avoid decimal numbers, we multiply both sides of the comparison by `N` (which is positive): `x > S / N` is the same as `x * N > S`. Everything stays a whole number, so there's no rounding to worry about.

The classic trap: trying to do everything in a single pass, by comparing each day with the average of the days read so far. That average changes along the way, and it isn't the average of the month.

A day exactly equal to the average is not a good day: the comparison is strict. So if every day has the same production, there are no good days at all.
