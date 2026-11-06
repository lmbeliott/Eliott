---
title: Climb and slip back
---

## Statement
A snail climbs up a wall that is `H` centimeters high. Every day, it climbs `A` centimeters; every night, if it hasn't reached the top yet, it slips back down `B` centimeters.

Write a program that prints the number of the day when the snail reaches the top of the wall: it's the first day when, after climbing `A` centimeters, the snail is `H` centimeters or more above the ground. It starts from the ground, and the first day is day 1.

## Input
A single line containing three integers `A`, `B` and `H` separated by spaces: the climb of each day, the slide of each night and the height of the wall, in centimeters.

## Output
A single integer: the number of the day when the snail reaches the top of the wall.

## Constraints
- 1 ≤ A ≤ 1,000
- 0 ≤ B < A (so the snail makes a little progress every day)
- 1 ≤ H ≤ 50,000

## Hints
1. Simulate the climb day after day with a `while` loop. Keep two variables: the current height of the snail and the number of the day.
2. On day 1, the snail climbs `A` centimeters. Then, as long as it is below `H`: it slips back `B` centimeters during the night, we move on to the next day, and it climbs `A` centimeters again.
3. On the day it reaches the top, the snail doesn't slip back. That's why dividing `H` by `A - B` doesn't give the right answer.

## Solution
We simulate the climb. At the start, it's day 1 and the snail has just climbed: its height is `A`. As long as this height is smaller than `H`, the snail hasn't arrived: it slips back `B` during the night, we move on to the next day, and it climbs `A` again. As soon as the height reaches or goes above `H`, the loop stops and we print the number of the day.

Let's take `A = 400`, `B = 300` and `H = 1000`. Each full day gains 100 centimeters, so you might think it takes 1,000 / 100 = 10 days. But on the morning of day 7, the snail is at 600 centimeters; by climbing 400 centimeters, it reaches 1,000 centimeters, the top of the wall. So the answer is 7: on the last day, the snail doesn't slip back, and it benefits from its whole climb.

The other trap is the arrival condition: reaching exactly `H` centimeters is enough. So the loop goes on as long as the height is **strictly** smaller than `H`.
