---
title: Count the records
---

## Statement
A jumper writes down the length of each of their `N` jumps, in order. A jump is a **record** if it is strictly longer than all the previous jumps; the first jump is always a record. Print the number of records.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer: the length of a jump, in centimetres.

## Output
A single integer: the number of records.

## Constraints
- 1 ≤ N ≤ 1 000
- 1 ≤ each length ≤ 1 000 000

## Hints
1. A jump is longer than **all** the previous ones exactly when it is longer than the best of the previous ones.
2. So keep the running maximum up to date, and a counter.
3. The first jump counts as a record: the counter can start at 1, and the running maximum at the first length.

## Solution
Comparing each jump with all the previous ones would require keeping them in memory. That is not necessary: being larger than all previous values is the same as being larger than their maximum. So keep the running maximum `best`.

Read the first jump: it is a record, so `records = 1` and `best` takes its value. For each following jump, if its length is strictly greater than `best`, it is a new record: increase the counter and update `best`. Otherwise, nothing changes.

The trap is a tie: a jump that equals the best jump is not a record, because it is not **strictly** longer. So write `>` and not `>=`.
