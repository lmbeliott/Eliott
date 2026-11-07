Level 2 showed that a string can be handled like an array of characters: you traverse it, cut it, glue it back together. This chapter moves on to **algorithms** on strings. Does the sentence "Never odd or even" read the same in both directions? At which positions does the word `ana` occur in a text of a hundred thousand letters? How many pieces of a word start with `a` and end with `b`?

These questions have obvious solutions, not always fast ones. From this level on, every algorithm comes with two justifications: why it gives the right answer (its **correctness**), and how many operations it performs (its **cost**). The cost is counted as a function of the length of the strings, written `n`: an algorithm doing about `n` operations stays instantaneous for `n = 100,000`, while an algorithm doing about `n²` of them, ten billion, does not finish in time.

## Character codes and classes

Each character has a **code**, an integer: `ord(c)` gives it in Python, and in C++ a `char` already is a small integer. Lowercase letters have consecutive codes (97 for `a`, …, 122 for `z`), and so do uppercase letters (65 to 90) and digits (48 to 57). A **class** of characters is a set of characters handled the same way: lowercase letters, uppercase letters, digits, the others. Thanks to the consecutive codes, each class is tested with a range check: `"a" <= c <= "z"` in Python, `c >= 'a' && c <= 'z'` in C++.

Codes let you compute with letters. The **rank** of a lowercase letter, `ord(c) - ord("a")`, goes from 0 to 25. To shift a letter by `k` steps, wrapping around to `a` after `z`, compute the new rank `(rank + k) % 26`, then the letter of that rank. This is a **circular shift**: the remainder of the division by 26 "turns" the alphabet around.

```python
def decaler(c, k):
    if "a" <= c <= "z":
        return chr(ord("a") + (ord(c) - ord("a") + k) % 26)
    if "A" <= c <= "Z":
        return chr(ord("A") + (ord(c) - ord("A") + k) % 26)
    return c

print(decaler("y", 3), decaler("B", -3), decaler("!", 5))
```

```cpp
#include <iostream>
using namespace std;

char decaler(char c, int k) {
    k = ((k % 26) + 26) % 26;   // a shift between 0 and 25, even if k < 0
    if (c >= 'a' && c <= 'z') {
        return 'a' + (c - 'a' + k) % 26;
    }
    if (c >= 'A' && c <= 'Z') {
        return 'A' + (c - 'A' + k) % 26;
    }
    return c;
}

int main() {
    cout << decaler('y', 3) << " " << decaler('B', -3) << " " << decaler('!', 5) << "\n";
    return 0;
}
```

The program prints `b Y !`. The rank of `y` is 24, and `(24 + 3) % 26` is 1: you get `b`. For `B`, rank 1 and shift −3 give `(1 − 3) % 26`. In Python, this remainder is 24, because the remainder always has the sign of the divisor: you get `Y`. In C++, `-2 % 26` is `-2`, which would give a character that is not a letter. That is why the C++ version first brings `k` between 0 and 25 with `((k % 26) + 26) % 26`.

The same computation works for digits, with `"0"` and 10 instead of `"a"` and 26. Shifting by `k` steps or by `k % 26` steps gives the same letter: a shift of 10⁹ steps costs a single operation.

## Palindromes

A **palindrome** is a string that reads the same from left to right and from right to left: `radar`, `level`, `a`, and even the empty string. In other words, `s` is a palindrome when `s[i] == s[n - 1 - i]` for every index `i`, where `n` is the length of `s`.

Python has a short way to reverse a string. The slices of level 2 accept a third number, the **step**: `s[a:b:p]` takes one character every `p`. With a step of −1 and no bounds, `s[::-1]` goes through the whole string backwards. The test `s == s[::-1]` is therefore correct, but it first builds a full copy of `s`, then compares everything, even when the first two characters already differ.

The **two-index** algorithm avoids both drawbacks. An index `i` starts at the beginning, an index `j` starts at the end, and they move towards each other while `i < j` and the facing characters are equal.

```python
def est_palindrome(s):
    i = 0
    j = len(s) - 1
    while i < j and s[i] == s[j]:
        i = i + 1
        j = j - 1
    return i >= j

print(est_palindrome("radar"), est_palindrome("rotor"), est_palindrome("route"))
```

