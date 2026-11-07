---
title: Sorting with rotations of three
---

## Statement
A list A₁, A₂, …, A_N can be modified by a single operation: choose three consecutive cells and rotate their values, the last one moving to the front. So (x, y, z) becomes (z, x, y). For example, rotating cells 2 to 4 of `5 1 4 2 3` gives `5 2 1 4 3`.

For each of the T given lists, tell whether it can be sorted in non-decreasing order with any number of operations of this kind.

## Input
The first line contains T. Each list is described by two lines: the first contains N, the second the N values.

## Output
T lines: `OUI` if the list can be sorted, `NON` otherwise.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ N, and the sum of the N does not exceed 10,000
- 1 ≤ Aᵢ ≤ 10⁹

## Hints
1. If all the values are different, count the **inversions**, the pairs of positions i < j with Aᵢ > Aⱼ. How does this number change during an operation? Only the pairs formed inside the three cells can change.
2. An operation changes the number of inversions by −2, 0 or +2: its **parity** is an invariant. A sorted list has 0 inversions. Conversely, one can show that with N ≥ 3, any list of different values with an even number of inversions can be sorted.
3. Counting inversions one by one costs O(N²). The parity of the number of inversions is also that of N minus the number of **cycles** of the permutation that sends each value to its place in the sorted list. And what if two values are equal?

## Solution
**Case N ≤ 2.** No operation is possible: the answer is `OUI` if the list is already sorted, `NON` otherwise.

**The invariant.** Assume the values are all different. Rotating (x, y, z) into (z, x, y) changes the relative order of no pair, except the pairs {x, z} and {y, z}, which are both reversed. So the number of inversions changes by −2, 0 or +2: its parity never changes. Since a sorted list has 0 inversions, a list with an odd number of inversions cannot be sorted.

**The converse, for N ≥ 3.** Place the values one by one, from smallest to largest, at the start of the unsorted part. If the smallest remaining value is at distance d ≥ 2 from its place, a rotation of the three cells ending on it brings it 2 closer. If it is right next to its place (d = 1) and at least three cells remain, two rotations of the first three unsorted cells, (x, y, z) → (z, x, y) → (y, z, x), put it in place. Continue until only two cells remain. Since parity is preserved and was even, these last two values cannot be reversed (that would be a single inversion): the list is sorted.

**Equal values.** If two values are equal (and N ≥ 3), sorting is always possible: consider them as different, choosing the order of the two equal values in the sorted list so that the number of inversions is even (swapping this choice changes the parity).

**Computing the parity.** Sort the positions by value to know, for each position i, the place p(i) of its value in the sorted list. The permutation p splits into **cycles** (i → p(i) → p(p(i)) → … → i). A cycle of length ℓ is obtained with ℓ − 1 swaps, and each swap of two values changes the parity of the number of inversions. So the parity we want is that of N − (number of cycles). Go through the cycles while marking visited positions: O(N).

**Cost.** O(N log N) per list because of the sort, instead of O(N²) to count inversions one by one, and an astronomical number of states for an exhaustive search. With the sum of the N limited to 10,000, counting the inversions directly, 5 × 10⁷ comparisons, still passes in C++ but not in Python: the heart of the problem is the parity invariant.
