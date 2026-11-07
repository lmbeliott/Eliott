---
title: Prefix of maximum weight
---

## Statement
You are given a word `S` of length `N`. For each length `k` from `1` to `N`, let `occ(k)` be the number of positions in `S` where an occurrence of the prefix of length `k` of `S` starts. Occurrences may overlap, and the prefix itself counts.

The **weight** of the prefix of length `k` is `k × occ(k)`.

Write a program that finds the prefix of maximum weight. If there is a tie, choose the shortest one.

## Input
A single line containing the word `S`, made of lowercase letters.

## Output
Two integers separated by a space: the length `k` of the chosen prefix, then its weight.

## Constraints
- 1 ≤ N ≤ 100 000

## Hints
1. The prefix of length `k` starts at position `i` exactly when the longest common prefix of `S` and the suffix starting at `i` has length at least `k`.
2. The Z-function gives this length `z[i]` for every position `i` at once, in O(N).
3. `occ(k)` is the number of `z[i]` greater than or equal to `k`. Count how many times each value appears in `z`, then build sums starting from `k = N`.

## Solution
Let `z[i]` be the length of the longest common prefix of `S` and the suffix `S[i..]`, with `z[0] = N`. The prefix of length `k` occurs at position `i` if and only if `z[i] ≥ k`. So `occ(k)` is the number of indices `i` with `z[i] ≥ k`.

The **Z-function** computes every `z[i]` in O(N). We keep the rightmost "box" `[g, d[` found so far, that is a piece `S[g..d-1]` equal to the start of `S`. For `i` inside the box, `S[i..d-1]` is a copy of `S[i-g..d-g-1]`, so `z[i]` is at least `min(d - i, z[i - g])`. We then extend letter by letter. Each successful comparison moves `d` forward, which guarantees linear time.

We then count `nb[v]`, the number of indices with `z[i] = v`. Going through `k` from `N` down to `1`, `occ(k) = occ(k + 1) + nb[k]`. We compute every weight and keep the maximum. Since we go from `N` down to `1` and replace the best on ties (`≥`), we keep the smallest `k`. Overall: **O(N)**.

Why simple ideas fail: counting the occurrences of each prefix separately costs O(N²) comparisons, and much more on a word like `aaaa…a`. Even the finer idea that keeps the list of occurrences of prefix `k` to deduce those of prefix `k + 1` does `z[0] + z[1] + … + z[N-1]` operations, about N²/2 = 5 × 10⁹ on `aaaa…a`.

Traps:
- The weight can exceed 2³¹ (`50 000 × 50 001` for `aaaa…a`): in C++, use `long long`.
- Don't forget the occurrence at position `0` (`z[0] = N`).
- On a tie in weight, the **shortest** prefix wins.

You can also use the KMP prefix function: each prefix `S[0..i]` contains, as borders, the prefixes of lengths `π[i]`, `π[π[i] - 1]`, and so on. Accumulating these counts from the longest lengths to the shortest gives the same `occ(k)`, also in O(N).
