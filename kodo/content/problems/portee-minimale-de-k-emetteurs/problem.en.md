---
title: Minimum range of K transmitters
---

## Statement
N houses are built along a straight road, house i at kilometre xᵢ. We want to install K transmitters, each at an integer kilometre of our choice, all with the same **range** R: a transmitter placed at kilometre p covers every house whose position x satisfies |x − p| ≤ R.

Print the smallest integer range R that allows covering all the houses with K transmitters.

## Input
The first line contains N and K. The second line contains the N positions x₁, …, x_N, in any order; several houses can be at the same kilometre.

## Output
The smallest possible range.

## Constraints
- 1 ≤ K ≤ N ≤ 10,000
- 0 ≤ xᵢ ≤ 10⁹

## Hints
1. For a fixed range R, how can you tell whether K transmitters are enough? Sort the houses, and deal first with the leftmost one.
2. The leftmost house must be covered by a transmitter: you might as well place it as far right as possible, at kilometre x + R. It then covers every house up to kilometre x + 2R.
3. If R is enough, every larger range is too: binary search on R, between 0 and 10⁹.

## Solution
**Testing a range.** Sort the positions. For a range R, count the minimum number of transmitters: the leftmost house, at kilometre x, must be covered, so a transmitter is placed between x − R and x + R. Placing it at x + R is the best choice: there is no house before x, and this transmitter covers everything a transmitter placed further left would cover, and more. It covers the houses up to kilometre x + 2R; start again with the first house beyond. We count the transmitters used this way, and R works if this count is at most K. A single pass over the sorted list: O(N).

**Why this count is minimal.** By induction on the number of transmitters: after j transmitters, the procedure has covered a prefix of houses at least as long as any other way of placing j transmitters. This holds at the start, and the argument above preserves it: the first uncovered house must be covered by a new transmitter, which cannot reach further than x + 2R.

**Binary search.** If R works, so does R + 1. The range 10⁹ always works (a single transmitter at kilometre 0 is enough), and we look for the smallest range that works, with the invariant "lo does not work, hi works", starting from lo = −1 and hi = 10⁹. Total cost: O(N log N) for the sort, then about thirty tests in O(N). Trying every range R = 0, 1, 2, … would cost up to 5 × 10⁸ tests.
