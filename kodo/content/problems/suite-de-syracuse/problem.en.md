---
title: Syracuse sequence
---

## Statement
Start from an integer `N` and repeat the following transformation: if the number is even, divide it by 2; if it is odd, replace it with `3 × n + 1`. Stop as soon as the number is `1`.

For example, starting from `6`, you get `6, 3, 10, 5, 16, 8, 4, 2, 1`: it takes 8 steps, and the largest value met is 16.

Print the number of steps needed to reach `1`, then the largest value met (counting `N`).

## Input
A single line containing the integer `N`.

## Output
A single line with two integers separated by a space: the number of steps, then the largest value met.

## Constraints
- 1 ≤ N ≤ 1,000,000
- For these values, the sequence is known to always reach `1`, in fewer than 600 steps.
- The largest value can exceed 10¹⁰: in C++, use `long long`.

## Hints
1. A `while` loop that goes on as long as the number is different from `1`. In the body, an `if` chooses the transformation.
2. Keep the largest value seen in a variable. It starts at `N`, and you update it after each transformation.
3. With `N = 1`, there is no step: the answer is `0 1`.

## Solution
Simulate the sequence. Three variables: the current number `n`, the counter `etapes` and the maximum `plus_grand`, which starts at `N` (the starting value counts).

As long as `n != 1`: if `n % 2 == 0`, do `n = n // 2`, otherwise `n = 3 * n + 1`; then add 1 to `etapes` and, if `n` is above `plus_grand`, update `plus_grand`.

Here the condition `n != 1` is safe: the sequence does not jump over `1`, it ends up landing exactly on it (nobody has ever found a starting number for which this fails, and it is checked for all those in the statement).

The trap in C++: the values climb much higher than `N`. Starting from `704,511`, you go above 5 × 10¹⁰, far beyond the limit of an `int`: without `long long`, the computation goes wrong and the loop may never stop.
