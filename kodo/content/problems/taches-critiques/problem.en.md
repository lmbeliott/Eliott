---
title: Critical tasks
---

## Statement
A project is split into `N` tasks, numbered from `1` to `N`. Task `i` lasts `D[i]` time units. Some tasks must wait for other tasks to finish: a constraint `A B` means that task `B` can only start once task `A` is finished. Apart from that, any number of tasks can run at the same time.

The project starts at time `0`. Its **duration** is the time at which its last task finishes. A task is **critical** if increasing its duration by `1` (and changing nothing else) increases the minimum duration of the project.

Write a program that computes the minimum duration of the project and the number of critical tasks. If the constraints make it impossible to carry out all the tasks, print `-1`.

## Input
- The first line contains two integers `N` and `M`: the number of tasks and the number of constraints.
- The second line contains `N` integers `D[1] … D[N]`.
- Each of the next `M` lines contains two integers `A` and `B`: task `B` can only start after task `A` is finished.

## Output
Two integers separated by a space: the minimum duration of the project, then the number of critical tasks. If the project cannot be carried out, print only `-1`.

## Constraints
- 1 ≤ N ≤ 6 000
- 0 ≤ M ≤ 8 000
- 1 ≤ D[i] ≤ 1 000
- 1 ≤ A, B ≤ N and A ≠ B; the same constraint may appear several times

## Hints
1. The project is impossible exactly when the constraints form a cycle. A **topological order** (each task placed after all the tasks it waits for) detects it: remove, one by one, the tasks that are no longer waiting for anything. If some remain at the end, there is a cycle.
2. Going through the tasks in topological order, the earliest start of a task is the maximum of the end times of the tasks it waits for. The duration of the project is the longest **chain** of tasks, adding up their durations.
3. A task is critical if a chain of maximum duration goes through it. Also compute, going through the topological order backwards, the duration of the longest chain that **starts** with each task: task `v` is critical if `start[v] + rest[v]` equals the duration of the project.

## Solution
The tasks and the constraints form a **directed graph**: one arc `A → B` per constraint. The minimum duration of the project is the largest total duration of a chain of tasks that follow each other in this graph. It only makes sense if the graph has **no cycle**: otherwise the tasks of a cycle wait for each other and never start.

**Topological order (Kahn's algorithm).** For each task, count the number of arcs entering it. Put all the tasks with count `0` in a list, then go through it: processing a task `u` removes its outgoing arcs, and a task whose count drops to `0` is appended to the list. If the final list holds fewer than `N` tasks, the remaining ones are blocked by a cycle: print `-1`.

**Earliest start times.** In topological order, all the tasks that `v` waits for are processed before it. Set `start[v] = max(start[u] + D[u])` over the arcs `u → v` (or `0` if there are none). The duration of the project is `T = max(start[v] + D[v])`.

**Critical tasks.** In reverse topological order, `rest[v] = D[v] + max(rest[w])` over the arcs `v → w`: the duration of the longest chain that starts with `v`. The longest chain that **goes through** `v` lasts `start[v] + rest[v]`. If it equals `T`, making `v` longer by `1` makes this chain longer, hence the project: `v` is critical. Otherwise this chain lasts at most `T - 1`, and making `v` longer by `1` does not change `T`.

Complexity: **O(N + M)**.

Why the naive approaches fail:
- Applying the definition (for each task, increase its duration and recompute everything) costs O(N × (N + M)), about 10⁸ operations: too slow in Python.
- Relaxing the constraints in a loop until nothing changes ("if `B` starts before `A` ends, shift `B`") may need `N` rounds over the `M` constraints when the tasks are given in the wrong order.
- A recursive depth-first search exceeds Python's recursion limit on a chain of 6,000 tasks.

Pitfalls:
- A task with no constraint can be critical: that happens if it lasts `T` on its own.
- Duplicate constraints are not a problem with Kahn's algorithm, as long as each arc is counted in the in-degree and decremented as many times.
- A critical task is not necessarily on **the** chain found by walking back from the end: several chains may reach the maximum duration, and all their tasks count.
