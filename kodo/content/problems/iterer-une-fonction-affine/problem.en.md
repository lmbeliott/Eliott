---
title: Iterate an affine function
---

## Statement
Let `f(x) = (A × x + B) mod M`, the remainder of the division of `A × x + B` by `M`. Starting from an integer `X`, apply the function `f` `K` times: compute `f(X)`, then `f(f(X))`, and so on. Print the result.

For example, with `M = 10`, `A = 3`, `B = 1`, `X = 2` and `K = 3`, you successively get 7, 2, then 7.

The input contains `T` questions of this kind.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains five integers: `M`, `A`, `B`, `X` and `K`.

## Output
For each question, one line with the result of `K` applications of `f` to `X` (if `K = 0`, it is `X`).

## Constraints
- 1 ≤ T ≤ 1,000
- 2 ≤ M ≤ 10⁹
- 0 ≤ A, B, X < M
- 0 ≤ K ≤ 10¹⁸

## Hints
1. Applying `f` once per turn would take up to 10¹⁸ turns. You need an idea like fast exponentiation.
2. Applying an affine function twice gives an affine function again: if `g(x) = a × x + b`, then `g(g(x)) = (a × a) × x + (a × b + b)`, all modulo `M`.
3. Maintain a value `x`, a function `g` (its two coefficients) and an integer `k` such that the result you want is always `g` applied `k` times to `x`.

## Solution
This is the fast exponentiation of the lesson, applied to functions instead of numbers. Maintain a value `x`, an affine function `g(x) = (a × x + b) mod M` given by its coefficients `(a, b)`, and an integer `k`, with the **invariant**: the result you want is `g` applied `k` times to `x`. At the start, `x = X`, `(a, b) = (A, B)` and `k = K`: the invariant holds.

At each turn, while `k > 0`:
- if `k` is odd, apply `g` once: `x` becomes `g(x)` and `k` decreases by 1. The invariant still holds, since `g` applied `k` times to `x` is `g` applied `k − 1` times to `g(x)`;
- `k` is now even: applying `g` `k` times is applying `g ∘ g` `k / 2` times. Replace `(a, b)` by the coefficients of `g ∘ g`, that is `(a × a mod M, (a × b + b) mod M)`, and `k` by `k / 2`.

When `k = 0`, the invariant says that the result is `x` itself (zero applications): print it.

**Termination and cost.** `k` is a non-negative integer that strictly decreases at each turn (it is at least halved): the loop stops, after at most 60 turns for `K ≤ 10¹⁸ < 2⁶⁰`. So each question costs about sixty turns, against 10¹⁸ for the simulation. In C++, products like `a × x` get close to 10¹⁸: `long long` is needed, reducing modulo `M` after each product.
