---
title: Interleaving with the fewest blocks
---

## Statement
You are given two words `U` and `V`. An **interleaving** of `U` and `V` is a word obtained by mixing all the letters of `U` and all those of `V`, keeping the order of the letters of `U` among themselves and the order of the letters of `V` among themselves. For example, `aabba` is an interleaving of `aba` and `ab`: it can be read as `a` (from `U`), `a` (from `V`), `b` (from `U`), `b` (from `V`), `a` (from `U`).

A **block** is a maximal group of identical consecutive letters: `aabba` has three blocks, `aa`, `bb` and `a`.

Write a program that computes the minimum number of blocks of an interleaving of `U` and `V`.

## Input
- The first line contains the word `U`.
- The second line contains the word `V`.

Both words contain only lowercase letters from `a` to `z`.

## Output
A single integer: the minimum number of blocks of an interleaving of `U` and `V`.

## Constraints
- 1 ≤ length of `U` ≤ 600
- 1 ≤ length of `V` ≤ 600

## Hints
1. The number of blocks is `1` plus the number of places where two neighbouring letters differ. When you build the interleaving from left to right, what do you need to know about the part already built to know the cost of the next letter?
2. A beginning of an interleaving uses the first `i` letters of `U` and the first `j` letters of `V`. Its last letter is necessarily `U[i]` or `V[j]` (numbering from `1`): you only need to know which of the two words it comes from.
3. Compute `endU[i][j]` (and `endV[i][j]`): the minimum number of blocks of an interleaving of the first `i` letters of `U` and the first `j` letters of `V` that ends with a letter of `U` (of `V`). The added letter creates a new block only if it differs from the previous one.

## Solution
The number of blocks of a word is `1` plus the number of positions where a letter differs from the previous one. We build the interleaving from left to right: at each step, we take the next letter of `U` or the next letter of `V`, and it costs one more block if it differs from the last letter written.

**The state.** After writing the first `i` letters of `U` and the first `j` letters of `V`, the last letter written is `U[i]` or `V[j]`: nothing else is needed for what follows. So we define:
- `endU[i][j]`: the minimum number of blocks of an interleaving of the first `i` letters of `U` and the first `j` letters of `V` that ends with `U[i]`;
- `endV[i][j]`: the same thing, for an interleaving that ends with `V[j]`.

**Transitions.** To end with `U[i]`, the letter before is either `U[i − 1]` or `V[j]`:

`endU[i][j] = min(endU[i − 1][j] + (U[i − 1] ≠ U[i]), endV[i − 1][j] + (V[j] ≠ U[i]))`

where `(x ≠ y)` is `1` if the letters differ and `0` otherwise. It is symmetric for `endV[i][j]`. At the start, `endU[1][0] = endV[0][1] = 1`, and impossible states (for example `endU[0][j]`) are infinite. We fill the tables for increasing `i` and `j`; the answer is `min(endU[n][m], endV[n][m])`, where `n` and `m` are the lengths of the words.

In the first example, `aabba` has 3 blocks, and you cannot do better: `U = aba` is read in order inside the interleaving, and it already takes 3 blocks to go from `a` to `b` and back to `a`. In the second one, `aacbbb` (`aa` from `U`, `c` from `V`, `b` from `U`, then `bb` from `V`) has 3 blocks, the minimum since the three letters `a`, `b` and `c` all appear.

**Complexity.** **O(n × m)** states, each computed in constant time: 360,000 states for two words of 600 letters.

**Why other ideas fail.** There are a huge number of interleavings: for two words of 600 letters, more than 10³⁵⁰. A greedy that takes the letter equal to the last one when possible, and otherwise a letter of `U`, already fails on the second example: it writes `aab` then `cbb`, that is `aabcbb` with 4 blocks. The right choice depends on the whole rest of both words.

**Pitfalls.**
- You need two tables (or a third dimension): knowing only `i` and `j` does not tell you which letter was written last.
- For `endU[i][j]` with `i = 1`, the letter before can only come from `V` (if `j ≥ 1`): be careful at the edges of the tables.
