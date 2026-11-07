---
title: Make a sentence a palindrome
---

## Statement
A sentence is a **palindrome** when its letters, read from right to left, give the same sequence as read from left to right, ignoring case and every character that is not a letter. For example, `Never odd or even.` is a palindrome.

A sentence is given. Print the smallest number of letters that must be replaced (each one by another letter) so that it becomes a palindrome. The other characters do not count and are never modified.

## Input
One line: the sentence.

## Output
The minimum number of letters to replace.

## Constraints
- The sentence has between 1 and 150,000 characters: letters, digits, spaces and the signs `.,;:!?'()-`. It neither starts nor ends with a space and never contains two spaces in a row.
- A sentence without any letter is a palindrome.

## Hints
1. Start by extracting the letters of the sentence, in lowercase, into a list.
2. The first letter must equal the last one, the second must equal the second to last, and so on. These pairs are independent of each other.
3. A pair of different letters needs at least one replacement, and one is enough.

## Solution
Extract the letters of the sentence in lowercase into a list `t` of length `n` (digits and punctuation are ignored). The sentence is a palindrome exactly when `t[i] == t[n − 1 − i]` for every `i`. So the positions form pairs `(i, n − 1 − i)` for `i < n // 2`, plus the middle letter when `n` is odd, which is alone in its group.

A pair of different letters needs **at least** one replacement, since one of the two must change. One replacement is **enough**: replace the second letter by the first. Since each letter belongs to a single pair, the replacements of one pair have no effect on the others. So the answer is exactly the number of pairs whose two letters differ.

Count these pairs with two indices `i` and `j` that start from both ends and move towards each other while `i < j`. The program makes one pass to extract the letters and `n / 2` comparisons: work proportional to the length of the sentence. The traps: forgetting to ignore case (`E` and `e` are the same letter), or counting a pair twice by going to the end of the list instead of stopping in the middle.
