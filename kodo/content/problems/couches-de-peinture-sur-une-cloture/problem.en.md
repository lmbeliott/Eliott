---
title: Layers of paint on a fence
---

## Statement
A fence is made of `N` planks numbered from 1 to `N`. `M` roller strokes are applied: stroke `(L, R)` puts one layer of paint on each of the planks `L` to `R`.

Print the largest number of layers received by a plank, the number of planks that received this number of layers, and the number of planks that received no layer.

## Input
The first line contains `N` and `M`. Each of the next `M` lines contains two integers `L` and `R`.

## Output
Three integers on one line: the maximum number of layers, the number of planks reaching it, the number of unpainted planks.

## Constraints
- 1 ≤ N ≤ 200,000
- 1 ≤ M ≤ 8,000
- 1 ≤ L ≤ R ≤ N

## Hints
1. Adding 1 to each plank of each stroke costs up to N × M = 1.6 billion operations.
2. Rather than changing all the planks of a stroke, only note where the paint starts and where it stops.
3. Difference array: `D[L] += 1` and `D[R + 1] -= 1`. The number of layers of plank `i` is then `D[1] + D[2] + … + D[i]`.

## Solution
Use a **difference array** `D` of size `N + 2`, filled with zeros. For each stroke `(L, R)`, do `D[L] += 1` and `D[R + 1] -= 1`. Then go through the planks from 1 to `N`, accumulating: `c = c + D[i]` gives the number of layers of plank `i`. Keep the maximum, the number of planks reaching it and the number of zeros up to date.

**Why.** The sum `D[1] + … + D[i]` receives `+1` from each stroke with `L ≤ i`, and `−1` from each stroke with `R + 1 ≤ i`, that is `R < i`. What remains is `+1` exactly for the strokes with `L ≤ i ≤ R`: those covering plank `i`.

**Cost.** Two operations per stroke, then one pass over the planks: about M + N operations, against up to N × M for the direct method. The trap: declaring `D` of size `N + 1` only, while writing at `R + 1`, which can be `N + 1`.