```cpp
#include <iostream>
#include <string>
using namespace std;

bool estPalindrome(const string &s) {
    int i = 0;
    int j = (int) s.size() - 1;
    while (i < j && s[i] == s[j]) {
        i = i + 1;
        j = j - 1;
    }
    return i >= j;
}

int main() {
    cout << estPalindrome("radar") << " " << estPalindrome("rotor") << " " << estPalindrome("route") << "\n";
    return 0;
}
```

Python prints `True True False` (C++ prints `1 1 0`). For `route`, the loop stops at the very first comparison, `r` against `e`, with `i = 0 < j = 4`: the function returns false.

**Why it is correct.** At the start of each turn, all the characters before `i` are equal to their mirror characters, located after `j`. This holds at the start (there are none), and each turn only moves the indices after checking `s[i] == s[j]`. A property that stays true at every turn is called an **invariant**; it will be studied in detail two chapters later. If the loop stops because `i >= j`, all the pairs have been checked: it is a palindrome. If it stops on a mismatch, it is not a palindrome.

**Cost.** At most `n / 2` comparisons, and no copy. The loop stops at the first mismatch.

For a sentence, you often keep only the letters, ignoring case. First extract these letters, in lowercase, into a new string, then apply the same function.

## Naive pattern search

Searching for a **pattern** `p` (a string of length `m`) in a **text** `t` (of length `n`) means finding the indices `i` such that `t[i:i + m] == p`. Each of these indices is an **occurrence** of the pattern. In `banana`, the pattern `ana` has two occurrences, at indices 1 and 3, which **overlap**: they share the `a` at index 3.

The **naive search** tries each possible starting index, from 0 to `n − m`, and compares the pattern with the text character by character, up to the first mismatch.

```python
t = "banana"
p = "ana"
n = len(t)
m = len(p)
for i in range(n - m + 1):
    j = 0
    while j < m and t[i + j] == p[j]:
        j = j + 1
    if j == m:
        print(i)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string t = "banana", p = "ana";
    int n = t.size(), m = p.size();
    for (int i = 0; i + m <= n; i++) {
        int j = 0;
        while (j < m && t[i + j] == p[j]) {
            j = j + 1;
        }
        if (j == m) {
            cout << i << "\n";
        }
    }
    return 0;
}
```

The program prints `1` then `3`. The inner loop maintains the property "the first `j` characters of the pattern match the text starting at `i`". When it stops with `j == m`, the whole pattern matches: it is an occurrence. Since every starting index is tried, no occurrence is missed. The last position tried is `n − m`: beyond it, the pattern would go past the end of the text. If `m > n`, `range(n - m + 1)` is empty and the loop makes no turn.

**Cost.** Each starting index takes at most `m` comparisons, so the search makes at most `(n − m + 1) × m` of them. The worst case is reached by a text like `aaaa…a` and the pattern `aa…ab`: each attempt compares almost the whole pattern before failing on the `b`. With `n = 100,000` and `m = 50,000`, that is more than a billion comparisons. On an ordinary text, however, most attempts fail at the first or second character, and the search makes barely more than `n` comparisons. So the naive search is fine when the pattern is short; level 5 will present algorithms that always make on the order of `n + m` operations.

Python provides ready-made tools: `p in t` tells whether the pattern occurs, `t.find(p)` gives the index of the first occurrence (or `-1`), and `t.count(p)` counts the occurrences **without overlap**: `"aaaa".count("aa")` is 2, not 3. In C++, `t.find(p)` returns the index of the first occurrence, or the special value `string::npos` if there is none, and `t.find(p, d)` searches from index `d`. These tools make comparisons too: a call to `find` inside a loop is not free.

## Counting substrings

A **substring** of `s` is a piece of consecutive characters, `s[i:j]` with `i < j`. A string of length `n` has `n` substrings of length 1, `n − 1` of length 2, …, a single one of length `n`: in all, `n + (n − 1) + … + 1 = n × (n + 1) / 2` substrings. For `n = 100,000`, that is five billion. Examining them one by one is out of the question; you must **count them without listing them**.

