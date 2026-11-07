---
title: Repeated pattern without overlap
---

## Statement
You are given a word `S` of length `N` and an integer `K`. A word `W` is **K-repeated** in `S` if you can find `K` occurrences of `W` in `S` such that no two of them overlap.

Write a program that computes the greatest length `L` of a K-repeated word in `S`, then the smallest position where an occurrence of a K-repeated word of length `L` starts. Positions are numbered from `1`.

## Input
- The first line contains the integer `K`.
- The second line contains the word `S`, made of lowercase letters.

## Output
Two integers separated by a space: the length `L`, then the position.

## Constraints
- 1 ≤ N ≤ 50 000
- 1 ≤ K ≤ N
- At least one letter appears `K` times or more in `S`.

## Hints
1. If a word of length `L` is K-repeated, its prefix of length `L - 1` is too, with the same starting positions. What can you binary search on?
2. For a fixed length `L`, group equal windows of length `L` with a polynomial hash computed in O(1) per window. Within a group, taking occurrences from left to right, each one as soon as it doesn't overlap the previous one kept, gives the maximum.
3. With a modulus around 10⁹, different windows often share the same hash when there are 50 000 of them. With computations "modulo 2⁶⁴" by overflow, some specially built words always collide. Use a prime modulus around 2⁶¹, or two different moduli.

## Solution
**Binary search on the length.** If `W` of length `L` has `K` disjoint occurrences, its prefix of length `L - 1` has occurrences at the same positions, even shorter, so still disjoint. The property "there is a K-repeated word of length `L`" is therefore true up to some length, then false. Length `1` works (this is guaranteed) and `L` can't exceed `N / K`. About 16 tests are enough.

**Testing one length.** We compute the prefix hashes `h[i]` and the powers `B^i`. The window `S[i..i+L-1]` has hash `h[i+L] - h[i] × B^L` (modulo `M`), in O(1). We go through the positions in order and, for each hash, remember the last occurrence kept and the number of occurrences kept. A new occurrence at `i` is kept if `i ≥ last + L`. This **greedy** choice is optimal: taking the leftmost possible occurrence always leaves at least as much room for the following ones. For the requested position, we keep the first occurrence of each hash that reaches `K`.

Total: **O(N log N)** operations on hashes, with a dictionary (or a sort in C++).

**Collisions.** Two different windows can have the same hash. With 50 000 windows and a modulus `M ≈ 10⁹`, the "birthday paradox" makes a collision likely at every length tested: the tests contain such cases. Computing modulo 2⁶⁴ by integer overflow has another flaw. The Thue-Morse word of order 11 and its complement (`a` and `b` swapped) always have the same hash, whatever the base. One test uses this. The solution uses the prime modulus `2⁶¹ - 1`: the probability of a collision becomes negligible. In C++, the product of two 61-bit numbers is computed with `unsigned __int128`. Two moduli around 10⁹, combined, also work.

Why simple ideas fail: comparing windows directly (or storing them in a dictionary of strings) costs O(L) per window, so O(N × L) per length tested. The tests have answers longer than 10 000 letters, which means billions of operations.

Traps:
- What matters is not the number of occurrences but the number of **disjoint** occurrences: in `aaaaa`, the word `aaa` appears 3 times but is not 2-repeated.
- Compute `h[i+L] - h[i] × B^L` modulo `M` without getting negative results.
