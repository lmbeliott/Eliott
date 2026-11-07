---
title: Earliest date
---

## Statement
Two dates are given as day, month, year. Print the one that comes first in the calendar. If both dates are the same, print it once.

## Input
Two lines, one per date. Each line contains three integers `J`, `M` and `A` separated by spaces: the day, the month and the year.

## Output
A single line: the earliest date, in the same form `J M A`.

## Constraints
- 1 ≤ A ≤ 9 999
- 1 ≤ M ≤ 12
- 1 ≤ J ≤ 31, and the dates exist.

## Hints
1. Years decide first: if they differ, the day and month do not matter.
2. If the years are equal, the months decide; if the months are equal too, the days.
3. A single `if` / `elif` chain is enough: `A1 < A2`, then `A1 > A2`, then `M1 < M2`, then `M1 > M2`, then the days. When you reach the month test, you already know the years are equal.

## Solution
Compare as in a dictionary: first the years, then the months, then the days. The chain of tests is:
- if `A1 < A2`, the first date is the earliest; if `A1 > A2`, the second one is;
- otherwise (the years are equal), if `M1 < M2`, the first; if `M1 > M2`, the second;
- otherwise (years and months equal), if `J1 <= J2`, the first; otherwise the second.

The `<=` in the last test handles two identical dates: the first one is printed, which is also the second.

The trap is to compare the days first, or to compare each number separately: January 30, 2020 would look earlier than March 2, 2019 if you forgot to look at the year first. It is not: the year decides.
