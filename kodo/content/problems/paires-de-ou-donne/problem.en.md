---
title: Pairs with a given OR
---

## Statement
You are given `N` integers `A[1]`, …, `A[N]`, all between `0` and `65 535` (they fit in `16` bits). The **OR** of two integers is the integer whose each bit is `1` if that bit is `1` in at least one of them (operator `|` in Python and C++). For example, `5 | 3 = 7`, since `101 | 011 = 111` in binary.

You are also given `Q` queries. Write a program that prints, for each query `X`, the number of index pairs `i < j` such that `A[i] | A[j] = X`.

## Input
- The first line contains the integer `N`.
- The second line contains the `N` integers `A[1]`, …, `A[N]`.
- The third line contains the integer `Q`.
- The fourth line contains the `Q` integers `X` of the queries.

## Output
`Q` lines: for each query, in order, the number of pairs `i < j` such that `A[i] | A[j] = X`.

## Constraints
- 1 ≤ N ≤ 15 000
- 1 ≤ Q ≤ 5 000
- 0 ≤ A[i] < 65 536
- 0 ≤ X < 65 536

## Hints
1. It is easier to count the pairs whose OR is **included** in `X` (all its `1` bits are also `1` in `X`): this happens exactly when `A[i]` and `A[j]` are both included in `X`. If `F[X]` values are included in `X`, there are `F[X] × (F[X] - 1) / 2` such pairs.
2. To compute `F` for all `65 536` masks at once, handle the bits one by one: after the step for bit `b`, `F[m]` counts the values that agree with `m` on the bits above `b`, and are included in `m` on the bits up to `b`. The step does `F[m] += F[m without bit b]` for each `m` that has bit `b`.
3. You now know `G[X]`, the number of pairs whose OR is included in `X`. To keep only those whose OR is exactly `X`, do the same thing backwards: for each bit `b`, `G[m] -= G[m without bit b]`.

## Solution
Say that a mask `y` is **included** in `m` if `y | m = m`. The OR of two values is included in `m` if and only if both values are.

**Counting included values.** Let `F[m]` be the number of values `A[i]` included in `m`. Computing it by going through all submasks of each `m` would cost 3¹⁶ ≈ 4 × 10⁷ operations. Instead, proceed **bit by bit**, like a dynamic programming. Initially, `F[m]` is the number of values equal to `m`. After handling bits `0` to `b`, `F[m]` counts the values equal to `m` on the bits above `b`, and included in `m` on bits `0` to `b`. To move to bit `b`, each `m` that has this bit receives `F[m without bit b]`, that is, the values with a `0` there. After the `16` bits, `F[m]` is indeed the number of values included in `m`. Cost: 16 × 2¹⁶ ≈ 10⁶ operations.

**From "included" pairs to "equal" pairs.** `G[m] = F[m] × (F[m] - 1) / 2` counts the pairs whose OR is included in `m`. Let `H[y]` be the number of pairs whose OR is exactly `y`. Then `G[m]` is the sum of `H[y]` over the `y` included in `m`: it is the same transformation as for `F`. To undo it, go through the bits one by one again, **subtracting**: for each `m` that has bit `b`, `G[m] -= G[m without bit b]`. Each step exactly cancels the matching step of the forward pass (the steps act on different bits, so their order does not matter). At the end, `G[m] = H[m]`, and each query is answered in O(1).

Complexity: **O(N + 16 × 2¹⁶ + Q)**.

Why simple ideas fail: trying all pairs costs N² / 2 ≈ 1.1 × 10⁸ operations, too many for Python. Grouping equal values does not help: one of the large tests has more than 13 000 distinct values. For each query, going through all its submasks and all pairs of submasks costs up to 3¹⁶ operations per query.

Traps:
- A pair uses two **different** indices: it is `F × (F - 1) / 2`, not `F²`.
- Subtracting from `G[X]` only the `G[X without one bit]` is not enough: a pair whose OR has two bits fewer than `X` would be subtracted twice. You really need the `16` passes, one per bit.
- The passes go through **all** masks from `0` to `65 535`, even those equal to no value.
