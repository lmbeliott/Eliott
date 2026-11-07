---
title: Composing two polynomials
---

## Statement
A polynomial of degree `n` is written `P(x) = p₀ + p₁x + p₂x² + … + pₙxⁿ`. It is represented by the list of its coefficients `p₀, p₁, …, pₙ`, starting with the constant term.

Given two polynomials `P` and `Q`, compute the coefficients of the **composed** polynomial `P(Q(x))`, obtained by replacing `x` with `Q(x)` in `P`.

For example, with `P(x) = 1 + x²` and `Q(x) = 1 + x`: `P(Q(x)) = 1 + (1 + x)² = 2 + 2x + x²`.

## Input
- The first line contains the degree `n` of `P`, then its `n + 1` coefficients `p₀ p₁ … pₙ`.
- The second line contains the degree `m` of `Q`, then its `m + 1` coefficients `q₀ q₁ … qₘ`.

## Output
A single line: the `n × m + 1` coefficients of `P(Q(x))`, from the constant term to the highest-degree term, separated by spaces.

## Constraints
- 0 ≤ n ≤ 5 and 0 ≤ m ≤ 5
- All coefficients are integers between -9 and 9.
- `pₙ ≠ 0` and `qₘ ≠ 0`.

## Hints
1. First write two functions on coefficient lists: `add(a, b)` and `multiply(a, b)`. In the product, the coefficient `a[i]` multiplied by `b[j]` contributes to the term of degree `i + j`.
2. To compose, use Horner's form: `P(y) = p₀ + y × (p₁ + y × (p₂ + … + y × pₙ))`. Start from `[pₙ]`, and for `i` going from `n - 1` down to 0, multiply by `Q` then add `[pᵢ]`.
3. The coefficients of the result can exceed 2³¹: in C++, use `long long`.

## Solution
Split the problem into three functions, each easy to check on its own.

- `add(a, b)` returns a new list whose length is the larger of the two lengths: the coefficient of degree `k` is `a[k] + b[k]`, taking 0 when a list is too short.
- `multiply(a, b)` returns a list of `len(a) + len(b) - 1` zeros, then, for each pair `(i, j)`, adds `a[i] × b[j]` to cell `i + j`. This is exactly distributivity: `(a₀ + a₁x)(b₀ + b₁x) = a₀b₀ + (a₀b₁ + a₁b₀)x + a₁b₁x²`.
- `compose(p, q)` applies **Horner's method**: `P(y) = p₀ + y(p₁ + y(p₂ + … + y pₙ))`. Start from `r = [pₙ]`, then, for `i` from `n - 1` down to 0, `r = add(multiply(r, q), [pᵢ])`. At the end, `r` holds `P(Q(x))`.

The degree of the result is exactly `n × m`, because its highest-degree coefficient is `pₙ × qₘⁿ`, which is not zero. The computed lists therefore have the right length, and you just print `r`.

The functions return new lists and do not modify their arguments: `q` can safely be reused at each turn. In C++, pass the arrays as `const vector<long long> &` to avoid copies, and return a `vector<long long>`.

Order of magnitude: the sum of the absolute values of the coefficients is at most 54 for each polynomial, so that of the result is at most 54 × 54⁵ ≈ 2.5 × 10¹⁰. This exceeds the limit of an `int` (about 2.1 × 10⁹), but fits easily in a `long long`.
