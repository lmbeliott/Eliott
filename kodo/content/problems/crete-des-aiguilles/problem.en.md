---
title: The Aiguilles ridge
---

## Statement
The Aiguilles ridge lines up `N` summits from west to east, numbered from `1` to `N`. Yanis's team is installing relay antennas there for the rescue radio. Each antenna needs a minimum altitude: the team starts from a given summit, walks east and stops at the **first** summit that is high enough, counting the starting summit itself.

During the season, the altitude readings change (snowfalls, rockfalls). Write a program that processes, in order, a sequence of operations of two kinds:
- `M i v` (`M` for *modification*): the altitude of summit `i` becomes `v`;
- `A i h` (`A` for *antenne*, "antenna"): an antenna must be placed starting from summit `i`; print the number of the first summit `j ≥ i` with altitude at least `h`, or `-1` if there is none.

## Input
- The first line contains two integers `N` and `Q`: the number of summits and the number of operations.
- The second line contains `N` integers: the initial altitudes of summits `1` to `N`.
- Each of the next `Q` lines contains one operation: the letter `M` or `A`, then two integers.

## Output
For each `A` operation, in order, one line containing the answer.

## Constraints
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 10 000
- 1 ≤ i ≤ N
- all altitudes (initial ones, `v` and `h`) are between `1` and `5 000`

## Hints
1. Walking through the summits one by one from `i` costs O(N) per question: 10⁸ operations in total in the worst case.
2. A segment tree where each node stores the **maximum** of its interval tells you with a single comparison whether a whole interval contains a summit that is high enough… and therefore lets you discard it in one go if it doesn't.
3. To find the first suitable summit: from leaf `i`, move from block to block to the right (going up) as long as the block's maximum is too small; in the first suitable block, go back down, each time choosing the left child if it is suitable, otherwise the right one.

## Solution
We build a **segment tree** over the altitudes where each node holds the maximum of its interval. With a size `T` that is a power of two, the leaves are at indices `T` to `2T - 1`, and node `k` has children `2k` and `2k + 1`. The extra leaves are `0`, an altitude smaller than any value of `h`.

**Modification** `M i v`: we change the leaf of summit `i`, then go up to the root recomputing each maximum. O(log N).

**Antenna** `A i h`: we look for the first summit `j ≥ i` with altitude `≥ h`, in two phases.
1. *Going up.* We start from the leaf `k` of summit `i`. As long as `max[k] < h`, the block of `k` contains no answer: we move to the block just to its right. To do so, as long as `k` is a right child (odd), we go up to its parent, then take `k + 1`. If we go up past the root (`k = 0`), there is no answer: `-1`.
2. *Going down.* The block found contains the answer. As long as `k` is not a leaf, we go to the left child if its maximum is `≥ h` (the leftmost answer is there), otherwise to the right child.

The blocks visited while going up are consecutive, cover everything to the right of `i` in order, and their size only grows: there are O(log N) of them. Going down also costs O(log N). Total complexity: **O(N + Q log N)**.

Why the other ideas fail:
- The direct scan costs O(N) per question, that is 10⁸ operations when all the answers are far away or `-1`.
- A binary search on `j`, with a maximum query on `[i, j]` at each step, works but costs O(log² N) per question: fine in C++, but slow in Python.
- Precomputing the answers doesn't work: each modification can change all of them.

Traps:
- The comparison is not strict: a summit with altitude exactly `h` is suitable, including summit `i` itself.
- After a modification, you must recompute **all** the ancestors of the leaf, even if the altitude decreased.
