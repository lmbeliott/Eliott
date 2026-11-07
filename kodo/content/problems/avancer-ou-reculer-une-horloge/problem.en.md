---
title: Move a clock forward or back
---

## Statement
A clock shows `H` hours and `M` minutes, on a 24-hour dial (after 23:59 comes 0:00). It is shifted by `D` minutes: forward if `D` is positive, backward if `D` is negative. Print the time it shows afterwards.

## Input
A single line containing `H`, `M` and `D`, separated by spaces.

## Output
A single line with two integers separated by a space: the hour (between `0` and `23`) then the minutes (between `0` and `59`).

## Constraints
- 0 ≤ H ≤ 23
- 0 ≤ M ≤ 59
- −10⁹ ≤ D ≤ 10⁹

## Hints
1. Convert the time into a single number: the number of minutes elapsed since 0:00. A day has 24 × 60 = 1,440 minutes.
2. After the shift, bring the total back between 0 and 1,439 with a remainder. Careful, the total can be negative.
3. In Python, `x % 1440` is always between 0 and 1,439, even if `x` is negative. In C++, you must write `((x % 1440) + 1440) % 1440`.

## Solution
Count in minutes since 0:00: `t = 60 × H + M + D`. Adding or removing whole days does not change the time shown, so the final time corresponds to the remainder of `t` by 1,440, taken between 0 and 1,439. Then print `t // 60` and `t % 60`.

The trap is the sign of the remainder. In Python, `%` always gives a remainder between 0 and 1,439 when dividing by 1,440. In C++, `%` has the sign of the number being divided: `-60 % 1440` is `-60`, and the program would print a negative hour. The correction `((t % 1440) + 1440) % 1440` brings the remainder back between 0 and 1,439. Adding 1,440 only once to `t` is not enough: `D` can be −10⁹, that is hundreds of thousands of days.
