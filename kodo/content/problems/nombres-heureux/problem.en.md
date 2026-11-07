---
title: Happy numbers
---

## Statement
Starting from an integer `N ≥ 1`, compute the sum of the squares of its digits, then start again with the result, and so on. For example, 19 → 1 + 81 = 82 → 64 + 4 = 68 → 36 + 64 = 100 → 1. The number 19 reaches 1 in 4 steps: it is called **happy**.

Other numbers never reach 1 and go round in circles: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → …

For each given number, print the number of steps needed to reach 1, or `-1` if it never reaches 1.

## Input
- The first line contains the integer `Q`.
- Each of the next `Q` lines contains an integer `N`.

## Output
`Q` lines: for each `N`, in order, the number of steps to reach 1 (`0` if `N = 1`), or `-1`.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ N ≤ 10¹⁸

## Hints
1. Write a function `next_value(n)` that returns the sum of the squares of the digits of `n`.
2. A number with at most 18 digits gives, after one step, a value of at most 18 × 81 = 1,458. After that, all values stay below 1,500.
3. If a value appears a second time, the sequence repeats the same loop forever and will never reach 1. A list of 1,500 booleans, created inside the function, lets you remember the values already seen.

## Solution
The function `next_value(n)` adds up the squares of the digits of `n`. A function `steps(n)` simulates the sequence: while `n ≠ 1`, it replaces `n` with `next_value(n)` and counts the steps.

To know when to stop if `n` is not happy, notice that each value depends only on the previous one: if a value comes back, everything after it repeats, and 1 will never be reached. Now, after the first step, the values are all below 1,500 (at most 9² × 18 = 1,458, then even less). So the function creates a local list `seen` of 1,500 booleans set to `False`. Before each step, if `n < 1500`, it looks at `seen[n]`: if it is `True`, it returns `-1`; otherwise it sets it to `True`. Since there are only 1,500 possible values, the loop stops after at most a few hundred steps.

The list `seen` must be created again at each call: it is a local variable of `steps`. A global list shared by all calls would give wrong answers, because the values seen for a previous number say nothing about the next one.

In C++, `N` can reach 10¹⁸: you need a `long long`.

To go further: one can prove that every unhappy number ends up in the loop of 4 given in the statement.
