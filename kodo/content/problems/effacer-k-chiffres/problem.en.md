---
title: Erasing K digits
---

## Statement
You are given a sequence of N digits. You must erase exactly K of them, without changing the order of the digits that remain: you only choose which ones to erase.

Write a program that prints the smallest number you can get with the N − K remaining digits, read in order.

## Input
- The first line contains two integers N and K.
- The second line contains the N digits written together.

## Output
The N − K remaining digits, written together, that form the smallest possible number.

## Constraints
- 1 ≤ N ≤ 100 000
- 0 ≤ K < N
- Each digit is between `1` and `9`.

## Hints
1. All possible results have N − K digits: the smallest is the one with the smallest first digit, then, in case of a tie, the smallest second digit, and so on.
2. If a digit is followed by a smaller digit, erasing the first one makes the number smaller. Read the digits from left to right and keep the ones you hold on to in a stack.
3. Before pushing a digit c, as long as you can still erase and the top of the stack is greater than c, remove the top. At the end, if erasures are left, remove the last digits of the stack.

## Solution
**The greedy idea: make the first digits as small as possible.** The numbers we compare all have N − K digits: the smallest is the one whose first digit is the smallest, then the second, and so on. We read the digits from left to right and keep the ones we hold on to in a stack. Before pushing a digit c, as long as erasures are left and the top of the stack is **strictly greater** than c, we erase that top. At the end, if erasures are left, we remove the last digits: the stack is then non-decreasing, so its last digits are the largest.

**Why it is optimal.** Let's first describe the best result digit by digit.
- The first digit of the result must be one of the first K + 1 digits of the sequence, since N − K − 1 more digits are needed after it. The best choice is the smallest of them and, if it appears several times, its **first** occurrence: anything you could keep after a later occurrence can also be kept after the first one. We erase everything before this digit, then repeat with the rest and the remaining erasures.
- The stack makes exactly these choices, without searching for a minimum every time. When digit c arrives and the top x of the stack is larger, all the digits of the sequence between x and c have already been erased: so erasing x brings c to the place of x, with the same beginning. Since c < x, x was not the right choice for this place. A digit is never erased because of an equal or larger digit, which keeps the first occurrence of the minimum. And when no erasures are left, we have to keep all the following digits. Finally, if erasures are left at the end, removing the last digits of the stack (the largest ones) does not touch the first places.

You can check it on the first example (`4731592`, K = 3): 7 is erased when the 3 arrives, then 4 as well, then 3 when the 1 arrives. What remains is `1592`.

**Complexity.** Each digit is pushed once and popped at most once: O(N), even with the `while` loop inside the `for` loop.

**Why the naive solution is too slow.** Repeating K times "search from the beginning for the first digit larger than its right neighbour, and erase it (or the last digit if there is none)" gives the right answer, but each search starts again from the beginning and each erasure shifts the whole string: O(N × K) in the worst case. That is far too slow in Python; in C++, these very simple operations on characters still pass on these tests, but the stack does the same work in O(N). Trying every way of erasing K digits is even worse.

**Traps.**
- Don't pop the stack when the digits are equal: erasing a digit equal to the next one gains nothing, and may waste an erasure that would be useful later.
- If the digits are already increasing (`123456`), the `while` loop erases nothing: it is the last K digits that must be removed.
