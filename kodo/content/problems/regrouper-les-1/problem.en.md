---
title: Group the 1s
---

## Statement
You are given a list of `N` values, each equal to `0` or `1`. A **swap** exchanges two neighbouring values of the list.

Write a program that prints the smallest number of swaps needed so that all the `1`s end up next to each other, with no `0` between them. The resulting group of `1`s can be anywhere in the list.

## Input
- The first line contains the integer `N`.
- The second line contains `N` values separated by spaces, each equal to `0` or `1`.

## Output
A single integer: the smallest number of swaps.

## Constraints
- 1 ≤ N ≤ 50 000
- The list contains at least one `1`.

## Hints
1. Swapping two neighbouring `1`s or two neighbouring `0`s is useless. A useful swap therefore moves a `0` past a `1`. At the end, each `0` is either to the left of the group of `1`s or to its right.
2. If a `0` ends up to the left of the group, it must move past all the `1`s that are before it in the list; if it ends up to the right, past all the `1`s that are after it. Each crossing costs one swap.
3. Each `0` picks the cheaper side: the smaller of the number of `1`s before it and the number of `1`s after it. These choices never conflict. First count the total number of `1`s, then go through the list counting the `1`s seen so far.

## Solution
Look at what happens to each `0`. At the end, it is either to the left of the group of `1`s or to its right.

- If it ends up **on the left**, all the `1`s placed before it in the list must move to the other side: you need at least as many swaps moving this `0` past a `1` as there are `1`s before it.
- If it ends up **on the right**, you likewise need at least as many swaps as there are `1`s after it.

A swap moves only one `0` past only one `1`. So the total number of swaps is at least the sum, over all `0`s, of the smaller of the two numbers: `1`s before it, or `1`s after it.

This minimum can be reached. As you move along the list, the number of `1`s before a `0` increases and the number of `1`s after it decreases: the `0`s that prefer the left all come before those that prefer the right. Push the first ones to the left and the others to the right, never making a useless swap.

The program first counts the total number `U` of `1`s. Then it goes through the list keeping `before`, the number of `1`s seen so far. For each `0`, it adds to the answer the smaller of `before` and `U - before`.

Example with `1 0 1 0 0 1`: `U = 3`. The first `0` has one `1` before it and two after: cost 1. The other two have two `1`s before and one after: cost 1 each. The answer is 3, for instance to get `0 1 1 1 0 0`.

Pitfalls:
- choosing the same side for every `0` (pushing everything to the left, or everything to the right): in the example, this costs 4 or 5 swaps instead of 3;
- trying every possible position of the group of `1`s and computing the cost of each: it is correct, but with 50 000 values it takes hundreds of millions of operations;
- recounting the `1`s before and after each `0` with a new loop: this is also much too slow. A single pass with a counter is enough.
