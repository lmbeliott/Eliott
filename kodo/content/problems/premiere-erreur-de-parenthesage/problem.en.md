---
title: First bracket error
---

## Statement
A string is made of the characters `(`, `)`, `[`, `]`, `{` and `}`. It is read from left to right. Each closing character must close the last opening character **not yet closed**, and it must be of the same type: `)` closes `(`, `]` closes `[`, `}` closes `{`.

- If a closing character cannot close an opening one (none is waiting, or the last one waiting is of another type), the string is incorrect: print the position of this closing character. Stop at the first error of this kind.
- If reading reaches the end without such an error but some opening characters were never closed, print the position of the leftmost of them.
- Otherwise, the string is well bracketed: print `OUI`.

Positions are numbered from 1.

## Input
A single line: the string, of length `N`, without spaces.

## Output
`OUI`, or the position of the error.

## Constraints
- 1 ≤ N ≤ 100,000

## Hints
1. Waiting opening characters are closed in the reverse order of their opening: the last opened is the first closed. This is a stack.
2. Push the **position** of each opening character rather than the character itself: the character is `s[position]`, and you have the position for the output.
3. At the end, if opening characters remain, the leftmost one is at the very bottom of the stack.

## Solution
Go through the string with a stack holding the positions of the waiting opening characters, from the oldest (at the bottom) to the most recent (at the top).

- For an opening character, push its position.
- For a closing character, look at the top of the stack. If the stack is empty, or if the opening character at the top is not of the same type, print the position of the closing character and stop. Otherwise, pop: this opening character is closed.

If the loop ends, the stack holds the opening characters never closed. If it is empty, print `OUI`; otherwise, print the position at the very bottom of the stack, `pile[0]`, which is the leftmost since positions were pushed in increasing order.

**Invariant.** Before processing character `i`, the stack holds, in order, exactly the opening characters already read and not yet closed. So the top of the stack is indeed the last opening character not yet closed, the one the closing character must close.

**Cost.** Each character is pushed at most once and popped at most once: at most 2N operations. Repeatedly removing neighbouring pairs `()`, `[]`, `{}` from the string would cost up to N² / 2 operations. The traps: looking at the top of an empty stack, and forgetting the case of the opening characters left at the end.
