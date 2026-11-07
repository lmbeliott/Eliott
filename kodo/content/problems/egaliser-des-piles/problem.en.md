---
title: Level the piles
---

## Statement
`N` piles of coins are lined up next to each other. A **move** consists of taking a single coin from a pile and putting it on a **neighbouring** pile, just to its left or just to its right.

The total number of coins is a multiple of `N`. Write a program that prints the smallest number of moves needed so that all piles hold the same number of coins.

## Input
- The first line contains the integer `N`, the number of piles.
- The second line contains `N` integers separated by spaces: the number of coins in each pile, from left to right.

## Output
A single integer: the smallest number of moves.

## Constraints
- 1 ≤ N ≤ 1 000
- Each pile holds between 0 and 1 000 coins.
- The total number of coins is a multiple of `N`.

## Hints
1. At the end, each pile holds `M` coins, where `M` is the total divided by `N`. Rather than following the coins one by one, look at a **boundary**: the space between two neighbouring piles. How many coins must cross it?
2. Take the boundary just after the first `i` piles. At the end, these `i` piles must hold `i × M` coins in all. If they hold more at the start, the surplus must cross the boundary to the right; if they are short, coins must cross it to the left. Each coin that crosses costs one move.
3. The answer is the sum, over all boundaries, of the gap between the number of coins in the first `i` piles and `i × M` (as a positive value). Compute the number of coins in the first `i` piles as you go, adding one pile at each turn of the loop.

## Solution
Let `M` be the number of coins per pile at the end: the total divided by `N`.

Look at the boundary between pile `i` and pile `i + 1`. To the left of this boundary there are `i` piles, which together hold `S` coins at the start, and must hold `i × M` at the end. A move only makes one coin at a time cross this boundary. So you need at least `|S - i × M|` moves that cross this boundary (the bars `| |` mean "as a positive value"). Each move crosses exactly one boundary, so the total number of moves is at least the sum of these numbers over the `N - 1` boundaries.

This number can always be reached: you just never make coins cross the same boundary in both directions, which would be pointless. So the answer is exactly this sum.

Example: the piles `0 8 0 4`, with `M = 3`.
- After pile 1: 0 coins instead of 3, 3 are missing, and they must come from the right.
- After pile 2: 8 coins instead of 6, there are 2 too many, which must go to the right.
- After pile 3: 8 coins instead of 9, 1 is missing.

The answer is 3 + 2 + 1 = 6.

To compute `S` at each boundary, keep a variable holding the number of coins in the piles seen so far, and add the next pile to it at each turn: a single pass over the list is enough.

The trap is trying to simulate the moves one by one: it's long and complicated, and it's easy to make a choice that isn't the best one. Reasoning about the boundaries gives the answer directly.
