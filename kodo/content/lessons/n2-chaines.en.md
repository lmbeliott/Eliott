A **string** is text: a word, a sentence, a secret code. In this chapter, you'll learn how to read a text letter by letter, test its letters and build new words.

## A string is a list of letters

You handle a string almost like a list. Each character has an **index**, starting at `0`. You get the length with `len(word)` in Python and `word.size()` in C++.

```python
word = "refuge"
print(len(word))             # 6
print(word[0])               # r: the first character
print(word[len(word) - 1])   # e: the last character
```

```cpp
string word = "refuge";
cout << word.size() << "\n";             // 6
cout << word[0] << "\n";                 // r: the first character
cout << word[word.size() - 1] << "\n";   // e: the last character
```

The last index is `len(word) - 1`, not `len(word)`: reading `word[len(word)]` is a classic mistake.

## Going through a string

To look at each letter, you use a loop, exactly as with a list. Here, we count the `e`s in a word:

```python
word = input()
count = 0
for c in word:
    if c == "e":
        count += 1
print(count)
```

```cpp
string word;
cin >> word;
int count = 0;
for (char c : word) {
    if (c == 'e') {
        count++;
    }
}
cout << count << "\n";
```

In C++, a single character is written between single quotes (`'e'`, of type `char`) and a string between double quotes (`"refuge"`, of type `string`). In Python, you can use either `"` or `'` for both.

When you need the position of the letter (to look at its neighbour, or to go through the word backwards), loop over the indices instead: `for i in range(len(word))` in Python, `for (int i = 0; i < (int)word.size(); i++)` in C++.

## Testing a letter

You compare characters with `==` and `!=`. To know whether a letter belongs to a group, Python has a shortcut: `c in "aeiouy"` is true if `c` is one of these letters. In C++, you chain the tests with `||` ("or"): `c == 'a' || c == 'e' || …`.

Characters can also be compared with `<` and `>`: the order is the alphabetical order, so `'a' <= c && c <= 'z'` (in Python: `"a" <= c <= "z"`) tests whether `c` is a lowercase letter.

## Building a new string

In Python, you can't change one letter of a string (`word[0] = "x"` causes an error). Instead, you build a new string, starting from `""` and adding the characters one by one with `+`. Here is a word written backwards:

```python
word = "piolet"
backwards = ""
for i in range(len(word) - 1, -1, -1):
    backwards = backwards + word[i]
print(backwards)   # teloip
```

```cpp
string word = "piolet";
string backwards = "";
for (int i = (int)word.size() - 1; i >= 0; i--) {
    backwards += word[i];
}
cout << backwards << "\n";   // teloip
```

Two strings can be compared directly with `==`: `backwards == word` is true if the two words are identical.

## Letters are numbers

The computer stores each character as a number, its **code**. The letters from `a` to `z` have codes that follow each other. So you can compute the number of a letter in the alphabet (`0` for `a`, `25` for `z`), do a calculation with it, then go back to a letter. Here is how to replace a letter with the next one, with `z` going back to `a` thanks to the modulo:

```python
c = "z"
number = ord(c) - ord("a")         # 25
number = (number + 1) % 26         # 0
print(chr(ord("a") + number))      # a
```

```cpp
char c = 'z';
int number = c - 'a';              // 25
number = (number + 1) % 26;        // 0
cout << (char)('a' + number) << "\n";   // a
```

In Python, `ord` gives the code of a character and `chr` does the opposite. In C++, a `char` is already a small number: you can directly write `c - 'a'`.

## Reading text

In Python, `input()` reads **a whole line**, spaces included. In C++, `cin >> word` reads a single word (it stops at the first space); for a whole line, you use `getline(cin, line)`. Careful: after a `cin >> n`, the end of the line hasn't been read yet. Add `cin.ignore();` before the `getline`, otherwise you get an empty line.

```python
n = int(input())
sentence = input()          # the whole line
words = sentence.split()    # cut into a list of words
```

```cpp
int n;
cin >> n;
cin.ignore();               // skip the end of line after n
string sentence;
getline(cin, sentence);     // the whole line
```

## Key takeaways

- The characters of a string are numbered from `0`; the last one is at index `len(word) - 1`.
- You go through a string with a loop, like a list, and compare characters with `==`, `<`, `>`.
- To build a word, start from `""` and add the characters one by one.
- `ord(c) - ord("a")` (Python) or `c - 'a'` (C++) gives the number of a letter; the modulo `% 26` lets you wrap around the alphabet.
- In C++, `cin >> word` reads one word, `getline` reads a whole line.
