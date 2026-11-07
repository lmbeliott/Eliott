---
title: Direction of a sequence
---

## Statement
Read a sequence of `N` integers and tell how it varies, by looking at each value compared with the previous one:
- `CONSTANTE` (constant) if all the values are equal;
- `CROISSANTE` (increasing) if the sequence goes up at least once and never goes down;
- `DECROISSANTE` (decreasing) if it goes down at least once and never goes up;
- `AUCUNE` (none) if it goes up at least once and goes down at least once.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer.

## Output
A single word: `CONSTANTE`, `CROISSANTE`, `DECROISSANTE` or `AUCUNE`.

## Constraints
- 1 ≤ N ≤ 1 000
- −1 000 000 ≤ each value ≤ 1 000 000

## Hints
1. Two pieces of information are enough: "did the sequence go up at least once?" and "did it go down at least once?".
2. These are two flags, `up` and `down`, which start at `False`.
3. At the end, the four answers match the four possible combinations of the two flags.

## Solution
Read the first value, then compare each following value `x` with the previous one. If `x > previous`, set the flag `up` to true; if `x < previous`, set `down` to true; if they are equal, nothing changes. Once raised, a flag stays raised.

At the end:
- `not up and not down`: `CONSTANTE`;
- `up and not down`: `CROISSANTE`;
- `down and not up`: `DECROISSANTE`;
- `up and down`: `AUCUNE`.

The traps: a sequence such as `1 3 3 5` is increasing, because ties count neither as going up nor as going down; and a sequence with a single value is constant.
