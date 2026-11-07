---
title: Arcs without crossings
---

## Statement
`N` points lie on a line and are numbered from `1` to `N` from left to right. Point `i` carries a letter `C[i]` and an integer value `V[i]`, which may be negative.

You can join pairs of points **with the same letter** with arcs drawn above the line. Each point belongs to at most one arc, and two arcs must not cross: if `i < j` and `k < l` are joined, you can't have `i < k < j < l`. However, an arc may pass over another one (`i < k < l < j`).

An arc between points `i` and `j` is worth `V[i] × V[j]`. Write a program that computes the greatest possible total. Drawing no arc at all is allowed.

## Input
- The first line contains the integer `N`.
- The second line contains a word of `N` lowercase letters: the letter of each point.
- The third line contains the `N` integers `V[1]`, …, `V[N]`.

## Output
A single integer: the greatest total.

## Constraints
- 1 ≤ N ≤ 400
- −1 000 ≤ V[i] ≤ 1 000

## Hints
1. If the leftmost point is joined to point `k`, no arc can join the inside of this arc to the outside. The two pieces become independent.
2. Compute `f[l][r]`, the best total using only the points from `l` to `r`. Either `l` is joined to nothing, or it is joined to a point `k` with the same letter between `l + 1` and `r`.
3. `f[l][r] = max(f[l+1][r], max over k of V[l] × V[k] + f[l+1][k-1] + f[k+1][r])`. Compute the values of `l` from largest to smallest.

## Solution
**Splitting the problem.** Look at point `l`, the leftmost one of the range `l..r`. Either it is joined to nothing, and the range `l+1..r` remains. Or it is joined to a point `k` with the same letter. Since arcs don't cross, every other arc is then either entirely **under** the arc `(l, k)` (in `l+1..k-1`), or entirely **to the right** (in `k+1..r`). The two ranges are independent. This gives the interval recurrence:

`f[l][r] = max( f[l+1][r], max over k ∈ ]l, r], C[k] = C[l] of V[l] × V[k] + f[l+1][k-1] + f[k+1][r] )`

with `f = 0` for an empty range. The answer is `f[1][N]`.

**Order of computation.** `f[l][r]` uses ranges that start after `l`. So we compute the rows `l` from `N` down to `1`. There are O(N²) ranges, and each one tries O(N) values of `k`: **O(N³)**, about 10⁷ elementary operations for N = 400 in the worst case (a single letter).

In Python, to go fast, we swap the loops. For fixed `l` and `k`, the quantity `V[l] × V[k] + f[l+1][k-1]` doesn't depend on `r`. So we update the whole row `f[l][r]`, for `r ≥ k`, with a single list comprehension.

Why simple ideas fail: trying every set of non-crossing arcs takes exponential time. The greedy "join the pair with the largest product first" is wrong. In `abab` with values `8 9 8 9`, it joins the two `b`s (81), which happens to be optimal here, but the tests contain cases where an arc with a large product blocks two others that are worth more together.

Traps:
- Two negative values give a positive product: an arc between them can be worth it. An arc with a negative product is never useful, and the recurrence discards it by itself thanks to the case "`l` is joined to nothing".
- The inner range `l+1..k-1` is empty when `k = l + 1`.
