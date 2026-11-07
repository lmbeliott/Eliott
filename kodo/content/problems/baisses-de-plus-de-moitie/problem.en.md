---
title: Drops of more than half
---

## Statement
The price of a product was recorded for N days: a₁, a₂, …, a_N. A **drop of more than half** is a pair of days i < j such that the price on day j is strictly less than half the price on day i, that is 2 × a_j < a_i.

Count the drops of more than half.

The prices are built by a formula, to keep the input short: a₁ = X, then a_{i+1} = (aᵢ × B + C) mod M. For example, with N = 5, X = 11, B = 21, C = 33 and M = 37, the prices are 11, 5, 27, 8, 16: only the pairs of days (1, 2) and (3, 4) are valid, since 2 × 5 < 11 and 2 × 8 < 27.

## Input
A single line: the five integers N, X, B, C and M.

## Output
The number of drops of more than half.

## Constraints
- 2 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Hints
1. Cut the sequence into two halves. A pair is either in the left half, or in the right half (count those recursively), or across: i on the left and j on the right.
2. For the pairs across, the order inside each half no longer matters: you can assume both halves are sorted, as in merge sort.
3. If both halves are sorted, when y grows in the right half, the first element x of the left half with x > 2y can only move to the right: two advancing indices are enough. Do this count before the merge, since the condition is not the sorting one.

## Solution
**Divide.** Adapt merge sort. The function receives a portion of the sequence, returns the sorted portion and the number of drops whose two days lie in the portion. A drop (i, j) has both days in the left half, or in the right half (recursive calls), or i is on the left and j on the right. For the latter, the condition i < j is automatic: only the values matter, not their positions within each half.

**Counting the pairs across.** After the recursive calls, the two halves g and d are sorted. For each y of d, in increasing order, we want the number of elements x of g with x > 2y. These elements form a suffix of g, starting at the first index i such that g[i] > 2y. When y grows, 2y grows, so this index never moves back: advance it while g[i] ≤ 2y, and add len(g) − i. This pass costs O(len(g) + len(d)). It cannot be done during the merge itself: the merge compares x with y, whereas a drop compares x with 2y.

**Merge, then cost.** Then merge g and d as in merge sort. Each level of recursion does linear work, and there are about log₂ N levels: O(N log N) overall, a few million operations. Comparing every pair would take 5 × 10⁹ comparisons for N = 100,000. In C++, 2y can reach 2 × 10⁹ and the answer 5 × 10⁹: `long long`.
