---
title: Occurrences up to one letter
---

## Statement
You are given a pattern `P` of length `M` and a text `T` of length `N`. A position `i` of `T` (numbered from `1`, with `i + M - 1 ≤ N`) is an **occurrence up to one letter** of `P` if the piece `T[i..i+M-1]` differs from `P` in at most one position.

For example, with `P = abca`, the piece `abba` qualifies (a single difference, in third position), but `acba` does not (two differences).

Write a program that prints all occurrences up to one letter of `P` in `T`.

## Input
- The first line contains the pattern `P`.
- The second line contains the text `T`.

Both words are made of lowercase letters.

## Output
- On the first line, the number `K` of occurrences up to one letter.
- On the second line, their `K` positions in increasing order, separated by spaces. This line is empty if `K = 0`.

## Constraints
- 1 ≤ M ≤ N ≤ 100 000

## Hints
1. If the piece starting at `i` differs from `P` in a single position `j`, then `T` and `P` agree before `j`, and they also agree after `j`. Measure, for each `i`, the length of the longest common beginning with `P`, and, for each possible end, the length of the longest common ending with `P`.
2. The Z-function of `P#T` gives in O(N + M) the longest common beginning of `P` and `T[i..]` for all `i`. For the common endings, apply the same idea to the reversed words.
3. With `start[i]` the longest common beginning at `i` and `end[j]` the longest common ending finishing at `j`, position `i` qualifies if and only if `start[i] + end[i + M - 1] ≥ M - 1`.

## Solution
For each position `i` of `T` (counted from `0` here), let:
- `start[i]`: the length of the longest common prefix of `P` and `T[i..]`;
- `end[j]`: the length of the longest common suffix of `P` and `T[..j]` (the part of `T` that ends at `j`).

**The criterion.** If `start[i] ≥ M`, the piece equals `P`. Otherwise, the first difference is at position `i + start[i]`. There is at most one difference if and only if everything after that letter agrees, that is, if the common ending of the piece with `P` covers the last `M - 1 - start[i]` letters. In both cases, the condition reads `start[i] + end[i + M - 1] ≥ M - 1`.

**Computing `start` and `end`.** Apply the Z-function to the word `P#T`, where `#` is a character absent from both words. For a position of `T`, the Z value is exactly `start[i]`, because the `#` stops any comparison beyond `M`. For `end`, do the same on reversed `P`, `#`, then reversed `T`: a common suffix becomes a common prefix. Then reverse the resulting array.

Complexity: **O(N + M)** for the two Z-functions, then O(1) per position.

Why simple ideas fail: comparing each window letter by letter and stopping at the second difference looks fast on a random text. But on a text made almost only of `a` and a pattern `aaa…a`, each comparison goes almost to the end: about N × M / 2, which is more than 10⁹ operations. Hashing with binary search (find the first difference, then compare the rest) also works, in O(N log M), but needs more care.

Traps:
- The separator `#` is essential: without it, a Z value could run past `P` into `T`.
- If `M = 1`, every position qualifies: the condition becomes `start[i] + end[i] ≥ 0`.
- When `K = 0`, the second line is empty, but the `0` must be printed.
