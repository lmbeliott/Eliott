---
title: Largest rise
---

## Statement
The price of an item is recorded for `N` days. You want to buy it on a day `i` and sell it on a day `j` strictly later (`i < j`). Print the largest possible gain `Pⱼ − Pᵢ`. This gain is negative if the price drops every day: you must still buy and then sell.

## Input
- The first line contains `N`.
- The second line contains the `N` prices `P₁, …, Pₙ`, in the order of the days.

## Output
The largest gain.

## Constraints
- 2 ≤ N ≤ 20,000
- 1 ≤ Pᵢ ≤ 1,000,000

## Hints
1. Trying every pair of days would take 200 million subtractions: too slow.
2. If you sell on day `j`, what is the best day to buy?
3. Go through the days in order, keeping the smallest price seen **before** the current day up to date. What property does this variable satisfy at the start of each turn?

## Solution
If you sell on day `j`, the best purchase is at the lowest price among days 1 to `j − 1`. So go through the days from the second one, keeping two variables up to date:
- `mini`, the smallest price among the days already passed;
- `best`, the largest gain of a sale before the current day.

On day `j`, compare `P[j] − mini` with `best`, **then** update `mini` with `P[j]`. The order matters: updating `mini` first would allow buying and selling on the same day, with a zero gain, which is wrong when prices drop.

**Invariant.** At the start of turn `j`, `mini` is the minimum of `P[1..j − 1]`, and `best` is the gain of an actual pair of days, at least the gain `P[j'] − P[i]` of every pair `i < j' < j`. It holds before the first turn (`j = 2`), by initialising `mini = P[1]` and `best = P[2] − P[1]`, the gain of the pair of days (1, 2). A turn keeps it: the new pairs are those where you sell on day `j`, and the best of them is `P[j] − mini`. After the `N − 1` turns, `best` is the gain of a pair, at least that of every pair: it is the largest gain.

**Termination and cost.** The `for` loop makes exactly `N − 1` turns, with a constant number of operations each. This is far less than the `N × (N − 1) / 2` pairs of the naive method. The trap: initialising `best` to 0, which gives a wrong answer when the price only drops.
