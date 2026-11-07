---
title: Leap year
---

## Statement
A year is a leap year (it has a February 29) according to the following rule:
- a year divisible by 400 is a leap year;
- otherwise, a year divisible by 100 is not a leap year;
- otherwise, a year divisible by 4 is a leap year;
- all other years are not leap years.

Print `OUI` (yes) if the year `A` is a leap year, `NON` (no) otherwise.

## Input
A single line containing the integer `A`.

## Output
`OUI` or `NON`.

## Constraints
- 1 ≤ A ≤ 100 000

## Hints
1. "`A` is divisible by 4" is written `A % 4 == 0`.
2. The rule is already written in the right order: each "otherwise" matches an `elif` (or `else if`).
3. What happens for the year 1900 if you test divisibility by 4 first?

## Solution
Translate the rule as it is, with an `if` / `elif` / `elif` / `else` chain: divisible by 400 gives `OUI`, otherwise divisible by 100 gives `NON`, otherwise divisible by 4 gives `OUI`, otherwise `NON`.

The order is essential, because the cases overlap: 1900 is divisible by 4 and by 100, but not by 400. Since only the first true case runs, the most specific rules (400, then 100) must be tested before the general rule (4). If you start with divisibility by 4, 1900 is declared a leap year, which is wrong. Likewise, 2000 is a leap year: divisible by 400, it is recognised by the very first test.
