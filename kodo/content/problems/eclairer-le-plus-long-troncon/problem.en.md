---
title: Lighting the longest stretch
---

## Statement
A road has `L` positions numbered from 1 to `L`. `N` street lamps stand on it: lamp `i` lights all positions from `Aᵢ` to `Bᵢ`. A position is **dark** if no lamp lights it.

You also have `K` portable lights; each can light a single position, of your choice. Find the longest stretch of consecutive positions that can be made fully lit. Print its length and its first position; in case of a tie, choose the leftmost stretch.

## Input
The first line contains `L`, `N` and `K`. Each of the next `N` lines contains two integers `Aᵢ` and `Bᵢ`.

## Output
Two integers on one line: the length of the stretch, then its first position.

## Constraints
- 1 ≤ L ≤ 300,000
- 1 ≤ N ≤ 8,000
- 0 ≤ K ≤ L
- 1 ≤ Aᵢ ≤ Bᵢ ≤ L

## Hints
1. Two steps: find the dark positions, then the longest stretch containing at most `K` dark positions.
2. For the first step, marking each position of each lamp can cost N × L = 2.4 billion operations. A difference array gives the number of lamps lighting each position in a single pass.
3. For the second, a sliding window: the end moves forward one position at a time, and the start moves forward as long as the window contains more than `K` dark positions.

## Solution
**Step 1: the dark positions.** Difference array `D` of size `L + 2`: for each lamp, `D[Aᵢ] += 1` and `D[Bᵢ + 1] −= 1`. Accumulating `D[1] + … + D[p]` gives the number of lamps lighting position `p`: it is dark if this number is 0. This costs N + L operations.

**Step 2: the longest window.** A stretch can be made fully lit if and only if it contains at most `K` dark positions: put a light on each one. Slide a window `[g, d]`, counting its dark positions. For each end `d` from 1 to `L`, add position `d`, then, while the window contains more than `K` dark positions, remove position `g` and move `g` forward. The window `[g, d]` is then the longest valid stretch ending at `d`: a stretch contained in a valid stretch is valid, so when `d` moves forward, the smallest valid start never moves back. Keep the window if it is **strictly** longer than the best one, which gives the leftmost in case of a tie.

**Cost.** About N + 3L operations, roughly a million. The direct method (marking positions one by one, then trying each start) can take billions of operations. The traps: forgetting cell `L + 1` of the difference array, and the case `K = 0`, where the stretch must already be fully lit.
