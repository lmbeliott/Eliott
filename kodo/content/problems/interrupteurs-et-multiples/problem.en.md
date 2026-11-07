---
title: Switches and multiples
---

## Statement
`N` lamps numbered from 1 to `N` are all off. `K` passes are made. On pass number `p` (for `p` going from 1 to `K`), the switch of every lamp whose number is a multiple of `p` is flipped: a lamp that is off turns on, a lamp that is on turns off. Print the number of lamps that are on at the end.

## Input
A single line containing `N` and `K`, separated by a space.

## Output
A single integer: the number of lamps on after the `K` passes.

## Constraints
- 1 ≤ K ≤ N ≤ 100,000

## Hints
1. An array of `N + 1` cells (cell 0 is unused) keeps the state of each lamp: `0` for off, `1` for on.
2. On pass `p`, there is no need to test every lamp: the multiples of `p` are `p`, `2p`, `3p`… Go through them directly with `range(p, N + 1, p)`.
3. Pass `p` touches about `N / p` lamps. In total, N/1 + N/2 + … + N/K stays around `12 × N` for `N = 100,000`: the simulation is fast.

## Solution
Simulate. An array `lampe` of `N + 1` cells, all 0, represents lamps 1 to `N`. For each pass `p` from 1 to `K`, go through the multiples of `p` with a step of `p` (`range(p, n + 1, p)` in Python, `j += p` in C++) and flip their state: `lampe[j] = 1 - lampe[j]`. At the end, count the cells equal to 1.

Testing for each lamp whether its number is a multiple of `p` would take `N × K` operations, up to 10¹⁰: far too many. By jumping directly from multiple to multiple, the total number of operations is N/1 + N/2 + … + N/K, about `N × 12` at most here.

A property to discover: when `K = N`, lamp number `x` is flipped once per divisor of `x`. It ends up on if `x` has an odd number of divisors, that is if `x` is a perfect square (divisors come in pairs `d` and `x / d`, except when `d × d = x`). The answer is then the number of squares between 1 and `N`. For `K < N`, there is no such simple formula any more, and the simulation does the work.
