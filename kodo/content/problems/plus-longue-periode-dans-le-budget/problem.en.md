---
title: Longest period within budget
---

## Statement
The price for renting a bike changes every day: on day i, the rental costs P_i euros. You have B euros and you want to rent the bike on **consecutive** days, without spending more than B euros in total.

Write a program that prints the largest number of consecutive days whose total price does not exceed B. The rental can start on any day.

## Input
- The first line contains two integers N and B.
- The second line contains N integers P_1, P_2, …, P_N: the price of each day.

## Output
A single integer: the largest number of consecutive days whose total price does not exceed B. Print `0` if even the cheapest day costs more than B.

## Constraints
- 1 ≤ N ≤ 50 000
- 1 ≤ B ≤ 10⁹
- 1 ≤ P_i ≤ 100

## Hints
1. Trying every starting day, and moving forward from each one while the budget allows, can take hundreds of millions of operations when the periods are long.
2. Keep a "window" of consecutive days, from `debut` to `fin` (French for "start" and "end"), together with its total price. When you add a day on the right and the window becomes too expensive, what should you do?
3. Prices are positive: if the window `debut..fin` is too expensive, every window that starts on the same day and ends later is too expensive as well. So remove days on the left (`debut += 1`) until you are back under the budget. Each index only ever moves to the right.

## Solution
**The idea: two pointers (sliding window).** We move `fin` from 1 to N. At each step, we add the price of day `fin` to the total of the window. While this total exceeds B, we remove day `debut` and move `debut` forward. The window `debut..fin` is then the longest affordable window that ends on day `fin`: we compare its length `fin − debut + 1` with the best result so far.

Why is it fine never to move `debut` back? Because all prices are positive: if days `debut..fin` cost too much, then days `debut..fin+1` cost even more. A window that is too expensive never becomes affordable again by growing to the right.

**Complexity.** `fin` moves forward N times and `debut` moves forward at most N times in total: O(N), even though the `while` loop is inside the `for` loop.

**Why the naive solution is too slow.** Trying each starting day and moving forward while the budget allows costs about N × L operations, where L is the length of the answer. On the large tests, the periods are tens of thousands of days long: that is more than a billion operations.

**Traps.**
- If a single day costs more than B on its own, the `while` loop empties the window completely (`debut` goes past `fin`): the length is then 0, which is correct.
- This method only works because the prices are positive. With negative numbers, you would need another idea.
