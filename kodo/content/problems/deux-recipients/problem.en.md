---
title: Two containers
---

## Statement
You have two unmarked containers, holding `A` and `B` litres, empty at the start, and a tap. An **operation** is one of the following six actions:
- fill the first container, or the second, completely at the tap;
- empty the first container, or the second, completely;
- pour the first into the second, or the second into the first, until the one being poured is empty or the receiving one is full.

Compute the minimum number of operations so that one of the two containers holds exactly `C` litres, or print `-1` if it is impossible.

## Input
A single line containing three integers `A`, `B` and `C`.

## Output
A single integer: the minimum number of operations, or `-1`.

## Constraints
- 1 ≤ A, B ≤ 50,000
- 0 ≤ C ≤ 100,000

## Hints
1. A state is a pair `(x, y)`: the quantities in the two containers. Each operation leads to another state: the answer is a distance, computed by a breadth-first search from `(0, 0)`.
2. There are up to 50,001 × 50,001 possible pairs: an array of that size does not fit in memory. Store only the states actually reached, in a dictionary.
3. After any operation, one of the two containers is empty or full. How many states can therefore be reached?

## Solution
A state is the pair `(x, y)` of quantities held. From `(x, y)`, the six operations give `(A, y)`, `(x, B)`, `(0, y)`, `(x, 0)`, then, writing `v = min(x, B − y)` and `w = min(y, A − x)` for the poured volumes, `(x − v, y + v)` and `(x + w, y − w)`. A breadth-first search from `(0, 0)` gives the minimum number of operations to reach each state; stop at the first dequeued state where `x = C` or `y = C`. Since states leave the queue by non-decreasing distance, this is the minimum sought.

**Size of the state space.** There are `(A + 1)(B + 1)` pairs, that is 2.5 × 10⁹: a distance array cannot be allocated. But each operation leaves a container empty or full: filling makes it full, emptying makes it empty, and pouring stops when the source is empty or the target full. The reached states therefore lie on the border of the rectangle, at most `2(A + 1) + 2(B + 1)` states. They are stored in a dictionary (in C++, a `map` of pairs), and the search costs O(A + B) dictionary operations.

**The link with arithmetic.** All quantities handled are combinations `uA + vB` with integers `u`, `v`, hence multiples of `d = gcd(A, B)`. If `C` is not a multiple of `d`, or if `C > max(A, B)`, the answer is `-1`. Bézout's theorem shows that every other `C` can be reached, but the minimum number of operations does require the search.
