---
title: h-index
---

## Statement
Someone has published `N` papers; paper `i` has been cited `Cᵢ` times. Their **h-index** is the largest integer `h` such that at least `h` papers have each been cited at least `h` times.

For example, with the citations `3 0 6 1 5`, the index is 3: three papers have at least 3 citations, but there are not four papers with at least 4 citations.

## Input
The first line contains `N`. The second line contains `C₁, …, C_N`, separated by spaces.

## Output
A single integer: the h-index.

## Constraints
- 1 ≤ N ≤ 25,000
- 0 ≤ Cᵢ ≤ 10⁹

## Hints
1. Trying each `h` from 0 to `N` and counting again each time the papers cited at least `h` times costs about N² operations.
2. The index never exceeds `N`. A paper cited 10⁹ times counts exactly like a paper cited `N` times.
3. Counting-sort the values `min(Cᵢ, N)`, then go through `h` from `N` down to `0`, accumulating the number of papers cited at least `h` times.

## Solution
The index is at most `N`, since at least `h` papers are needed. For a threshold `h ≤ N`, a paper cited more than `N` times is cited at least `h` times, just like a paper cited exactly `N` times: each `Cᵢ` can be replaced by `min(Cᵢ, N)` without changing the answer. The values are then between 0 and `N`, and a **counting sort** is possible: `cpt[v]` is the number of papers with value `v`.

Then go through `h = N, N − 1, …, 0`, keeping `au_moins` ("at least") up to date: the number of papers cited at least `h` times. Going from `h + 1` to `h`, add `cpt[h]` to it. The first `h` met such that `au_moins ≥ h` is the largest that works, since you go down from `N`. You always find one: `h = 0` works.

**Cost.** One pass to count, one pass to go down: about 2N operations. Another solution sorts the citations in decreasing order, `D₁ ≥ D₂ ≥ …`, and looks for the largest `h` such that `D_h ≥ h`; it is a bit slower because of the sort, but just as correct. The trap is to create a counting array of size 10⁹.
