---
title: Comparing two times
---

## Statement
Two runners, numbered 1 and 2, run the same race, and each one's time is measured in seconds. The fastest one, meaning the one who took **the least time**, wins the race.

Write a program that reads the time of runner 1, then the time of runner 2, and prints the number of the winner, or `EGALITE` (French for "tie") if their times are equal.

## Input
A single line containing two integers `A` and `B` separated by a space: the time of runner 1, then the time of runner 2, in seconds.

## Output
A single line:
- `1` if runner 1 won;
- `2` if runner 2 won;
- `EGALITE` (in capital letters, without accents) if both times are equal.

## Constraints
- 1 ≤ A, B ≤ 600

## Hints
1. There are three possible cases. In Python, you chain them with `if`, `elif` and `else`; in C++, with `if`, `else if` and `else`.
2. Runner 1 wins if their time is **smaller** than runner 2's: `a < b`.
3. If runner 1 didn't win and runner 2 didn't win either, only one possibility is left: a tie. The final `else` takes care of it.

## Solution
We compare the two times:
- if `A < B`, runner 1 was faster: we print `1`;
- otherwise, if `B < A`, runner 2 was faster: we print `2`;
- otherwise, both times are equal: we print `EGALITE`.

The first trap is to think that the bigger number wins, like a score. Here we are measuring a time: the smaller, the better.

The second trap is to forget about ties. With only an `if` and an `else`, a program like "if `A < B` then `1`, otherwise `2`" would let runner 2 win when the times are equal.