The most useful idea is to group the substrings by their **last position**. Let us count, for example, the substrings that start with `a` and end with `b`. Such a substring ends on a `b` at index `j`, and starts on an `a` at index `i < j`. When the traversal reaches a `b`, each `a` already met provides exactly one substring. So it is enough to keep the number of `a`s seen so far up to date.

```python
s = "abcab"
nb_a = 0
total = 0
for c in s:
    if c == "b":
        total = total + nb_a
    if c == "a":
        nb_a = nb_a + 1
print(total)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "abcab";
    long long nbA = 0, total = 0;
    for (char c : s) {
        if (c == 'b') {
            total = total + nbA;
        }
        if (c == 'a') {
            nbA = nbA + 1;
        }
    }
    cout << total << "\n";
    return 0;
}
```

The program prints `3`: the substrings `ab` (indices 0 and 1), `abcab` (0 to 4) and `ab` (3 and 4). Each valid substring is counted once and only once, when the traversal reaches its last character. The program does a constant number of operations per character: its cost is proportional to `n`, instead of `n²` for trying every pair `(i, j)`. The total can exceed 2³¹: in C++, use a `long long`.

## Building a string efficiently

In Python, a string is immutable. The instruction `s = s + c` does not modify `s`: it builds a new string, **copying** all the characters of `s` then `c`. Building a string of `n` characters this way copies `1 + 2 + … + n`, about `n² / 2` characters. Python sometimes avoids this copy for `s = s + c` when nothing else uses `s`, but that is an optimisation, not a guarantee. For `s = c + s`, which adds at the front, the copy always happens: reversing a text of 100,000 characters this way copies five billion characters.

The right method is to store the pieces in a **list**, where `append` costs a single operation, then to glue them once at the end with `"".join(pieces)`, which copies each character only once.

```python
mots = ["un", "deux", "trois"]
morceaux = []
for m in mots:
    morceaux.append(m.upper())
    morceaux.append(str(len(m)))
print("".join(morceaux))
print("-".join(morceaux))
```

```cpp
#include <cctype>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> mots = {"un", "deux", "trois"};
    string resultat = "", avecTirets = "";
    for (string m : mots) {
        for (char &c : m) {
            c = toupper(c);
        }
        string longueur = to_string(m.size());
        resultat += m;
        resultat += longueur;
        if (avecTirets != "") {
            avecTirets += "-";
        }
        avecTirets += m;
        avecTirets += "-";
        avecTirets += longueur;
    }
    cout << resultat << "\n" << avecTirets << "\n";
    return 0;
}
```

The program prints `UN2DEUX4TROIS5`, then `UN-2-DEUX-4-TROIS-5`. C++ has no `join`: the separator is added by hand, between two pieces. A C++ `string` can be modified: `resultat += m` appends at the end without copying what comes before, most of the time. On the other hand, `resultat = resultat + m` builds a new string and copies everything: the difference between these two forms, which look equivalent, can turn an instantaneous program into one that is too slow. To build a string backwards, build it forwards then reverse it once, or fill it from the end.

## Common mistakes

**Forgetting the last position.** `for i in range(n - m):` does not try index `n − m`. With `t = "abc"` and `p = "bc"`, the occurrence at index 1 is missed. The correct bound is `range(n - m + 1)`.

**Going past the text.** Without the bound `n − m`, the comparison `t[i + j]` goes past the end and Python stops with `IndexError: string index out of range`. In C++, there is no message: the program reads garbage.

**Counting overlapping occurrences with `count`.** `"aaa".count("aa")` is 1. If the statement counts overlaps, you need the naive search, or calls to `find` that restart just after the start of the last occurrence found (its index plus one).

**Joining numbers.** `" ".join([1, 2, 3])` raises `TypeError: sequence item 0: expected str instance, int found`. Convert each element with `str` before adding it to the list.

**Comparing the result of `find` in C++.** `t.find(p)` returns an unsigned integer; if there is no occurrence, it is `string::npos`, a huge number. Write `if (t.find(p) != string::npos)`, not `if (t.find(p) >= 0)`, which is always true.

