---
title: K-th move of the towers of Hanoi
---

## Statement
Three pegs are numbered 1, 2 and 3. On peg 1 are stacked N disks of sizes 1 (the smallest, at the top) to N (the largest, at the bottom). They are all moved to peg 3, one disk at a time, never putting a disk on a smaller one, with the classic recursive method. To move a tower of n disks from peg a to peg b, using peg c:

1. if n = 0, there is nothing to do;
2. otherwise, move the tower of the n − 1 smallest disks from a to c (using b);
3. move disk n from a to b;
4. move the tower of the n − 1 smallest disks from c to b (using a).

The complete move, from 1 to 3 using 2, takes 2^N − 1 steps. Answer Q questions: what is the K-th move?

## Input
The first line contains N and Q. Each of the next Q lines contains an integer K.

## Output
For each question, one line with three integers: the number of the disk moved, the starting peg and the destination peg.

## Constraints
- 1 ≤ N ≤ 60
- 1 ≤ Q ≤ 1,000
- 1 ≤ K ≤ 2^N − 1

## Hints
1. With N = 60, there are more than 10¹⁸ moves: simulating them is impossible. You must go straight to the right move.
2. Moving a tower of n disks takes exactly 2^n − 1 steps (by induction). The first 2^(n−1) − 1 steps move the small tower, the next step moves disk n, the others move the small tower again.
3. A function `find(n, a, b, c, k)` compares `k` with `2^(n−1)` and makes a single recursive call, with the right pegs.

## Solution
Let T(n) be the number of steps to move a tower of n disks. T(0) = 0 and T(n) = 2 T(n − 1) + 1, so T(n) = 2^n − 1: by induction, 2 × (2^(n−1) − 1) + 1 = 2^n − 1.

In the move of a tower of n disks from a to b, let `m = 2^(n−1)`. Steps 1 to m − 1 are the move of the small tower from a to c, step m moves disk n from a to b, and steps m + 1 to 2^n − 1 are the move of the small tower from c to b. Hence the recursive function `find(n, a, b, c, k)`:

- if `k = m`, the answer is disk n, from a to b;
- if `k < m`, it is the k-th step of the small tower: `find(n − 1, a, c, b, k)`;
- if `k > m`, it is step `k − m` of the second move: `find(n − 1, c, b, a, k − m)`.

**Correctness.** By induction on n: the split above copies steps 2 to 4 of the method, and `k` always stays between 1 and 2^n − 1, so the call reaches the case `k = m` at the latest when n = 1.

**Cost.** Each call makes a single recursive call, with n decreased by 1: at most 60 calls per question, instead of 2^60 simulated steps. In C++, K and `m` are computed as `long long`, with `1LL << (n − 1)`: writing `1 << (n − 1)` overflows as soon as n exceeds 32.
