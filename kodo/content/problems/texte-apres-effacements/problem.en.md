---
title: Text after deletions
---

## Statement
The keys pressed on a keyboard are recorded. A lowercase letter adds that letter at the end of the text; the character `<` stands for the delete key, which removes the last letter of the text. On an empty text, deleting does nothing.

Print the text obtained at the end.

## Input
A single line: the sequence of the `N` keys pressed, without spaces.

## Output
The final text, or `VIDE` if it contains no letter.

## Constraints
- 1 ≤ N ≤ 100,000

## Hints
1. The deleted letter is always the **last** one added among those that remain: this is how a stack behaves.
2. Keep the letters in a list: `append` for a letter, `pop` for `<` (only if the list is not empty).

## Solution
Keep the text in a stack of characters (a Python list, a `string` or a `vector<char>` in C++). For a letter, push it; for `<`, pop if the stack is not empty. At the end, the stack holds the text, from the first letter (at the bottom) to the last one (at the top).

This is correct, because at any moment the stack is exactly the displayed text: adding a letter adds it at the top, that is at the end, and deleting removes the top one, that is the last one.

Each key costs a single stack operation: about N operations in total. Rebuilding a new string at each deletion (`s = s[:-1]`) would copy the whole text each time. The classic trap: popping an empty stack, which raises `IndexError: pop from empty list` in Python.
