---
title: Payable amounts with coins
---

## Statement
There are `K` kinds of coins, of values `A₁, …, A_K`, and as many coins of each kind as wanted. An amount is **payable** if it is equal to a sum of coins. Count the payable amounts between `1` and `X`.

For example, with coins of 6, 10 and 15, the payable amounts up to 30 are 6, 10, 12, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28 and 30: there are 15 of them.

## Input
- The first line contains `K` and `X`.
- The second line contains the `K` values `A₁ … A_K`.

## Output
A single integer: the number of payable amounts between `1` and `X`.

## Constraints
- 1 ≤ K ≤ 5
- 1 ≤ A_i ≤ 10⁹, and the smallest value is at most 50,000
- 1 ≤ X ≤ 10¹⁸

## Hints
1. Let `m` be the smallest value. If an amount `s` is payable, so is `s + m`. So it is enough to know, for each remainder `r` modulo `m`, the smallest payable amount with remainder `r`.
2. These smallest amounts are distances: the vertices are the remainders `0, …, m − 1`, and adding a coin of value `a` leads from `r` to `(r + a) mod m` at a cost `a`.
3. If `D[r]` is the distance from remainder `0` to remainder `r`, the payable amounts with remainder `r` are exactly `D[r]`, `D[r] + m`, `D[r] + 2m`, … It remains to count those that are at most `X`.

## Solution
Let `m` be the smallest coin value. Define a graph whose vertices are the remainders `0, 1, …, m − 1`; each coin of value `a` gives, from each remainder `r`, an arc to `(r + a) mod m` of length `a`. A path from `0` corresponds to a sequence of coins, and its length is the amount paid. Dijkstra from `0` gives `D[r]`, the **smallest payable amount with remainder `r`** (infinite if there is none).

**Why it is correct.** A payable amount `s` with remainder `r` is the length of a path from `0` to `r`, so `s ≥ D[r]`; moreover `s − D[r]` is a multiple of `m`. Conversely, `D[r] + j × m` is payable for every `j ≥ 0`: add `j` coins of value `m`. So the payable amounts with remainder `r` are exactly `D[r], D[r] + m, D[r] + 2m, …`, and there are `(X − D[r]) / m + 1` of them (integer division) not exceeding `X` when `D[r] ≤ X`. Sum over the remainders, then subtract 1 for the amount `0` (counted with remainder `0`).

**Complexity.** `m` vertices and `m × K` arcs: O(m × K × log(m × K)), about 250,000 arcs, whatever `X` is. A method that marks payable amounts one by one up to `X` is out of the question for `X = 10¹⁸`.

**Pitfalls.** Distances reach `m × 10⁹ ≈ 5 × 10¹³` and the answer `10¹⁸`: `long long` in C++. When the GCD of the values is not 1, some remainders stay at infinite distance (second sample: with 4 and 6, no odd amount is payable). Do not forget to remove the amount `0`.
