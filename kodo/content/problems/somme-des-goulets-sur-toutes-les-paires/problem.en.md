---
title: Sum of bottlenecks over all pairs
---

## Statement
A connected undirected graph has `N` vertices and `M` edges; each edge has a weight. The **bottleneck** of a path is the largest weight of its edges. For two vertices `u` and `v`, let `g(u, v)` be the smallest bottleneck of a path from `u` to `v`.

Print the sum of `g(u, v)` over all pairs of vertices `u < v`.

For example, in the first sample, to go from `1` to `4`, the direct edge has weight 7, the path `1 – 3 – 4` has bottleneck 6, and the path `1 – 2 – 3 – 4` has bottleneck 5: `g(1, 4) = 5`.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains three integers `A`, `B` and `W`: an edge of weight `W` joins `A` and `B`.

## Output
A single integer: the sum of `g(u, v)` for `1 ≤ u < v ≤ N`.

## Constraints
- 2 ≤ N ≤ 8,000
- N − 1 ≤ M ≤ 8,000
- 1 ≤ A, B ≤ N
- 1 ≤ W ≤ 10⁶
- the graph is connected

## Hints
1. There are up to 32 million pairs: they must be counted in batches, not one by one.
2. Add edges by increasing weight, as in Kruskal. When `u` and `v` become connected for the first time, what is `g(u, v)`?
3. When the edge of weight `w` merges two components of sizes `s` and `t`, it connects `s × t` pairs for the first time, and all of them have a bottleneck equal to `w`.

## Solution
Add edges by increasing weight to a Union-Find, as in **Kruskal**'s algorithm. When an edge of weight `w` joins two different components `A` and `B`, add `w × |A| × |B|` to the total, then merge.

**Why it is correct.** Take `a` in `A` and `b` in `B` at the moment the edge `e` of weight `w` merges them. *The bottleneck is at most `w`*: `A` and `B` are each connected by edges already added, of weight at most `w`, so the path from `a` to `b` through `e` only uses edges of weight at most `w`. *The bottleneck is at least `w`*: all edges of weight strictly smaller than `w` have already been added, and `a`, `b` are not connected yet; so every path from `a` to `b` contains an edge of weight at least `w`. Finally, each pair is counted exactly once: at the merge that connects it for the first time, and since the graph is connected, all pairs end up connected.

These merging edges form a minimum spanning tree, and `g(u, v)` is the largest weight on the path from `u` to `v` in this tree: this is the property of **minimum bottleneck paths** seen in the lesson.

**Complexity.** O(M log M) for sorting, plus the Union-Find operations. Computing `g(u, ·)` from each vertex would cost `N` traversals of the graph, more than 10⁸ operations.

**Pitfalls.** The sum reaches 32 million pairs × 10⁶: `long long` in C++, including for the product `w × |A| × |B|`, which overflows in `int`. Loops and parallel edges do no harm.
