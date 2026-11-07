---
title: Rounded weighted average
---

## Statement
A school report contains `N` grades out of 20, each with a coefficient. Print the weighted average, rounded to the nearest tenth. When the average falls exactly halfway between two tenths, round up.

The weighted average is the sum of the `grade × coefficient`, divided by the sum of the coefficients. For example, a grade of 12 with coefficient 3 and a grade of 13 with coefficient 1 give (36 + 13) / 4 = 12.25, which rounds to `12.3`.

## Input
The first line contains the integer `N`. Each of the next `N` lines contains a grade and its coefficient, two integers separated by a space.

## Output
The rounded average, written with a dot and exactly one digit after the dot (for example `12.3` or `15.0`).

## Constraints
- 1 ≤ N ≤ 100
- 0 ≤ grade ≤ 20
- 1 ≤ coefficient ≤ 10

## Hints
1. With decimal numbers, `round(12.25, 1)` gives `12.2` in Python: because of "round half to even" and representation errors, the "exactly halfway" cases are handled badly.
2. Rounding `x` to the tenth means rounding `10 × x` to the nearest integer. For a positive `a / b`, the nearest integer, halves up, is `(2a + b) // (2b)`.
3. With `S` the sum of the `grade × coefficient` and `C` the sum of the coefficients, the number of tenths is `(20 × S + C) // (2 × C)`. All that's left is to print it with `// 10` and `% 10`.

## Solution
First compute two integers: `S`, the sum of the `grade × coefficient`, and `C`, the sum of the coefficients. The average is `S / C`.

The trap is to do the division with decimal numbers, then round with `round` or by printing one decimal. In Python, `round` rounds halves towards the even digit (`round(0.25, 1)` gives `0.2`), and anyway `12.25` or `13.35` are not represented exactly by the machine: the result depends on tiny errors.

So stay with integers. The number of tenths you want is the integer nearest to `10 × S / C`. For a positive quotient `a / b`, adding one half then taking the integer part gives the rounding with halves up: `⌊a / b + 1/2⌋ = ⌊(2a + b) / (2b)⌋`. With `a = 10 × S` and `b = C`, you get `(20 × S + C) // (2 × C)`. A small function `arrondi_au_dixieme` ("round to the tenth") isolates this computation and makes it easy to test.

For the output, `dixiemes // 10` (the number of tenths) is the integer part and `dixiemes % 10` the digit after the dot: 123 tenths are written `12.3`, and 150 tenths `15.0`, with the final zero.
