---
title: The ridge zip line
---

## Statement
The ridge trail is described step by step by a sequence of N letters: `M` when the trail goes up by one metre (*monte*), `D` when it goes down by one metre (*descend*), and `P` when it stays flat (*plat*). Markers stand all along the trail: marker 0 at the start, then marker i just after the i-th step. So there are N + 1 markers, numbered from 0 to N.

Sofia, the mountain guide, wants to install a zip line: a cable that leaves from a marker i and arrives at a marker j further along the trail (i < j), going down by exactly K metres. In other words, the altitude of marker i must be K metres higher than the altitude of marker j.

Write a program that counts the number of possible pairs of markers (i, j).

## Input
- The first line contains two integers N and K.
- The second line contains N letters written together, each one `M`, `D` or `P`.

## Output
A single integer: the number of pairs (i, j) with 0 ≤ i < j ≤ N such that the altitude of marker i minus the altitude of marker j is exactly K.

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ N

## Hints
1. First compute the altitude of every marker, starting from `0` for marker 0. Testing every pair of markers would take about 5 billion comparisons: you need something better.
2. Go through the markers in order. For a marker j at altitude h, the possible starting points are the markers already seen at altitude h + K. So it is enough to know how many markers already seen have each altitude.
3. Keep a dictionary `vues` (French for "seen"): `vues[h]` = number of markers already met at altitude h. For each marker j, add `vues[h + K]` to the total, then increase `vues[h]` by 1. Careful, the answer can be very large.

## Solution
**The idea: running altitudes and counting.** The altitude of marker i is a prefix sum: the number of `M` minus the number of `D` among the first i steps. We want to count the pairs i < j with `altitude[i] = altitude[j] + K`.

We go through the markers from 0 to N while updating a dictionary `vues`, where `vues[h]` is the number of markers already visited that are at altitude h. When we reach marker j, at altitude h, the possible starting markers are exactly the earlier markers at altitude h + K: we add `vues[h + K]` to the answer. Only then do we add marker j to the dictionary. This order guarantees that we only count pairs with i < j, and each of them only once.

On the example `MDDPMD` with K = 1, the altitudes of markers 0 to 6 are `0 1 0 -1 -1 0 -1`. Marker 6 (altitude −1) can receive a cable from markers 0, 2 and 5 (altitude 0), which makes 3 pairs; in total we find 9.

**Complexity.** A single loop of N + 1 steps, with constant-time dictionary operations: O(N).

**Why the naive solution is too slow.** Testing every pair of markers takes about N²/2 = 5 × 10⁹ comparisons for N = 100 000: hours in Python, and several seconds even in C++.

**Traps.**
- The answer can exceed 2³¹ (for example, 45 000 markers at altitude 0 followed by 55 000 markers at altitude −K give almost 2.5 billion pairs): use a `long long` in C++.
- Altitudes can be negative. A dictionary has no problem with that; in C++, you can also use an array of size 2N + 1 and shift the indices by N.
- Marker 0 counts too: don't forget to add it to the dictionary before the first step.
