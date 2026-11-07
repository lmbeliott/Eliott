---
title: Points touching every interval
---

## Statement
Checks must be made on a production line during N periods: period i goes from minute aᵢ to minute bᵢ, bounds included. A check takes place at an integer minute, and it counts for every period containing that minute.

Print the smallest number of checks such that every period contains at least one check.

## Input
The first line contains N. Each of the next N lines contains two integers aᵢ and bᵢ.

## Output
The smallest number of checks.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ aᵢ ≤ bᵢ ≤ 10⁶

## Hints
1. Among all periods, look at the one that **ends** first. It must contain a check: at which minute is it most useful?
2. Place this check at the end of this period: it touches every period that started before, and loses nothing.
3. Sort the periods by increasing end, and place a check at the end of each period not touched yet.

## Solution
**The greedy algorithm.** Sort the periods by increasing end. Go through them in this order, remembering the minute of the last check placed: if the current period starts after this check, it is not touched, and we place a new check at its **end** bᵢ. Otherwise, it contains the last check (which is at most its end, since the ends are sorted) and there is nothing to do.

**The choice is safe (exchange argument).** Let [a, b] be the period that ends first, and take any optimal solution. It has a check q in [a, b]. Replace q by b. Every period that contained q starts before q ≤ b, and ends after b, since b is the smallest end: it also contains b. The modified solution is therefore still valid, with the same number of checks, and it makes the same first choice as greedy. Remove the periods touched by b and repeat the reasoning on those that remain: by induction, greedy uses as many checks as an optimal solution.

**Bad greedy algorithms.** Sorting by start, or placing the check at the start of a period, fails: with [0, 10], [1, 2] and [5, 6], a check at minute 0 or 10 touches only one period; the right greedy places 2 and 6, and answers 2.

**Cost.** O(N log N) for the sort, then a single pass.
