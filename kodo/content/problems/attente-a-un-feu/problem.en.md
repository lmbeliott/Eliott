---
title: Waiting at a traffic light
---

## Statement
A traffic light turns green at time `0`, stays green for `V` seconds, then red for `R` seconds, then starts over: green from `V + R` to `2V + R`, and so on. At the exact moment it changes, it already has its new colour.

`N` cars arrive at the light, each at a given time. A car arriving on green goes through without waiting; a car arriving on red waits for the next switch to green. Print the total waiting time of all the cars.

## Input
- The first line contains two integers `V` and `R`.
- The second line contains the integer `N`.
- Each of the next `N` lines contains an integer `T`: the arrival time of a car, in seconds.

## Output
A single integer: the sum of the waiting times, in seconds.

## Constraints
- 1 ≤ V, R ≤ 1,000
- 1 ≤ N ≤ 1,000
- 0 ≤ T ≤ 10⁹

## Hints
1. The light repeats every `V + R` seconds. What matters is the position of `T` in the cycle: `T % (V + R)`.
2. If this position `p` is less than `V`, the light is green. Otherwise it is red, and it turns green again at the end of the cycle, `V + R - p` seconds later.
3. Check the switching times: with `V = 30` and `R = 20`, a car arriving at `30` waits 20 seconds, and a car arriving at `50` doesn't wait.

## Solution
The light is **periodic**: it does the same thing every `V + R` seconds. So bring each arrival time back into the first cycle with `p = T % (V + R)`, a number between `0` and `V + R - 1`.

- If `p < V`, the light is green: the wait is 0.
- Otherwise, the light is red and turns green again at position `V + R` of the cycle: the wait is `V + R - p`.

The switching times follow the statement: for `p = V`, the light has just turned red, and the wait is `R`; for `p = 0`, it has just turned green, and the wait is 0.

Simulating the light second by second up to `T` would be far too slow when `T` is 10⁹: the remainder `%` replaces that loop with a single computation.
