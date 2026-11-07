---
title: Longest gap between two dates
---

## Statement
A logbook contains a list of dates, in chronological order.

Write a program that prints the largest number of days between two **consecutive** dates of the logbook. For example, between `28/02/2023` and `01/03/2023`, there is 1 day; between `15/07/2024` and `01/09/2024`, there are 48.

Dates are written day first, then month, then year. Watch out for leap years, when February has 29 days. A year is a leap year if it's divisible by 4, unless it's divisible by 100 without being divisible by 400: `2024` and `2000` are leap years, but `1900`, `2023` and `2100` aren't.

## Input
- The first line contains an integer `N`: the number of dates.
- The next `N` lines each contain a date in the form `dd/mm/yyyy` (day, month, year), in chronological order. The same date can appear several times in a row.

To read a date like `14/07/2025`: in Python, `input().split("/")` cuts the line at each `/`. In C++, you can read `cin >> d >> c >> m >> c >> y` with a variable `char c` that takes the `/` characters.

## Output
A single integer: the largest number of days between two consecutive dates of the logbook.

## Constraints
- 2 ≤ N ≤ 100
- All dates exist, and they are between `01/01/1900` and `31/12/2100`.

## Hints
1. Counting the days between two dates directly is complicated. Simpler: give each date a **number**, the number of days since `01/01/1900`. The number of days between two dates is then the difference between their numbers.
2. Split the work into small functions: `is_leap(y)`, then `days_in_month(m, y)`, which uses it for February, then `day_number(d, m, y)`, which adds up the days of all the full years since 1900, then those of the full months of year `y`, then the days of the month.
3. Once you have the numbers, all that's left is to find the largest gap between two numbers that follow each other: keep the number of the previous date in a variable.

## Solution
We number the days: `01/01/1900` gets number 0, `02/01/1900` number 1, and so on. To compute the number of a date `d/m/y`, we add up:
- 365 or 366 days for each full year from 1900 to `y - 1`;
- the days of each full month of year `y`, from January to month `m - 1`;
- `d - 1` days in month `m`.

The number of days between two dates is the difference between their numbers. All that's left is to go through the logbook, keeping the number of the previous date, and remember the largest gap.

This problem shows clearly why functions are useful. In the reference solutions, `est_bissextile` ("is leap year") is used both for the full years and for February, `jours_dans_mois` ("days in month") hides all the details of the calendar, and `numero` gives the number of a date. Each function is short and can be checked on its own (`est_bissextile(1900)` must be false).

The traps:
- the century rule: `1900` and `2100` aren't leap years, but `2000` is;
- for February, what matters is the year **of the date**, not another year;
- two identical dates are 0 days apart, and that's not a mistake.
