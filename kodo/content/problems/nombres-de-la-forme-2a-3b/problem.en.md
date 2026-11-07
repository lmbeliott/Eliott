---
title: Numbers of the form 2ᵃ × 3ᵇ
---

## Statement
We look at the integers that can be written 2ᵃ × 3ᵇ, with integers a ≥ 0 and b ≥ 0: 1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27… They are the integers with no prime divisor other than 2 and 3.

Answer Q questions: how many such integers are there between A and B (inclusive)?

## Input
The first line contains Q. Each of the next Q lines contains A and B.

## Output
Q lines: the answer to each question.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ A ≤ B ≤ 10¹⁸

## Hints
1. Going through the integers from A to B is impossible. But how many integers of the form 2ᵃ × 3ᵇ are there up to 10¹⁸? We have 2ᵃ ≤ 10¹⁸, so a ≤ 59, and 3ᵇ ≤ 10¹⁸, so b ≤ 37.
2. So there are at most 60 × 38 = 2,280 of them. They can all be built with two nested loops, stopping as soon as the product exceeds 10¹⁸.
3. Then, for each question, it is enough to count those in the list that are between A and B.

## Solution
**Building the list.** For each power of 2, p = 1, 2, 4… while p ≤ 10¹⁸, multiply p by 1, 3, 9… while the product stays at most 10¹⁸, and store each product in a list. Each integer 2ᵃ × 3ᵇ is obtained exactly once, for its pair (a, b), since the prime factorization is unique. The list contains 1,178 of them.

**Answering.** For each question, go through the list and count the values between A and B. One can also sort the list and stop as soon as B is exceeded.

**Cost.** About 1,200 values built, then 1,200 comparisons per question: a little over a million operations, instead of up to 10¹⁸ by testing every integer of [A, B]. The key remark is to count the objects to be found before searching: here they are very rare (on the order of (log N)²).

**Overflow in C++.** The product must be tested before it exceeds the capacity of a `long long` (about 9.2 × 10¹⁸): since only values at most 10¹⁸ are multiplied by 3, the products stay below 3 × 10¹⁸, which fits.
