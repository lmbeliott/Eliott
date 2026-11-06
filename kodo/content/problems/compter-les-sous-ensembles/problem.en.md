---
title: The open slopes
---

## Statement
The Valcorde ski area has 16 slopes, numbered from `0` to `15`. Each of the resort's `N` season-pass holders has favourite slopes, and only comes skiing if **all** of their favourite slopes are open. Every evening, Awa, at the slopes office, announces which slopes will be open the next day and wants to predict how many pass holders will come.

A set of slopes is encoded as an integer between `0` and `65 535`: slope `p` belongs to the set if bit number `p` of the integer is `1`. For example, `13 = 1101` in binary encodes slopes `0`, `2` and `3`.

Write a program that answers Awa's `Q` forecasts: for each set of open slopes, the number of pass holders all of whose favourite slopes are open.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N` integers: the set of favourite slopes of each pass holder.
- The third line contains `Q` integers: for each forecast, the set of open slopes.

## Output
`Q` lines: for each forecast, in order, the number of pass holders who will come skiing.

## Constraints
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 10 000
- each set is an integer between `0` and `65 535`

## Hints
1. The pass holder with favourites `F` comes when the open slopes are `O` if `F` is a subset of `O`, that is if `F & O == F`. Testing every pass holder for each forecast means 10⁸ tests: too slow.
2. There are only 2¹⁶ = 65 536 possible sets. First count how many pass holders have exactly each set of favourites, then precompute the answer for **all** the sets `O`: `answer[O]` is the sum of the counts of all the subsets of `O`.
3. Listing the subsets of every `O` costs 3¹⁶ ≈ 4 × 10⁷ in total: still too much in Python. Instead, handle the bits one by one: for each bit `b` and each `m` that contains `b`, add to `answer[m]` the value of `answer[m without bit b]`.

## Solution
A pass holder with favourites `F` comes if `F ⊆ O`, which is tested with `F & O == F`. Testing every pass holder for each forecast costs O(N × Q) = 10⁸: too slow in Python.

Notice that there are only 2¹⁶ sets. We count `c[F]`, the number of pass holders whose favourites are exactly `F`. The answer for `O` is then `S[O] = sum of c[F] over F ⊆ O`. If we precompute `S` for all 65 536 sets, each forecast is read in O(1).

Computing `S[O]` by listing the subsets of each `O` (with the trick `F = (F - 1) & O`) costs the sum of `2^(number of bits of O)`, that is 3¹⁶ ≈ 4.3 × 10⁷ operations: fine in C++, too slow in Python.

We use the **sum over subsets**, a bit-by-bit dynamic programming. We start from `S = c`, then for each bit `b` from `0` to `15`:

> for each `m` whose bit `b` is `1`: `S[m] += S[m ^ (1 << b)]`.

After handling bits `0` to `b`, `S[m]` is the sum of the `c[F]` over the `F` that are subsets of `m` **and differ from `m` only on bits `0` to `b`**. Indeed, for an `m` whose bit `b` is `1`, these `F` split into those that have bit `b` (already counted in `S[m]`) and those that don't (counted in `S[m ^ (1 << b)]`). After all 16 bits, `S[m]` counts all the subsets of `m`, each exactly once.

Complexity: **O(16 × 2¹⁶ + N + Q)**, about a million operations.

Traps:
- `F = 0` (no favourite slope) is a subset of every set: this pass holder comes every day, even if all the slopes are closed.
- Several pass holders can have the same favourites: you must **count** them, not just mark them.
- In Python, `~O` is a negative number: to test inclusion, prefer `F & O == F` or `F | O == O`.
