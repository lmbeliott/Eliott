Since level 1, programs have read and printed text, but without ever looking inside it. A word was a block that could only be copied. Yet many questions are about the letters themselves: does a word read the same both ways? How many times does the letter `e` appear in a sentence? Is this hundred-digit number divisible by 3?

This chapter shows that a **string** can be handled almost like an array: you access each character by its index, traverse it, compare it, build new ones. You will also see that every character has a number, which lets you compute with letters.

## A string is a sequence of characters

A **string** is a sequence of **characters**: letters, digits, spaces, punctuation marks. As with an array, each character has an index, starting from 0, and `len(s)` gives the length. In C++, the type `string` (in `<string>`) plays this role, and the length is written `s.size()`.

```python
s = "bonjour"
print(len(s))
print(s[0], s[3], s[len(s) - 1])
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "bonjour";
    cout << s.size() << "\n";
    cout << s[0] << " " << s[3] << " " << s[s.size() - 1] << "\n";
    return 0;
}
```

The program prints `7`, then `b j r`. As with lists, Python accepts `s[-1]` for the last character.

One difference between the two languages is worth noting right away. In C++, a single character has its own type, `char`, and is written between **single quotes**: `'b'`. **Double quotes** `"b"` denote a string, even if it contains only one character. `s[0]` is a `char`. In Python, there is no character type: `s[0]` is a string of length 1, and `'b'` and `"b"` are the same thing.

## Traversing a string

You traverse a string exactly like an array: by value with `for c in s:`, which gives the characters one by one, or by index with `for i in range(len(s)):`. The following program counts the `e`s of a word.

```python
mot = input()
nb = 0
for c in mot:
    if c == "e":
        nb = nb + 1
print(nb)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot;
    cin >> mot;
    int nb = 0;
    for (char c : mot) {
        if (c == 'e') {
            nb = nb + 1;
        }
    }
    cout << nb << "\n";
    return 0;
}
```

With the input `entreprise`, the program prints `3`. Traversal by index is useful when you compare a character with its neighbour, or with the matching one at the other end of the word: `s[i]` and `s[len(s) - 1 - i]`.

## Building a string

In Python, a string **cannot be modified**: `s[0] = "B"` causes `TypeError: 'str' object does not support item assignment`. A string is said to be **immutable**. To get a different string, you build a new one. The operator `+` glues two strings end to end (this is **concatenation**, seen in level 1), and `*` repeats a string: `"ab" * 3` is `"ababab"`. You often start from the **empty string** `""` and add characters one by one.

In C++, a `string` can be modified: `s[0] = 'B';` is allowed. You can also add a character or a string at the end with `+=`.

```python
mot = "radar"
sans_a = ""
envers = ""
for c in mot:
    if c != "a":
        sans_a = sans_a + c
    envers = c + envers
print(sans_a, envers)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot = "radar";
    string sans_a = "";
    string envers = "";
    for (char c : mot) {
        if (c != 'a') {
            sans_a += c;
        }
        envers = c + envers;
    }
    cout << sans_a << " " << envers << "\n";
    return 0;
}
```

The program prints `rdr radar`. The line `envers = c + envers` puts each new character **in front of** those already stored: the word is therefore built backwards. Here, "radar" reads the same both ways: it is a **palindrome**.

Python also lets you extract a piece of a string, a **slice**: `s[a:b]` contains the characters of indices `a` to `b − 1`. `"bonjour"[0:3]` is `"bon"`, `"bonjour"[3:]` is `"jour"` (up to the end), and `"bonjour"[:3]` is `"bon"` (from the start). In C++, write `s.substr(start, length)`: `s.substr(3, 4)` is `"jour"`.

## Comparing strings

Two strings are equal (`==`) when they have the same length and the same characters in the same places. They can also be compared with `<` and `>`, in **lexicographic order**, the dictionary order: compare the first characters; if they are equal, move to the second ones, and so on. The first different character decides. If one string is the beginning of the other, the shorter one is smaller.

