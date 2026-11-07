---
title: Difference constraints
---

## Statement
We look for integers `x₁, x₂, …, x_N` that satisfy `M` constraints, each of the form `x_B − x_A ≤ C`. The number `C` can be negative: `x₁ − x₃ ≤ −4` means that `x₃` exceeds `x₁` by at least 4.

If no choice of the `x_i` satisfies all the constraints, print `IMPOSSIBLE`. Otherwise, print the largest possible value of `x_N − x₁`, or `INFINI` if `x_N − x₁` can be as large as wanted.

## Input
- The first line contains `N` and `M`.
- Each of the next `M` lines contains three integers `A`, `B` and `C`: the constraint `x_B − x_A ≤ C`.

## Output
`IMPOSSIBLE`, `INFINI` or an integer.

## Constraints
- 1 ≤ N ≤ 300
- 0 ≤ M ≤ 3,000
- 1 ≤ A, B ≤ N
- −10⁶ ≤ C ≤ 10⁶

## Hints
1. `x_B ≤ x_A + C` looks like the inequality satisfied by distances after relaxing the arc `A → B` of length `C`. What do the constraints `x₂ − x₁ ≤ 5` and `x₃ − x₂ ≤ 2` say about `x₃ − x₁`?
2. Adding the constraints along a path from `1` to `N` gives `x_N − x₁ ≤ length of the path`. Along a cycle, it gives `0 ≤ length of the cycle`.
3. Lengths can be negative: Bellman-Ford. A cycle of negative length makes the system impossible; otherwise the answer is the distance from `1` to `N`, and `INFINI` if `N` cannot be reached from `1`.

## Solution
**Modelling.** Each constraint `x_B − x_A ≤ C` becomes an arc `A → B` of length `C`. For a path `1 → v₁ → … → N`, adding the constraints of its arcs makes the intermediate terms cancel: `x_N − x₁ ≤ length of the path`. For a cycle, the same sum gives `0 ≤ length of the cycle`.

**Impossible ⟺ negative cycle.** If a cycle has a negative length, the previous sum gives `0 ≤ negative`: no solution. Otherwise, add a fictitious source joined to each vertex by an arc of length `0`, and compute the distances `p(v)` from this source. They satisfy `p(B) ≤ p(A) + C` for each arc (the triangle inequality of distances): `x_v = p(v)` is a solution. In practice, the fictitious source amounts to **initialising all distances to 0**. Then run at most `N` rounds of Bellman-Ford: if there is still an improvement in round `N`, there is a negative cycle (without one, everything is stable after `N − 1` rounds, because a shortest path from the source has at most `N` arcs, the first of which is fictitious).

**The largest value.** Let `D(v)` be the distance from `1` to `v`. Every solution satisfies `x_N − x₁ ≤ D(N)`. Conversely, `x_v = min(D(v), p(v) − p(1) + T)` is a solution for any constant `T ≥ 0`: the minimum of two solutions is a solution, because `min(f, g)(B) ≤ min(f(A) + C, g(A) + C)`, and an infinite value of `D(A)` constrains nothing. We have `x₁ = 0`. If `N` is reachable, a large enough `T` gives `x_N = D(N)`: the answer is `D(N)`. Otherwise `x_N = p(N) − p(1) + T` grows with `T`: the answer is `INFINI`.

**Complexity.** Two runs of Bellman-Ford: O(N × M), at most 900,000 relaxations. Dijkstra does not work, because of negative lengths.

**Pitfalls.** The direction of the arc: `x_B − x_A ≤ C` gives `A → B`. A constraint `x_A − x_A ≤ C` with `C < 0` is a negative cycle of a single arc. A negative cycle that cannot be reached from `1` also makes the system impossible: a Bellman-Ford run only from `1` does not see it. If `N = 1`, the answer is `0` (when the system is possible).
