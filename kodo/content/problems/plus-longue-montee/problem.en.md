---
title: Longest climb
---

## Statement
`N` measurements have been taken, one after the other. A **climb** is a group of consecutive measurements in which each measurement is strictly greater than the previous one. A single measurement forms a climb of length 1.

Write a program that prints the length of the longest climb, that is, its number of measurements.

For example, in `3 1 4 5 9 2 6`, the longest climb is `1 4 5 9`: its length is 4.

## Input
- The first line contains the integer `N`, the number of measurements.
- Each of the next `N` lines contains an integer: a measurement, in the order they were taken.

## Output
A single integer: the length of the longest climb.

## Constraints
- 1 ≤ N ≤ 10,000
- Each measurement is between 0 and 1,000,000.

## Hints
1. Read the measurements one by one, and remember the previous one. For each new measurement, only one question matters: is it strictly greater than the previous one?
2. Also keep the length of the current climb, the one that ends on the measurement you just read. If the new measurement is greater than the previous one, the climb goes on: its length increases by 1. Otherwise, a new climb starts, of length 1.
3. After each measurement, compare the length of the current climb with the best length seen so far. Don't do it only when a climb stops: the longest one may go all the way to the last measurement.

## Solution
Read the first measurement separately: it forms a climb of length 1, which is also the best one so far. Then, for each of the next `N - 1` measurements:
- if it is strictly greater than the previous one, the current climb goes on: `current = current + 1`;
- otherwise, a new climb starts with this measurement: `current = 1`;
- if `current` is greater than `best`, update `best`;
- finally, the measurement you read becomes the "previous" one for the next turn.

Example with `3 1 4 5 9 2 6`: the current length is successively 1, 1, 2, 3, 4, 1, 2. The largest is 4.

The traps:
- two equal measurements stop the climb: you need "strictly greater", so `>` and not `>=`;
- updating `best` only when a climb stops: if the longest climb ends on the last measurement, you miss it. Updating after each measurement avoids this problem;
- starting `best` at 0: with a single measurement, the answer is 1.
