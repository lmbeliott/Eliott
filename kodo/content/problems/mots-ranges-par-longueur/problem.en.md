---
title: Words ordered by length
---

## Statement
Order `N` words from the shortest to the longest. Words of the same length stay in the order in which they are given: this is a **stable** sort by length.

For example, `pomme kiwi fraise noix` becomes `kiwi noix pomme fraise`: `kiwi` and `noix` have 4 letters, and `kiwi` came before `noix`.

## Input
The first line contains `N`. The second line contains the `N` words, separated by spaces. Each word is made of 1 to 12 lowercase letters.

## Output
A single line: the ordered words, separated by spaces.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ length of each word ≤ 12

## Hints
1. A selection sort that swaps words is not stable: a swap can move a word in front of another word of the same length.
2. Lengths only take 12 values. Prepare 12 lists, one per length, and put the words in them in reading order.
3. In Python, `sorted(mots, key=len)` is also a solution, because Python's sort is stable. In C++, `stable_sort` is stable, `sort` is not.

## Solution
Prepare an empty list for each length from 1 to 12. Read the words in order and append each one to the list of its length. Finally, print the lists one after the other, from length 1 to length 12.

Words come out by increasing length, since the lists are printed in that order. And two words of the same length are in the same list, where they were appended in reading order: the original order is kept. This is a stable counting sort, where the elements themselves are stored instead of only being counted.

The program makes one pass over the words and one pass over the lists: about 2N operations, against N² / 2 = 200 million comparisons for an insertion sort on 20,000 words. The trap is to use a sort that is not stable, such as `sort` in C++ or a hand-written selection sort.
