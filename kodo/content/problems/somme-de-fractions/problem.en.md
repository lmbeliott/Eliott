---
title: Sum of fractions
---

## Statement
Compute the sum of `N` positive fractions and write it in **lowest terms**: `P/Q` where `P` and `Q` have no common divisor other than 1.

For example, 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6, which is written `1/1` in lowest terms.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains two integers `A` and `B`, separated by a space: the fraction `A/B`.

## Output
A single line: `P/Q`, the sum in lowest terms (with `Q = 1` if the sum is an integer).

## Constraints
- 1 ≤ N ≤ 20
- 1 ≤ A ≤ 100
- 1 ≤ B ≤ 30
- The fractions of the input are not necessarily in lowest terms.

## Hints
1. `a/b + c/d = (a × d + c × b) / (b × d)`. Write a function `gcd(a, b)` (Euclid's algorithm) to simplify the result.
2. Write a function that adds two fractions and returns the **simplified** sum: two values to return, with `return p, q` in Python and reference parameters in C++.
3. In C++, if you only simplify at the end, the denominator can reach 30²⁰ and overflow `long long`. Simplifying after each addition keeps the numbers small.

## Solution
Keep the running sum as a fraction `p/q`, starting from `0/1`. For each fraction `a/b` read, a function `add(p, q, a, b)` computes the numerator `p × b + a × q` and the denominator `q × b`, then divides both by their GCD. At the end, print `p/q`.

The function `gcd` is Euclid's algorithm from the lesson: while `b ≠ 0`, replace `(a, b)` with `(b, a % b)`.

Why simplify at each step? The denominator of the sum in lowest terms always divides the LCM of the `B`, which is at most 2,329,089,562,800 (the LCM of 1, 2, …, 30). If you simplify after each addition, the numbers stay of that order, and the products stay well below 9 × 10¹⁸, the limit of `long long`. Without simplifying, the denominator would be the product of the `B`, up to 30²⁰ ≈ 3.5 × 10²⁹: in C++, the computation would overflow and give a wrong result. Python has no limit, but the principle is still the right one.

The function that adds two fractions must return two numbers: in Python, `return p // d, q // d` and `p, q = add(p, q, a, b)`; in C++, `p` and `q` are passed by reference (`long long &p, long long &q`) and the function modifies them directly.
