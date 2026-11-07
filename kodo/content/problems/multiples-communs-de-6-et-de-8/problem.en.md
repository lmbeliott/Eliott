---
title: Common multiples of 6 and 8
---

## Statement
Print, in increasing order, all the positive integers less than `500` that are both multiples of `6` and multiples of `8`.

## Input
None: the program reads nothing.

## Output
The requested numbers, one per line, in increasing order.

## Hints
1. Write down on paper the first multiples of 8: 8, 16, 24, 32, 40, 48… Which ones are also multiples of 6?
2. The first suitable number is not 6 × 8 = 48.
3. Once the first number is found, the following ones come with a constant step.

## Solution
Among the multiples of 8, the first one that is also a multiple of 6 is 24 (8 and 16 are not multiples of 6). The numbers that are multiples of both 6 and 8 are exactly the multiples of 24: 24, 48, 72, … The number 24 is the **least common multiple** of 6 and 8.

The loop starts at 24 with a step of 24, and stops before 500: `range(24, 500, 24)`. The last number printed is 480 = 20 × 24; the next one, 504, exceeds 500.

The trap is to take the step 48 = 6 × 8: you do get common multiples, but you miss 24, 72, 120… The product of two numbers is their least common multiple only when they have no common divisor other than 1, which is not the case for 6 and 8 (both even).
