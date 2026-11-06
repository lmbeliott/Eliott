---
title: The cheese contest jury
---

## Statement
At the big Valcorde cheese contest, each tomme is tasted by three judges, who each give it a whole-number mark out of 20. So that a judge who is too strict or too generous can't spoil the result, Lucas, the organizer, only keeps the middle mark.

Write a program that reads the three marks and prints the middle mark, meaning the one that ends up in the middle when you sort the three marks from smallest to largest.

## Input
A single line containing three integers `A`, `B` and `C` separated by spaces: the marks of the three judges. Two marks, or even all three, can be equal.

## Output
A single integer: the middle mark.

## Constraints
- 0 ≤ A, B, C ≤ 20

## Hints
1. Ask yourself: when is `A` the middle mark? It has to be between the two other marks.
2. `A` is in the middle if B ≤ A ≤ C, or if C ≤ A ≤ B. You can use the same reasoning for `B`. If neither `A` nor `B` is in the middle, then it has to be `C`.
3. To combine two conditions, use `and` and `or` in Python, `&&` and `||` in C++. Think about equal marks: use `<=` rather than `<`.

## Solution
The mark `A` is in the middle when it lies between the two others: B ≤ A ≤ C or C ≤ A ≤ B. Same thing for `B`. If neither `A` nor `B` is in the middle, then `C` is. Three cases, so `if`, `elif`, `else`.

First trap: equal marks. With strict comparisons (`<`), for the marks `5 5 1`, neither of the first two conditions is true, and the program would answer `1` instead of `5`. With `<=`, everything works.

Second trap, in C++: `b <= a <= c` is accepted by the compiler, but it doesn't mean what you think! C++ first computes `b <= a` (which gives 0 or 1), then compares that 0 or 1 with `c`. You must write `b <= a && a <= c`. In Python, on the other hand, `b <= a <= c` works just like in math.

Another, cleverer idea: the middle mark is the sum of the three marks, minus the largest one, minus the smallest one.
