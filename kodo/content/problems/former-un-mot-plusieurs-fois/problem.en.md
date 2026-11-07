---
title: Spell a word as many times as possible
---

## Statement
A box contains plastic letters. You want to spell the same word as many times as possible with these letters. Each letter from the box can only be used once, and a word only counts if it is spelled in full.

For example, to spell `pomme`, you need one `p`, one `o`, **two** `m`s and one `e`.

Write a program that prints the maximum number of times the word can be spelled.

## Input
- The first line contains the letters of the box, written one after the other, in no particular order.
- The second line contains the word to spell.

All letters are lowercase, without accents.

## Output
A single integer: the maximum number of copies of the word that can be spelled.

## Constraints
- The box contains between 1 and 1,000 letters.
- The word has between 1 and 20 letters.

## Hints
1. Start by counting how many `a`s, `b`s, …, `z`s the box contains. An array of 26 counters is enough: cell `ord(c) - ord("a")` (in C++: `c - 'a'`) is for the letter `c`.
2. Count the letters of the word the same way. If the word uses 2 `m`s and the box has 5, the `m`s let you spell the word 5 // 2 = 2 times.
3. Each letter of the word sets a limit on the number of copies: the answer is the smallest of these limits.

## Solution
We fill two arrays of 26 counters: `dans_boite[k]` and `dans_mot[k]` (French for "in the box" and "in the word") give the number of times the `k`-th letter of the alphabet appears in the box and in the word.

For each letter that appears in the word (`dans_mot[k] > 0`), we can spell at most `dans_boite[k] // dans_mot[k]` copies of the word: that's how many times we can take all the letters `k` we need. The answer is the minimum of these values. To compute this minimum, we start from a large enough value (the size of the box, for example) and lower it letter after letter.

The traps:
- letters that appear several times in the word: in the first example, the box contains three `p`s, three `o`s and three `e`s, but only five `m`s, and each `pomme` needs two. So you can only spell the word 2 times, not 3;
- a letter of the word that isn't in the box gives a limit of 0: the answer is then 0;
- don't divide by `dans_mot[k]` when it's 0: letters that aren't in the word don't limit anything.

A dictionary would also work for counting, but when the possible values are few and known in advance (here, 26 letters), a simple array of counters is more direct.
