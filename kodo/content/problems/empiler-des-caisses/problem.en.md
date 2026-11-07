---
title: Stacking crates
---

## Statement
N crates must be stacked on top of each other, in a single column. Crate i weighs wᵢ kilos and has a **strength** sᵢ. The **risk** of a crate is the total weight of the crates placed above it, minus its strength; it can be negative. The risk of the stack is the largest risk of its crates.

Print the smallest possible risk of a stack containing the N crates, choosing the order well.

For example, with the crates (w, s) = (10, 3), (2, 5) and (3, 3), the stack with (2, 5) on top, then (3, 3), then (10, 3) at the bottom gives the risks 0 − 5 = −5, 2 − 3 = −1 and 5 − 3 = 2: the risk of the stack is 2, and we cannot do better.

## Input
The first line contains N. Each of the next N lines contains two integers wᵢ and sᵢ.

## Output
The smallest possible risk of the stack.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ wᵢ ≤ 10,000
- 1 ≤ sᵢ ≤ 10⁶

## Hints
1. Neither "heaviest at the bottom" nor "strongest at the bottom" always works. Look at two neighbouring crates in the stack: what changes when you swap them?
2. If crate i is just above crate j, and W is the weight above both, their risks are W − sᵢ and W + wᵢ − s_j. Compare with the reverse order.
3. Put on top the crates whose sum wᵢ + sᵢ is the smallest.

## Solution
**Swapping two neighbours.** Let i be placed just above j, and W the total weight above both. The risks are W − sᵢ for i and W + wᵢ − s_j for j; the other crates are not affected, because the weight above them does not change if i and j are swapped. After the swap, the risks are W − s_j for j and W + w_j − sᵢ for i. Assume wᵢ + sᵢ ≤ w_j + s_j. Then W + wᵢ − s_j ≤ W + w_j − sᵢ, and W − sᵢ ≤ W + w_j − sᵢ: the larger of the two risks with i above is at most W + w_j − sᵢ, which is one of the risks of the swapped order. Putting above the crate with the smaller sum w + s can therefore only improve the risk of the stack, or leave it equal.

**The optimal order.** Start from an optimal stack. While two neighbours are placed with the larger sum w + s above, swap them: the risk does not increase, and the number of badly ordered pairs decreases (as in bubble sort). We reach the stack sorted by increasing w + s from top to bottom, which is therefore optimal. Build it directly with a sort, then compute the risks from top to bottom while accumulating the weights.

**Cost.** O(N log N). Trying the N! orders is impossible as soon as N = 12. The risk can be negative: initialise the maximum with the risk of the first crate, not with 0.
