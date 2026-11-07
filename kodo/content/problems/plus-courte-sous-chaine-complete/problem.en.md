---
title: Shortest complete substring
---

## Statement
You are given a string of N lowercase letters. A substring (a run of consecutive letters of the string) is **complete** if it contains at least once each of the letters that appear in the string.

Write a program that finds the shortest complete substring. If there are several of minimum length, choose the one that starts the earliest.

## Input
- The first line contains an integer N.
- The second line contains the string: N lowercase letters written together.

## Output
Two integers separated by a space: the minimum length of a complete substring, then the position of its first letter (positions are numbered from 1 to N).

## Constraints
- 1 ≤ N ≤ 100 000
- The string only contains letters from `a` to `z`.

## Hints
1. Start by counting the number of different letters in the string: that is the number of letters the substring must contain.
2. Use a window of positions `debut..fin` (French for "start..end") and an array that counts how many times each letter appears in the window. Also keep the number of different letters present in the window, so you don't recompute it every time.
3. Move `fin` forward one position at a time. As soon as the window contains all the letters, record it if it is shorter than the best one found, then move `debut` forward to try to shorten it, and repeat as long as it still contains everything.

## Solution
**The idea: a sliding window with counters.** Let `a_voir` ("to see") be the number of different letters in the string. We move `fin` forward one position at a time, and we keep up to date:
- `compte[c]` ("count"), the number of times letter c appears in the window `debut..fin`;
- `vues` ("seen"), the number of different letters present in the window (it goes up when a counter goes from 0 to 1, and down when a counter falls back to 0).

After adding position `fin`, as long as `vues == a_voir`, the window is a complete substring: we compare it with the best one, then we remove the letter at position `debut` and move `debut` forward. When the loop stops, `debut` has gone past the start of the shortest complete substring that ends at position `fin`.

Why does `debut` never need to move back? We only move `debut` past a position l when the window that starts at l contains everything: that substring has then been recorded. Any substring that also starts at l but ends further on is longer, so it is never better.

**Breaking ties.** Substrings are examined by increasing `fin`, and for the same length, a smaller `fin` means a smaller `debut`. By replacing the best substring only when the new length is **strictly** smaller, we keep the one that starts the earliest.

**Complexity.** `fin` and `debut` each move forward at most N times: O(N), with an array of 26 counters.

**Why the naive solution is too slow.** Trying every starting position and moving forward until everything has been seen costs up to N²/2 operations: from each start, you may have to scan the whole rest of the string (for example when a rare letter appears only once). For N = 100 000, that's about 5 × 10⁹ operations.

**Traps.**
- Don't recompute the number of different letters in the window at every step (for example with `len(set(...))`): that is exactly what makes a solution slow. The counter `vues` is updated in constant time.
- Positions are numbered from 1: remember to add 1 to the start index before printing it.
