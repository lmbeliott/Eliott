---
title: Pairs with a bounded gap
---

## Statement
You are given a sequence of `N` integers `a[1], a[2], …, a[N]` and two integers `L` and `R`. Write a program that counts the pairs of positions `(i, j)` such that `i < j` and `L ≤ a[j] - a[i] ≤ R`.

The gap `a[j] - a[i]` is signed: it is negative when the value further right is the smaller one.

## Input
- The first line contains three integers `N`, `L` and `R`.
- The second line contains `N` integers: `a[1]` to `a[N]`.

## Output
A single integer: the number of pairs `(i, j)` that qualify.

## Constraints
- 1 ≤ N ≤ 15 000
- 0 ≤ a[i] ≤ 10⁹
- -10⁹ ≤ L ≤ R ≤ 10⁹

## Hints
1. Go through the sequence from left to right. At position `j`, you must count the values already seen that lie in the range `[a[j] - R, a[j] - L]`.
2. A Fenwick tree indexed by **values** counts the values already seen in a range in O(log N)… but values go up to 10⁹. Yet there are at most `N` different values: replace each value with its **rank** in the sorted list of distinct values.
3. The bounds `a[j] - R` and `a[j] - L` are not necessarily in the sequence: use binary search to find the first distinct value `≥ a[j] - R` and the last one `≤ a[j] - L`.

## Solution
Go through the sequence from left to right, keeping the set of values already seen. At position `j`, the positions `i < j` that qualify are those whose value is in `[a[j] - R, a[j] - L]`: you must count the values already seen in a range, then add `a[j]` to the set.

A **Fenwick tree** does both operations in O(log) if the values are small integers. So **compress** the values: sort the distinct values of the sequence, and replace each value with its rank `1, 2, …, m` in this list. The order is preserved, so a range of values becomes a range of ranks:
- `start` = number of distinct values `< a[j] - R` (binary search: `bisect_left`, or `lower_bound` in C++);
- `end` = number of distinct values `≤ a[j] - L` (`bisect_right`, or `upper_bound`);
- the values we want are those of ranks `start + 1` to `end`, and their number is `sum(end) - sum(start)`.

Then add `1` to the cell of the rank of `a[j]`.

Complexity: **O(N log N)** for the sort, the binary searches and the tree operations.

Why the naive method fails: testing every pair makes about 1.1 × 10⁸ comparisons, far too many for Python. A Fenwick tree indexed directly by the values would need an array with a billion cells.

Pitfalls:
- `a[j] - L` can reach 2 × 10⁹: compute the bounds with `long long` in C++.
- The order matters: a pair `(i, j)` is counted when you reach `j`, querying only the values **already** added. Adding `a[j]` before counting would count the pair `(j, j)` when `L ≤ 0 ≤ R`.
- Equal values share the same rank; with `L ≤ 0 ≤ R`, two equal values form a valid pair.
- If `start ≥ end`, no value qualifies: don't do the subtraction the wrong way round.
