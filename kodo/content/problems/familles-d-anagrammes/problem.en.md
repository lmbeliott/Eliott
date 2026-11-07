---
title: Anagram families
---

## Statement
Two words are **anagrams** if you can get one by changing the order of the letters of the other: they use exactly the same letters, each one the same number of times. For example, `chien` and `niche` are anagrams, and so are `arme`, `mare` and `rame`. However, `salle` and `lasse` are not: the first one has two `l`s and one `s`, the second one has one `l` and two `s`s.

A **family** is a group of words that are all anagrams of each other. A word that has no anagram in the list forms a family on its own.

Write a program that sorts a list of words into families.

## Input
- The first line contains an integer `N`: the number of words.
- The next `N` lines each contain one word, in lowercase letters without accents. The `N` words are all different.

## Output
- On the first line, the number of families.
- Then one line per family: the words of the family, in alphabetical order and separated by a space.

The families are printed in the alphabetical order of their first word.

## Constraints
- 1 ≤ N ≤ 1,000
- Each word has between 1 and 20 letters.

## Hints
1. Comparing each word with all the others is complicated. Instead, look for a "signature" that you can compute for each word on its own, which is the same for two anagrams and different otherwise.
2. What happens if you put the letters of `chien` in alphabetical order? And those of `niche`?
3. The signature of a word is its sorted letters: `"".join(sorted(word))` in Python, or a copy of the word sorted with `sort` in C++. Then store the words in a dictionary whose keys are the signatures and whose values are lists of words. All that's left is to sort each family, then the list of families.

## Solution
The key idea is to give each word a **signature**: its letters sorted in alphabetical order. `chien` and `niche` both have the signature `cehin`. Two words are anagrams exactly when they have the same signature: having the same letters, each one the same number of times, means having the same list of letters once sorted. For `salle` (`aells`) and `lasse` (`aelss`), the signatures are different.

Then it's a **grouping**: we use a dictionary that maps each signature to the list of words that have it (called `familles`, French for "families", in the reference solutions). Each word is added to the list of its signature, which we create empty the first time.

For the output, we sort each family, then sort the list of families. In Python as in C++, two lists are compared element by element, starting with the first one: since all the words are different, the families end up sorted by their first word.

The traps:
- comparing only the **set** of letters used: `salle` and `lasse` both use the letters `a`, `e`, `l`, `s`, but not the same number of times. Sorting the letters keeps the repetitions, so it solves the problem;
- sorting the families before sorting the words inside each one: the order of the families depends on their first word **once sorted**;
- forgetting to print the number of families on the first line.

Comparing each word with all the others would also work, but it would be longer to write and slower: with the signature, each word is handled only once.
