---
title: Row and seat
---

## Statement
In a room, each row has `M` seats. People come in one by one and sit down in the order they arrive: first the whole first row, from seat 1 to seat `M`, then the whole second row, and so on. Rows and seats are numbered starting from 1.

Write a program that prints the row number and the seat number of the `K`-th person to come in.

## Input
A single line containing two integers `M` and `K` separated by a space: the number of seats in a row, then the arrival number of the person.

## Output
A single line containing two integers separated by a space: the row number, then the seat number.

## Constraints
- 1 ≤ M ≤ 1 000
- 1 ≤ K ≤ 1 000 000

## Hints
1. Try it by hand with `M = 10`: people 1 to 10 are in row 1, people 11 to 20 in row 2. Where is person 20? And person 21?
2. Computing `K // M` isn't enough: with `M = 10`, people 10 and 11 both give `1`, yet they are not in the same row. The trouble comes from the numbers starting at 1.
3. Count from 0 instead: person `K` is person number `K - 1` if you start at 0. With this numbering, the quotient and the remainder of the division by `M` give the row and the seat directly, also counted from 0. Then just add 1.

## Solution
Numbers that start at 1 make the computations harder. The trick is to count everything from 0:
- the `K`-th person has number `K - 1`;
- with rows of `M` seats, person number `K - 1` is in row number `(K - 1) // M`, on seat number `(K - 1) % M`, both counted from 0;
- add 1 to each of them to go back to a numbering that starts at 1.

Example: `M = 10` and `K = 20`. We compute `19 // 10 = 1` and `19 % 10 = 9`, so row 2 and seat 10. That's indeed the last seat of the second row.

The classic trap: computing `K // M` and `K % M` directly. For `K = 20`, you would get row 2 and seat 0, which doesn't exist! Shifting by 1 handles every case at once, without any `if`.
