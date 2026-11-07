---
title: K-th number in dictionary order
---

## Statement
The integers from 1 to N are arranged in dictionary order, like words: their writings are compared digit by digit, and a word that is the beginning of another comes before it. For N = 13, this gives 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9.

Answer Q questions: what is the K-th number of this list?

## Input
The first line contains Q. Each of the next Q lines contains N and K.

## Output
Q lines: the K-th number of the list of the integers from 1 to N arranged in dictionary order.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ K ≤ N ≤ 10¹⁸

## Hints
1. Sorting the N numbers is impossible for N = 10¹⁸. But whole blocks can be skipped: all the numbers starting with 1 come before all those starting with 2.
2. Write a function `count(start, N)` that returns the number of integers from 1 to N whose writing starts with that of `start`. For `start` = 12: 12, then 120 to 129, then 1,200 to 1,299… cut off at N.
3. Start from `start` = 1, which is the first number. If the numbers starting with `start` are fewer than K (counting the one you are on), skip them all and move to `start + 1`. Otherwise the answer starts with `start`: go down to `start × 10`.

## Solution
**Counting a block.** The integers starting with p (written in base 10) are p, then the 10 integers from 10p to 10p + 9, then the 100 integers from 100p to 100p + 99, etc. The function `count(p, N)` adds, for each length, the size of the interval [first, last] cut off at N: `min(N, last) − first + 1`, while `first ≤ N`. There are at most 19 lengths.

**Going down in order.** In dictionary order, the number p is followed by all the numbers that start with p (in the order p0…, p1…, …, p9…), then by the block starting with p + 1. Keep the current number p and the rank k still to go through, starting from p = 1 and k = K − 1 (the number 1 is the first one). While k > 0:

- if `count(p, N) ≤ k`, the answer is not in the block of p: subtract the size of the block from k and move to p + 1;
- otherwise the answer is in the block of p, but it is not p itself (k > 0): move to the first number after p, which is 10p, and subtract 1 from k.

**Correctness.** Invariant: the answer is the (k + 1)-th number of the list from p on, and it lies in the block of the **parent** of p (the number p without its last digit). So we never go from p = 19 to p = 20: the answer would then be outside the block of 1. Moving to p + 1 therefore stays inside the same parent block, where the order of the sub-blocks is indeed p, p + 1, …

**Cost.** Each step goes down one digit or moves to the next digit: at most 19 descents and 10 moves per level, each with a call to `count` in 19 steps, a few thousand operations per question. In C++, 10 × last must not exceed the capacity of a `long long`: stop multiplying as soon as the bound exceeds N / 10.
