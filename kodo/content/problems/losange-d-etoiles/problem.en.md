---
title: Diamond of stars
---

## Statement
Print a diamond of stars `*` of width 7, inside a frame of 7 rows and 7 columns. Empty cells are filled with dots `.`. The middle row is entirely filled with stars; moving away from the middle, each row loses one star at each end, down to the first and last rows, which have a single star, in the centre.

## Input
None: the program reads nothing.

## Output
7 lines of 7 characters each, made only of `*` and `.`.

## Hints
1. Start with the middle row (the fourth one): it contains 7 stars.
2. Rows 3 and 5 contain 5 centred stars: one dot remains on each side.
3. The figure is symmetric: row 7 is identical to row 1, row 6 to row 2, and so on.

## Solution
Start from the middle row, `*******`. Going up one row, remove one star at each end and replace it with a dot: `.*****.`, then `..***..`, then `...*...`. The bottom half is the mirror image of the top half.

The number of stars per row is therefore 1, 3, 5, 7, 5, 3, 1: it grows by 2 up to the middle and then shrinks by 2. Each row always has 7 characters: dots on the left + stars + dots on the right = 7. The dots are essential: the judge ignores spaces, so it would not see an offset made with spaces.
