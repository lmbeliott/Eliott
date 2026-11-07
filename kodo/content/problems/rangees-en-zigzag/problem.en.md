---
title: Zigzag rows
---

## Statement
In a room, each row has `M` seats, numbered from 1 to `M` from left to right. Rows are numbered starting from 1. People come in one by one and sit down in the order they arrive, in a zigzag:
- row 1 fills up from left to right: seats 1, 2, …, `M`;
- row 2 fills up from right to left: seats `M`, `M - 1`, …, 1;
- row 3 fills up from left to right again, row 4 from right to left, and so on.

Write a program that prints the row number and the seat number of the `K`-th person to come in.

This problem can be solved without `if` and without loops: with computations only.

## Input
A single line containing two integers `M` and `K` separated by a space: the number of seats in a row, then the arrival number of the person.

## Output
A single line containing two integers separated by a space: the row number, then the seat number.

## Constraints
- 1 ≤ M ≤ 1,000,000
- 1 ≤ K ≤ 1,000,000,000

## Hints
1. Start as in "Row and seat": counting from 0, the `K`-th person has number `K - 1`, sits in row `R = (K - 1) // M`, and is the `P`-th person to sit down in that row, with `P = (K - 1) % M`. `R` and `P` are counted from 0.
2. If `R` is even, the row fills up from left to right and the seat is `P + 1`. If `R` is odd, it fills up from right to left and the seat is `M - P`. Check with `M = 4` and `K = 6`.
3. To choose without `if`, use `E = R % 2`, which is 0 or 1. What is `(1 - E) × (P + 1) + E × (M - P)` when `E = 0`? And when `E = 1`?

## Solution
First, count everything from 0, as for rows that all fill up in the same direction: the `K`-th person has number `K - 1`, sits in row `R = (K - 1) // M`, and is the `P`-th person to sit down in that row, with `P = (K - 1) % M`. The row number to print is `R + 1`.

Now the seat. If `R` is even (rows 1, 3, 5… when counting from 1), people go from left to right: the seat is `P + 1`. If `R` is odd, they go from right to left: the first one takes seat `M`, the next one seat `M - 1`, and the `P`-th one seat `M - P`.

To choose between these two values without `if`, use `E = R % 2`, which is 0 when `R` is even and 1 when it is odd:

`seat = (1 - E) × (P + 1) + E × (M - P)`

When `E = 0`, the second product is zero and `P + 1` is left. When `E = 1`, the first one is zero, and `M - P` is left. Multiplying by a number that is 0 or 1 lets you "switch on" or "switch off" a term.

Example: `M = 4` and `K = 6`. We compute `R = 5 // 4 = 1` and `P = 5 % 4 = 1`. The row is number 2; `E = 1`, so the seat is `4 - 1 = 3`. Indeed, in row 2, person 5 takes seat 4 and person 6 takes seat 3.

The trap: forgetting that numbers start at 1. With `(K - 1)` instead of `K`, the last person of a row stays in their row. With `M = 1,000,000` and `K = 1,000,000,000`, all the numbers computed stay below one billion: they fit in an `int` in C++.
