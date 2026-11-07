---
title: Making change from 1 to 50
---

## Statement
A till has as many coins of `1`, `2`, `5` and `10` euros as it wants. For each amount from `1` to `50` euros, print the smallest number of coins that makes exactly this amount. Then print the total of these 50 numbers of coins.

## Input
None: the program reads nothing.

## Output
50 lines, for the amounts from 1 to 50 in order: the amount, a space, then the minimal number of coins. Finally, a last line containing the total of the 50 numbers of coins.

For instance, the line for the amount 18 is `18 4`, because 18 = 10 + 5 + 2 + 1, and you cannot do better.

## Hints
1. To use few coins, first take as many 10-euro coins as possible, then 5-euro coins with what is left, then 2, then 1.
2. The number of 10-euro coins is `m // 10`, and `m % 10` euros remain to be made. Go on the same way with 5, then with 2.
3. An accumulator, initialised before the loop, adds up the numbers of coins of the 50 amounts.

## Solution
For an amount `m`, apply the "largest coin first" method using the quotient and the remainder:

- `m // 10` coins of 10, and `r = m % 10` remains;
- `r // 5` coins of 5, and `r % 5` remains;
- then, with this remainder `s`, `s // 2` coins of 2 and `s % 2` coin of 1.

For m = 18: 1 coin of 10, 8 left; 1 coin of 5, 3 left; 1 coin of 2 and 1 coin of 1: 4 coins. Compute this number in a loop over `m` from 1 to 50, print it with `m`, and add it to an accumulator `total` initialised to 0. After the loop, print `total`, which is 190.

Why does this method give the minimum? In an optimal solution, you never use two 5-euro coins (one 10-euro coin replaces them), nor two 1-euro coins (one 2-euro coin is enough), nor three 2-euro coins (5 + 1 does the same with one coin fewer), nor 2 + 2 + 1 (one 5-euro coin). The small coins of an optimal solution therefore add up to at most 9 euros, and they are exactly those chosen by the method. Careful: this is not true for every coin system. With coins of 1, 3 and 4, the method gives 4 + 1 + 1 for 6 euros, whereas 3 + 3 is enough.
