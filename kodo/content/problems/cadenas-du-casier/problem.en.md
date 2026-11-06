---
title: The locker padlock
---

## Statement
At the ski resort, Lucas keeps his skis in a locker closed by a padlock with N dials. Each dial shows a digit from `0` to `9`. Lucas has forgotten his code, but he remembers two things:
- reading from left to right, the digits never decrease (each digit is greater than or equal to the previous one);
- the sum of the N digits is S.

Write a program that prints all the possible codes, so that Lucas can try them one by one.

## Input
A single line containing two integers N and S.

## Output
- On the first line, the number of possible codes.
- Then one code per line, written with its N digits together (including the leading `0`s), from the smallest to the largest.

If no code works, print only `0`.

## Constraints
- 1 ≤ N ≤ 10
- 0 ≤ S ≤ 90

## Hints
1. Trying the 10ᴺ possible codes one by one means 10 billion codes when N = 10: far too many. You must build only the codes that follow the rules.
2. Write a recursive function that chooses the digits from left to right. It needs to know which sum is still to be reached and which digit is the smallest one allowed (the previous digit).
3. If you try the digits in increasing order at each position, the codes come out directly from the smallest to the largest. To go faster, abandon a branch as soon as the remaining sum can no longer be reached.

## Solution
**The idea: build the codes digit by digit, recursively.** The function `explorer(reste, plus_petit)` ("explore(remaining, smallest)") knows the digits already chosen (in a list `code`), the sum `reste` that still has to be reached, and the smallest digit allowed at the next position. If all the digits are chosen, we keep the code when `reste` is 0. Otherwise, for each digit c from `plus_petit` to 9, we add it to the code, call `explorer(reste − c, c)`, then remove it: that is the backtracking step.

**The order.** All codes have N digits, so "from the smallest to the largest" is the same as alphabetical order. Since we try the digits in increasing order at each position, all the codes that start with 0 come out before those that start with 1, and so on: the list is already in the right order, without sorting.

**Pruning.** If p digits are still to be chosen (including this one) and we place c, all p of them are at least c: if `c × p > reste`, this digit and all the following ones are too large, so we stop the loop. And if `c + 9 × (p − 1) < reste`, even with 9s everywhere afterwards we cannot reach the sum: we move on to the next digit.

**Complexity.** There are only 92 378 non-decreasing sequences of 10 digits, and pruning avoids almost all the useless branches: on the biggest tests, the function is called about 11 000 times, for fewer than 3 000 printed codes.

**Why the naive solution is too slow.** Testing the 10ᴺ codes (for example with ten nested loops) means 10¹⁰ tries for N = 10: several hours in Python.

**Traps.**
- Print the leading zeros: the code `006` must not become `6`.
- Don't forget to print the number of codes first, even when it is 0.
