---
title: Wheels turned by a counter
---

## Statement
A mechanical counter shows a number on 18 wheels, one per digit, with leading zeros. To go from x to x + 1, the units wheel turns one notch; each wheel that goes from 9 to 0 also turns the wheel to its left by one notch. For example, going from 1,299 to 1,300 turns 3 wheels, and going from 1,300 to 1,301 turns only one.

The counter shows A, and it is advanced one by one up to B. Answer Q questions of this kind: how many notches did the wheels turn in total?

## Input
The first line contains Q. Each of the next Q lines contains A and B.

## Output
Q lines: the total number of notches turned for each question.

## Constraints
- 1 ≤ Q ≤ 1,000
- 0 ≤ A ≤ B < 10¹⁸

## Hints
1. Simulating the B − A steps one by one is impossible when B − A is 10¹⁷.
2. Count wheel by wheel rather than step by step: how many times does the tens wheel turn when going from A to B? It turns every time the new number is a multiple of 10.
3. The number of multiples of d between A + 1 and B is ⌊B/d⌋ − ⌊A/d⌋.

## Solution
**Changing the point of view.** Instead of counting, for each step, the wheels that turn, count, for each wheel, the steps where it turns. Wheel number k (k = 0 for units, 1 for tens…) turns during the step from x to x + 1 exactly when the last k digits of x are all 9, that is when x + 1 is a multiple of 10^k. The number x + 1 goes through the integers from A + 1 to B: so wheel k turns as many times as there are multiples of 10^k between A + 1 and B, that is ⌊B/10^k⌋ − ⌊A/10^k⌋.

The answer is the sum of these quantities for k = 0, 1, …, 17. For example, from 1,299 to 1,301: (1,301 − 1,299) + (130 − 129) + (13 − 12) + (1 − 1) = 2 + 1 + 1 = 4, which is indeed 3 + 1.

**Cost.** 18 terms per question: O(log B) instead of O(B − A).

**Amortized cost.** One step can turn up to 18 wheels, but this is rare: wheel k only turns once every 10^k steps. Over a long run, the average number of wheels turned per step tends to 1 + 1/10 + 1/100 + … = 10/9. This is the idea of **amortized cost**: an expensive operation from time to time, but a total cost close to the number of operations. Totals exceed 2³¹: `long long` in C++.
