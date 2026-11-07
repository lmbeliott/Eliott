---
title: Bounces of a ball
---

## Statement
A ball is dropped from a height of `H` centimetres. Each time it hits the ground, it bounces back up to `P` % of the height it just fell from, rounded down to the centimetre: if it fell from `h` centimetres, it rises `h × P // 100` centimetres, then falls back from that same height. It stops as soon as the bounce height is `0`.

Print the number of times the ball hits the ground, then the total vertical distance it travels, in centimetres.

## Input
A single line containing two integers `H` and `P` separated by a space.

## Output
A single line with two integers separated by a space: the number of times the ball hits the ground, then the total distance travelled (falls and rises).

## Constraints
- 1 ≤ H ≤ 10⁹
- 0 ≤ P ≤ 99
- In C++, the total distance needs a `long long`.

## Hints
1. The variables that describe the situation: the height of the last fall, the number of hits and the distance travelled. At the start, the ball falls from `H`: one hit, and `H` centimetres travelled.
2. At each turn of the loop, compute the bounce height. If it is positive, the ball rises and falls back by that height: that's twice the height in distance, and one more hit.
3. Example: with `H = 100` and `P = 50`, the ball bounces up 50, 25, 12, 6, 3, 1, then 0. It hits the ground 7 times and travels `100 + 2 × (50 + 25 + 12 + 6 + 3 + 1) = 294` centimetres.

## Solution
Simulate the bounces one by one. The variable `h` holds the height of the last fall. At the start, `h = H`, the number of hits is 1 and the distance is `H` (the first fall).

Then compute the bounce `h = h * P // 100`, and as long as it is positive: the ball rises by `h` and falls back by `h`, so the distance grows by `2 × h` and the number of hits by 1; then compute the next bounce. When `h` is 0, the loop stops.

The loop always ends, because `P` is at most 99: the height decreases by at least one centimetre at each bounce. Even in the worst case (`H = 10⁹`, `P = 99`), there are about 1,700 bounces.

The traps: forgetting the first fall, counting the first fall twice, or counting a hit for the zero bounce. In C++, the distance can exceed 2 × 10⁹ (it gets close to 2 × 10¹¹): you need a `long long`.
