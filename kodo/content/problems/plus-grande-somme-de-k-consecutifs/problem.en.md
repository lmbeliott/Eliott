---
title: Largest sum of K consecutive values
---

## Statement
In a sequence of `N` integers, whose positions are numbered from 1 to `N`, find `K` consecutive values whose sum is as large as possible. Print this sum, then the position of the first of these `K` values. If several groups give the same maximal sum, choose the one that starts first.

## Input
The first line contains `N` and `K`. The second line contains the `N` integers, separated by spaces.

## Output
A single line with two integers separated by a space: the largest sum, then the position where the group starts.

## Constraints
- 1 ≤ K ≤ N ≤ 30,000
- Each integer is between −1,000 and 1,000.

## Hints
1. There are `N − K + 1` possible groups. Recomputing the sum of each one with a loop of `K` turns takes up to about 225 million additions: too slow.
2. Compare two neighbouring groups: the one starting at index `i + 1` contains almost the same values as the one starting at `i`.
3. Going from the group starting at `i` to the one starting at `i + 1`, you lose `t[i]` and gain `t[i + K]`. So the new sum is `somme - t[i] + t[i + K]`.

## Solution
Compute the sum of the first group, `t[0] + … + t[K − 1]`, with a loop. Then **slide** the window one cell at a time: to go from the group starting at index `i` to the one starting at `i + 1`, remove `t[i]`, which leaves the window, and add `t[i + K]`, which enters it. Each new sum costs two operations instead of `K`. At each step, compare the sum with the best one found, with a strict `>` to keep the leftmost group in case of a tie.

The program makes about `N` operations instead of `N × K`. The index `i + K` must stay inside the array: the loop makes `i` go from 0 to `N − K − 1`, and the group obtained starts at index `i + 1`, that is at position `i + 2`. Watch the shift between indices and positions in the output, and the initialisation of the maximum: sums can be negative, so start from the sum of the first group, not from 0.
