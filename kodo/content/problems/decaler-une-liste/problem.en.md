---
title: Shift a list
---

## Statement
A list of `N` numbers is shifted by `K` positions to the left: each number moves `K` places towards the start of the list, and those that fall off the start come back at the end, in the same order, as if they were going round.

For example, the list `1 2 3 4 5` shifted by 2 positions becomes `3 4 5 1 2`. Shifted by 7 positions, it also becomes `3 4 5 1 2`.

Write a program that prints the shifted list.

## Input
- The first line contains two integers `N` and `K`: the number of elements in the list and the shift.
- The second line contains `N` integers separated by spaces: the list.

## Output
A single line: the `N` numbers of the shifted list, separated by spaces.

## Constraints
- 1 ≤ N ≤ 1 000
- 0 ≤ K ≤ 1 000 000 000
- Each number is between -1 000 and 1 000.

## Hints
1. Shifting a list by `N` positions brings it back exactly to where it started. So a shift of `K` gives the same result as a shift of `K % N`.
2. In the shifted list, the first number is the one that was at position `K % N` in the starting list (counting positions from 0), and then come the next ones.
3. The number at position `i` of the shifted list is the one that was at position `(i + K) % N`. The remainder of the division by `N` makes the positions that go past the end "go round".

## Solution
First, notice that `N` shifts bring every number back to its place. So you can replace `K` with `K % N`, which is smaller than `N`. This is essential: shifting the list one step at a time, a billion times, would take far too long.

Then, the shifted list starts with the number that was at position `K % N`. More generally, the number at position `i` of the shifted list comes from position `(i + K) % N` of the starting list: the `% N` brings positions that go past the end back to the start. So you just print, for `i` going from 0 to `N - 1`, the value stored at position `(i + K) % N`.

Example: `N = 4`, `K = 6` and the list `10 20 30 40`. We have `6 % 4 = 2`, so we print positions 2, 3, 0, 1: `30 40 10 20`.

The traps: forgetting that `K` can be larger than `N` (position `i + K` then falls outside the list), and the case `K = 0`, where the list doesn't change.
