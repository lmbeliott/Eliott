---
title: Largest number by concatenation
---

## Statement
We have N non-negative integers. We write them all in base 10, one after the other, in any order, to form a single large number. For example, with 3, 30 and 34, we can form 33034, 34330, 30343…

Print the largest number that can be formed, without useless leading zeros: if it consists only of zeros, print `0`.

## Input
The first line contains N. The second line contains the N integers.

## Output
The largest number that can be formed.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ each integer ≤ 10⁹

## Hints
1. Sorting by decreasing value does not work (9 must come before 34), nor does decreasing alphabetical order: with 3 and 30, the word `30` is larger than `3`, but 330 > 303.
2. For two written numbers a and b, the right question is: `a` then `b`, or `b` then `a`? Place a before b if the word a + b is larger than b + a. This is a comparison rule, to give to the sort.
3. For this sort to make sense, the rule must be transitive. Write a + b > b + a as an inequality on numbers: a × 10^|b| + b > b × 10^|a| + a, where |a| is the number of digits of a.

## Solution
**The exchange rule.** In an optimal order, two neighbours a then b satisfy a + b ≥ b + a (comparing the words, which have the same length): otherwise, swapping them would make the number larger, since the beginning and the end do not change. So we sort with the rule "a goes before b if a + b > b + a": in Python with `functools.cmp_to_key`, in C++ with a comparison function.

**Why the rule is a true order.** Let |a| be the number of digits of a. The word a + b represents the number a × 10^|b| + b, so a + b > b + a means a × (10^|b| − 1) > b × (10^|a| − 1), that is r(a) > r(b) with r(a) = a / (10^|a| − 1). The rule thus amounts to sorting by decreasing value of r: it is transitive, and the sort is well defined. (r(a) is the number 0.aaaa…: for example r(34) = 34/99 = 0.343434…)

**Optimality.** Take any optimal order. If it contains two neighbours a then b with r(a) < r(b), swapping them gives a strictly larger number: impossible. So neighbours have decreasing r, and the optimal order is an order sorted by r. Two numbers with the same r give a + b = b + a, and their order does not matter: all sorted orders give the same number, which is therefore the maximum.

**The zero trap.** With the numbers 0 and 0, we form `00`, which is written `0`. After sorting, if the first character is `0`, all the numbers are zero and we print `0`. **Cost**: O(N log N) comparisons of words of at most 20 characters.
