---
title: Countdown
---

## Statement
Write a program that reads an integer `N` and prints a countdown: the numbers from `N` down to `1`, from the largest to the smallest and one per line, then the word `FIN` (French for "end").

## Input
A single line containing an integer `N`.

## Output
`N + 1` lines: the integers `N`, `N - 1`, …, `2`, `1`, one per line, then a last line containing exactly the word `FIN`, in capital letters.

## Constraints
- 1 ≤ N ≤ 100

## Hints
1. Printing a number `N` times in a row: that's a job for a loop. It just needs to count backwards.
2. In Python, `range(n, 0, -1)` gives `n`, `n - 1`, …, `1`: it starts at `n`, goes back by 1 each time, and stops **before** 0. In C++: `for (int i = n; i >= 1; i--)`.
3. The word `FIN` is printed only once, after the loop: it must not be inside the repeated block.

## Solution
A loop makes `i` go from `N` down to `1`, going back one step each time, and prints `i`. After the loop, we print `FIN`.

In Python, `range(n, 0, -1)` stops just before `0`, so the last number printed is indeed `1`. You can also use a `while` loop: start with `i = n`, and as long as `i >= 1`, print `i` and then subtract 1 from `i`.

The classic traps:
- writing `range(n, 1, -1)`, which stops before `1` and so forgets the last number;
- putting `print("FIN")` inside the loop (with the same indentation as the line that prints the number): the word would then be printed at every turn.
