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

**Why it is optimal.** Number the tasks by increasing deadline, and let f_k(j) be the smallest total duration of a set of j tasks chosen among the first k that can be finished on time (+∞ if there is none). Prove by induction the invariant: after the first k tasks, A is finished on time, and for every j, f_k(j) is the sum of the j smallest durations of A (+∞ if j > |A|). In particular, |A| is the largest possible number of tasks on time.

Add task k + 1, of duration p and deadline d, the latest so far. A set of j tasks on time among the first k + 1 either does not contain it, or is made of j − 1 tasks on time among the first k, then this task, done last, which requires their duration plus p to be at most d. We may as well take these j − 1 tasks of minimum duration: f_{k+1}(j) = min(f_k(j), f_k(j − 1) + p), the second term counting only if f_k(j − 1) + p ≤ d. And the minimum of "sum of the j smallest durations of A" and "sum of the j − 1 smallest + p" is exactly the sum of the j smallest durations of A and task k + 1 together.

- If T + p ≤ d, the condition holds for every j ≤ |A| + 1, since f_k(j − 1) ≤ T: the invariant holds for A plus task k + 1.
- Otherwise, no set of |A| + 1 tasks is possible, since f_k(|A|) + p = T + p > d. For j ≤ |A|, if the condition fails, f_k(j − 1) + p > d ≥ T ≥ f_k(j) (T ≤ d, since A is on time and its deadlines are at most d): so p exceeds the j-th smallest duration of A, the minimum is f_k(j), and it is still the sum of the j smallest durations together. These j smallest durations never use the longest one: the invariant holds for the set obtained by removing the longest task. This set is finished on time: if the removed task is task k + 1, it is A; otherwise, the other tasks finish earlier than before, and task k + 1 finishes at T + p − (removed duration) ≤ T ≤ d.

**A priority queue.** To remove the longest task fast, store the accepted durations in a **priority queue**, which gives and removes the maximum in O(log N). In Python, `heapq` gives the minimum: store the durations with a minus sign. **Cost**: O(N log N). A list scanned at each removal would cost O(N²).
