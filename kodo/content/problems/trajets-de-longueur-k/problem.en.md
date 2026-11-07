---
title: Walks of length K
---

## Statement
`N` places are numbered from 1 to `N`. A grid `A` of `N × N` digits describes the one-way roads: `A[i][j]` is `1` if there is a road from place `i` to place `j`, and `0` otherwise. A road can go from a place to itself.

A **walk of length `K`** is a sequence of `K` roads taken one after the other; it can go several times through the same place or the same road. For each pair of places `(i, j)`, count the walks of length exactly `K` that start at `i` and end at `j`.

## Input
- The first line contains two integers `N` and `K`.
- Each of the next `N` lines contains `N` integers `0` or `1`, separated by spaces: the grid `A`.

## Output
`N` lines of `N` integers separated by spaces: on line `i`, in column `j`, the number of walks of length `K` from place `i` to place `j`.

## Constraints
- 1 ≤ N ≤ 10
- 1 ≤ K ≤ 15

## Hints
1. For `K = 1`, the answer is the grid `A` itself.
2. A walk of length `k + 1` from `i` to `j` is a walk of length `k` from `i` to some place `p`, followed by a road from `p` to `j`. If `C[i][p]` counts the walks of length `k`, then the number of walks of length `k + 1` is the sum, over all `p`, of `C[i][p] × A[p][j]`.
3. Write a function `product(X, Y)` that returns a **new** grid `Z` with `Z[i][j] = X[i][0] × Y[0][j] + X[i][1] × Y[1][j] + …`. The numbers can reach 10¹⁴: in C++, use `long long`.

## Solution
Let `C` be the grid of the numbers of walks of length `k`. At the start (`k = 1`), `C = A`. To extend the walks by one road, look at the last place `p` before arrival: a walk of length `k + 1` from `i` to `j` is a walk of length `k` from `i` to `p` followed by the road `p → j`, which exists if `A[p][j] = 1`. So the new number is `C[i][0] × A[0][j] + C[i][1] × A[1][j] + … + C[i][N-1] × A[N-1][j]`.

This computation is the **matrix product** `C × A`, a central operation in mathematics. Write a function `product(X, Y)` that creates a grid of zeros and fills it with three nested loops (on `i`, `j` and `p`). Apply it `K - 1` times: `C = product(C, A)`. The answer is the `K`-th power of the matrix `A`.

The new grid must be distinct from `C`: if you wrote the results directly into `C` during the computation, cells already updated would be reused to compute the next ones. So the function creates its own grid (a new row per turn, not `[[0] * N] * N`) and returns it.

Size of the numbers: when all roads exist, there are `N` choices for each intermediate place, that is `N^(K-1)` walks from `i` to `j`, up to 10¹⁴. You need `long long` in C++. The computation takes `K × N³`, at most 15,000 operations.
