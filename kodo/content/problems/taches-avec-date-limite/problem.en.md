---
title: Tasks with deadlines
---

## Statement
There are N tasks. Each task takes exactly one day, and only one task can be done per day; days are numbered 1, 2, 3… Task number i is worth G_i points if it is done on day D_i at the latest. A task done too late is worth nothing: you might as well skip it.

Write a program that computes the largest total number of points you can get by choosing well which tasks to do and on which days.

## Input
- The first line contains an integer N.
- Each of the next N lines contains two integers D_i and G_i.

## Output
A single integer: the largest possible total number of points.

## Constraints
- 1 ≤ N ≤ 15,000
- 1 ≤ D_i ≤ 10⁹
- 1 ≤ G_i ≤ 10,000

## Hints
1. Once you have chosen a set of tasks, it is easy to check whether it is feasible: do them by increasing deadline. It is feasible if, for every day d, at most d chosen tasks have a deadline less than or equal to d.
2. Go through the tasks by increasing deadline, keeping all of them. When you have just added a task with deadline d and you are keeping more than d tasks, the set is no longer feasible: you must drop one. Which one?
3. Drop the kept task worth the fewest points. To find it quickly, store the points of the kept tasks in a heap (`heapq` in Python, `priority_queue` in C++).

## Solution
**Knowing whether a choice is feasible.** A set of tasks is feasible if they can be placed on distinct days, each one before its deadline. The best way is to do them by increasing deadline: the j-th task in this order is done on day j, and the set is feasible if and only if every task has a deadline at least equal to its rank. In other words: for every d, at most d chosen tasks have a deadline ≤ d.

**The greedy idea: keep everything, then fix it.** We go through the tasks by increasing deadline. We add each task to the kept set. If we now keep more tasks than the deadline d of the one we just added, there is exactly one too many among those with a deadline ≤ d: we remove the one worth the fewest points (it may be the new one). At the end, the kept set is feasible, and its total is the answer.

**Why it is optimal.** We show that after each step, the kept set has the largest possible total among the feasible sets made of the tasks seen so far. When we have to remove a task, it is because there are d + 1 tasks with a deadline ≤ d: any feasible set must leave out at least one of them. Leaving out the least valuable one is the best choice: if an optimal solution leaves out another one, we can swap it for the least valuable one without losing points and without making the choice infeasible (the tasks seen so far all have a deadline ≤ d).

In the first example, we see (1, 10), then (1, 30): two tasks for one day, we drop 10. Then (2, 40) and (2, 50): three tasks for two days, we drop 30. What remains is 40 + 50 = 90 (the 40-point task is done on day 1).

**Complexity.** Sorting costs O(N log N), and each task enters and leaves the heap at most once, in O(log N): O(N log N) overall.

**Why the simple solutions fail.** Taking the tasks by increasing deadline as long as there is room is wrong: in the first example, it keeps the 10-point task instead of the 30-point one. Taking the points from largest to smallest and placing each task on its deadline day is wrong too: the 40-point task would find day 2 taken, when it could have gone on day 1. Placing it on the **last** free day before its deadline is correct, but searching for that day cell by cell costs O(N²). Finally, trying every set of tasks costs 2ᴺ.

**Traps.**
- Deadlines go up to 10⁹: no way to build an array indexed by days. With the heap, we only look at the number of kept tasks.
- The total can reach 15,000 × 10,000 = 1.5 × 10⁸: it still fits in an `int`, but a `long long` avoids any bad surprise.
- In Python, `heapq` always gives the **smallest** element: exactly what we need here. In C++, `priority_queue` gives the largest by default: use `greater<long long>`.
