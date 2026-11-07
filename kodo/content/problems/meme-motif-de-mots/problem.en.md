---
title: Same pattern of words
---

## Statement
A pattern is a word of letters, like `abba`. A sentence **follows** the pattern if a word can be associated with each letter so that:
- the sentence has as many words as the pattern has letters, and the `i`-th word is the one associated with the `i`-th letter;
- two different letters are associated with two different words.

For example, `chat chien chien chat` follows the pattern `abba` (`a` → `chat`, `b` → `chien`), but `chat chat` does not follow the pattern `ab`, because `a` and `b` would be associated with the same word.

Tell whether the sentence follows the pattern.

## Input
The first line contains the pattern, in lowercase letters. The second line contains the sentence: words of lowercase letters separated by a space.

## Output
`OUI` if the sentence follows the pattern, `NON` otherwise.

## Constraints
- The pattern has between 1 and 1,000 letters.
- The sentence has between 1 and 1,000 words, each of 1 to 10 letters.

## Hints
1. A dictionary `letter → word` lets you check that a given letter always corresponds to the same word.
2. That's not enough: with the pattern `ab` and the sentence `chat chat`, the dictionary `a → chat, b → chat` detects no contradiction. You also need a dictionary `word → letter`.
3. Think of the case where the number of words differs from the number of letters.

## Solution
Write a function `meme_motif(motif, mots)` ("same pattern") that returns a boolean. It starts by comparing the lengths: if the sentence doesn't have as many words as the pattern has letters, the answer is `NON`.

Then go through the positions `i` keeping **two dictionaries**:
- `mot_de` maps each letter already met to the word that corresponds to it;
- `lettre_de` maps each word already met to the letter that corresponds to it.

For the letter `c` and the word `m` at position `i`, if `c` is already associated with a word other than `m`, or if `m` is already associated with a letter other than `c`, the sentence doesn't follow the pattern. Otherwise, record both associations and continue. If the loop ends without a contradiction, the associations form a correspondence between letters and words that respects both rules.

The trap is to use only the first dictionary: it guarantees that a letter has a single word, but not that two letters have different words. The function lets you return `False` at the first contradiction, without a flag or `break`.
