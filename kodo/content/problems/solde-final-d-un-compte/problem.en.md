---
title: Final balance of an account
---

## Statement
An account holds `S` euros. Then `N` operations are made: a positive number is a deposit, a negative number is a withdrawal. Print the balance of the account after all the operations.

## Input
- The first line contains two integers `S` and `N` separated by a space.
- Each of the next `N` lines contains an integer: the amount of one operation.

## Output
A single integer: the final balance (it can be negative).

## Constraints
- 0 ≤ S ≤ 1 000 000
- 1 ≤ N ≤ 1 000
- −10 000 ≤ each operation ≤ 10 000

## Hints
1. The first line holds two numbers: split it with `split()`.
2. A loop of `N` iterations reads one operation per iteration, with one `input()` per line.
3. The balance starts at `S`, and every operation is added to it, whether it is positive or negative.

## Solution
The balance is a variable that starts at `S`. At each iteration, read an operation and add it to the balance: adding a negative number means taking money out, so there is no case to tell apart. After the loop, print the balance.

The trap is the input format: the first line holds two values, the following ones a single value. In Python, write `s, n = map(int, input().split())`, then `int(input())` inside the loop.
