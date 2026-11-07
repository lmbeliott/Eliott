---
title: Non-negative solutions of an equation
---

## Statement
In how many ways can boxes of A items and boxes of B items deliver exactly C items? In other words, count the pairs of integers (x, y), with x ≥ 0 and y ≥ 0, such that A × x + B × y = C. For example, for A = 4, B = 6 and C = 24, there are three pairs: (0, 4), (3, 2) and (6, 0).

Answer T questions.

## Input
The first line contains T. Each of the next T lines contains three integers A, B and C.

## Output
T lines: for each question, the number of pairs (x, y).

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ A, B ≤ 10⁹
- 0 ≤ C ≤ 10¹⁸

## Hints
1. Let g = GCD(A, B). If C is not a multiple of g, there is no solution. Otherwise, divide A, B and C by g.
2. After division, A × x ≡ C (mod B): x is determined modulo B by an inverse of A modulo B (extended Euclid). Let x₀ be the smallest non-negative possible value.
3. The solutions are x = x₀ + k × B for k ≥ 0, as long as A × x ≤ C (so that y is non-negative).

## Solution
**Reducing.** Let g = GCD(A, B). The left-hand side is a multiple of g, so there is no solution when g does not divide C. Otherwise, let a = A/g, b = B/g, c = C/g: the equation becomes a × x + b × y = c, with a and b coprime.

**The possible values of x.** If (x, y) is a solution, a × x ≡ c (mod b). The extended Euclidean algorithm gives u with a × u ≡ 1 (mod b), so x ≡ u × c (mod b). Conversely, if x ≡ u × c (mod b) and a × x ≤ c, then b divides c − a × x, and y = (c − a × x) / b is a non-negative integer. The solutions therefore correspond to the x = x₀ + k × b (k ≥ 0) with a × x ≤ c, where x₀ = (u × c) mod b is the smallest.

**Counting.** If a × x₀ > c, there is no solution. Otherwise, the condition a × (x₀ + k × b) ≤ c means k ≤ (c − a × x₀) / (a × b), and there are ⌊(c − a × x₀) / (a × b)⌋ + 1 solutions. The same computations can be done without dividing C: A × x₀ ≤ C and (C − A × x₀) / (A × b).

**Traps.** In C++, u can be negative: bring it back between 0 and b − 1. The product u × c can reach 10²⁷: reduce c modulo b before multiplying, and the products stay below 10¹⁸, like A × x₀ and A × b = LCM(A, B). **Cost**: O(log) per question. Trying every x from 0 to C / A would take up to 10¹⁸ steps.
