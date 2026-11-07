---
title: Paths through a bonus cell
---

## Statement
A grid has `H` rows and `W` columns. Cell `(l, c)` is in row `l` and column `c`, numbered from `1`. You start at cell `(1, 1)` and go to cell `(H, W)` using only steps to the right or down.

`K` cells are **traps**: a path must go through none of them. `B` other cells are **bonuses**.

Write a program that counts the paths that avoid every trap and go through at least one bonus. Since this number can be huge, print it modulo `1 000 000 007`.

## Input
- The first line contains four integers `H`, `W`, `K` and `B`.
- The next `K` lines each contain two integers `l` and `c`: a trap.
- The next `B` lines each contain two integers `l` and `c`: a bonus.

All these cells are different, and none of them is `(1, 1)` or `(H, W)`.

## Output
A single integer: the number of paths, modulo `1 000 000 007`.

## Constraints
- 1 ≤ H, W ≤ 100 000
- 0 ≤ K + B ≤ 1 500

## Hints
1. Without any special cell, the number of paths to go down `a` rows and right `b` columns is the binomial coefficient `C(a + b, a)`. With factorials and their inverses modulo `1 000 000 007`, it is computed in O(1).
2. Count the complement instead: (paths that avoid the traps) − (paths that avoid the traps **and** the bonuses). All that's left is to count paths that avoid a set of forbidden cells.
3. Sort the special cells. For a cell `i`, the number of paths from `(1, 1)` to `i` that touched no forbidden cell before is: all paths to `i`, minus, for each forbidden cell `j` before `i`, the paths whose **first** forbidden cell is `j`.

## Solution
**Counting without obstacles.** A path from `(l₁, c₁)` to `(l₂, c₂)` is a sequence of `l₂ - l₁` steps down and `c₂ - c₁` steps right, in any order. There are `C(d, l₂ - l₁)` of them with `d = (l₂ - l₁) + (c₂ - c₁)`, and `0` if `l₂ < l₁` or `c₂ < c₁`. We precompute the factorials up to `H + W` and their inverses. The first inverse comes from Fermat's little theorem, `x⁻¹ = x^(p-2) mod p`, and the others going backwards: `inv[i-1] = inv[i] × i`. Each coefficient then costs O(1).

**Avoiding a set of cells.** Sort the forbidden cells by row then column, and add the end cell last. Let `f[i]` be the number of paths from `(1, 1)` to cell `i` that touch no forbidden cell before `i`. A path that touches at least one has a **first** forbidden cell `j`, placed before `i` in the order. These paths are counted by `f[j] × paths(j → i)`. So:

`f[i] = paths(start → i) − sum over forbidden j before i of f[j] × paths(j → i)`.

**At least one bonus.** We do this computation twice, in the same loop. Once where only the traps are forbidden (`no_trap`), once where traps and bonuses are (`no_special`). The answer is `no_trap[end] − no_special[end]`, modulo `1 000 000 007`. Indeed, a path without traps either touches no bonus or touches at least one.

Complexity: **O(H + W + (K + B)²)**, about a million binomial coefficients.

Why simple ideas fail: filling the grid cell by cell costs `H × W = 10¹⁰` operations. Adding, for each bonus, the paths going through it counts several times the paths that touch several bonuses. Inclusion-exclusion over all subsets of cells is exponential. The complement and the "first forbidden cell" avoid both pitfalls.

Traps:
- Subtractions modulo give negative results in C++: add `MOD` before taking the remainder.
- Products of two numbers below `10⁹ + 7` exceed 2³¹: use `long long` and reduce after each multiplication.
- Sorting by (row, column) guarantees that every cell `j` that can come before `i` on a path is placed before `i`. You still have to check `column(j) ≤ column(i)`.
