---
title: Complete a network
---

## Statement
A network has `N` vertices. `K` links already exist. Others can be built among `M` possible links, each with a cost. Print the minimum total cost of the links to build so that all vertices are connected to each other (directly or through other vertices), or `-1` if it is impossible.

## Input
- The first line contains `N`, `K` and `M`.
- Each of the next `K` lines contains two integers `A` and `B`: an existing link between `A` and `B`.
- Each of the next `M` lines contains three integers `A`, `B` and `C`: a link between `A` and `B` can be built for the cost `C`.

## Output
A single integer: the minimum cost, or `-1`.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ K ≤ 5,000
- 0 ≤ M ≤ 6,000
- 1 ≤ A, B ≤ N
- 1 ≤ C ≤ 10⁶

## Hints
1. Without existing links, this is a minimum spanning tree: Kruskal's algorithm.
2. An existing link is a link of cost 0.
3. So it is enough to first merge the endpoints of the existing links in the Union-Find, then run Kruskal on the possible links sorted by cost.

## Solution
Existing links are links of cost 0: we look for a minimum spanning tree of the graph containing all links, and we may choose to use every free link. So first **merge** their endpoints in the Union-Find. Then apply **Kruskal**: go through the possible links by increasing cost, and build each one that joins two different components. At the end, if more than one component remains, the answer is `-1`.

**Why it is correct.** This is Kruskal on the graph where existing links have cost 0: sorting puts these links first, and merging them first amounts to processing them first. Existing links that close a cycle are simply ignored, as in Kruskal. The cut property from the lesson guarantees that each link built belongs to a minimum spanning tree.

**Complexity.** O(M log M) for sorting, then Union-Find operations in nearly constant time.

**Pitfalls.** The total can exceed 2³¹ (thousands of links at 10⁶): `long long` in C++. The number of components is counted starting from `N` and subtracting 1 at each successful merge, existing links included. If `N = 1`, the answer is `0`.
