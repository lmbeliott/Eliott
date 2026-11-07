---
title: Counting subsets
---

## Statement
A subset of `{0, 1, …, 15}` is encoded as an integer between `0` and `65 535`: element `p` belongs to the set if bit number `p` of the integer is `1`. For example, `13 = 1101` in binary encodes the set `{0, 2, 3}`.

You are given a list of `N` sets. Write a program that answers `Q` queries: for each given set `B`, the number of sets of the list that are **included** in `B`.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N` integers: the sets of the list.
- The third line contains `Q` integers: the sets of the queries.

## Output
`Q` lines: for each query, in order, the number of sets of the list included in the given set.

## Constraints
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 10 000
- each set is an integer between `0` and `65 535`

## Hints
1. Set `A` is included in `B` if `(A & B) == A`. Testing every set of the list for each query means 10⁸ tests: too slow in Python.
2. There are only 2¹⁶ = 65 536 possible sets. First count how many times each set appears in the list, then precompute the answer for **all** the sets `B`: `answer[B]` is the sum of the counts of all the subsets of `B`.
3. Listing the subsets of every `B` costs 3¹⁶ ≈ 4 × 10⁷ in total: still too much in Python. Instead, handle the bits one by one: for each bit `b` and each `m` that contains `b`, add to `answer[m]` the value of `answer[m without bit b]`.

## Solution
A set `A` is included in `B` if `A ⊆ B`, which is tested with `(A & B) == A`. Testing every set of the list for each query costs O(N × Q) = 10⁸: too slow in Python.

Notice that there are only 2¹⁶ sets. We count `c[A]`, the number of times set `A` appears in the list. The answer for `B` is then `S[B] = sum of c[A] over A ⊆ B`. If we precompute `S` for all 65 536 sets, each query is read in O(1).

Computing `S[B]` by listing the subsets of each `B` (with the trick `A = (A - 1) & B`) costs the sum of `2^(number of bits of B)`, that is 3¹⁶ ≈ 4.3 × 10⁷ operations: fine in C++, too slow in Python.

We use the **sum over subsets**, a bit-by-bit dynamic programming. We start from `S = c`, then for each bit `b` from `0` to `15`:

> for each `m` whose bit `b` is `1`: `S[m] += S[m ^ (1 << b)]`.

After handling bits `0` to `b`, `S[m]` is the sum of the `c[A]` over the `A` that are subsets of `m` **and differ from `m` only on bits `0` to `b`**. Indeed, for an `m` whose bit `b` is `1`, these `A` split into those that have bit `b` (already counted in `S[m]`) and those that don't (counted in `S[m ^ (1 << b)]`). After all 16 bits, `S[m]` counts all the subsets of `m`, each exactly once.

Complexity: **O(16 × 2¹⁶ + N + Q)**, about a million operations.

Traps:
- `A = 0` (the empty set) is included in every set: it counts for every query, even `B = 0`.
- Several sets of the list can be equal: you must **count** them, not just mark them.
- In C++, `==` has higher precedence than `&`: write `(A & B) == A`. Without parentheses, `A & B == A` means `A & (B == A)`.
