---
title: Unique spanning tree
---

## Statement
A connected undirected graph has `N` vertices and `M` edges; each edge has a weight. Print the weight of a minimum spanning tree, then tell whether this tree is **unique**.

Two spanning trees are different if they do not have exactly the same edges; two parallel edges count as two different edges.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains three integers `A`, `B` and `W`: an edge of weight `W` joins `A` and `B`.

## Output
Two lines: the minimum weight of a spanning tree, then `OUI` (yes) if only one spanning tree has this weight, `NON` (no) otherwise.

## Constraints
- 1 ≤ N ≤ 8,000
- N − 1 ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N
- 1 ≤ W ≤ 10⁶
- the graph is connected

## Hints
1. If all weights are different, the tree is always unique. Difficulties come from edges of equal weight.
2. In Kruskal, process all edges of the same weight `w` together. Just before this group, an edge of the group is **useful** if its endpoints are in two different components.
3. The tree is unique if and only if, for each weight, the number of useful edges equals the number of edges Kruskal picks in the group.

## Solution
Apply **Kruskal**, processing edges **in groups of equal weight**. For a group of weight `w`, first count the **useful** edges: those whose endpoints are in different components before the group. Then process the group normally, counting the edges picked. If a group has more useful edges than picked edges, the tree is not unique.

**Why it is correct.** Let `G_(<w)` be the graph of edges of weight strictly less than `w`. Let `T` be any minimum spanning tree.

- *The edges of `T` of weight `< w` connect exactly the components of `G_(<w)`.* Otherwise an edge `e` of weight `< w` would join two parts that `T` only joins with an edge `f` of weight `≥ w` (on the path of `T` between the endpoints of `e`); swapping `f` for `e` would give a lighter tree.
- So an edge of weight `w` that is not useful would close a cycle with the lighter edges of `T`: `T` contains none of them. And `T` contains exactly as many edges of weight `w` as Kruskal picks, since in both cases they turn the components of `G_(<w)` into those of the edges of weight `≤ w`.
- If, for every weight, useful = picked, then `T` contains all useful edges of each weight, and nothing else: all minimum trees are equal.
- If a group has a useful edge `e` that was not picked, run Kruskal again with `e` first in its group: it is picked. Kruskal gives a minimum tree whatever the order of ties, and this second tree contains `e`, the first does not: there are at least two.

**Complexity.** O(M log M) for sorting, then two passes per group with the Union-Find.

**Pitfalls.** Count the useful edges **before** merging anything in the group: after the first merges, a useful edge may look useless. Two parallel edges of the same weight, both useful, make the tree non-unique. A loop is never useful. The weight can exceed 2³¹: `long long` in C++. For `N = 1`, the empty tree is unique, of weight `0`.
