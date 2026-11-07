---
title: Shortest period of a word
---

## Statement
Take a word of `N` letters. An integer `p` between 1 and `N` is a **period** of the word if each letter is equal to the letter `p` positions further on, whenever that letter exists. In other words, the word is obtained by writing its first `p` letters, the **pattern**, several times in a row, the last copy possibly being cut short.

For example, `abcabcab` has period 3: it is the pattern `abc` repeated, with a last copy cut after `ab`. It also has period 6, and `N` is always a period.

Write a program that prints, for each word, its shortest period and the matching pattern.

## Input
- The first line contains the integer `Q`, the number of words.
- Each of the next `Q` lines contains a word, in lowercase letters without accents.

## Output
`Q` lines: for each word, in input order, its shortest period `p`, a space, then the pattern made of its first `p` letters.

## Constraints
- 1 ≤ Q ≤ 10
- Each word has between 1 and 1 000 letters.

## Hints
1. First write a loop that tests whether a given integer `p` is a period: compare each letter `word[i]` with `word[i + p]`, as long as `i + p` stays inside the word.
2. Then try `p = 1`, then `p = 2`, then `p = 3`… The first value that works is the shortest period. You are sure to stop, because `p = N` always works.
3. The period does not necessarily divide the length of the word: `abaab` has period 3, with pattern `aba`. Do not only test the divisors of `N`.

## Solution
Try the values of `p` in order: 1, 2, 3… For each one, check that `word[i]` equals `word[i + p]` for every `i` from 0 to `N - p - 1`, stopping as soon as two letters differ. The first value of `p` that passes this test is the shortest period. When `p = N`, there is no letter to compare: the test always succeeds, so the loop stops there at the latest.

Then print `p` and the pattern, that is, the first `p` letters of the word (`word[:p]` in Python, `word.substr(0, p)` in C++).

Why is it enough to compare each letter with the one `p` positions further on? If this holds everywhere, then the letter at position `i` equals the one at position `i - p`, which equals the one at position `i - 2p`, and so on until you reach the first `p` letters: each letter of the word is indeed a copy of a letter of the pattern, in the right place.

Example with `abaab`: `p = 1` fails (`a` then `b`), `p = 2` fails (`b` at position 1 and `a` at position 3), `p = 3` succeeds (`a` = `a` and `b` = `b`). The answer is `3 aba`.

Pitfalls:
- only testing the periods that divide `N`: you would find 5 for `abaab` instead of 3;
- only checking the first copy of the pattern instead of the whole word: `abcabd` does not have period 3;
- forgetting the case where no period shorter than `N` works: the pattern is then the whole word.

Each period test makes at most `N` comparisons, and you try at most `N` values of `p`: at most a million comparisons per word, which is still fast.
