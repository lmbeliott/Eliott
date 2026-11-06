---
title: Non-overlapping time slots
---

## Statement
A room can only host one booking at a time. N requests have arrived: request number i starts at minute D_i and lasts L_i minutes, that is, it uses the room from minute D_i (included) to minute D_i + L_i (excluded).

Each request is accepted or refused as a whole: a slot can be neither moved nor shortened. Two accepted slots must not overlap, but a slot may start exactly at the minute when the previous one finishes.

Write a program that computes the largest number of requests that can be accepted.

## Input
- The first line contains an integer N.
- Each of the next N lines contains two integers D_i and L_i.

## Output
A single integer: the maximum number of accepted slots.

## Constraints
- 1 ≤ N ≤ 15 000
- 0 ≤ D_i ≤ 99 999
- 1 ≤ L_i ≤ 500

## Hints
1. Accepting first the slots that start the earliest, or the shortest ones, does not always work: look for a counterexample. Which slot frees the room as early as possible for what comes next?
2. Among all the slots, the one that **ends** the earliest can always be accepted with no regret. Sort the slots by end time.
3. Go through the slots by increasing end time, remembering the moment when the room becomes free. Accept a slot if its start is greater than or equal to that moment.

## Solution
**The greedy idea: finish as early as possible.** We compute the end time `F_i = D_i + L_i` of each slot, and sort the slots by increasing end time. We go through them in this order, remembering `salle_libre_a` ("room free at"), the end of the last accepted slot: if `D_i ≥ salle_libre_a`, we accept the slot and `salle_libre_a` becomes `F_i`; otherwise, we refuse it.

**Why it is optimal (exchange argument).** Let g be the slot that ends the earliest, and take any optimal solution. Its first slot o ends at `F_g` or later, since g ends before all the others. Let's replace o by g: g ends before o (or at the same time), so it overlaps none of the following slots of the solution, which all start after o ends. We get a valid solution with as many slots, which starts with g. So there is an optimal solution that starts like the greedy one. We repeat with the slots that start after `F_g`, and so on.

**The other ideas fail.** On the second example, the slot that starts the earliest (minute 10, for 300 minutes) blocks the three others: accepting "earliest start first" gives 1 instead of 3. Choosing the shortest slots first fails too, for example with [0, 10), [8, 13) and [12, 22): the shortest one, [8, 13), blocks the two others.

**Complexity.** Sorting costs O(N log N), the scan O(N).

**Why the naive solution is too slow.** Trying every subset of requests is exponential: there are 2ᴺ of them. A dynamic programming solution that, for each slot, looks at all the previous slots costs O(N²), more than 10⁸ operations: about ten seconds in Python.

**Traps.**
- Slots are half-open: a slot that starts at minute 60 is compatible with a slot that ends at minute 60. Hence the condition `D_i ≥ salle_libre_a` (and not `>`).
- Make sure you sort by **end** time, not by start time or by duration.
