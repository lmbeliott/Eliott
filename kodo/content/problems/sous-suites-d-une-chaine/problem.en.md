---
title: Subsequences of a string
---

## Statement
You are given a string `P` and a list of words. A word is a **subsequence** of `P` if you can choose letters of `P`, **from left to right**, that form exactly this word when you read them one after the other. You can skip as many letters of `P` as you want, but you never go back and you can't use the same letter of `P` twice.

For example, if `P` is `programmes`, the word `rame` is a subsequence (the first `r`, the `a`, an `m`, then the `e`), but `mare` isn't: after the `m`s, there is no `a` left.

Write a program that says, for each word, whether it is a subsequence of `P`.

## Input
- The first line contains the string `P`.
- The second line contains an integer `Q`: the number of words.
- The next `Q` lines each contain one word.

All letters are lowercase, without accents.

## Output
`Q` lines: for each word, in the order of the input, print `OUI` (French for "yes") if it is a subsequence of `P`, and `NON` ("no") otherwise. Print exactly these words.

## Constraints
- `P` has between 1 and 1,000 letters.
- 1 ≤ Q ≤ 100
- Each word has between 1 and 100 letters.

## Hints
1. Do it by hand on the example: you read the letters of `P` one by one, and you keep in mind the next letter of the word you are looking for.
2. If the letter of `P` is the one you are looking for, take it right away! There is never any point in waiting for the same letter further on in `P`: taking the first one leaves you more letters for the rest of the word.
3. Keep an index `j`: the number of letters of the word already found. Go through `P`; when the letter you read equals `word[j]`, increase `j`. At the end, the word is a subsequence if and only if `j` equals the length of the word. Don't forget to check `j < len(word)` before reading `word[j]`.

## Solution
We read `P` only once, from left to right, keeping an index `j` on the next letter of the word to find. At each letter of `P`, if it equals `word[j]`, we take it and move on to the next letter of the word (`j` increases by 1). Otherwise, we skip it. The word is a subsequence if, at the end, all its letters have been found, that is, if `j` equals the length of the word. (In the reference solutions, the word is called `mot`.)

Why is it correct to always take **the first** letter that fits? If you can form the word using a letter further on in `P`, you can also use the first identical letter: it is even earlier in `P`, so all the letters chosen afterwards are still after it.

The traps:
- don't look for each letter of the word from the start of `P`: the order matters (`mare` isn't a subsequence of `programmes`), and a letter of `P` can only be used once (`aa` isn't one either, because `programmes` has only one `a`);
- once all the letters have been found, you must not read `word[j]` any more, because it doesn't exist: that's what the test `j < len(word)` is for;
- a word longer than `P` is never a subsequence, and the method handles that on its own.
