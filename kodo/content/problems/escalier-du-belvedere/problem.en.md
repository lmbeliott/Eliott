---
title: The staircase to the viewpoint
---

## Statement
To reach the Valcorde viewpoint, Lina climbs a long staircase carved into the rock. The steps are numbered from `1` to `N`; Lina starts from the ground (step `0`) and must finish exactly on step `N`. At each move, she can jump a number of steps taken from a fixed list of `K` lengths. This morning, some steps are icy: Lina must **never** set foot on them.

Two climbs are different if their sequences of jumps are different (going up `1` then `2` is not the same as going up `2` then `1`). Write a program that counts the possible climbs. Since this number can be huge, print its remainder when divided by `1 000 000 007`.

## Input
- The first line contains two integers `N` and `K`.
- The second line contains `K` distinct integers: the allowed jump lengths.
- The third line contains a string of `N` characters: the `i`-th character is `#` if step `i` is icy, `.` otherwise.

## Output
A single integer: the number of possible climbs, modulo `1 000 000 007`.

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ 10
- each jump length is between `1` and `N`

## Hints
1. Listing every climb is impossible: with jumps of `1` and `2`, there are already more than 10²⁰ of them for `N = 100`.
2. Let `nb[i]` be the number of ways to arrive on step `i`. Where was Lina just before arriving on `i`?
3. `nb[0] = 1`, `nb[i] = 0` if step `i` is icy, and otherwise `nb[i]` is the sum of the `nb[i - s]` for each jump `s ≤ i`. Compute the `nb[i]` in increasing order, taking the modulo at each step.

## Solution
We sort the climbs that arrive on step `i` by their **last jump**. If this last jump has length `s`, the climb is a climb up to step `i - s`, followed by the jump `s`. Climbs from different classes are all different, so:

- `nb[0] = 1` (the empty climb: Lina is on the ground);
- `nb[i] = 0` if step `i` is icy;
- otherwise `nb[i] = sum of nb[i - s]` over the jumps `s ≤ i`.

Each `nb[i]` only uses values with smaller indices: we compute them from `1` to `N` in order, and the answer is `nb[N]`. Complexity: **O(N × K)**, that is at most 10⁶ additions.

The naive solution recursively explores every sequence of jumps. It keeps recomputing the same subproblems: without ice, the number of calls is at least the number of climbs, which grows exponentially with `N`. That is the whole point of dynamic programming: each subproblem `nb[i]` is computed only once.

Traps:
- Take the modulo at each step. In C++, a sum of `K` values below 10⁹ + 7 exceeds 2³¹: use `long long`. In Python, integers don't overflow, but numbers with thousands of digits make the computation very slow.
- An icy step is worth `0` even if it could be reached; if step `N` is icy, the answer is `0`.
- A jump longer than `i` cannot lead to step `i`: beware of negative indices (in Python, `nb[-1]` doesn't raise an error, it reads the last element!).
