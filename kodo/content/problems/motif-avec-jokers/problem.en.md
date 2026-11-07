---
title: Pattern with wildcards
---

## Statement
A text `T` and a pattern `P` are made of lowercase letters, but the pattern may also contain **wildcards** `?`. A wildcard stands for any letter. The pattern occurs at position `i` of the text if each character of `P` is a wildcard or is equal to the letter of the text facing it, starting at position `i`.

Find all the positions where the pattern occurs. Occurrences may overlap. Positions are numbered from 1.

## Input
- The first line contains the text `T`.
- The second line contains the pattern `P`.

## Output
- On the first line, the number of occurrences of the pattern.
- If there is at least one, on the second line, their positions in increasing order, separated by spaces.

## Constraints
- 1 ≤ length of `T` ≤ 50,000
- 1 ≤ length of `P` ≤ 10 (the pattern may be longer than the text)

## Hints
1. The ready-made tools (`in`, `find`, `count`) know nothing about wildcards: you have to compare by hand.
2. For each possible starting position `i`, compare the pattern with the text character by character, and stop at the first mismatch.
3. The last possible starting position is `len(T) − len(P)` (as an index, from 0). If the pattern is longer than the text, there is none.

## Solution
This is the naive search of the lesson, with a modified equality rule. For each starting index `i` from 0 to `n − m` (where `n` and `m` are the lengths of the text and of the pattern), advance an index `j` while `j < m` and `P[j]` is a wildcard or equals `T[i + j]`. If `j` reaches `m`, every character of the pattern has been checked: the pattern occurs at index `i`, that is at position `i + 1`. If `m > n`, the loop makes no turn and the answer is 0.

Why it is correct: the inner loop maintains the property "the first `j` characters of the pattern match the text starting at `i`". It stops either at the first mismatch (no occurrence) or when `j = m` (occurrence). Since every starting position is tried, no occurrence is missed, overlaps included.

Cost: at most `m` comparisons per starting position, so at most `(n − m + 1) × m ≤ 500,000` comparisons, which is fast. The worst case is a text like `aaaa…a` with the pattern `aaaaaaaaa?`, where every position takes `m` comparisons. The positions are stored in a list and printed at the end with `join` (in C++, build the line with `+=` or print as you go).
