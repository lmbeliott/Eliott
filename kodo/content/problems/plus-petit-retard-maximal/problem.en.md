---
title: Smallest maximum lateness
---

## Statement
A printer must process N orders, one at a time, without pause, starting at time 0. Order i takes pᵢ minutes and should be finished at time dᵢ. If it ends at time C, its **lateness** is C − dᵢ if C > dᵢ, and 0 otherwise.

Print the smallest possible maximum lateness, choosing the order of the orders well: we want the largest of the N latenesses to be as small as possible.

## Input
The first line contains N. Each of the next N lines contains two integers pᵢ and dᵢ.

## Output
The smallest maximum lateness.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ pᵢ ≤ 1,000
- 0 ≤ dᵢ ≤ 10⁷

## Hints
1. Starting with the shortest orders does not work: with an order of 10 minutes due at time 10 and an order of 1 minute due at time 20, the long one must be done first.
2. Look at two orders that follow each other in a given schedule. If the first has a later deadline than the second, what happens when you swap them?
3. Sort by increasing deadline, then compute the latenesses in this order.

## Solution
**Greedy.** Process the orders by increasing deadline, and compute the successive end times and the largest lateness.

**Exchange argument.** Take any schedule, and two neighbouring orders i then j with dᵢ > d_j: an **inversion** with respect to the sort. If t is the time when i starts, j ends at t + pᵢ + p_j, with a lateness of at least t + pᵢ + p_j − d_j. Swap them. The other orders do not move. Now j ends at t + p_j, earlier than before, so its lateness can only decrease; and i ends at t + pᵢ + p_j, with a lateness of at most max(0, t + pᵢ + p_j − dᵢ), which is at most the old lateness of j since dᵢ > d_j. So the maximum lateness does not increase. Each swap decreases the number of inversions by one; starting from an optimal schedule and swapping while two neighbours are badly ordered (as in bubble sort), we reach the deadline order without ever increasing the maximum lateness: this order is optimal. Orders with the same deadline can be placed in any order: swapping two of them does not change the maximum lateness, by the same computation.

**Cost.** O(N log N) for the sort, then one pass. Trying every order would cost N!: already 3.6 million for N = 10.