```python
print("chat" < "chien")
print("chat" < "chaton")
print("Zebre" < "arbre")
print("10" < "9")
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string a = "chat", b = "chien", c = "chaton", d = "Zebre", e = "arbre";
    cout << (a < b) << " " << (a < c) << " " << (d < e) << " " << (string("10") < string("9")) << "\n";
    return 0;
}
```

Python prints `True` four times (C++ prints `1 1 1 1`). The first two results are those of the dictionary: `a` comes before `i`, and "chat" is the beginning of "chaton". The last two are surprising. All uppercase letters come **before** all lowercase letters, so "Zebre" is smaller than "arbre". And the string `"10"` is smaller than `"9"`, because the character `1` comes before the character `9`: comparing numbers written as strings does not give the order of the numbers.

## Character codes: ord and chr

These surprises have an explanation. Inside the computer, every character is represented by a number, its **code**. The codes of common characters follow the **ASCII** table: `A` is 65, `B` 66, …, `Z` 90; `a` is 97, …, `z` 122; the digit `0` is 48, …, `9` 57; the space is 32. Comparing two characters means comparing their codes. Just remember that lowercase letters have consecutive codes, and so do uppercase letters and digits.

In Python, `ord(c)` gives the code of the character `c`, and `chr(n)` the character of code `n`. In C++, a `char` is already a small integer: you compute with it directly, and `(char)` converts a number back into a character.

```python
c = "d"
print(ord(c), ord(c) - ord("a"))
print(chr(ord(c) + 1))
print(ord("7") - ord("0"))
```

```cpp
#include <iostream>
using namespace std;

int main() {
    char c = 'd';
    cout << (int) c << " " << c - 'a' << "\n";
    cout << (char) (c + 1) << "\n";
    cout << '7' - '0' << "\n";
    return 0;
}
```

The program prints `100 3`, then `e`, then `7`. Three computations come up all the time:

- `ord(c) - ord("a")` (in C++, `c - 'a'`) gives the **rank** of a lowercase letter in the alphabet, from 0 for `a` to 25 for `z`. This rank can be used as an index in a counting array of 26 cells;
- `chr(ord("a") + k)` (in C++, `(char) ('a' + k)`) does the reverse: it gives the letter of rank `k`;
- `ord(c) - ord("0")` (in C++, `c - '0'`) gives the value of a digit. In Python, `int(c)` gives the same result.

To test whether a character is a lowercase letter, check that `"a" <= c <= "z"` (in C++, `c >= 'a' && c <= 'z'`), which works precisely because the codes are consecutive.

## Uppercase, lowercase and other tools

Python provides **methods**, that is operations written after the string and a dot. `s.upper()` gives a copy of `s` in uppercase, `s.lower()` in lowercase; characters that are not letters do not change. `c.isdigit()` tells whether `c` is a digit, `c.isalpha()` whether it is a letter. Finally, `s.count("e")` counts the occurrences of `"e"` in `s`: it is the program written above, in one line.

In C++, the functions `toupper(c)`, `tolower(c)`, `isdigit(c)` and `isalpha(c)`, from `<cctype>`, work on a single character. To put a whole string in uppercase, use a loop: `for (int i = 0; i < (int) s.size(); i++) s[i] = toupper(s[i]);`.

## Splitting and joining: split and join

You already know `split()`, which cuts a line into words. The result is a **list of strings**, which you can store in a variable and traverse. With an argument, `split` cuts at another separator: `"12:30:05".split(":")` gives `["12", "30", "05"]`.

The reverse operation is `join`. It is written after the string used as the **separator**: `", ".join(mots)` glues the strings of the list `mots`, separating them with a comma and a space. The elements must be strings; for numbers, convert them first with `str`, which does the reverse of `int`: `str(42)` is `"42"`.

```python
mots = input().split()
print(len(mots))
print("-".join(mots))
print(str(len(mots)) + " mots")
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    string resultat = "";
    for (int i = 0; i < n; i++) {
        string mot;
        cin >> mot;
        if (i > 0) {
            resultat += "-";
        }
        resultat += mot;
    }
    cout << n << "\n" << resultat << "\n";
    cout << to_string(n) + " mots" << "\n";
    return 0;
}
```

