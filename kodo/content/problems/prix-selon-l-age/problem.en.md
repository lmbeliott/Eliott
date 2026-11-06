---
title: Price by age
---

## Statement
In a museum, the price of an entrance ticket depends on the visitor's age:

| Age | Ticket price |
| --- | --- |
| under 4 | free (0 euros) |
| 4 to 11 | 12 euros |
| 12 to 17 | 18 euros |
| 18 to 64 | 25 euros |
| 65 and over | 20 euros |

In this table, "4 to 11" means: 4, 11, and every age in between.

Write a program that reads the age of a visitor and prints the price of their ticket.

## Input
A single line containing an integer `A`: the age of the visitor, in years.

## Output
A single integer: the price of the ticket, in euros (don't write "euros").

## Constraints
- 0 ≤ A ≤ 110

## Hints
1. There are five age groups. Test them in order, from the youngest to the oldest, with `if`, then several `elif` (`else if` in C++), then `else`.
2. The tests are chained: when the program reaches the second test, it already knows that the first one was false. If the first test is `a < 4`, the second one can simply be `a <= 11`: no need to check again that `a >= 4`.
3. Try your program on the ages at the boundaries: 3, 4, 11, 12, 17, 18, 64 and 65.

## Solution
We chain the tests, from the youngest age group to the oldest:
- if `A < 4`, the price is 0;
- otherwise, if `A <= 11`, the price is 12;
- otherwise, if `A <= 17`, the price is 18;
- otherwise, if `A <= 64`, the price is 25;
- otherwise, the price is 20.

Thanks to `elif` (or `else if`), only one case is chosen: the first one whose condition is true. That's why the order of the tests matters. If we tested `A <= 64` first, a 10-year-old child would pay 25 euros!

The classic trap is to get the boundaries wrong: at 11, you still pay 12 euros, and it's at 12 that the price goes up to 18 euros. Writing `A < 11` instead of `A <= 11` (or `A < 12`) would make an 11-year-old pay 18 euros.
