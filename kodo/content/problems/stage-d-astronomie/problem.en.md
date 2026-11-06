---
title: The astronomy course
---

## Statement
At the Valcorde observatory, Nathan writes down every night the constellation that is the most visible, coded by a lowercase letter. His notebook covers N consecutive nights: it is a string of N letters, the i-th letter corresponding to night number i.

Next year, he wants to run a course over several consecutive nights, on the same dates. During the course, the students must be able to observe **all** the constellations that appear in the notebook, each one on at least one night.

Write a program that finds the shortest possible course. If there are several courses of minimum length, choose the one that starts the earliest.

## Input
- The first line contains an integer N.
- The second line contains the notebook: N lowercase letters written together.

## Output
Two integers separated by a space: the minimum length of the course (in nights), then the number of its first night (nights are numbered from 1 to N).

## Constraints
- 1 ≤ N ≤ 100 000
- The notebook only contains letters from `a` to `z`.

## Hints
1. Start by counting the number of different letters in the notebook: that is the number of constellations the course must contain.
2. Use a window of nights `debut..fin` (French for "start..end") and an array that counts how many times each letter appears in the window. Also keep the number of different letters present in the window, so you don't recompute it every time.
3. Move `fin` forward one night at a time. As soon as the window contains all the constellations, record it if it is shorter than the best one found, then move `debut` forward to try to shorten it, and repeat as long as it still contains everything.

## Solution
**The idea: a sliding window with counters.** Let `a_voir` ("to see") be the number of different letters in the notebook. We move `fin` forward night by night, and we keep up to date:
- `compte[c]` ("count"), the number of nights in the window `debut..fin` on which constellation c is visible;
- `vues` ("seen"), the number of different constellations present in the window (it goes up when a counter goes from 0 to 1, and down when a counter falls back to 0).

After adding night `fin`, as long as `vues == a_voir`, the window is a valid course: we compare it with the best one, then we remove night `debut` and move `debut` forward. When the loop stops, `debut` has gone past the start of the shortest valid course that ends on night `fin`.

Why does `debut` never need to move back? We only move `debut` past a night l when the window that starts at l contains everything: that course has then been recorded. Any course that also starts on night l but ends later is longer, so it is never better.

**Breaking ties.** Courses are examined by increasing `fin`, and for the same length, a smaller `fin` means a smaller `debut`. By replacing the best course only when the new length is **strictly** smaller, we keep the course that starts the earliest.

**Complexity.** `fin` and `debut` each move forward at most N times: O(N), with an array of 26 counters.

**Why the naive solution is too slow.** Trying every starting night and moving forward until everything has been seen costs about N × (length of the course). If two rare constellations only appear at the very beginning and at the very end of the notebook, the course covers almost everything: about N²/2 = 5 × 10⁹ operations.

**Traps.**
- Don't recompute the number of different letters in the window at every step (for example with `len(set(...))`): that is exactly what makes a solution slow. The counter `vues` is updated in constant time.
- Nights are numbered from 1: remember to add 1 to the start index before printing it.
