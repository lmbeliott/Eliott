---
title: Addition pyramid
---

## Statement
A pyramid of numbers has the row `2 7 1 8 2 8` as its base. Each number above the base is the sum of the two numbers it rests on: the row just above the base starts with 2 + 7 = 9, then 7 + 1 = 8, and so on, up to the top, which contains a single number.

Print the whole pyramid, from the top down to the base, then an empty line, then a last line containing the word `SOMMET` (French for "top") followed by the number at the top.

## Input
None: the program reads nothing.

## Output
First 6 lines: line number k (from 1 to 6) contains the k numbers of level number k counted from the top, separated by a space. The sixth line is therefore the base `2 7 1 8 2 8`. Then an empty line, then a line of the form `SOMMET x`, where `x` is the number at the top.

## Hints
1. The levels are computed from the bottom up, but printed from the top down: you must compute everything on paper before writing the program.
2. Each level has one number fewer than the one below. The level just above the base is `9 8 9 10 10`.
3. To check, the top can also be computed directly: it is 1 × 2 + 5 × 7 + 10 × 1 + 10 × 8 + 5 × 2 + 1 × 8, with the coefficients of a row of Pascal's triangle.

## Solution
Compute the levels starting from the base:

- base: `2 7 1 8 2 8`;
- level 5: `9 8 9 10 10`;
- level 4: `17 17 19 20`;
- level 3: `34 36 39`;
- level 2: `70 75`;
- top: `145`.

The program then prints these rows **in the reverse order** of the computation, from the top down to the base, then the empty line and `SOMMET 145`.

The check in hint 3 comes from Pascal's triangle: each number of the base is counted at the top as many times as there are paths going up from it to the top, and these numbers of paths are 1, 5, 10, 10, 5, 1. Indeed 2 + 35 + 10 + 80 + 10 + 8 = 145.
