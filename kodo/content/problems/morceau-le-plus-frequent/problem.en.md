---
title: Most frequent piece
---

## Statement
A word `S` of `N` lowercase letters and an integer `K` are given. Among all the substrings of `S` of length exactly `K`, find the one that occurs most often, occurrences being allowed to overlap. In case of a tie, choose the smallest one in alphabetical order.

For example, in `abababa` with `K = 3`, `aba` occurs 3 times and `bab` 2 times.

## Input
- The first line contains `N` and `K`.
- The second line contains the word `S`.

## Output
The chosen substring and its number of occurrences, separated by a space.

## Constraints
- 1 ≤ K ≤ N ≤ 100,000
- K ≤ 10

## Hints
1. There are exactly `N − K + 1` substrings of length `K`, one per starting position.
2. Counting the occurrences of each one by scanning the whole word would take about `N²` comparisons: too slow.
3. A dictionary mapping each substring to its number of occurrences can be filled in a single pass.

## Solution
The substrings of length `K` are the slices `S[i:i + K]` for `i` from 0 to `N − K` (in C++, `S.substr(i, K)`). Go through them once, and a dictionary counts how many times each one occurs. Each occurrence is counted exactly once, when its starting position is visited: at the end, the dictionary holds the exact number of occurrences of each substring, overlaps included.

Then go through the dictionary to find the largest counter. Replace the current best when the counter is larger, or when it is equal and the substring is smaller in alphabetical order (strings are compared with `<`). In C++, a `map<string, int>` visits its keys in increasing order: a strict `>` is then enough.

Cost: `N − K + 1` slices of `K ≤ 10` letters, plus one dictionary operation for each, that is at most about a million elementary operations. The naive approach, which recounts each substring by scanning the whole word, takes on the order of `N² × K` comparisons in the worst case, far too many for `N = 100,000`. The trap: `S.count(piece)` does not count overlapping occurrences (`"aaaa".count("aa")` is 2, not 3).
