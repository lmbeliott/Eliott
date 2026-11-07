---
title: Tower of Hanoi with three disks
---

## Statement
Three pegs are labelled `A`, `B` and `C`. Three disks of different sizes are stacked on peg `A`, the largest at the bottom and the smallest at the top. A **move** consists of taking the top disk of a peg and putting it on another peg, provided that a disk is never put on a smaller disk.

Print a sequence of moves that brings the three disks onto peg `C`, with as few moves as possible.

## Input
None: the program reads nothing.

## Output
One move per line, in the order they are performed. A move is written with two letters separated by a space: the starting peg then the destination peg. For instance, `A B` means "take the top disk of peg `A` and put it on peg `B`".

## Hints
1. At some point the large disk must go from `A` to `C`. At that moment, where must the two other disks be?
2. So you must first bring the two small disks onto `B`, using `C` as an intermediate peg. For that, the smallest disk must first go to `C`.
3. Moving two disks takes 3 moves. The minimal total is 3 + 1 + 3 = 7.

## Solution
For the large disk to go from `A` to `C`, it must be alone on `A` and `C` must be empty: the two small disks are therefore both on `B`. The plan splits into three parts:

1. bring the two small disks from `A` to `B`: `A C`, `A B`, `C B` (the smallest one makes a detour through `C`);
2. move the large disk: `A C`;
3. bring the two small disks from `B` to `C`: `B A`, `B C`, `A C` (this time, the detour goes through `A`).

That makes 7 moves, and you cannot do fewer: moving two disks takes at least 3 moves, and it must be done both before and after the large disk moves. To check the answer, simulate the 7 moves on paper, drawing the three pegs after each one.

This is a classic problem, the **Tower of Hanoi**. With n disks, the same idea gives a solution in 2ⁿ − 1 moves; you will write it as a program in the chapter on recursion.
