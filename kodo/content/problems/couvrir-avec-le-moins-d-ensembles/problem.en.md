---
title: Cover with the fewest sets
---

## Statement
A town has `M` districts, numbered from `1` to `M`, and `N` possible sites for antennas. An antenna placed on site `i` covers a given list of districts. All districts must be covered with as few antennas as possible (at most one per site).

Compute this minimum number `K` of antennas, then the number of ways to choose `K` sites that cover every district.

## Input
- The first line contains two integers `N` and `M`.
- Each of the next `N` lines describes a site: an integer `L`, then `L` distinct district numbers.

## Output
Two integers on one line: `K`, then the number of choices of `K` sites that cover everything. If even the `N` antennas do not cover every district, print only `-1`.

## Constraints
- 1 ≤ N ≤ 18
- 1 ≤ M ≤ 30
- 0 ≤ L ≤ M

## Hints
1. There are `2^N` ways to choose sites, at most 262,144: all of them can be tried.
2. Encode a choice of sites by an integer whose bit `i` is 1 if site `i` is taken, and the set of covered districts by an integer on `M` bits. The union becomes a bitwise "or".
3. Recomputing the union of each choice from scratch costs `N` operations per choice. It can be deduced from the choice without its lowest bit, already computed.

## Solution
Encode the set of districts covered by site `i` as an integer `cover_i` whose bit `q − 1` is 1 if district `q` is covered. A choice of sites is a **mask** of `N` bits, from 0 to `2^N − 1`; the districts it covers are the "or" of the `cover_i` of the bits set to 1, and everything is covered when this "or" equals `2^M − 1`.

To avoid `N` operations per mask, fill an array `union[mask]` in increasing order: if `b` is the lowest bit of the mask (`mask & -mask`), of index `i`, then `union[mask] = union[mask − b] | cover_i`, and `mask − b` is smaller, hence already computed. The number of bits set in each mask is kept the same way. A last pass finds the smallest size `K` of a mask covering everything, then counts the masks of size `K` that cover everything.

**Complexity.** O(2^N): about 260,000 masks, a few operations each. Recomputing each union bit by bit would cost `N` times more, nearly 5 million operations, which is already slow in Python.

**Remark.** This problem, **set cover**, is known to be hard: no algorithm is known that solves it in polynomial time in general. Exhaustive enumeration is reasonable only because `N` is small.
