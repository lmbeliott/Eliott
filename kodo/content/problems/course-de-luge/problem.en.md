---
title: The sled race
---

## Statement
Every winter, Mia and Théo have a sled race on the village slope. They go down one after the other, and Hugo times each run in seconds. The fastest one, meaning the one who took **the least time**, wins the race.

Write a program that reads Mia's time, then Théo's time, and prints the winner's name, or `EGALITE` (French for "tie") if their times are equal.

## Input
A single line containing two integers `A` and `B` separated by a space: Mia's time, then Théo's time, in seconds.

## Output
A single word, in capital letters and without accents:
- `MIA` if Mia won;
- `THEO` if Théo won;
- `EGALITE` if both times are equal.

## Constraints
- 1 ≤ A, B ≤ 600

## Hints
1. There are three possible cases. In Python, you chain them with `if`, `elif` and `else`; in C++, with `if`, `else if` and `else`.
2. Mia wins if her time is **smaller** than Théo's: `a < b`.
3. If Mia didn't win and Théo didn't win either, only one possibility is left: a tie. The final `else` takes care of it.

## Solution
We compare the two times:
- if `A < B`, Mia was faster: we print `MIA`;
- otherwise, if `B < A`, Théo was faster: we print `THEO`;
- otherwise, both times are equal: we print `EGALITE`.

The first trap is to think that the bigger number wins, like a score. Here we are measuring a time: the smaller, the better.

The second trap is to forget about ties. With only an `if` and an `else`, a program like "if `A < B` then `MIA`, otherwise `THEO`" would let Théo win when the times are equal.
