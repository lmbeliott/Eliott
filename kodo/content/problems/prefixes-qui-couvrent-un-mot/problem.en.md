---
title: Prefixes that cover a word
---

## Statement
You are given a word `S` of length `N`. A prefix `U` of `S` **covers** `S` if every letter of `S` belongs to at least one occurrence of `U` in `S`. Occurrences may overlap or touch.

For example, `aba` covers `abaababaaba`: its occurrences start at positions `1`, `4`, `6` and `9`, and they cover letters `1` to `3`, `4` to `6`, `6` to `8` and `9` to `11`. On the other hand, `a` does not cover this word, because no occurrence of `a` contains a `b`.

Write a program that finds all lengths `L` (from `1` to `N`) such that the prefix of length `L` covers `S`.

## Input
A single line containing the word `S`, made of lowercase letters.

## Output
- On the first line, the number `K` of lengths that qualify.
- On the second line, these `K` lengths in increasing order, separated by spaces.

## Constraints
- 1 ≤ N ≤ 100 000

## Hints
1. The prefix of length `L` covers `S` if and only if two consecutive occurrences are at most `L` positions apart, and the last one ends at the end of the word. With the Z-function, the occurrences of the prefix of length `L` are the positions `i` where `z[i] ≥ L`.
2. Checking each length separately costs O(N) per length, so O(N²) on a word like `aaa…a`. Look instead at what changes when `L` grows by `1`: some positions disappear, and none appears.
3. Add a sentinel at position `N`, then keep the positions still present in a doubly linked list. When a position disappears, its two neighbours become consecutive: the largest gap can only grow. Length `L` qualifies when this largest gap is at most `L`.

## Solution
Let `z[i]` be the length of the longest common prefix of `S` and `S[i..]` (positions counted from `0`, with `z[0] = N`). The prefix of length `L` starts at `i` if and only if `z[i] ≥ L`. Let `O(L)` be the set of these positions.

**The criterion.** The occurrences of the prefix of length `L` cover `S` exactly when:
- two consecutive positions of `O(L)` are at most `L` apart (otherwise a letter between them is covered by nobody);
- the last position `p` of `O(L)` satisfies `p + L = N`.

Add to `O(L)` a sentinel at position `N`. Since `p + L ≤ N` for every occurrence, the second condition means that the gap between `p` and the sentinel is at most `L`. The criterion becomes: **the largest gap between two consecutive elements of `O(L) ∪ {N}` is at most `L`**. Position `0` is always in `O(L)`.

**Growing `L`.** When going from `L - 1` to `L`, remove from the set the positions where `z[i] = L - 1`, and add nothing. Keep the positions in a doubly linked list. Removing `i` links its predecessor `a` to its successor `b`, and the new gap `b - a` is larger than both old ones. So the largest gap only grows: a running maximum is enough, with no data structure. Each position is removed at most once. First group the positions by the value of `z[i]`, to know which ones to remove at each step.

Complexity: **O(N)** for the Z-function, then O(N) for all removals.

Why simple ideas fail: testing each length by walking through its occurrences costs O(N) per length. Restricting to the **borders** of `S` (the lengths `L` with `z[N - L] = L`) is not enough: `aaa…a` has `N` borders, and `aaa…abaaa…a` has tens of thousands that all fail, each after a long walk. In both cases, that is close to a billion operations or more.

Traps:
- Don't forget the condition on the end of the word: in `abaa`, the prefix `aba` only appears at the start, and the last letter is covered by no occurrence. The sentinel at `N` handles this case.
- `L = N` always qualifies: `K ≥ 1`.
- Gaps are measured between the **starts** of occurrences: two occurrences of length `L` that start `L` positions apart touch without leaving a hole.
