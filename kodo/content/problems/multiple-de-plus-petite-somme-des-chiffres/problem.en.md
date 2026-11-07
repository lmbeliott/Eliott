---
title: Multiple with the smallest digit sum
---

## Statement
Among the positive multiples of `K`, find the one whose digit sum, written in base `B`, is the smallest. Print this sum.

For example, for `K = 7` in base 10, the multiple `1001 = 7 × 143` has a digit sum of 2, and no multiple of 7 has a digit sum of 1 (a power of 10 is never divisible by 7).

## Input
One line: two integers `K` and `B`.

## Output
A single integer: the smallest digit sum in base `B` of a positive multiple of `K`.

## Constraints
- 1 ≤ K ≤ 100,000
- 2 ≤ B ≤ 10

## Hints
1. The multiple can be huge (for `K = 19`, it is `1,000,000,001`): trying multiples one by one is hopeless. Only the remainder modulo `K` of the number being built matters.
2. Every positive integer can be obtained from `1` with two operations: "add 1" and "multiply by `B`". What happens to the digit sum and to the remainder modulo `K` with each operation?
3. Graph on the `K` remainders: `r → r + 1` costs 1, `r → r × B` costs 0 (modulo `K`). The answer is the distance from the remainder of `1` to the remainder `0`, plus 1.

## Solution
**Modelling.** Build a number starting from `1`, with two operations: "add 1", which increases the digit sum by at most 1 (exactly 1 without a carry), and "multiply by `B`", which appends a `0` on the right without changing the sum. Only the remainder modulo `K` matters to know whether we have a multiple of `K`. Hence a graph whose vertices are the remainders `0, …, K − 1`, with arcs `r → (r + 1) mod K` of cost 1 and `r → (r × B) mod K` of cost 0. The answer is `dist(1 mod K → 0) + 1`.

**Why it is correct.** *Every multiple gives a path.* If `n` is written `d₁d₂…d_k` in base `B`, start from `1`, add 1 `d₁ − 1` times, then for each following digit multiply by `B` and add 1 `d_i` times. This path leads to the remainder of `n` (so `0` if `n` is a multiple) and costs `digit sum of n − 1`. *Every path gives a multiple.* A path of cost `c` from the remainder of `1` to the remainder `0` describes a number `n ≥ 1` divisible by `K`; each "add 1" increases the digit sum by at most 1 and each multiplication leaves it unchanged, so this sum is at most `c + 1`. The two inequalities give equality.

**Algorithm.** Costs are 0 or 1: Dijkstra with a heap works, with `K` vertices and `2K` arcs, in O(K log K). (A double-ended queue, pushing to the front for a cost-0 arc and to the back for a cost-1 arc, gives the same result in O(K).) You can stop as soon as the remainder `0` leaves the heap.

**Pitfalls.** For `K = 1`, the start is already the remainder `0`: the answer is `1`. The number `0` is not a "positive" multiple: start from `1`, not from `0`. An ordinary breadth-first search counts operations, not digit sums: it gives a wrong answer.
