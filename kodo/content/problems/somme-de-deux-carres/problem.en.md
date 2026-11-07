---
title: Sum of two squares
---

## Statement
Find all the ways to write the integer `N` as a sum of two squares: `N = a × a + b × b`, with integers `a` and `b` and `0 ≤ a ≤ b`.

For example, `50 = 1 × 1 + 7 × 7 = 5 × 5 + 5 × 5`: there are two ways.

## Input
A single line containing the integer `N`.

## Output
- On the first line, the number `C` of ways.
- On the next `C` lines, the couples `a b`, one per line, separated by a space, in increasing order of `a`.

If `N` cannot be written as a sum of two squares, print only `0`.

## Constraints
- 1 ≤ N ≤ 1,000,000

## Hints
1. Since `a ≤ b`, you have `a × a ≤ N / 2` and `b × b ≤ N`. In particular, `a` and `b` stay less than or equal to 1,000.
2. Two nested loops: `a` from 0 to 1,000 and `b` from `a` to 1,000. For each couple, test whether `a × a + b × b == N`.
3. You must know the number of couples before printing them: run the same loops twice, the first time to count, the second time to print.

## Solution
Do an exhaustive search on the couples `(a, b)` with `a ≤ b`. Since `b × b ≤ N ≤ 10⁶`, it's enough to try `b ≤ 1,000`, and the loop on `b` starts at `a` to respect `a ≤ b`. That's about 500,000 couples: it's fast.

The number of ways must be printed **before** the couples. Without a list to remember them, go through the same couples twice: a first pass counts the solutions, you print that number, then a second pass prints each couple found. Since `a` increases in the outer loop, the couples come out in increasing order of `a`.

You can also bound the loops with `while`: `a` moves on as long as `2 × a × a ≤ N`, and `b` moves on as long as `a × a + b × b ≤ N`. That's what the solutions do: fewer turns, same result.

The trap: forgetting `a = 0`. For example, `25 = 0 × 0 + 5 × 5 = 3 × 3 + 4 × 4`: there are two ways, not just one.
