---
title: Circle of prime sums
---

## Statement
`N` distinct integers are placed around a circle. The arrangement is **valid** if the sum of any two neighbouring numbers on the circle is a prime number.

Two arrangements that are rotations of each other are considered identical; two arrangements that are mirror images of each other (the same circle read in the other direction) are considered different. For example, with `1 2 3 4`, there are exactly 2 valid arrangements: `1 2 3 4` and `1 4 3 2` (sums 3, 5, 7, 5 and 5, 7, 5, 3).

Count the valid arrangements.

## Input
- The first line contains `N`.
- The second line contains the `N` integers, which are distinct.

## Output
A single integer: the number of valid arrangements.

## Constraints
- 3 ≤ N ≤ 14
- each integer is between 1 and 1,000

## Hints
1. To count each circle only once, fix the first number of the list at position 0: each class of rotations contains exactly one arrangement starting with it.
2. Place the numbers one by one, and abandon a branch as soon as two neighbours have a non-prime sum, without waiting for the end.
3. A sieve up to 2,000 is enough to test the sums. A sum of two odd numbers is even: it is prime only if it equals 2, which is impossible here.

## Solution
**Breaking the symmetry.** The rotations of an arrangement give `N` different lists; exactly one starts with the first given number, `a₀`. So we count the orders of the `N − 1` other numbers placed after `a₀`, that is the permutations of `N − 1` elements that form a valid circle.

**Backtracking.** A recursive function places a number not yet used at position `i`, provided its sum with the number at position `i − 1` is prime; if not, the branch is cut immediately. When all `N` positions are filled, check the last sum, that of the last number and `a₀`, and count 1. Primality tests take constant time thanks to a sieve of Eratosthenes up to 2,000.

**Size of the search tree.** Without pruning, there would be `13! ≈ 6 × 10⁹` leaves for `N = 14`. Pruning is very effective: a sum of two odd numbers is even and greater than 2, so even and odd numbers must alternate, and among sums of different parities, few are prime. On the tests, the tree has at most a few hundred thousand nodes.

**Going further.** With the numbers from 1 to `N`, alternation forces `N` to be even (otherwise the answer is 0); the answers for `N = 4, 6, 8, 10, 12, 14` are 2, 2, 4, 96, 1,024 and 2,880.
