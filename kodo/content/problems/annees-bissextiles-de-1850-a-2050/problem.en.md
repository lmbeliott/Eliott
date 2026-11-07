---
title: Leap years from 1850 to 2050
---

## Statement
A year is a **leap year** if it is divisible by 4, except years divisible by 100, which are leap years only if they are also divisible by 400. So 2024 is a leap year, 1700 is not, 1600 is.

Print, in increasing order, all the leap years from `1850` to `2050` included.

## Input
None: the program reads nothing.

## Output
The requested years, one per line, in increasing order.

## Hints
1. If the rule were just "divisible by 4", a single loop with step 4 would do. What is the first year divisible by 4 from 1850 on?
2. Between 1850 and 2050, which years are divisible by 100? Are they leap years?
3. One year is missing from the step-4 sequence: you have to split the loop into two loops one after the other.

## Solution
The first year divisible by 4 from 1850 on is 1852, the last one before 2050 is 2048. In between, the years divisible by 100 are 1900 and 2000. The year 2000 is divisible by 400: it is a leap year, and the usual rule applies. The year 1900 is not divisible by 400: it is **not** a leap year, even though it is divisible by 4.

The wanted sequence is therefore the years from 1852 to 2048 going up by 4, without 1900. You print it with two loops one after the other: the first one from 1852 to 1896 (`range(1852, 1900, 4)`), the second one from 1904 to 2048 (`range(1904, 2049, 4)`). There are 12 + 37 = 49 years.

The two traps are forgetting the 1900 exception, and conversely excluding 2000 by applying the exception without checking divisibility by 400.
