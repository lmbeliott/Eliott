---
title: The wooden letters
---

## Statement
For the village festival, Malik was given a bag of wooden letters to make a sign. Before decorating it, he has fun looking for all the words (even meaningless ones) that he can form using **all** his letters, each exactly once.

Some letters come in several copies. Swapping two identical letters gives the same word: each word must appear only once in the list.

Write a program that prints all these words in alphabetical order.

## Input
A single line containing Malik's letters, written together, in uppercase.

## Output
- On the first line, the number of different words.
- Then all these words, one per line, in alphabetical order.

## Constraints
- There are between 1 and 12 letters, all between `A` and `Z`.
- There are at most 20 000 different words.

## Hints
1. With 12 letters, there are 12! ≈ 479 million ways to arrange them. Generating them all and then removing duplicates is far too slow: you must avoid building the same word twice.
2. Build the word letter by letter with a recursive function. Instead of a list of letters, keep the **number** of available letters of each kind.
3. At each position, try each **different** letter still available only once, in alphabetical order. The words then come out without duplicates and already sorted.

## Solution
**The idea: enumerate distinct letters, not copies.** We count the copies of each letter (`compte['N'] = 2` for `ANNA`; *compte* means "count"). The recursive function `explorer` ("explore") adds one letter at the end of the word being built: for each distinct letter c, in alphabetical order, if `compte[c] > 0`, we take it (`compte[c] -= 1`), explore the rest, then put it back (`compte[c] += 1`). When the word has all its letters, we add it to the list.

**Why there are no duplicates.** Two words produced by two different branches differ at the first position where the branches split, because two **different** letters were placed there. With the two `N`s of `ANNA`, choosing "the first N" or "the second N" would be the same branch: we only try it once.

**Why the order is alphabetical.** At each position, the letters are tried from `A` to `Z`: all the words whose first letter is smaller come out before the others, and so on at every position.

**Complexity.** Each call of the function corresponds to a different beginning of a word, which leads to at least one word of the list. A 12-letter word has 13 beginnings (from 0 to 12 letters): so there are at most 13 × 20 000 = 260 000 calls, with at most 12 distinct letters to try in each one.

**Why the naive solution is too slow.** Generating all the permutations (for example with `itertools.permutations`), then putting them in a set and sorting, builds 12! ≈ 4.8 × 10⁸ permutations for `AAAAAABBBBCC`, while there are only 13 860 different words.

**Traps.**
- Always put the letter back into the stock after the recursive call: otherwise the following branches run out of letters.
- Print the number of words first.
