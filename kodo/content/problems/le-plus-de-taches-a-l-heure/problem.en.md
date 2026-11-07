---
title: The most tasks on time
---

## Statement
A workshop receives N tasks. Task i takes pᵢ minutes and must be **finished at the latest** at time dᵢ. The workshop does one task at a time, without pause, starting at time 0, and it may refuse tasks: a refused task is not done at all.

Print the largest number of tasks the workshop can accept, so as to finish all of them on time.

## Input
The first line contains N. Each of the next N lines contains two integers pᵢ and dᵢ.

## Output
The largest number of tasks finished on time.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ pᵢ ≤ 1,000
- 1 ≤ dᵢ ≤ 10⁷

## Hints
1. Once the tasks to do are chosen, in which order should they be done so that they are all on time, if possible? (Think of the smallest maximum lateness.)
2. Go through the tasks by increasing deadline, accepting them. If the last accepted one ends late, one of the accepted tasks must be dropped: which one frees the most time?
3. Drop the longest of the accepted tasks. To find it fast, use a priority queue (`heapq` in Python, `priority_queue` in C++).

## Solution
**Testing a set of tasks.** By the exchange argument of the lesson (maximum lateness), a set of tasks can be finished on time if and only if it is when its tasks are done by increasing deadline.

**Greedy.** Go through the tasks by increasing deadline, keeping the set A of accepted tasks and their total duration T. Add the current task: T grows by pᵢ. If T > dᵢ, the current task, which is the last in deadline order, ends late; then remove from A the **longest** task (possibly the current task itself), and T decreases by as much. The answer is the number of tasks in A at the end.

**Why it is optimal.** Prove by induction the invariant: after the first k tasks, A can be done on time, has the largest possible number of tasks among the first k, and, among the feasible sets of this size, the smallest total duration. If task k + 1 fits (T + p ≤ d), A plus this task is feasible and the maximum size can only grow by 1: the invariant still holds (no set of the same size has a smaller duration, otherwise removing task k + 1 from it would beat A). Otherwise, no feasible set can have one task more than A: it would contain task k + 1 and a set of |A| tasks among the first k, of duration at least T, so it would end after T + p > d. The size stays |A|, and removing the longest task of A plus task k + 1 gives the smallest possible duration for this size. The resulting set is feasible: its duration is at most T, which fitted before the deadline of all previous tasks, and task k + 1 has the latest deadline.

**A priority queue.** To remove the longest task fast, store the accepted durations in a **priority queue**, which gives and removes the maximum in O(log N). In Python, `heapq` gives the minimum: store the durations with a minus sign. **Cost**: O(N log N). A list scanned at each removal would cost O(N²).