**Negative remainders in C++.** `(c - 'a' + k) % 26` is negative if `k` is negative enough: bring `k` between 0 and 25 before the computation.

## A complete example

**Statement.** Read a word of `N` lowercase letters, with `N ≤ 2,000`. Print the length of its longest palindromic substring.

**Idea.** Testing the `N × (N + 1) / 2` substrings, with `N / 2` comparisons each, would take on the order of a billion operations. Instead, use the **centre** of a palindrome. A palindrome of odd length has its middle character as centre; a palindrome of even length has as centre the gap between its two middle characters. So a word of `N` letters has `2N − 1` possible centres. Around a fixed centre, start from the smallest palindrome (one letter, or nothing) and **extend** it by one character on each side, as long as the two new characters are equal.

**Program.**

```python
# extends the palindrome s[i+1:j] while s[i] == s[j]; returns its length
def plus_long_autour(s, i, j):
    while i >= 0 and j < len(s) and s[i] == s[j]:
        i = i - 1
        j = j + 1
    return j - i - 1

n = int(input())
s = input()
meilleur = 0
for c in range(n):
    meilleur = max(meilleur, plus_long_autour(s, c, c))       # centre on letter c
    meilleur = max(meilleur, plus_long_autour(s, c, c + 1))   # centre between c and c + 1
print(meilleur)
```

```cpp
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

// extends the palindrome s[i+1..j-1] while s[i] == s[j]; returns its length
int plusLongAutour(const string &s, int i, int j) {
    while (i >= 0 && j < (int) s.size() && s[i] == s[j]) {
        i = i - 1;
        j = j + 1;
    }
    return j - i - 1;
}

int main() {
    int n;
    string s;
    cin >> n >> s;
    int meilleur = 0;
    for (int c = 0; c < n; c++) {
        meilleur = max(meilleur, plusLongAutour(s, c, c));       // centre on letter c
        meilleur = max(meilleur, plusLongAutour(s, c, c + 1));   // centre between c and c + 1
    }
    cout << meilleur << "\n";
    return 0;
}
```

**Checking by hand.** With `7` and `abacabb`. The centre on the letter at index 3 (`c`) extends: `a` = `a` (indices 2 and 4), then `b` = `b` (1 and 5), then `a` against `b` (0 and 6): it stops with `i = 0` and `j = 6`, and the length is `6 − 0 − 1 = 5`, that of `bacab`. The centre between indices 5 and 6 gives `bb`, of length 2. No other centre does better, and the program prints `5`. With the centre between indices 0 and 1 (`a` against `b`), the loop makes no turn and the function returns `1 − 0 − 1 = 0`, the length of the empty palindrome.

**Why it is correct.** If `s[i..j]` is a palindrome, removing its two ends still gives a palindrome, with the same centre. Conversely, starting from the centre, each extension keeps the property "`s[i+1..j-1]` is a palindrome", since you only extend when the two new characters are equal. So the extension stops exactly on the longest palindrome with this centre: beyond it, the two characters differ or you leave the word, and no longer palindrome with the same centre exists. Every palindrome has a centre, and the program tries every centre: so it finds the longest one.

**Cost.** Each extension around a centre makes at most `N / 2` turns, and there are `2N − 1` centres: at most about `N²` comparisons, that is four million for `N = 2,000`. This is far less than the billion operations of trying every substring.

## Key takeaways

- Character classes are tested with code ranges; a circular shift is computed on the rank with `% 26` (or `% 10`), first bringing the shift between 0 and 25 in C++.
- A palindrome is tested with two indices moving towards each other: at most `n / 2` comparisons, without a copy. `s[::-1]` reverses a string in Python.
- The naive pattern search tries the `n − m + 1` starting positions and makes at most `(n − m + 1) × m` comparisons: fast for a short pattern, slow in the worst case. `count` ignores overlapping occurrences.
- A string has `n × (n + 1) / 2` substrings: count them without listing them, by grouping them by last position and keeping counters up to date.
- To build a long string, accumulate the pieces in a list, then `"".join(...)`; in C++, `+=` and not `s = s + ...`.
- Every algorithm is justified: why it is correct (what stays true at each turn of the loop) and how many operations it makes as a function of `n`.
