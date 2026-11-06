---
title: Climb high, sleep low
---

## Statement
To get used to the altitude, the Valcorde mountain guides follow a golden rule: "climb high, sleep low". While climbing a summit, Malik's team of climbers goes up `A` meters every day. In the evening, if it hasn't reached the summit yet, the team goes back down `B` meters to sleep a bit lower. The summit is `H` meters above the starting point.

Write a program that prints the number of the day when the team reaches the summit: it's the first day when, after climbing `A` meters, the team is `H` meters or more above the starting point. The first day of the climb is day 1.

## Input
A single line containing three integers `A`, `B` and `H` separated by spaces: the climb of each day, the descent of each evening and the height of the summit, in meters.

## Output
A single integer: the number of the day when the team reaches the summit.

## Constraints
- 1 ≤ A ≤ 1,000
- 0 ≤ B < A (so the team makes a little progress every day)
- 1 ≤ H ≤ 50,000

## Hints
1. Simulate the climb day after day with a `while` loop. Keep two variables: the current height of the team and the number of the day.
2. On day 1, the team climbs `A` meters. Then, as long as it is below `H`: it goes down `B` meters for the night, we move on to the next day, and it climbs `A` meters again.
3. On the day it reaches the summit, the team doesn't go back down. That's why dividing `H` by `A - B` doesn't give the right answer.

## Solution
We simulate the climb. At the start, it's day 1 and the team has just climbed: its height is `A`. As long as this height is smaller than `H`, the summit hasn't been reached: the team goes down `B` for the night, we move on to the next day, and it climbs `A` again. As soon as the height reaches or goes above `H`, the loop stops and we print the number of the day.

Let's take `A = 400`, `B = 300` and `H = 1000`. Each full day gains 100 meters, so you might think it takes 1,000 / 100 = 10 days. But on the morning of day 7, the team is at 600 meters; by climbing 400 meters, it reaches 1,000 meters and the summit. So the answer is 7: on the last day, the team doesn't go back down, and it benefits from its whole climb.

The other trap is the arrival condition: reaching exactly `H` meters is enough. So the loop goes on as long as the height is **strictly** smaller than `H`.
