---
title: Climbing a staircase
---

## Statement
You climb a staircase of `N` steps starting from the ground. At each move, you go up 1, 2 or 3 steps, and you must stop exactly on the last step. Two climbs are different if their sequences of moves are different: going up 1 then 2 is not the same as going up 2 then 1.

For example, there are 7 ways to climb 4 steps: `1+1+1+1`, `1+1+2`, `1+2+1`, `2+1+1`, `2+2`, `1+3` and `3+1`.

Print the number of ways to climb the staircase.

## Input
A single line containing the integer `N`.

## Output
A single integer: the number of ways to climb the `N` steps.

## Constraints
- 1 ≤ N ≤ 70
- The answer can exceed 10¹⁸: in C++, use `long long`.

## Hints
1. The number of ways becomes huge: you can't list the climbs one by one. Find how the number of ways for `n` steps follows from the numbers for smaller staircases.
2. Look at the **last move** of a climb of `n` steps: it covers 1, 2 or 3 steps. Before that last move, you had climbed `n - 1`, `n - 2` or `n - 3` steps.
3. Writing `W(n)` for the number of ways, `W(n) = W(n - 1) + W(n - 2) + W(n - 3)`, with `W(0) = 1` (a single way to climb 0 steps: do nothing). It's enough to keep the last three values in three variables.

## Solution
Write `W(n)` for the number of ways to climb `n` steps. Sort the climbs by their **last move**:
- if it covers 1 step, what comes before is a climb of `n - 1` steps, and there are `W(n - 1)` of them;
- if it covers 2 steps, what comes before is a climb of `n - 2` steps: `W(n - 2)` possibilities;
- if it covers 3 steps, `W(n - 3)` possibilities.

These three groups don't overlap and cover all the climbs, so `W(n) = W(n - 1) + W(n - 2) + W(n - 3)`. Set `W(0) = 1` (the empty climb), and `W(n) = 0` for negative `n`. You get back `W(1) = 1`, `W(2) = 2`, `W(3) = 4`, `W(4) = 7`.

Without an array, keep only the last three values: `a = W(n - 3)`, `b = W(n - 2)`, `c = W(n - 1)`. At each turn, compute `nouveau = a + b + c`, then shift: `a` takes the value of `b`, `b` that of `c`, and `c` that of `nouveau`. The order of the three assignments matters: if you first wrote `b = c`, the old value of `b` would be lost before being copied into `a`.

This idea, computing an answer from the answers to smaller problems, is called **dynamic programming**. It will be studied in detail later. The answer for `N = 70` exceeds 2 × 10¹⁸: in C++, you need `long long`.
