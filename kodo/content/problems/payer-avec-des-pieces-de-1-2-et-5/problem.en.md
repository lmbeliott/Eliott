---
title: Pay with coins of 1, 2 and 5
---

## Statement
You have as many coins of 1, 2 and 5 as you want. Write a program that prints the number of different ways to pay exactly the amount `N`.

The order of the coins doesn't matter: a way to pay is only a number of coins of 1, a number of coins of 2 and a number of coins of 5.

For example, there are 5 ways to pay 6: `5 + 1`, `2 + 2 + 2`, `2 + 2 + 1 + 1`, `2 + 1 + 1 + 1 + 1` and `1 + 1 + 1 + 1 + 1 + 1`.

## Input
A single line containing the integer `N`.

## Output
A single integer: the number of ways to pay exactly `N`.

The answer can be larger than 2 billion: in C++, store it in a `long long`.

## Constraints
- 1 ≤ N ≤ 1,000,000

## Hints
1. A first idea: two loops, one inside the other, one for the number of coins of 5 and one for the number of coins of 2, with coins of 1 making up the rest. But for `N = 1,000,000`, that's tens of billions of turns: far too slow.
2. Only fix the number `A` of coins of 5. What remains is `R = N - 5 × A`, to pay with coins of 2 and 1. How many ways are there to do it? Try with `R = 4`, then `R = 5`.
3. To pay `R` with coins of 2 and 1, you choose the number of coins of 2: from 0 to `R // 2`, and coins of 1 make up the rest. That makes `R // 2 + 1` ways. Only one loop is left, over `A`.

## Solution
A way to pay is fixed by the number `A` of coins of 5 and the number `B` of coins of 2: the coins of 1 make up the rest, as long as `5 × A + 2 × B` is not more than `N`.

Two loops, one inside the other, over `A` then over `B`, give the right answer, but far too slowly: for `N = 1,000,000`, there are about 50 billion pairs `(A, B)` to count one by one.

But you don't need to list them: for a given number `A` of coins of 5, `R = N - 5 × A` remains to be paid with 2s and 1s. The number of coins of 2 can be 0, 1, 2… up to `R // 2`, and coins of 1 make up the difference: that's exactly `R // 2 + 1` ways. Add them to the total in one go.

Only one loop is left, for `A` going from 0 to `N // 5`: at most 200,001 turns, which is very fast.

Example: `N = 10`. With 0 coins of 5, 10 remains: `10 // 2 + 1 = 6` ways. With 1 coin of 5, 5 remains: 3 ways. With 2 coins of 5, 0 remains: 1 way. The total is 6 + 3 + 1 = 10.

The traps:
- forgetting the `+ 1`: using no coin of 2 is also a way to pay;
- stopping the loop too early: `A` goes up to `N // 5` included (in Python, `range(N // 5 + 1)`);
- in C++, keeping the total in an `int`: for `N = 1,000,000`, the answer is above 50 billion.
