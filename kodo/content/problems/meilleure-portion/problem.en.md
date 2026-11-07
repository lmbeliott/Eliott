---
title: Best stretch
---

## Statement
A shopkeeper records the profit of each day, positive or negative, for `N` days numbered from 1 to `N`. Find a period of consecutive days (at least one day) whose total profit is as large as possible.

If several periods give this same total, choose the one that starts earliest, and among those, the shortest.

## Input
- The first line contains `N`.
- The second line contains the `N` profits, in the order of the days.

## Output
Three integers on one line: the total profit of the period, its first day and its last day.

## Constraints
- 1 ≤ N ≤ 30,000
- Each profit is between −1,000 and 1,000.

## Hints
1. Trying every period, with a sum updated as you go, would take about `N² / 2` additions: 450 million. Too slow.
2. For each day `i`, look for the best period that **ends** on day `i`. How can you deduce it from the best period that ends on day `i − 1`?
3. If the best sum ending the day before is negative, you had better start again from zero and begin the period on day `i`.

## Solution
Let `end[i]` be the largest total of a period that ends on day `i`. Such a period is either day `i` alone, or a period ending the day before, extended by day `i`. In the second case, the best choice is the best period ending the day before. So `end[i] = t[i] + max(end[i − 1], 0)`: extend if `end[i − 1] ≥ 0`, start again otherwise. The answer is the largest `end[i]`, since every period ends on some day.

The program goes through the days, keeping `current` (the value of `end[i]`) and `start` (the first day of the corresponding period) up to date, as well as the best total seen and its period. When `end[i − 1] = 0`, **extend**: the period then starts earlier. And replace the best only if `current` is **strictly** larger: the first period found is kept. One can check that these two choices indeed give the period that starts earliest, then the shortest: if two periods with the maximum total overlap badly, the part separating them has a total of zero, which provides a period further to the left, found first.

Cost: a single pass, a constant number of operations per day. The trap: initialising the best total to 0, which is wrong when all profits are negative (the answer is then the largest of them, on a single day). Initialise it with the first day.
