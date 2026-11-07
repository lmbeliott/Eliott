---
title: Adding up durations
---

## Statement
For each working day, a person writes down the time when they start and the time when they finish. They want to know their total working time.

Times are written in the form `hh:mm`: for example, `08:05` means 8 hours and 5 minutes.

Write a program that prints this total time, in the same `hh:mm` form.

## Input
- The first line contains an integer `N`: the number of working days.
- The next `N` lines each contain two times `hh:mm` separated by a space: the start time, then the end time of the same day. The end is never before the start.

## Output
The total time, in the form `hh:mm`: the number of hours, written with at least two digits (with a `0` in front if it has only one digit), then `:`, then the number of minutes, always written with two digits. For example: `07:05`, `00:15` or `125:40`.

## Constraints
- 1 ≤ N ≤ 100
- Times go from `00:00` to `23:59`.

## Hints
1. It's much easier to compute with minutes than with hours and minutes. Write a function `to_minutes(time)` that turns `"08:45"` into `525` (8 × 60 + 45).
2. In `"08:45"`, the hours are the characters at indices `0` and `1`, and the minutes those at indices `3` and `4`. In Python, `int(time[0:2])` gives the hours. In C++, `(time[0] - '0') * 10 + (time[1] - '0')`.
3. For the output, write a function `two_digits(n)` that returns `"07"` for `7` and `"45"` for `45`, then a function `to_text(duration)` that uses it twice: for the hours (`duration // 60`, or `duration / 60` in C++) and for the minutes (`duration % 60`).

## Solution
We split the problem into three small functions. In the reference solutions, they're called `en_minutes`, `deux_chiffres` and `en_texte`, French for "to minutes", "two digits" and "to text":
- `en_minutes(horaire)` turns a time `hh:mm` into a number of minutes since midnight;
- `deux_chiffres(n)` writes a number with at least two digits, adding a `0` in front if it's less than 10;
- `en_texte(duree)` turns a number of minutes into the text `hh:mm`: the hours are `duree // 60` (integer division, which is `/` on `int`s in C++) and the minutes are `duree % 60`.

The main program then becomes very short: for each day, we add `en_minutes(fin) - en_minutes(debut)` (end time minus start time) to the total, then we print `en_texte(total)`.

Each function can be tested and understood on its own, and `en_minutes` is used twice per line: that's the whole point of functions.

The traps:
- subtracting hours and minutes separately: from `09:50` to `10:05`, that would give 1 hour and −45 minutes! By converting everything to minutes, the problem disappears;
- forgetting the `0` in front of the minutes: `8:5` instead of `08:05`;
- thinking that the total fits in 24 hours: over many days, it can go over 100 hours. The number of hours isn't limited to two digits.
