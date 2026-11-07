---
title: Longest run in an interval
---

## Statement
The temperature is recorded for `N` days. A day is **mild** if its temperature is between `A` and `B` (bounds included). Print the largest number of consecutive mild days.

## Input
- The first line contains three integers `N`, `A` and `B`.
- The second line contains `N` integers separated by spaces: the temperatures, in order.

## Output
A single integer: the length of the longest run of consecutive mild days, or `0` if there is no mild day.

## Constraints
- 1 ≤ N ≤ 10 000
- −50 ≤ A ≤ B ≤ 50
- −50 ≤ each temperature ≤ 50

## Hints
1. Keep the length of the **current** run up to date: the number of consecutive mild days ending on the day just read.
2. A mild day extends the current run by 1. A day that is not mild resets it to 0.
3. The answer is the maximum of all the values taken by the current run.

## Solution
Keep two variables, both starting at 0: `current`, the length of the run ending on the current day, and `record`, the largest length seen.

For each temperature `t`:
- if `A <= t and t <= B`, the day is mild: `current` grows by 1, and if it goes beyond `record`, `record` takes its value;
- otherwise, the run is broken: `current` goes back to 0.

The trap is to update the record only when a run is broken: a run that lasts until the last day would then never be taken into account. Updating `record` on every mild day avoids this problem.

Since no value needs special handling, in Python you can go directly through the pieces of the second line.
