---
title: Sums and products of all subsets
---

## Statement
There are N numbers a₁, a₂, …, a_N. A non-empty **subset** of these numbers is chosen (any choice of at least one of the N numbers); there are 2^N − 1 of them. Compute:

- the sum, over all non-empty subsets, of the sum of their elements;
- the sum, over all non-empty subsets, of the product of their elements.

For example, with 1, 2 and 3, the non-empty subsets are {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3} and {1, 2, 3}. The sum of the sums is 1 + 2 + 3 + 3 + 4 + 5 + 6 = 24, and the sum of the products is 1 + 2 + 3 + 2 + 3 + 6 + 6 = 23.

The results being very large, they are given modulo 1,000,000,007. Two equal numbers at different positions are considered different.

## Input
The first line contains N. The second line contains the N numbers.

## Output
Two lines: the sum of the sums, then the sum of the products, each modulo 1,000,000,007.

## Constraints
- 1 ≤ N ≤ 20,000
- 0 ≤ aᵢ ≤ 10⁹

## Hints
1. Enumerating the 2^N subsets is impossible as soon as N exceeds about 25. You must count differently.
2. For the sum of the sums: in how many subsets does the number aᵢ appear?
3. For the sum of the products: expand the product (1 + a₁)(1 + a₂)…(1 + a_N). Each term of the expansion corresponds to a subset.

## Solution
**Sum of the sums.** Rather than going through the subsets, count the **contribution** of each number. The number aᵢ belongs to 2^(N−1) subsets: for each of the N − 1 other numbers, one freely chooses to take it or not. The sum of the sums is therefore (a₁ + a₂ + … + a_N) × 2^(N−1). In the example: 6 × 4 = 24.

**Sum of the products.** When expanding (1 + a₁)(1 + a₂)…(1 + a_N), one chooses in each parenthesis either 1 or aᵢ: each choice corresponds to the subset of the chosen aᵢ, and gives the product of its elements. The expansion is therefore the sum of the products of all subsets, including the empty subset, whose product is 1. The answer is (1 + a₁)(1 + a₂)…(1 + a_N) − 1. In the example: 2 × 3 × 4 − 1 = 23.

**Computing modulo 1,000,000,007.** Reduce after each addition and each multiplication: the remainder of a sum or a product only depends on the remainders of the terms. After the final subtraction, add the modulus if the result is negative (in C++, `-1 % m` is `-1`). 2^(N−1) is computed with a loop of N − 1 multiplications by 2.

**Cost.** One loop over the N numbers: O(N), instead of O(N × 2^N) for the enumeration. In C++, products of two remainders reach 10¹⁸: `long long` is needed.
