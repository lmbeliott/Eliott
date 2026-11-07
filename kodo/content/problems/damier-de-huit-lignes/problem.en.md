---
title: Eight-row checkerboard
---

## Statement
Print a checkerboard of 8 rows and 8 columns, where `#` stands for a black square and `.` for a white square. Two neighbouring squares (left, right, above or below) never have the same colour, and the top-left square is black.

## Input
None: the program reads nothing.

## Output
8 lines of 8 characters each, made only of `#` and `.`.

## Hints
1. First write the first row: it starts with `#` and alternates.
2. The second row starts below a `#`: its first square is therefore white. How many different rows does the board contain in total?

## Solution
The first row alternates, starting with a black square: `#.#.#.#.`. The square just below each `#` must be white, and conversely: the second row is therefore `.#.#.#.#`. The third row is below the second, so it is `#.#.#.#.` again, and so on.

The board therefore contains only two different rows, which alternate: rows 1, 3, 5, 7 are `#.#.#.#.` and rows 2, 4, 6, 8 are `.#.#.#.#`. The classic trap is to print the same row 8 times: every column would then have a single colour.