With the input `le petit chat`, the Python program prints `3`, then `le-petit-chat`, then `3 mots`. C++ has neither `split` nor `join`: you read the words one by one with `cin >>`, which stops at each space. That is why the C++ program first reads how many there are (here, the input would be `3 le petit chat`). You glue by hand with `+=`, adding the separator before every word except the first. `to_string(n)` converts a number into a string, and `stoi(s)` a string into an integer. To read a whole line, spaces included, use `getline(cin, s)`.

## Common mistakes

**Going outside the string.** `s[len(s)]` causes `IndexError: string index out of range`. The last character has index `len(s) - 1`. In C++, as with `vector`, there is no message, only a wrong result.

**Modifying a string in Python.** `s[i] = "x"` causes `TypeError: 'str' object does not support item assignment`. Build a new string, or go through a list of characters: `t = list(s)`, modify `t`, then `s = "".join(t)`.

**Mixing strings and numbers.** `"total : " + 5` causes `TypeError: can only concatenate str (not "int") to str`. Write `"total : " + str(5)`, or use an f-string. The other way round, `"7" + "5"` is `"75"`: you need `int` to add.

**Mixing up single and double quotes in C++.** `if (c == "a")` with a `char c` does not compile: the compiler reports `ISO C++ forbids comparison between pointer and integer`. A character is written `'a'`.

**Comparing numbers as strings.** `"10" < "9"` is true. To compare values, convert them to integers, or, for very large numbers, compare the lengths first.

**Mixing `cin >>` and `getline` in C++.** After `cin >> n`, the end of the line is still waiting to be read: a `getline` right after reads an empty line. Add an extra `getline` to consume this leftover, or read everything with `cin >>`.

## A complete example

**Statement.** Read `N`, then `N` lowercase words on one line. Print, in uppercase and separated by commas, the words that start and end with the same letter, in input order. If there are none, print `AUCUN`.

**Idea.** For each word, compare its first character `m[0]` with its last one `m[len(m) - 1]`. A one-letter word fits, since that letter is both the first and the last. The selected words, converted to uppercase, are added to a list, glued at the end with `",".join`. In C++, build the result string directly, putting a comma before every word except the first.

**Program.**

```python
n = int(input())
retenus = []
for m in input().split():
    if m[0] == m[len(m) - 1]:
        retenus.append(m.upper())
if len(retenus) == 0:
    print("AUCUN")
else:
    print(",".join(retenus))
```

```cpp
#include <cctype>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    string resultat = "";
    int nb = 0;
    for (int i = 0; i < n; i++) {
        string m;
        cin >> m;
        if (m[0] == m[m.size() - 1]) {
            for (int j = 0; j < (int) m.size(); j++) {
                m[j] = toupper(m[j]);
            }
            if (nb > 0) {
                resultat += ",";
            }
            resultat += m;
            nb = nb + 1;
        }
    }
    if (nb == 0) {
        cout << "AUCUN\n";
    } else {
        cout << resultat << "\n";
    }
    return 0;
}
```

**Checking by hand.** With `5` then `rotor chat elle a pomme`, the first word starts and ends with `r`: it is selected. "chat" starts with `c` and ends with `t`: it is skipped. "elle" is selected, "a" too (a single letter), and "pomme" is skipped (`p` and `e`). The program prints `ROTOR,ELLE,A`. With `2` then `bon jour`, no word fits and the program prints `AUCUN`.

## Key takeaways

- A string is read like an array: `s[i]` for i from 0 to `len(s) - 1` (`s.size()` in C++), traversal with `for c in s` or by index.
- In Python, a string is immutable: build a new one with `+`, starting from `""`. In C++, a `string` can be modified, and `+=` adds at the end. A `char` is written between single quotes.
- Strings are compared in lexicographic order, which follows the character codes: uppercase before lowercase, and `"10" < "9"`.
- `ord` and `chr` go from a character to its code and back: `ord(c) - ord("a")` gives the rank of a letter, `ord(c) - ord("0")` the value of a digit. In C++, compute directly on `char`s.
- `upper`, `lower`, `split` and `join` (in C++: `toupper`, `tolower`, word-by-word reading and `+=`) transform, cut and glue strings; `str` and `int` convert between numbers and strings.
