---
title: Weighing with a balance
---

## Statement
A balance has two pans. An object of unknown mass is placed on the left pan, and N weights are available. Each weight can be put on the left pan (with the object), on the right pan, or left aside. The balance is level when both pans carry the same mass.

An integer mass m ≥ 1 is **measurable** if some placement of the weights levels the balance with an object of mass m. For example, with the weights 1, 3 and 9, the mass 5 is measurable: 5 + 1 + 3 = 9.

Count the measurable masses, and find the smallest integer mass m ≥ 1 that is not measurable.

## Input
The first line contains N. The second line contains the masses of the N weights.

## Output
Two integers on one line: the number of measurable masses, and the smallest mass that is not measurable.

## Constraints
- 1 ≤ N ≤ 10
- 1 ≤ mass of a weight ≤ 10⁶

## Hints
1. Each weight has three possible places: there are 3^N placements, at most 59,049. All of them can be tried.
2. A recursive function `explore(i, d)` handles the weights from number `i` on, knowing that the weights already placed give a difference `d` between the right pan and the left pan. It calls itself three times, once per possible place of weight `i`.
3. Store the positive differences in a set: two different placements can give the same mass.

## Solution
If the weights on the right weigh R and those on the left weigh L, the balance is level with an object of mass m when `m + L = R`, that is `m = R − L`. The measurable masses are therefore the strictly positive values of `R − L`.

They are enumerated with a recursive function `explore(i, d)`, where `d` is the value of `R − L` for weights 0 to i − 1, already placed. If `i = N`, all the weights are placed: add `d` to a set if it is positive. Otherwise call `explore(i + 1, d)` (weight aside), `explore(i + 1, d + p[i])` (on the right) and `explore(i + 1, d − p[i])` (on the left). The call `explore(0, 0)` goes through the 3^N placements: by induction on N − i, the call `explore(i, d)` reaches each of the 3^(N−i) ways of placing the remaining weights exactly once.

The answer is the size of the set, then the smallest integer `m ≥ 1` that is not in it, found by trying 1, 2, 3…

**Cost.** The call tree has 3^N leaves and fewer than 3^N / 2 internal nodes: about 90,000 calls for N = 10. The depth does not exceed N + 1.

With the weights 1, 3, 9, 27…, every mass from 1 to (3^N − 1) / 2 is measurable, each in exactly one way: this is the **balanced ternary** representation of numbers, with digits −1, 0 and 1.
