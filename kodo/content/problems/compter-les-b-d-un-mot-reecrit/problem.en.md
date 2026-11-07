---
title: Counting the b's of a rewritten word
---

## Statement
We build words with the letters `a` and `b`, using two rules: each `a` is replaced by the word U, and each `b` by the word W.

At step 0, the word is `a`. To go from one step to the next, **every** letter of the word is replaced at the same time by the word of its rule. For example, with U = `ab` and W = `a`, we get `a`, then `ab`, then `aba`, then `abaab`, then `abaababa`…

Write a program that answers Q questions about the word obtained at step E: for a given integer K, how many `b`'s are there among the first K letters of this word?

## Input
- The first line contains two integers E and Q.
- The second line contains the word U, the third line the word W.
- Each of the next Q lines contains an integer K.

## Output
Q lines: for each question, in order, the number of `b`'s among the first K letters of the word at step E.

## Constraints
- 0 ≤ E ≤ 60
- U and W each contain between 1 and 5 letters, `a` or `b`.
- 1 ≤ Q ≤ 1,000
- 1 ≤ K ≤ 10¹⁸, and K is at most the length of the word at step E.

## Hints
1. The word can have more than 10¹⁸ letters: you cannot build it. But the word at step t, obtained from `a`, is made of the pieces obtained in t − 1 steps from each letter of U, put end to end.
2. First compute, for each step t and each letter c, the length and the number of `b`'s of the word obtained in t steps from the single letter c. These numbers follow from those of step t − 1.
3. Write `compter(t, c, k)` (*compter* means "count"): the number of `b`'s among the first k letters of the word obtained from c in t steps. Go through the letters of the rule of c: as long as a whole piece fits in the k letters, add its number of `b`'s and subtract its length; for the first piece that does not fit, call `compter` on it, at step t − 1. Watch out for gigantic lengths: cap them.

## Solution
**The idea: cut the word into pieces without ever writing it.** Let `mot(t, c)` (*mot* means "word") be the word obtained in t steps from the single letter c. Replacing all letters at the same time, t times in a row, amounts to replacing c by its rule, then expanding each letter of the rule for t − 1 steps. So `mot(t, c)` is the concatenation of the words `mot(t − 1, d)`, for each letter d of the rule of c. The word at step E is `mot(E, a)`.

**Sizes first.** We compute `longueur[t][c]` (*length*) and `nb_b[t][c]` for t from 0 to E: at step 0, the word is the letter c itself (length 1, and one `b` only if c = `b`); after that, each value is the sum of the values at step t − 1 for the letters of the rule of c.

**Then the recursive descent.** `compter(t, c, k)` goes through the letters d of the rule of c. If the piece `mot(t − 1, d)` fits entirely in the first k letters, we add `nb_b[t − 1][d]` and subtract its length from k. Otherwise, the remaining k letters stop in the middle of this piece: the answer is what we have counted so far plus `compter(t − 1, d, k)`. At step 0, the word has a single letter, and we count 1 if it is a `b` (and k ≥ 1).

In the first example (U = `ab`, W = `a`, E = 4, K = 5): `mot(4, a)` = `mot(3, a)` + `mot(3, b)`, and `mot(3, a)` = `abaab` has exactly 5 letters, 2 of which are `b`. The answer is 2.

**Complexity.** The precomputation costs O(E × (|U| + |W|)). Each question goes down one step per call and looks at most 5 letters per step: O(E × 5) per question, about 300,000 operations for 1,000 questions.

**Why the naive solution is too slow.** Building the word letter by letter is impossible: its length can double (or more) at each step, and go beyond 10¹⁸ letters long before step 60.

**Traps.**
- Lengths can become huge (up to 5⁶⁰). In C++, they overflow `long long`. Since K ≤ 10¹⁸, it is enough to replace any larger length by a cap, for example 10¹⁸ + 1: a capped piece never fits entirely in the K letters, so its exact value is never used. Do the same for the numbers of `b`'s.
- With a cap of 10¹⁸ + 1 and rules of 5 letters, the sum before capping stays below 6 × 10¹⁸: it fits in a `long long`.
- Some rules do not make the word grow (for example U = `b` and W = `a`): the descent still goes through its E steps, without any problem.
