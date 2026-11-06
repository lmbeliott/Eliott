---
title: The trail markers
---

## Statement
Along the ridge trail, each marker post has a letter painted on it. While climbing, Chloé reads the letters of the markers in order: she gets a string `P`.

Her friends give her a challenge: for each word they suggest, Chloé must choose markers **in the order of the climb** whose letters, read one after the other, form exactly that word. She can skip as many markers as she wants, but she never goes back and can't use the same marker twice.

For example, if `P` is `marmottes`, Chloé can form `mot` (the first `m`, the `o`, then a `t`), but not `tom`: after the last `t`, there is no `o` left.

Write a program that says, for each word, whether Chloé can form it.

## Input
- The first line contains the string `P`.
- The second line contains an integer `Q`: the number of suggested words.
- The next `Q` lines each contain one word.

All letters are lowercase, without accents.

## Output
`Q` lines: for each word, in the order of the input, print `oui` (French for "yes") if Chloé can form it, and `non` ("no") otherwise. Print exactly these French words.

## Constraints
- `P` has between 1 and 1,000 letters.
- 1 ≤ Q ≤ 100
- Each word has between 1 and 100 letters.

## Hints
1. Do it by hand on the example: you read the markers one by one, and you keep in mind the next letter of the word you are looking for.
2. If the marker has the letter you are looking for, take it right away! There is never any point in waiting for a marker further on with the same letter: taking the first one leaves you more markers for the rest of the word.
3. Keep an index `j`: the number of letters of the word already found. Go through `P`; when the letter you read equals `word[j]`, increase `j`. At the end, the word can be formed if and only if `j` equals the length of the word. Don't forget to check `j < len(word)` before reading `word[j]`.

## Solution
We read `P` only once, from left to right, keeping an index `j` on the next letter of the word to find. At each marker, if its letter equals `word[j]`, we take it and move on to the next letter (`j` increases by 1). Otherwise, we skip it. The word can be formed if, at the end, all its letters have been found, that is, if `j` equals the length of the word. (In the reference solutions, the word is called `mot` and the trail `piste`.)

Why is it correct to always take **the first** marker that fits? If Chloé can form the word using a marker further on for some letter, she can also use the first marker with that letter: it is even earlier on the trail, so all the markers she chooses afterwards are still after it.

The traps:
- don't look for each letter of the word from the start of `P`: the order matters (`tom` can't be formed with `marmottes`), and a marker can only be used once (`aa` can't be formed with `marmottes`, which has only one `a`);
- once all the letters have been found, you must not read `word[j]` any more, because it doesn't exist: that's what the test `j < len(word)` is for;
- a word longer than `P` can never be formed, and the method handles that on its own.
