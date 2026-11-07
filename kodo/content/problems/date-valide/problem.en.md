---
title: Valid date
---

## Statement
A date is given by three integers: the day `J`, the month `M` and the year `A`. Print `OUI` (yes) if this date exists in the calendar, `NON` (no) otherwise.

Reminders:
- months 1, 3, 5, 7, 8, 10 and 12 have 31 days; months 4, 6, 9 and 11 have 30;
- February (month 2) has 29 days in leap years and 28 in the others;
- a year is a leap year if it is divisible by 4 but not by 100, or if it is divisible by 400.

## Input
A single line containing three integers `J`, `M` and `A` separated by spaces.

## Output
`OUI` or `NON`.

## Constraints
- 0 ≤ J ≤ 40
- 0 ≤ M ≤ 15
- 1 ≤ A ≤ 9 999

## Hints
1. The month must be between 1 and 12, and the day at least 1. After that, everything depends on the number of days in the month.
2. First compute this number of days in a variable `days_in_month`, then compare `J` with it.
3. For the 30-day months: `M == 4 or M == 6 or M == 9 or M == 11`.

## Solution
Work in two steps. First, compute the number of days in the month:
- if `M == 2`, it is 29 if the year is a leap year, 28 otherwise, with `leap = (A % 4 == 0 and A % 100 != 0) or A % 400 == 0`;
- otherwise, if `M` is 4, 6, 9 or 11 (four equalities joined by `or`), it is 30;
- otherwise, it is 31.

Then, the date is valid if `1 <= M <= 12` and `1 <= J <= days_in_month`. For an invalid month such as 13, the computation gives 31 days, but that does not matter: the test on the month rejects the date.

The traps: forgetting that a day or a month can be 0; forgetting the parentheses in the leap year rule; and mixing up years such as 1900 (not a leap year, so no February 29) and 2000 (a leap year).
