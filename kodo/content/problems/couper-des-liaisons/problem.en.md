---
title: Cut links
---

## Statement
A network has `N` vertices and `M` links, numbered from `1` to `M`. We cut `Q` links, one after the other. After each cut, print the number of vertices of the largest connected component of the network.

## Input
- The first line contains `N`, `M` and `Q`.
- Each of the next `M` lines contains two integers `A` and `B`: the link joins `A` and `B`.
- The last line contains the numbers of the `Q` cut links, in the order of the cuts. They are all different.

## Output
One line of `Q` integers: the size of the largest component after each cut.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ Q ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N

## Hints
1. Union-Find can merge two components, but not split one. What if we watched the film backwards?
2. Start from the final network, where all cuts have been made. Going back in time, each cut becomes an **addition** of a link.
3. The answer after the `i`-th cut is the state of the network just before undoing this cut. Going backwards, the largest size can only increase.

## Solution
Cutting a link can split a component in two, and Union-Find cannot undo a union. But all cuts are known in advance: the problem can be solved **offline**, in **reverse order**.

First build the final network, with all links that will never be cut. Then go through the cuts from the last to the first: the current state is exactly the network after cut `i`, so record `reponse[i]`, the largest size; then **add** the link cut at step `i`, which gives the network just before this cut, that is, after cut `i − 1`. Finally print the answers in normal order.

**Why it is correct.** Invariant of the reverse loop: when processing `i`, the Union-Find contains exactly the links not cut after the first `i` cuts. This holds for `i = Q` (final network), and adding the link of step `i` makes it hold for `i − 1`. The largest size only grows during merges: keeping a maximum is enough.

**Complexity.** O(N + M + Q) Union-Find operations, in nearly constant time. Running a traversal of the network after each cut would cost `Q × (N + M)`, nearly 10⁹ operations.

**Pitfalls.** Link numbers start at `1`. A link `A – A`, or a link parallel to another one, changes nothing when cut. Do not forget isolated vertices: the largest component has at least 1 vertex.
