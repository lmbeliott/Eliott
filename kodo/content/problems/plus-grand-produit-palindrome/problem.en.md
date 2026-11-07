---
title: Largest palindromic product
---

## Statement
An integer is a **palindrome** if it reads the same from left to right and from right to left, like `7`, `55` or `9009`.

Consider all the products `x × y` with `A ≤ x ≤ y ≤ B`. Print the largest of these products that is a palindrome, then the number of couples `(x, y)` with `A ≤ x ≤ y ≤ B` that give this product. If no product is a palindrome, print `AUCUN`.

For example, for `A = 10` and `B = 99`, the largest palindromic product is `9009 = 91 × 99`, and it's the only couple that gives it.

## Input
A single line containing two integers `A` and `B` separated by a space.

## Output
A single line: the largest palindromic product and the number of couples that give it, separated by a space; or the word `AUCUN`.

## Constraints
- 1 ≤ A ≤ B ≤ 10,000
- B - A ≤ 300

## Hints
1. Two nested loops go through the couples: `x` from `A` to `B`, and `y` from `x` to `B`. At most 301 × 302 / 2, about 45,000 couples.
2. To know whether a product `p` is a palindrome, build its reverse digit by digit (`r = r × 10 + m % 10`, then `m = m // 10`) and compare it with `p`. That's a third loop, inside the other two.
3. Keep the best palindrome and its number of couples: if a palindrome is larger than the best, it replaces it and the counter goes back to 1; if it's equal, the counter increases by 1. At the start the best is 0: if it's still 0 at the end, no product is a palindrome.

## Solution
Do an exhaustive search on the couples `(x, y)` with `A ≤ x ≤ y ≤ B`: the outer loop makes `x` vary, the inner loop makes `y` vary starting from `x`, to count each couple only once.

For each product `p = x × y`, test whether it is a palindrome. Copy `p` into `m`, and build the reverse `r` with a loop `while m > 0`: `r = r × 10 + m % 10` then `m = m // 10`. The product is a palindrome when `r == p`. So there are three nested loops, but the last one makes at most 9 turns (products have at most 9 digits): about 400,000 turns in total.

Keep two variables: `meilleur`, the largest palindrome found (0 at the start, which is never a product since `A ≥ 1`), and `nombre`, the number of couples that give it.
- If `p` is a palindrome larger than `meilleur`, it becomes the new best, and `nombre` goes back to 1.
- If `p` is a palindrome equal to `meilleur`, `nombre` increases by 1.

At the end, if `meilleur` is still 0, print `AUCUN`; otherwise, `meilleur` and `nombre`.

The traps: resetting `nombre` to 0 instead of 1 when a new best is found (the current couple already counts), forgetting to reset `r` to 0 before each test, and starting `y` at `A` instead of `x`, which would count couples like `(3, 4)` and `(4, 3)` twice. A small speed-up: no need to test whether `p` is a palindrome when `p` is smaller than `meilleur`.
