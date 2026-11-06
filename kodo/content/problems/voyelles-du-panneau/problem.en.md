---
title: The vowels on the sign
---

## Statement
Théo is repainting the big wooden sign that welcomes visitors at the entrance of Valcorde. He paints the vowels yellow and the consonants blue. Before opening his paint pots, he wants to know how many letters he will paint in each colour.

The vowels are `a`, `e`, `i`, `o`, `u` and `y`. All the other letters are consonants.

Write a program that reads the word written on the sign and prints the number of vowels, then the number of consonants.

## Input
A single line containing the word, written in lowercase letters without accents.

## Output
Two lines:
- on the first one, the number of vowels in the word;
- on the second one, the number of consonants.

## Constraints
- The word has between 1 and 100 letters, all between `a` and `z`.

## Hints
1. Go through the word letter by letter with a loop, and keep a counter.
2. For each letter, test whether it is one of the six vowels. In Python, `c in "aeiouy"` does this test in one go.
3. No need to count the consonants too: each letter is either a vowel or a consonant. So the number of consonants is the length of the word minus the number of vowels.

## Solution
We go through the letters of the word one by one. Each time the letter is a vowel, we add 1 to a counter. At the end, this counter gives the number of vowels, and the length of the word minus this counter gives the number of consonants.

The trap: forgetting `y`, which counts as a vowel here (`lynx` has one vowel and three consonants).

In C++, you can write the test with `||`: `c == 'a' || c == 'e' || …`. The length of the word is given by `mot.size()` (in the reference solutions, `mot` is French for "word").
