---
title: Comparisons of quicksort
---

## Statement
A list of distinct numbers is sorted with the following version of **quicksort**. If the list has at most one element, it is sorted. Otherwise, its **first** element is the pivot p; p is compared with each of the other elements, which makes (length − 1) comparisons, and we form the list G of the elements smaller than p and the list D of the larger ones, each **in the order in which its elements appeared**. G and D are sorted the same way, and the result is sorted G, then p, then sorted D.

The list is a permutation of the integers from 1 to N, built by a formula: its element number i, for i from 0 to N − 1, is ((A × i + B) mod N) + 1, where A and N have no common divisor other than 1. Print the total number of comparisons.

For example, with N = 5, A = 2 and B = 3, the list is `4 1 3 5 2`. The pivot 4 makes 4 comparisons and gives G = `1 3 2` and D = `5`. To sort G, the pivot 1 makes 2 comparisons and leaves `3 2`, where the pivot 3 makes 1 comparison. In total: 4 + 2 + 1 = 7 comparisons.

## Input
A single line: the three integers N, A and B.

## Output
The total number of comparisons made by quicksort.

## Constraints
- 1 ≤ N ≤ 200,000
- 0 ≤ A, B < N, and GCD(A, N) = 1

## Hints
1. Simulating the sort costs up to N²/2 comparisons, for example when the list is already sorted, with a recursion depth equal to N: too slow and too deep.
2. Two values x < y are compared at most once. They stay in the same sublist as long as no pivot has been chosen among x, x + 1, …, y. Which of these numbers becomes a pivot first?
3. x and y are compared if and only if, among the values x, x + 1, …, y, the one appearing first in the initial list is x or y. For each x, counting the valid y amounts to finding the next value larger than x that appears before x: a monotonic stack.

## Solution
**When are two values compared?** A comparison always happens between a pivot and another element of its sublist, and a pivot no longer belongs to any sublist afterwards: two values are compared at most once. Take x < y. As long as the chosen pivot is not between x and y, all the values x, x + 1, …, y go to the same side: they stay together. Sublists keep the initial order, so the pivot of a sublist is the element appearing first in the initial list. The first pivot chosen among x, …, y is therefore the one of these values that appears first. If it is x or y, they are compared; otherwise, this pivot sends them to two different sides, and they never will be.

**Counting.** Let pos[v] be the position of value v in the list. The pair x < y is compared if pos[x] is the minimum of pos[x], …, pos[y], or if pos[y] is (both cannot happen together). For a fixed x, the first condition holds for y = x + 1, x + 2, …, up to the first value z > x with pos[z] < pos[x], excluded: that makes z − x − 1 values (with z = N + 1 if there is none). Likewise, for a fixed y, the second holds for the x located after the last value w < y with pos[w] < pos[y]: y − w − 1 values (with w = 0 if there is none). The answer is the sum of all these quantities.

**Monotonic stack.** For each v, the next larger value with a smaller position is found for every v in a single pass with a stack, like the "next smaller element" of level 3, applied to the array pos; the same goes for the previous one. Computing pos, the two passes and the sum cost O(N). The answer can reach N(N − 1)/2 ≈ 2 × 10¹⁰: `long long` in C++.
