---
title: Concatenations divisible by K
---

## Statement
There are N cards, each carrying an integer. By putting all the cards side by side, in some order, one reads a big number. For example, the cards 12, 5 and 3 laid in the order 5, 3, 12 give 5312.

Count the orders for which the number obtained is divisible by K. The cards are all considered different, even if two of them carry the same integer: there are N! orders in total.

## Input
The first line contains N and K. The second line contains the N integers of the cards.

## Output
The number of orders that give a multiple of K.

## Constraints
- 1 ≤ N ≤ 8
- 1 ≤ K ≤ 10⁹
- 1 ≤ integer on a card ≤ 10⁹

## Hints
1. There are at most 8! = 40,320 orders: all of them can be tried. A recursive function picks the next card among those not yet laid, marking used cards in a list of booleans.
2. The number obtained can have 80 digits. No need to build it: only its remainder modulo K matters. Laying card x, with c digits, to the right of a number with remainder r gives the remainder `(r × 10^c + x) mod K`.
3. To avoid overflows in C++, compute `10^c mod K` in advance for each card.

## Solution
Write a recursive function `count(laid, r)`: `laid` cards are already laid, and the number formed so far has remainder `r` modulo K. It returns the number of ways to finish with a multiple of K.

- If `laid = N`, the number is complete: return 1 if `r = 0`, and 0 otherwise.
- Otherwise, for each unused card `i`: mark it, add `count(laid + 1, (r × p[i] + x[i]) mod K)`, where `p[i] = 10^c mod K` and `c` is the number of digits of `x[i]`, then unmark it.

**Why the remainder is enough.** Writing x, with c digits, to the right of a number A gives `A × 10^c + x`. The remainder of this sum only depends on the remainders of A, of `10^c` and of x: one can reduce modulo K at every step without changing the final result.

**Correctness.** By induction on the number of remaining cards: each way of finishing starts with the choice of an unused card, then finishes in a way counted by the recursive call; two different choices give different orders, so the sum counts each order once.

**Cost.** The call tree has N! leaves, and at each level the N cards are scanned: about 8! × 8 ≈ 320,000 operations at most. In C++, `r × p[i]` can reach 10¹⁸: `long long` is needed.
