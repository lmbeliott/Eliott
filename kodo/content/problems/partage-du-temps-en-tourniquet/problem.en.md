---
title: Round-robin time sharing
---

## Statement
A processor must run `N` tasks, numbered from 1 to `N`; task `i` needs `Dᵢ` units of computing time. At the start, at time 0, the tasks wait in a queue, in the order 1, 2, …, `N`.

The processor works in **round robin**: it takes the task at the front of the queue and runs it for at most `Q` units of time. If it is finished, it leaves the queue; otherwise, it goes back to the end of the queue with its remaining time. Then it moves on to the next task, without losing any time.

Print the time at which each task ends.

## Input
The first line contains `N` and `Q`. The second line contains `D₁, …, D_N`, separated by spaces.

## Output
One line of `N` integers: the end time of task 1, of task 2, …, of task `N`.

## Constraints
- 1 ≤ N ≤ 40,000
- 1 ≤ Q ≤ 1,000
- 1 ≤ Dᵢ ≤ 20 × Q

## Hints
1. Simulate with a queue holding the numbers of the tasks not yet finished, and an array of remaining times.
2. Removing the front of a Python list with `pop(0)` shifts all the other elements: with 40,000 tasks and hundreds of thousands of turns, this is too slow. Use `collections.deque` (in C++, `queue`).

## Solution
Simulate the process exactly. A queue holds the numbers of the waiting tasks, an array `reste` ("remaining") their remaining time, and a variable `t` the current time. While the queue is not empty, remove task `i` from the front and run it for `d = min(Q, reste[i])` units: `t` increases by `d` and `reste[i]` decreases by `d`. If `reste[i]` is 0, the task ends at time `t`; otherwise, put it back at the end of the queue.

**Termination and cost.** Each turn decreases the sum of the remaining times by at least 1: the simulation stops. More precisely, a task of duration `Dᵢ` reaches the front exactly `Dᵢ / Q` times, rounded up, so at most 20 times here: at most 20N = 800,000 turns, each in a few operations with a real queue. With `pop(0)` on a list, each removal shifts every task still waiting, up to N = 40,000: billions of moves.
