---
title: Swap the halves
---

## Statement
A word is transformed as follows. A one-letter word does not change. A longer word is cut in two: G, made of its first ⌊n/2⌋ letters (n is the length of the word), and D, made of the remaining letters. G and D are transformed by the same rule, which gives g and d, then the two pieces are glued back together, in the order of your choice: `g + d` or `d + g`.

For example, `dcba` is cut into `dc` and `ba`, which can become `cd` and `ab`. Gluing in the order `ab + cd` gives `abcd`.

Find the smallest word, in alphabetical (dictionary) order, that can be obtained from the given word.

## Input
One line containing the word, made of lowercase letters.

## Output
The smallest word that can be obtained.

## Constraints
- 1 ≤ length of the word ≤ 100,000

## Hints
1. Trying every possible choice is out of the question: there is one choice per cut, nearly 100,000 choices, and 2^100,000 combinations.
2. All the words that can be obtained from G have the same length. To make `g + d` as small as possible, what should be chosen for g, then for d?
3. A recursive function `best(m)` returns the smallest word obtained from `m`: it is enough to compare `best(G) + best(D)` and `best(D) + best(G)`.

## Solution
Write a recursive function `best(m)`. If `m` has one letter, it returns it. Otherwise it cuts `m` into G and D, computes `g = best(G)` and `d = best(D)`, and returns the smaller of the two words `g + d` and `d + g`.

**Correctness.** By induction on the length. Assume `best(G)` and `best(D)` are the smallest words obtained from G and from D. All the words obtained from G have the length of G. To compare two words `g₁ + d₁` and `g₂ + d₂` of this form, one first compares the beginnings `g₁` and `g₂`, of the same length, and only if they are equal the ends. So the smallest word of the form `g + d` is `best(G) + best(D)`. Likewise, the smallest word of the form `d + g` is `best(D) + best(G)`. The smallest possible word is the smaller of the two.

**Cost.** Each cut halves the length: the depth of the calls is about log₂(100,000) ≈ 17, harmless for the stack. At each depth, the pieces being handled have a total length of n, and the copies and comparisons done on them are proportional to their length: the total work is about n × 17 operations. Trying all combinations would require 2^(n−1) words.
