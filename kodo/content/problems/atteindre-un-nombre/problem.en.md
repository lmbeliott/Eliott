---
title: Reach a number
---

## Statement
You start from the number `A`. At each step, you can do only one of these two operations:
- add 1;
- multiply by `K`.

Write a program that prints the smallest number of steps needed to get exactly the number `B`.

For example, with `A = 3`, `B = 25` and `K = 2`, you need 4 steps: 3 → 6 → 12 → 24 → 25.

## Input
A single line containing three integers `A`, `B` and `K` separated by spaces.

## Output
A single integer: the smallest number of steps to go from `A` to `B`.

## Constraints
- 1 ≤ A ≤ B ≤ 1 000 000 000
- 2 ≤ K ≤ 10

## Hints
1. Starting from `A` forces you to make hard choices: should you multiply straight away, or add 1 first? Try instead to start from `B` and go back to `A`, undoing the operations one by one.
2. Going back, if `B` is not a multiple of `K`, the last operation can't be a multiplication by `K`: it must have been "add 1". So you go back to `B - 1`.
3. If `B` is a multiple of `K` and `B / K` is still at least `A`, dividing by `K` is always the best choice. And when `B / K` (integer division) is smaller than `A`, you will never be able to divide again: all that's left is `B - A` times "add 1", to count in one go.

## Solution
Think backwards: start from `B` and go back up to `A`. Each operation can be undone: "divide by `K`" undoes "multiply by `K`", and "subtract 1" undoes "add 1". Going back, the numbers decrease, and they must never go below `A`. While `B > A`:
- if `B // K < A`, no division is possible any more, neither now nor later: add `B - A` steps in one go, and you're done;
- otherwise, if `B` is a multiple of `K`, divide by `K`;
- otherwise, the last operation must have been "add 1": subtract 1.

Why is dividing as soon as possible the best choice? Suppose `B` is a multiple of `K`, and you subtract 1 instead of dividing. To divide later, you'll have to land on a multiple of `K` again, so subtract at least `K` in all, then divide: at least `K + 1` steps to reach `B / K - 1`. By dividing first and then subtracting 1, you reach the same number in only 2 steps. And if you never divide again, you need `B - A` steps, whereas dividing and then subtracting 1 down to `A` costs `1 + B / K - A`, never more.

Example: `A = 2`, `B = 100`, `K = 3`. Going back: 100 → 99 (subtract 1) → 33 (divide) → 11 (divide) → 10 → 9 (subtract 1 twice) → 3 (divide) → 2 (subtract 1). That's 7 steps, and the path in the right direction is 2 → 3 → 9 → 10 → 11 → 33 → 99 → 100.

The trap: subtracting 1 at each turn of the loop, even when no division is possible any more. For `A = 500 000 001` and `B = 1 000 000 000`, the loop would then run almost 500 million times: far too slow. By counting the `B - A` steps in one go, the loop runs only a few dozen times.
