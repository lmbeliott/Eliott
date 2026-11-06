---
title: Overtaking on the trail
---

## Statement
For the Valcorde cross-country ski race, `N` skiers set off one by one, in the order of their bib numbers: bib `1` starts first, then bib `2`, and so on up to `N`. At the finish, Mia writes down the bib numbers in the order in which the skiers cross the line.

An **overtaking** is any pair of skiers where the one who started first finishes after the other: bibs `a < b` form an overtaking if `b` finished before `a`. Write a program that counts the overtakings.

## Input
- The first line contains an integer `N`.
- The second line contains `N` distinct integers between `1` and `N`: the bib numbers in order of arrival.

## Output
A single integer: the number of overtakings.

## Constraints
- 1 ≤ N ≤ 20 000

## Hints
1. Comparing every pair means about 2 × 10⁸ comparisons: far too many in Python.
2. Go through the bibs in order of arrival. When bib `d` arrives, how many overtakings involve it together with skiers who have already arrived? You only need to know how many bibs already arrived are **larger** than `d`.
3. Maintain a Fenwick tree over the bib numbers: cell `d` is `1` if bib `d` has already arrived. A prefix sum then gives the number of bibs already arrived that are smaller than `d`.

## Solution
We go through the arrival list. When bib `d` crosses the line in position `i` (counting from `0`), `i` skiers have already arrived. Those with a bib larger than `d` started after it and finished before it: each of them forms an overtaking with `d`. Adding this number for every skier counts each overtaking exactly once (when the second of the two arrives).

So we need to answer quickly "how many bibs already arrived are smaller than `d`?" while adding the bibs one by one. That is exactly what a **Fenwick tree** over the array `vu[1..N]` does (`vu`, "seen": `vu[d] = 1` if `d` has arrived):
- `somme(d)` ("sum") gives the number of bibs already arrived between `1` and `d`, in O(log N);
- `ajoute(d)` ("add") sets `vu[d]` to `1`, in O(log N).

The number of overtakings due to `d` is `i - somme(d)`. Total complexity: **O(N log N)**.

The naive algorithm compares every pair: N(N - 1)/2, that is 2 × 10⁸ comparisons for `N = 20 000`.

This number is also called the **number of inversions** of a permutation; a modified merge sort can also compute it in O(N log N).

Traps:
- The result can reach N(N - 1)/2 ≈ 2 × 10⁸: it fits in a 32-bit `int`, but not by much; a `long long` is safer.
- The Fenwick tree is indexed from `1`: with index `0`, `i & -i` is `0` and the loop in `ajoute` never stops.
