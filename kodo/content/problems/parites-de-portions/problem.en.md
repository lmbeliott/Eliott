---
title: Parities of segments
---

## Statement
A secret sequence of `N` bits `b₁, b₂, …, b_N` (each equal to `0` or `1`) is hidden. We receive `Q` statements, each of the form "the sum `b_L + b_(L+1) + … + b_R` is even" or "… is odd".

Print the largest integer `k` such that the first `k` statements can all be true at the same time, for one and the same sequence of bits.

## Input
- The first line contains `N` and `Q`.
- Each of the next `Q` lines contains three integers `L`, `R` and `P`: the sum from `b_L` to `b_R` has parity `P` (`0` for even, `1` for odd).

## Output
A single integer `k`, between `0` and `Q`.

## Constraints
- 1 ≤ N ≤ 10⁹
- 1 ≤ Q ≤ 8,000
- 1 ≤ L ≤ R ≤ N
- P is `0` or `1`

## Hints
1. With prefix sums `S_x = b₁ + … + b_x` (and `S₀ = 0`), a statement concerns only two numbers: `S_R − S_(L−1)` has parity `P`. Only the parities of the `S_x` matter.
2. "`S_i` and `S_j` have the same parity" or "different parities": these relations combine as in a Union-Find, but with two kinds of links.
3. Create two vertices per prefix `x`: "`S_x` is even" and "`S_x` is odd". "Same parity" joins even–even and odd–odd; "different parities" joins even–odd and odd–even. A statement is contradictory if its two possible conclusions are already in incompatible components.

## Solution
**Parities of prefixes.** Let `S_x = b₁ + … + b_x`, with `S₀ = 0`. Statement `(L, R, P)` says exactly that `S_R − S_(L−1)` has parity `P`, that is, `S_(L−1)` and `S_R` have the same parity if `P = 0`, different parities if `P = 1`. Conversely, any choice of the parities of the `S_x` (with `S₀` even) gives a sequence of bits: `b_x` is the parity of `S_x − S_(x−1)`. So the question is whether "same parity / different parity" relations between prefixes are compatible.

**Two vertices per prefix.** For each prefix `x`, create vertices `(x, 0)` ("`S_x` is even") and `(x, 1)` ("`S_x` is odd"). The relation "`S_i` and `S_j` differ by `P`" becomes two unions: `(i, 0)` with `(j, P)`, and `(i, 1)` with `(j, 1 − P)`. Two vertices are in the same component exactly when one **implies** the other: if `(i, a)` and `(j, c)` are joined, then the parity of `S_i` is `a` if and only if that of `S_j` is `c`. A new statement `(i, j, P)` is contradictory exactly when `(i, 0)` is already joined to `(j, 1 − P)`: the previous statements force the opposite parity. Otherwise, choosing a consistent value for each component (a component and its "twin", obtained by swapping 0 and 1, get opposite values) gives parities that satisfy everything; flipping all values if needed, `S₀` is even. Stop at the first contradiction.

**Positions up to 10⁹.** An array of size `N` is impossible. Only the prefixes mentioned matter: at most `2Q`. A dictionary gives them numbers `0, 1, 2, …` at their first appearance.

**Complexity.** O(Q) dictionary and Union-Find operations. Rechecking all statements with a traversal after each new one, as when colouring a graph with two colours, would cost O(Q²).

**Pitfalls.** The prefix to use is `L − 1`, not `L`. A statement may be repeated; if it is repeated with the other parity, it is a contradiction. The answer is `Q` when everything is consistent.
