---
title: Queue at a counter
---

## Statement
A counter serves customers one by one, in their order of arrival. Each customer arrives at a time `T` and needs `D` minutes at the counter. They are served as soon as they arrive if the counter is free; otherwise they wait until the previous customer has finished. The counter never takes a break while a customer is waiting.

Print the total waiting time of all customers (the time spent in the queue, before reaching the counter), then the time when the last customer leaves the counter.

## Input
- The first line contains the integer `N`, the number of customers.
- Each of the next `N` lines contains two integers `T` and `D`: the arrival time and the service time of a customer. Customers are given in order of arrival: the times `T` never decrease.

## Output
A single line with two integers separated by a space: the total waiting time, then the time when the last customer has finished.

## Constraints
- 1 ≤ N ≤ 1,000
- 0 ≤ T ≤ 1,000,000
- 1 ≤ D ≤ 1,000

## Hints
1. A single piece of information is enough to describe the counter: the time when it will be free. At the start, it is free at time 0.
2. When a customer arrives at time `T`, their service starts at the later of `T` and the time when the counter becomes free.
3. Their wait is then `start - T`, and the counter will be free at `start + D`.

## Solution
Simulate the counter customer by customer with a single state variable, `libre`, the time when the counter will be available (0 at the start).

For each customer `(T, D)`:
- their service starts at time `debut`, which is `T` if the counter is already free (`libre ≤ T`), and `libre` otherwise;
- their wait is `debut - T`, added to the total;
- the counter will be free at `libre = debut + D`.

At the end, `libre` is the time when the last customer finishes.

Example: with the customers `(0, 5)`, `(2, 3)` and `(20, 4)`, the first is served from 0 to 5; the second, who arrived at 2, waits 3 minutes and is served from 5 to 8; the third, who arrived at 20, finds the counter free and finishes at 24. The answer is `3 24`.

The trap: writing `debut = libre` without the `if`. When the counter has been free for a long time, the customer would then have a negative wait, or start before arriving.
