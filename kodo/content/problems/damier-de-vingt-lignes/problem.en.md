---
title: Twenty-row checkerboard
---

## Statement
Print a checkerboard of 20 rows and 20 columns, where `#` stands for a black square and `.` for a white square. Two neighbouring squares (left, right, above or below) never have the same colour, and the top-left square is black.

## Input
None: the program reads nothing.

## Output
20 lines of 20 characters each, made only of `#` and `.`.

## Hints
1. The board contains only two different rows, which alternate.
2. Rows 1 and 2 form a pattern; this pattern is repeated. How many times?
3. The body of a loop can contain two print instructions.

## Solution
The first row is `#.#.#.#.#.#.#.#.#.#.` (20 alternating characters, starting with `#`), and the second one is its opposite, `.#.#.#.#.#.#.#.#.#.#`. Then the third row is the first one again, and so on.

The board is therefore the block of these two rows, repeated 10 times. The program is a loop of 10 iterations whose body prints the two rows: 2 × 10 = 20 lines. The loop variable is not used in the body; it only counts the iterations.

The traps: repeating the block 20 times (you get 40 lines), or getting the length of the rows wrong. To check a row, count the `#.` pairs: there must be 10.
