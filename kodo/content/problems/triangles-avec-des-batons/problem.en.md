---
title: Triangles with sticks
---

## Statement
There are `N` sticks with lengths `L₁, …, L_N`. Count the ways to choose three sticks (three different positions) that can form a real triangle, that is, a triangle that is not flat.

Three lengths `a ≤ b ≤ c` form a real triangle if and only if `a + b > c`.

## Input
The first line contains `N`. The second line contains `L₁, …, L_N`, separated by spaces.

## Output
A single integer: the number of choices of three sticks that form a real triangle.

## Constraints
- 1 ≤ N ≤ 2,000
- 1 ≤ Lᵢ ≤ 10⁶

## Hints
1. Trying all triples costs N³ / 6, more than 10⁹ attempts: too many.
2. Sort the lengths. Fix the longest side `c = L[k]`, then count the pairs `i < j < k` such that `L[i] + L[j] > c`.
3. Two indices: `g = 0` and `d = k − 1`. If `L[g] + L[d] > c`, then each `i` between `g` and `d − 1` works with `d`. Otherwise, `g` works with no `j ≤ d`.

## Solution
Sort: `L[0] ≤ L[1] ≤ … ≤ L[N − 1]`. A choice of three sticks is written in exactly one way `i < j < k` in the sorted order, and it forms a real triangle if and only if `L[i] + L[j] > L[k]`: count these triples.

For each `k`, count the pairs `i < j < k` with two indices `g = 0` and `d = k − 1`. While `g < d`:

- if `L[g] + L[d] > L[k]`, then for every `i` from `g` to `d − 1`, `L[i] + L[d] ≥ L[g] + L[d] > L[k]`: the `d − g` pairs `(i, d)` work. Add them, and move `d` back, since all its remaining pairs have been counted;
- otherwise, for every `j` from `g + 1` to `d`, `L[g] + L[j] ≤ L[g] + L[d] ≤ L[k]`: stick `g` forms a valid pair with no remaining `j`. Move `g` forward.

Each step discards an index whose remaining pairs have been fully handled: each valid pair is counted exactly once.

**Cost.** For each `k`, `d − g` decreases by 1 at each step: at most `k` steps. In total, about N² / 2 = 2 million steps, against more than a billion triples. The result can reach `N × (N − 1) × (N − 2) / 6`, about 1.3 × 10⁹, close to the limit of an `int`: a `long long` is wise in C++. The trap: forgetting to sort, or writing `≥` instead of `>` (a flat triangle does not count).
