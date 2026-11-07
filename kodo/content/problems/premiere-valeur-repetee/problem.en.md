---
title: First repeated value
---

## Statement
A sequence of `N` integers is read from left to right. Find the first moment when a value already met earlier is read: print that value and its position.

For example, in `5 3 8 3 5 8`, the value `3` at position 4 is the first one that has already been seen. Positions are numbered from 1.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
The repeated value and its position, separated by a space. If all values are different, print `AUCUNE`.

## Constraints
- 1 ≤ N ≤ 30,000
- 0 ≤ each integer ≤ 10⁹

## Hints
1. Read the values in order while remembering the ones already seen.
2. A set answers the question "has this value already been seen?" very fast. Test membership **before** adding the value.
3. As soon as a repetition is found, you can stop the loop with `break`.

## Solution
Go through the sequence while keeping a **set** `vues` ("seen") of the values already read. For each value `v`, at position `i`:

- if `v` is in `vues`, this is the first repetition: print `v` and `i`, and stop;
- otherwise, add `v` to `vues` and continue.

The order of the two operations matters: if you add `v` before testing, every value looks repeated as soon as it first appears.

Don't confuse this with "the first value that will be repeated later": in `4 1 2 1 4`, the answer is `1 4`, because reading meets the second `1` (position 4) before the second `4` (position 5).

With a list instead of the set, each test goes through all the values already seen: with 30,000 distinct values, that makes about 450 million comparisons.
