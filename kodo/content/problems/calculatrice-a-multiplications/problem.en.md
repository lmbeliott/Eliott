---
title: Calculator with multiplications
---

## Statement
A calculator shows `0`. The keys `+ 1` and `− 1` each cost `D`. There are also `K` multiplication keys: key `i` multiplies the number shown by `M_i` and costs `C_i`. Print the minimum cost to make the integer `N` appear.

For example, with `D = 1` and the keys `× 2` and `× 3` of cost 1 each, 11 is obtained by `+ 1`, `× 2`, `× 2`, `× 3`, `− 1` (1, 2, 4, 12, 11): cost 5.

Each test contains `T` independent cases.

## Input
- The first line contains `T`.
- Each of the next `T` lines describes a case: `N`, `D`, `K`, then the `K` pairs `M_i C_i`.

## Output
`T` lines: the minimum cost for each case.

## Constraints
- 1 ≤ T ≤ 20
- 1 ≤ N ≤ 10¹²
- 1 ≤ D ≤ 10⁶
- 1 ≤ K ≤ 4
- 2 ≤ M_i ≤ 10 and 1 ≤ C_i ≤ 10⁶

## Hints
1. Values go up to 10¹²: a shortest path over all integers from `0` to `N` is out of reach. Reason backwards: what is the **last** multiplication, and to which number `v` is it applied?
2. After the last multiplication `× M`, only `+ 1` and `− 1` are used: the final cost is `D × |N − M v|`. Show that it is enough to try `v = ⌊N / M⌋` and `v = ⌈N / M⌉`.
3. Backward graph: from `n`, arcs to `0` (cost `n × D`), to `⌊n / M⌋` and to `⌈n / M⌉` (cost `C` plus the adjustments). Few vertices are reached: Dijkstra from `N` with a dictionary, down to `0`.

## Solution
Let `f(n)` be the minimum cost to show `n`.

**A recurrence.** In an optimal sequence of keys leading to `n`, either there is no multiplication, and the cost is at least `n × D` (at least `n` times `+ 1`); or consider the last multiplication, `× M` of cost `C`, applied to a number `v`: before it, `v` was shown (cost at least `f(v)`), and after it, only `± 1` (cost at least `D × |n − M v|`). So `f(n) = min(n × D, min over M and v of f(v) + C + D × |n − M v|)`.

**Only two values of `v` matter** (exchange argument). If `v < ⌊n / M⌋`, replacing `v` with `v + 1` costs at most `D` more before the multiplication (one `+ 1` key), but `M (v + 1)` is still at most `n`: it saves `M × D ≥ 2D` of adjustments after. The total can only decrease. Likewise, if `v > ⌈n / M⌉`, replace `v` with `v − 1`. So we can restrict to `v = ⌊n / M⌋` and `v = ⌈n / M⌉`.

**A shortest path.** See each number `n` as a vertex, with arcs to `0` (cost `n × D`), to `⌊n / M⌋` (cost `C + D (n − M ⌊n / M⌋)`) and, if `M` does not divide `n`, to `⌈n / M⌉` (cost `C + D (M ⌈n / M⌉ − n)`). These values are strictly smaller than `n` as soon as `n ≥ 2` (for `n = 1`, the arc to `⌈1 / M⌉ = 1` is useless). `f(N)` is the length of a shortest path from `N` to `0`: costs are positive, so **Dijkstra**, with a dictionary for distances since vertices are large numbers.

**Few vertices.** We have `⌊⌊n / a⌋ / b⌋ = ⌊n / (a b)⌋`, and rounding up or down of `n / (a b)` for the other combinations: the vertices reached are of the form `⌊N / P⌋` or `⌈N / P⌉`, where `P` is a product of the `M_i`. With `M_i ≤ 10`, there are at most a few tens of thousands of such vertices, and far fewer in practice since Dijkstra stops as soon as `0` leaves the heap.

**Complexity.** O(S × K × log S) per case, where `S` is the number of vertices reached. A shortest path over all integers up to `N` would need 10¹² vertices.

**Pitfalls.** `N × D` reaches 10¹⁸: `long long` in C++. Forgetting `⌈n / M⌉` gives answers that are too large (for 11 with `× 3`, one must go through 4 then press `− 1`). Several keys may have the same multiplier with different costs.
