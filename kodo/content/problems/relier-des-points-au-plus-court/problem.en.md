---
title: Connect points as cheaply as possible
---

## Statement
We are given `N` points of the plane, with integer coordinates. Directly linking two points `(x₁, y₁)` and `(x₂, y₂)` costs `min(|x₁ − x₂|, |y₁ − y₂|)`: the smaller of the two distances, horizontal or vertical.

Print the minimum total cost of a set of links that allows going from any point to any other, possibly through other points.

## Input
- The first line contains `N`.
- Each of the next `N` lines contains two integers `x` and `y`: the coordinates of a point. Several points may coincide.

## Output
A single integer: the minimum cost.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ x, y ≤ 10⁹

## Hints
1. This is a minimum spanning tree of the complete graph, but that graph has 50 million edges.
2. A link of cost `min(dx, dy)` behaves like two parallel links, one of cost `dx`, the other of cost `dy`: the minimum tree keeps at most one of them, the cheaper.
3. Among the links of cost `dx`, only those between two consecutive points in the order of `x` can be useful: if `xᵢ ≤ xⱼ ≤ x_k`, the link from `i` to `k` is the most expensive of the triangle `i, j, k`.

## Solution
**Two links instead of one.** Replace each link `i – j` by two parallel links, of costs `|xᵢ − xⱼ|` ("horizontal") and `|yᵢ − yⱼ|` ("vertical"). A minimum spanning tree of this new graph never uses both parallel links, and when it uses one, it is the cheaper (otherwise we would swap them); so it has the same weight as a minimum tree of the original graph.

**Few useful links.** Sort the points by `x`. If `j` lies between `i` and `k` in this order, the horizontal link `i – k` costs `(xⱼ − xᵢ) + (x_k − xⱼ)`, at least as much as each of the horizontal links `i – j` and `j – k`. It is the heaviest of the cycle `i, j, k`: by the **cycle property** (an edge heavier than all other edges of a cycle, or tied with the heaviest, can be removed without changing the minimum weight), it can be removed. Removing first the links that span the most points (the two other links of the cycle are then still there), only the `N − 1` horizontal links between consecutive points in the order of `x` remain. The same holds for `y`. There remain `2(N − 1)` links, on which we apply **Kruskal**.

**Complexity.** Two sorts and Kruskal on `2N` edges: O(N log N). Kruskal on the complete graph would sort 50 million edges; Prim on the complete graph would compute 10⁸ distances, far too many for Python.

**Pitfalls.** Coinciding or aligned points give links of cost `0`, which is fine. For `N = 1`, the answer is `0`. The total never exceeds 10⁹ (the chain of neighbours in the order of `x` costs at most `max(x) − min(x)`), but differences are computed safely in `long long`.
