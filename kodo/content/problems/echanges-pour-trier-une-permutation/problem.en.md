---
title: Swaps to sort a permutation
---

## Statement
A list contains the integers from `1` to `N`, each once, in any order. One operation **swaps** two elements of the list, at any positions. Print the smallest number of operations needed to sort the list in increasing order.

For example, `3 1 2` needs 2 swaps, and so does `2 1 4 3`.

## Input
The first line contains `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the minimum number of swaps.

## Constraints
- 1 ≤ N ≤ 25,000

## Hints
1. At each step, selection sort puts the right value at position `i`, with at most one swap. Here, the right value for position `i` is known in advance: it is `i`.
2. To avoid searching for `i` in the whole end of the list, keep an array `pos` up to date: `pos[v]` is the current position of value `v`.
3. Does this sort make the minimum number of swaps? Following the arrow "position `p` → position of value `p`" splits the list into **cycles**. How many cycles can one swap create at most?

## Solution
**Algorithm.** This is a selection sort where finding the minimum is immediate. For `i` from 1 to `N`: if position `i` does not hold `i`, swap its content with value `i`, which is at `pos[i]`, and update `pos`. Count these swaps. The invariant is the one of selection sort: before step `i`, positions `1` to `i − 1` hold `1` to `i − 1`. Each step costs a few operations: about N operations in total, instead of the N² / 2 comparisons of a selection sort that searches for the minimum (300 million here).

**Why it is the minimum.** Link each position `p` to the position where value `p` is. Following these links, you go round in circles: the list splits into **cycles**. In `3 1 2`, position 1 leads to position 2 (where the `1` is), which leads to 3, which leads back to 1: a single cycle. In `2 1 4 3`, there are two cycles of two positions. A sorted list has `N` cycles, each with a single position.

A swap changes two links: it cuts a cycle in two, or merges two cycles into one. So the number of cycles increases by at most 1 per swap. If the list has `C` cycles at the start, at least `N − C` swaps are needed to reach `N`. Now each swap of the algorithm puts a value at its final place and cuts a cycle in two: it makes exactly `N − C` swaps. So it is optimal.
