---
title: Balanced pieces
---

## Statement
You are given a word `S` of `N` letters. The vowels are `a`, `e`, `i`, `o`, `u` and `y`; all the other letters are consonants.

A **piece** of `S` is a run of at least one consecutive letter of `S`. A piece is **balanced** if it contains as many vowels as consonants.

Write a program that prints the length of the longest balanced piece, then the number of balanced pieces. Two pieces that start or end at different positions count separately, even if they are made of the same letters.

## Input
A single line containing the word `S`, in lowercase letters without accents.

## Output
Two lines:
- on the first, the length of the longest balanced piece, or `0` if there is none;
- on the second, the number of balanced pieces.

## Constraints
- 1 ≤ N ≤ 100 000
- The number of balanced pieces can exceed 2³¹: in C++, use a `long long`.

## Hints
1. Testing every piece one by one is too slow: there are about 5 billion of them when `N` is 100 000. You need a single pass over the word.
2. Read the word from left to right while keeping a **balance**: `+1` for each vowel, `-1` for each consonant. Note the balance before the first letter (it is 0), then after each letter. The piece between two moments where the balance is the same contains as many vowels as consonants.
3. The balance stays between `-N` and `N`. Keep two lists of size `2N + 1`, indexed by `balance + N`: the first time each balance was seen, and the number of times it was seen. When the balance comes back to a value already seen, this gives one balanced piece for each earlier time, and the longest one starts from the first time.

## Solution
Read the word from left to right while keeping a **balance**: the number of vowels minus the number of consonants among the letters read so far. Write `balance[0] = 0` before the first letter, then `balance[j]` after the first `j` letters.

The piece made of letters `i + 1` to `j` contains `balance[j] - balance[i]` more vowels than consonants. So it is balanced exactly when `balance[i] = balance[j]`. The two questions become:
- the largest gap `j - i` between two moments with the same balance;
- the number of pairs of moments `i < j` with the same balance.

Since the balance is always between `-N` and `N`, the information can be stored in lists of size `2N + 1`, at index `balance + N`:
- `first[k]`: the first moment when the balance was `k - N` (`-1` if never seen);
- `count[k]`: the number of moments so far with that balance.

For each new moment `j`, whose balance has index `k`: if this balance was already seen, the longest balanced piece ending here starts just after `first[k]`, and it has `j - first[k]` letters. The number of balanced pieces ending here is `count[k]`: add it to the total, then increase `count[k]` by 1.

Example with `banane`: the successive balances are `0, -1, 0, -1, 0, -1, 0`. Balance 0 appears 4 times, at moments 0, 2, 4 and 6, which gives 6 pairs; balance -1 appears 3 times, which gives 3 pairs. So there are 9 balanced pieces, and the longest goes from moment 0 to moment 6: it is the whole word, of length 6.

Pitfalls:
- forgetting the balance 0 **before** the first letter: without it, you miss every piece that starts at the beginning of the word;
- using the balance directly as an index: it can be negative. Shifting it by `N` brings it between 0 and `2N`;
- testing every piece, even while updating the counters as you go: that is about `N² / 2` pieces, i.e. 5 billion for `N = 100 000`. The balance method makes a single pass;
- in C++, the number of pieces exceeds 2³¹ for a 100 000-letter word where vowels and consonants alternate.
