---
title: Dictionary compression
---

## Statement
A compression method replaces a text with a list of codes, building along the way a dictionary of pieces of text.

At the start, the dictionary contains the 26 letters: `a` has code 0, `b` code 1, …, `z` code 25. The next free code is 26. Read the text from left to right while keeping a **current piece**, which is first the first letter. For each following letter `c`:
- if the current piece followed by `c` is in the dictionary, it becomes the new current piece;
- otherwise, write the code of the current piece, add to the dictionary the current piece followed by `c` with the next free code, and the current piece becomes `c` alone.

At the end of the text, write the code of the current piece.

For example, `abababa` gives the codes `0 1 26 28`: write `a` (0) and add `ab` (26), write `b` (1) and add `ba` (27), write `ab` (26) and add `aba` (28), and finish by writing `aba` (28).

Print the list of codes produced for a given text.

## Input
A single line containing the text, made of lowercase letters.

## Output
On the first line, the number of codes. On the second line, the codes in order, separated by spaces.

## Constraints
- The text has between 1 and 50,000 letters.

## Hints
1. The dictionary of the method is exactly a Python dictionary: the keys are strings, the values integers.
2. First fill in the 26 letters with a loop and `chr(ord("a") + i)`. Keep the next free code in a variable.
3. Trace the example `abababa` by hand and check the values of the current piece after each letter. Don't forget the last code, written after the loop.

## Solution
The task is to **simulate** the method with exactly the right structures. The dictionary `code` maps each known piece of text to its code; it is first filled with the 26 letters. The variable `suivant` ("next") is 26, and the current piece `mot` is the first letter of the text.

For each following letter `c`, test whether `mot + c` is a key of the dictionary:
- if so, `mot` becomes `mot + c`: you try to extend the piece as far as possible;
- otherwise, append `code[mot]` to the list of codes, record `code[mot + c] = suivant`, increase `suivant`, and `mot` becomes `c`.

After the loop, one current piece is left unwritten: append its code. It is always in the dictionary, since it was only extended into known pieces.

Each test `mot + c in code` is done without going through the dictionary. With a list of pieces instead, each test would go through thousands of pieces, and the program would make hundreds of millions of comparisons on a text of 50,000 letters.

The traps: forgetting the last code; starting again from an empty piece instead of the letter `c`; writing the code of `mot + c` instead of that of `mot`. The safest way is to check your program on `abababa` and on `aaaaaaaaaa`, which gives `0 26 27 28` (the pieces `a`, `aa`, `aaa`, `aaaa`).
