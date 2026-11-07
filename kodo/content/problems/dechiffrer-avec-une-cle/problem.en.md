---
title: Decrypt with a key
---

## Statement
A message was encrypted with a key, a word of lowercase letters. The letters of the key are used one after the other, starting again from the beginning of the key when it runs out. Each letter of the message was **moved forward** in the alphabet by as many places as the rank of the corresponding key letter: `a` moves by 0, `b` by 1, …, `z` by 25. After `z`, you go back to `a`.

Spaces are copied as they are and don't use a letter of the key.

For example, with the key `bac`, the message `un message secret` becomes `vn ofsubgg teesev`: `u` moves by 1 (`b`), `n` by 0 (`a`), `m` by 2 (`c`), `e` by 1 (`b`), and so on.

Recover the original message from the key and the encrypted message.

## Input
The first line contains the key. The second line contains the encrypted message: lowercase letters and spaces, with no space at the beginning or the end, and never two spaces in a row.

## Output
The original message, on one line.

## Constraints
- The key has between 1 and 100 letters.
- The encrypted message has between 1 and 1,000 characters.

## Hints
1. To decrypt, you must move each letter **back** by the rank of the key letter. The rank of a letter `c` is `ord(c) - ord("a")`.
2. To move back while going round from `a` to `z`, compute the new rank modulo 26: in Python, `(-1) % 26` is `25`. In C++, the remainder of a negative number is negative: add 26 before taking the remainder again.
3. Keep a counter `k` of letters already decrypted: the key letter to use is `cle[k % len(cle)]`. Don't increase `k` on a space.

## Solution
Go through the message character by character, building the result in a string. A counter `k` tells how many letters have already been handled; the key letter to use is `cle[k % len(cle)]`, which makes the key loop around automatically.

- For a space, copy it, and `k` does not change.
- For a letter, the shift is `ord(key letter) - ord("a")`. Move the letter back by this shift, then increase `k` by 1.

Moving back is isolated in a function `decaler(lettre, decalage)` ("shift"): go to the rank (from 0 to 25), subtract, take the remainder modulo 26 to come back into the alphabet, then go back to a letter with `chr`. In Python, `%` always gives a result between 0 and 25, even for a negative number. In C++, `(-3) % 26` is `-3`: write `((x % 26) + 26) % 26`.

The classic mistake is to move forward in the key using the index of the character in the message: spaces then shift everything that follows.
