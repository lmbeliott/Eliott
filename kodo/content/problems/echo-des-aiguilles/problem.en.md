---
title: The echo of the Aiguilles
---

## Statement
At the foot of the Aiguilles, there is a very strange echo: it sends words back reversed! When Lucas shouts `piolet`, the mountain answers `teloip`.

Lucas has prepared a list of words to shout. For each one, he wants to know what the echo will answer. He also wants to count the words that the echo sends back unchanged, like `kayak`: those are his favourite words.

Write a program that prints the echo's answer for each word, then the number of words that the echo sends back unchanged.

## Input
- The first line contains an integer `N`: the number of words.
- The next `N` lines each contain one word, in lowercase letters without accents.

## Output
- `N` lines: for each word, in the order of the input, the word written backwards.
- Then one last line with an integer: the number of words that are identical to their echo.

## Constraints
- 1 ≤ N ≤ 100
- Each word has between 1 and 50 letters.

## Hints
1. To write a word backwards, go through its letters from the last one to the first one, and add them one by one to a new, empty string.
2. The last letter of `word` is at index `len(word) - 1` (in C++: `word.size() - 1`), and the first one is at index `0`.
3. Once you have the reversed word, just compare it with the original word using `==` to know whether the echo sends it back unchanged.

## Solution
For each word, we build its reverse: we start from an empty string and add the letters of the word starting from the end (indices `len(word) - 1`, `len(word) - 2`, …, `0`). We print this reverse, then compare it with the word: if they are equal, we increase a counter, which we print at the very end. (In the reference solutions, the word is called `mot` and its reverse `envers`.)

A word that is equal to its reverse is called a **palindrome**. A one-letter word is always a palindrome.

The traps:
- the loop that starts from the end must go all the way down to index `0` included: in Python, that's `range(len(word) - 1, -1, -1)`;
- the counter is printed only **once**, after the loop over the words.

In Python, you can also get the reverse in one go with `word[::-1]`, and in C++ with `string reversed_word(word.rbegin(), word.rend());`. That's handy, but first make sure you can write it with a loop!
