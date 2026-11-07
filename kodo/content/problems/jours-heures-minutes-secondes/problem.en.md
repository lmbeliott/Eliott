---
title: Days, hours, minutes, seconds
---

## Statement
A duration is given in seconds. Write it in days, hours, minutes and seconds: the number of hours must be between 0 and 23, and the numbers of minutes and seconds between 0 and 59.

## Input
A single line containing an integer `S`: the duration in seconds.

## Output
A single line containing four integers separated by spaces: the days, the hours, the minutes and the seconds.

## Constraints
- 0 ≤ S ≤ 1 000 000 000

## Hints
1. A minute is 60 seconds, an hour is 3,600 seconds and a day is 86,400 seconds.
2. `S // 86400` gives the number of full days, and `S % 86400` what is left once those days are removed.
3. Start again with this remainder: it gives the hours, then a new remainder for the minutes, and so on.

## Solution
Remove the largest units first. The number of days is `S // 86400`; `S % 86400` seconds remain, less than a day. In this remainder, the number of hours is `rest // 3600`, and `rest % 3600` seconds remain, less than an hour. Then the minutes are `rest // 60` and the seconds `rest % 60`.

The classic trap is to compute the hours as `S // 3600`: that gives the total number of hours, which can exceed 23. You must start from the remainder after removing the days.

`S` goes up to 10⁹, which fits in an `int` in C++ (the limit is about 2.1 × 10⁹).
