---
title: Disorders of an almost sorted list
---

## Statement
A list `A₁, A₂, …, A_N` contains the integers from `1` to `N`, each once, in an **almost sorted** order: each value `v` is at most 10 positions away from its place in the sorted list, that is, from position `v`.

A **disorder** is a pair of positions `i < j` such that `Aᵢ > Aⱼ`. Count the disorders of the list.

## Input
The first line contains `N`. The second line contains `A₁, …, A_N`, separated by spaces.

## Output
A single integer: the number of disorders.

## Constraints
- 1 ≤ N ≤ 25,000
- value `v` is at a position `p` such that `|p − v| ≤ 10`

## Hints
1. Testing every pair costs N² / 2, more than 300 million tests: too much for Python.
2. Insertion sort swaps badly ordered neighbours. How many disorders does such a swap remove?
3. Run an insertion sort and count the swaps. On an almost sorted list, each element only moves back a few positions.

## Solution
Sort the list by insertion and count the swaps of neighbours. This number is exactly the number of disorders.

**Why.** Insertion sort only swaps two neighbours `x` and `y` (with `x` just before `y`) when `x > y`. After the swap, the pair `{x, y}` is no longer a disorder, and no other pair changes: the other elements are still on the same side of `x` and `y`. So each swap removes exactly one disorder. At the end, the list is sorted and has no disorder left: the number of swaps equals the initial number of disorders.

**Cost.** Insertion sort makes about N steps plus one swap per disorder. Here, if `i < j` and `Aᵢ > Aⱼ`, then value `Aᵢ` is at most at `i + 10` in the sorted list and `Aⱼ` at least at `j − 10`, so `j − i < 20`. Each position forms at most 20 disorders with the positions after it: fewer than 20N = 500,000 swaps. Insertion sort is fast on an almost sorted list, while it would be too slow on an arbitrary list.
