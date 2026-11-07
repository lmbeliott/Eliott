---
title: Next prime palindrome
---

## Statement
A number is a **palindrome** if it reads the same from left to right and from right to left, like 383 or 7. Find the smallest number greater than or equal to `N` that is both prime and a palindrome.

## Input
A single line containing the integer `N`.

## Output
The smallest integer `P ≥ N` that is prime and a palindrome.

## Constraints
- 1 ≤ N ≤ 1,000,000

## Hints
1. Three functions: `reverse_number(n)` that returns the number written backwards, `is_palindrome(n)` that uses it, and `is_prime(n)`.
2. Start from `N` and move forward by 1 as long as the number is not both a palindrome and prime.
3. The palindrome test is much faster than the primality test: do it first.

## Solution
Split the problem into three functions, as in the lesson: `reverse_number(n)` builds the reversed number digit by digit (`r = r × 10 + n % 10`), `is_palindrome(n)` returns `reverse_number(n) == n`, and `is_prime(n)` tries the divisors up to the square root. The main program starts from `N` and moves forward while the condition `is_palindrome(n) and is_prime(n)` is false.

The order of the two tests matters: with `and`, the second one is only evaluated if the first one is true. Palindromes are rare, so very few numbers get a primality test.

How many numbers must be tried? Sometimes a lot: there is no 4-digit prime palindrome, and no 6-digit one either. Indeed, a palindrome with an even number of digits is always divisible by 11 (for example 3443 = 11 × 313). For `N = 1000`, the answer is therefore 10,301, and for `N = 100,000` it is 1,003,001. Even in this last case, fewer than a million numbers are tried, with a very short palindrome test for each.

The trap: 11 is the only two-digit prime palindrome. For `N = 12`, the answer is 101.
