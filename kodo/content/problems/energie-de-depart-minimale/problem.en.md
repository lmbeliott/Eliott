---
title: Minimal starting energy
---

## Statement
You must do N tasks, one by one, in the order of your choice. To start task i, you need at least R_i energy points. Once the task is finished, your energy changes by G_i points: it goes up if G_i is positive, down if it is negative. We always have R_i ≥ −G_i: so the energy never becomes negative.

Write a program that computes the smallest starting energy that lets you do all the tasks, choosing their order well.

## Input
- The first line contains an integer N.
- Each of the next N lines contains two integers R_i and G_i.

## Output
A single integer: the minimal starting energy.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ R_i ≤ 10⁶
- −R_i ≤ G_i ≤ 10⁶

## Hints
1. A task that gives energy (G_i ≥ 0) never hurts: better do it before the ones that cost energy. Among the tasks that give energy, which one should you do first?
2. For the tasks that cost energy, compare two neighbouring tasks a and b: how much energy do you need before them to do a then b? And to do b then a? Look at the second example: starting with the most demanding one is not always the right choice.
3. Doing a then b requires `max(R_a, R_b − G_a)`. The tasks that cost energy are sorted by decreasing `R_i + G_i`: the energy left after the task, if you start it with exactly R_i. Then a single pass gives the required starting energy.

## Solution
**Computing the energy needed for a fixed order.** If we do the tasks in a given order, and V is the total change of energy before task i, we need a starting energy E such that `E + V ≥ R_i`. The minimal starting energy is therefore the largest of the `R_i − V` (and at least `0`). A single pass is enough. The whole question is choosing the order.

**First the tasks that give energy, least demanding first.** If a task that costs energy is right before a task that gives energy, swapping them never requires more energy: the task that gives, done earlier, no longer suffers the other one's loss and so has more energy than before, and the one that costs, done after the gain, has at least as much. Among the tasks that give energy, we do them by increasing R_i: when we reach the most demanding one, we have gained everything we could before.

**Then the tasks that cost energy, by decreasing remaining energy.** For two neighbouring tasks a and b that cost energy, doing a then b requires, before them, `max(R_a, R_b − G_a)`, and b then a requires `max(R_b, R_a − G_b)`. If `R_a + G_a ≥ R_b + G_b`, then `R_b − G_a ≤ R_a − G_b`, and since `R_a ≤ R_a − G_b` (G_b is negative), doing a first never costs more. This is the exchange argument: we sort the tasks that cost energy by decreasing `R_i + G_i`. This quantity is the energy left if you start the task with exactly R_i: we keep for the end the tasks that leave the least.

In the second example, we first do (3, +4). Then (6, −2), which leaves 4, before (7, −5), which leaves 2. Starting from 5: 5 → 9 → 7 → 2, and each task has the energy it requires. With 4, we would have 8 then 6: not enough for (7, −5). Starting the costly tasks with the most demanding one (7, −5) would require 7.

**Complexity.** Two sorts and one pass: O(N log N).

**Why the simple solutions fail.** Trying every order is impossible (N! orders). The sorts that come to mind first are wrong: sorting everything by increasing R_i, doing the costly tasks from most to least demanding, or from the smallest loss to the largest, or doing the largest gains first. Each of these sorts goes wrong on some tests.

**Traps.**
- The answer can go beyond 2³¹ (up to about 10¹⁰): use `long long` in C++.
- Tasks with G_i = 0 go with the ones that give energy (or anywhere: they do not change the energy).
- The answer is at least `0`, even if no task requires any energy.
