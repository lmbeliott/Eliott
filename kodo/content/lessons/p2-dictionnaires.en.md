A shop wants to know the stock of each of its items: 12 apples, 30 pears, 0 kiwis. With a list, you would have to number the items and remember that cell 0 is for apples, cell 1 for pears… And to find the stock of kiwis, you would have to go through a list of names until you reach `kiwi`. That is long to write, and slow as soon as there are thousands of items.

This chapter introduces two structures that solve this problem. A **dictionary** stores values not at positions 0, 1, 2…, but under freely chosen names: words, large numbers, points of the plane. A **set** is a collection without duplicates that answers the question "is this element present?" very fast. With them, you count occurrences, detect repetitions and look things up in a single step, where a list would require going through everything.

## A dictionary maps keys to values

A dictionary is a collection of **key-value pairs**. The **key** is a label, the **value** is the information stored under that label. In Python, you write it between curly braces, each pair in the form `key: value`:

```python
stock = {"apple": 12, "pear": 30, "kiwi": 0}
print(stock["pear"])
print(len(stock))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["apple"] = 12;
    stock["pear"] = 30;
    stock["kiwi"] = 0;
    cout << stock["pear"] << "\n";
    cout << stock.size() << "\n";
    return 0;
}
```

The program prints `30` then `3`. The expression `stock["pear"]` looks like accessing a list cell, but between the brackets you put a key, not a position. The function `len` gives the number of pairs in the dictionary.

In C++, the type is called `map` (you need `#include <map>`). Between angle brackets you write the type of the keys, then the type of the values: `map<string, int>` maps strings to integers. The empty dictionary is created by declaring the variable, and `size()` plays the role of `len`.

In a dictionary, **each key is unique**, but several keys can have the same value.

## Adding and modifying

The assignment `d[key] = value` does two different things depending on the situation: if the key does not exist yet, it **adds** a new pair; if the key already exists, it **replaces** the old value.

```python
stock = {}
stock["apple"] = 12
stock["apple"] = stock["apple"] - 5
stock["plum"] = 40
print(stock)
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["apple"] = 12;
    stock["apple"] = stock["apple"] - 5;
    stock["plum"] = 40;
    cout << stock["apple"] << " " << stock["plum"] << "\n";
    return 0;
}
```

In Python, `{}` creates an empty dictionary. After the three assignments, the program prints `{'apple': 7, 'plum': 40}`: the second line changed the value of `apple`, the third one added a key. The C++ version prints `7 40`.

To remove a pair, write `del stock["plum"]` in Python, and `stock.erase("plum")` in C++.

## Testing whether a key is present

Reading the value of a missing key is an error. In Python, the program stops:

```python
stock = {"apple": 12}
print(stock["kiwi"])
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["apple"] = 12;
    cout << stock["kiwi"] << "\n";
    cout << stock.size() << "\n";
    return 0;
}
```

Python prints `KeyError: 'kiwi'`: the key `'kiwi'` does not exist. C++ behaves differently, and it is a trap: `stock["kiwi"]` raises no error, but silently **creates** the key `kiwi` with the value 0. The program prints `0`, then `2`, because the dictionary now contains two keys.

Before reading a key you are not sure about, you therefore test whether it is present. In Python, the operator `in` answers the question "is this key in the dictionary?", and `not in` the opposite question. In C++, `d.count(key)` is 1 if the key is present and 0 otherwise, without creating anything.

Python also offers a very handy shortcut: `d.get(key, default)` returns the value of the key if it exists, and the **default value** otherwise. C++ has no direct equivalent; you write the test by hand.

```python
stock = {"apple": 12}
if "kiwi" in stock:
    print("kiwi:", stock["kiwi"])
else:
    print("no kiwi")
print(stock.get("apple", 0), stock.get("kiwi", 0))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["apple"] = 12;
    if (stock.count("kiwi") > 0) {
        cout << "kiwi: " << stock["kiwi"] << "\n";
    } else {
        cout << "no kiwi\n";
    }
    int kiwis = 0;
    if (stock.count("kiwi") > 0) {
        kiwis = stock["kiwi"];
    }
    cout << stock["apple"] << " " << kiwis << "\n";
    return 0;
}
```

The program prints `no kiwi`, then `12 0`. The default value 0 was returned for `kiwi`, but the dictionary was not modified: `get` does not create a key.

## Counting occurrences

The most common use of a dictionary is to **count** how many times each element appears. It is often called a **frequency dictionary**. For each element read, you increase the counter associated with it by 1. The first time an element shows up is a problem, because its key does not exist yet: `get` with the default value 0 settles it.

```python
words = "the cat and the dog and the rat".split()
count = {}
for w in words:
    count[w] = count.get(w, 0) + 1
print(count["the"], count["and"], count["rat"])
```

```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> words = {"the", "cat", "and", "the", "dog", "and", "the", "rat"};
    map<string, int> count;
    for (string w : words) {
        count[w]++;
    }
    cout << count["the"] << " " << count["and"] << " " << count["rat"] << "\n";
    return 0;
}
```

The program prints `3 2 1`. The first time `the` is met, `count.get("the", 0)` is 0, and the key is created with the value 1; the following times, it goes to 2 then 3. In C++, `count[w]++` is enough: here, automatically creating a key at 0 is exactly what you want.

To count small consecutive integers (digits, grades from 0 to 20), a list of counters does just as well. The dictionary becomes essential for words, very large numbers, or values whose range you don't know.

## Going through a dictionary

A `for` loop over a dictionary goes through its **keys**. To get both the key and the value, go through `d.items()`, which gives the pairs one by one. Finally, `d.values()` gives only the values, which lets you write `max(d.values())` for example.

```python
grades = {"lea": 14, "tom": 9, "ali": 17}
for name in grades:
    print(name)
for name, grade in grades.items():
    if grade >= 10:
        print(name, grade)
print(max(grades.values()))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> grades;
    grades["lea"] = 14;
    grades["tom"] = 9;
    grades["ali"] = 17;
    for (auto [name, grade] : grades) {
        cout << name << "\n";
    }
    for (auto [name, grade] : grades) {
        if (grade >= 10) {
            cout << name << " " << grade << "\n";
        }
    }
    return 0;
}
```

The **traversal order** needs care, because it depends on the language and on the structure:

- a Python dictionary is traversed in the **insertion order** of the keys: here `lea`, `tom`, `ali`. The program prints the three names, then `lea 14` and `ali 17`, then `17`;
- a C++ `map` is traversed in **increasing order of the keys**: here `ali`, `lea`, `tom`. The syntax `auto [name, grade]` (C++17) gives a name to the key and to the value of each pair, and `auto` lets the compiler find their types;
- C++ also offers `unordered_map` (with `#include <unordered_map>`), which is used exactly like `map` and is usually faster, but whose traversal order is arbitrary.

When a problem imposes an output order, don't rely on the order of the dictionary: go through another sequence in the desired order instead, for example the list of data read, or the letters from `a` to `z`. To print the keys in increasing order, Python also provides `sorted(d)`, which returns the sorted list of the keys. Here you use it as a ready-made tool; how to sort a list will be studied in level 3.

## Pairs as keys

A key can be an integer, a string, but also a **pair** of values, written between parentheses: `(3, 5)`. In Python, such a group of values is called a **tuple**. It is used to identify a point of the plane or a grid cell by its two coordinates.

```python
cells = {}
cells[(2, 3)] = "wall"
cells[(0, 0)] = "start"
x, y = 2, 3
print(cells.get((x, y), "empty"), cells.get((3, 2), "empty"))
```

```cpp
#include <iostream>
#include <map>
#include <string>
#include <utility>
using namespace std;

int main() {
    map<pair<int, int>, string> cells;
    cells[{2, 3}] = "wall";
    cells[{0, 0}] = "start";
    int x = 2, y = 3;
    string a = "empty", b = "empty";
    if (cells.count({x, y}) > 0) {
        a = cells[{x, y}];
    }
    if (cells.count({3, 2}) > 0) {
        b = cells[{3, 2}];
    }
    cout << a << " " << b << "\n";
    return 0;
}
```

The program prints `wall empty`: cell `(3, 2)` is not cell `(2, 3)`. In C++, the pair is written with the type `pair<int, int>` and the values between curly braces.

A tuple can be unpacked as in a multiple assignment: if `p = (2, 3)`, then `x, y = p` stores 2 in `x` and 3 in `y`. A list of pairs is therefore traversed with `for x, y in points:`. You can also read `p[0]` and `p[1]`, as in a list. In C++, the two values of a `pair` `p` are called `p.first` and `p.second`, and you add a pair to a `vector<pair<int, int>>` with `points.push_back({x, y})`. Careful: `unordered_map` and `unordered_set` don't directly accept `pair`s as keys; use `map` and `set`.

On the other hand, a **list** cannot be a key in Python. Writing `d[[2, 3]] = 1` stops the program with `TypeError: unhashable type: 'list'`. The reason: a list can be modified afterwards, and its place in the dictionary would become wrong. A tuple cannot be modified. So convert the list into a tuple, or use a tuple directly.

## Sets

A **set** is a collection of elements **without duplicates** and **without order**. You can see it as a dictionary that only has keys. It is used to remember elements already seen and to test their presence very fast.

In Python, `set()` creates an empty set, `add` adds an element, `in` tests presence and `len` gives the number of elements. `set(list)` builds the set of the elements of a list (or of the characters of a string), which removes duplicates. In C++, use `set` (with `#include <set>`): `insert` adds, `count` tests, `size` counts.

```python
seen = set()
for x in [4, 8, 4, 1, 8, 4]:
    seen.add(x)
print(len(seen), 8 in seen, 5 in seen)
print(len(set("abracadabra")))
```

```cpp
#include <iostream>
#include <set>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<int> values = {4, 8, 4, 1, 8, 4};
    set<int> seen;
    for (int x : values) {
        seen.insert(x);
    }
    cout << seen.size() << " " << seen.count(8) << " " << seen.count(5) << "\n";
    string word = "abracadabra";
    set<char> letters;
    for (char c : word) {
        letters.insert(c);
    }
    cout << letters.size() << "\n";
    return 0;
}
```

The Python program prints `3 True False`, then `5`. The six additions left only three elements, 4, 8 and 1, because adding an element that is already there changes nothing. The word `abracadabra` contains five different letters: a, b, r, c, d. The C++ version prints `3 1 0`, because `count` returns a number.

Python also provides the mathematical operations on sets:

- the **union** `a | b` contains the elements present in `a` or in `b`;
- the **intersection** `a & b` contains the elements present both in `a` and in `b`;
- the **difference** `a - b` contains the elements of `a` that are not in `b`.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(len(a | b), len(a & b), len(a - b))
print(3 in (a & b))
```

```cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> a = {1, 2, 3, 4};
    set<int> b = {3, 4, 5};
    set<int> inter;
    for (int x : a) {
        if (b.count(x) > 0) {
            inter.insert(x);
        }
    }
    cout << inter.size() << " " << inter.count(3) << "\n";
    return 0;
}
```

The Python program prints `5 2 2`, then `True`. Curly braces with single elements, without `:`, create a set. In C++, there is no operator for the intersection: you build it with a loop, keeping the elements of `a` present in `b`, as in the example. The C++ version prints `2 1`.

As with dictionaries, C++ offers `unordered_set`, faster and without order, while a `set` is traversed in increasing order. In Python, the order of a set is **never** guaranteed: `print({30, 2, 17})` may print the elements in a surprising order. To print in a precise order, go through the possible values in that order, or use `sorted`.

## Why a set is faster than a list

The operator `in` also works on a list: `8 in [4, 8, 1]` is `True`, and `x not in t` is `True` when `x` appears nowhere in the list `t`. On a string, `c in s` tests whether the character `c` appears in `s`. C++ has no equivalent for a `vector`: you write a loop that compares each element, with a boolean. This test has a hidden cost.

A test `x in list` compares `x` with the elements of the list one by one, from the start. If `x` is missing, it makes as many comparisons as there are elements. A test `x in set` goes through nothing: from the value of `x`, Python directly computes the place in its memory where `x` would be stored, and looks whether it is there. This computation is called **hashing**, and the structure that uses it a **hash table**. Dictionaries work the same way for their keys. The result: a membership test on a set takes almost the same time whether the set contains ten elements or a million.

The difference becomes huge when there are many tests. To know whether 100,000 values are all different, you store each value after checking that it is not stored already. With a list, the last check compares with 99,999 elements, the one before with 99,998, and so on: in total, about 100,000 × 100,000 / 2, that is 5 billion comparisons, which takes several tens of seconds in Python. With a set, it takes 100,000 fast tests: a fraction of a second.

In C++, `unordered_set` and `unordered_map` are hash tables. `set` and `map` use another organisation, which keeps the elements sorted: each test there takes a few dozen comparisons, which is still very fast. Choose `set` or `map` when increasing order is useful, or when the keys are `pair`s.

## List, dictionary or set?

The three structures meet different needs:

- a **list** stores values in an order, at positions 0, 1, 2… Choose it when the order matters, when you access by position, or when the "keys" are small consecutive integers;
- a **set** remembers elements without duplicates. Choose it for the question "have I already seen it?" or "is it allowed?", and to remove duplicates;
- a **dictionary** associates a piece of information with each key. Choose it when you must find a value from a word, a large number or a pair: a price from a name, a number of occurrences from a value, a position from a state already met.

## Common mistakes

### Reading a missing key

`count[w] = count[w] + 1` on a key `w` that is still missing raises `KeyError`. Write `count.get(w, 0) + 1`, or test `w in count` first. In C++, the opposite mistake is lurking: `d[key]` creates the key, which distorts `size()` and traversals. For a simple test, always use `count`.

### Modifying a dictionary while going through it

```python
stock = {"apple": 12, "kiwi": 0, "pear": 30}
for name in stock:
    if stock[name] == 0:
        del stock[name]
```

```cpp
// In C++, erasing a key of the map during a loop for (auto [name, n] : stock)
// is forbidden: the program may crash or give anything at all.
```

Python stops with `RuntimeError: dictionary changed size during iteration`. You cannot add or remove keys during a traversal. Go through a copy of the list of keys instead, `for name in list(stock):`, or build a new dictionary with the pairs to keep. Modifying the **value** of an existing key during the traversal, on the other hand, is allowed.

### Creating an empty set with `{}`

`seen = {}` creates an empty dictionary, not a set. The instruction `seen.add(3)` then raises `AttributeError: 'dict' object has no attribute 'add'`. The empty set is written `set()`.

### Using a list where a set is needed

The program is correct, but far too slow: an `in` test on a list, repeated at each turn of a loop, makes billions of comparisons on large inputs. As soon as a loop contains an `if x in ...`, ask yourself whether a set would be better suited.

## Complete example: mirror words

**Statement.** Read `N` distinct words, one per line. Two words are **mirrors** if one is the other written backwards, like `star` and `rats`. Print the number of pairs of mirror words. A palindrome like `level` does not form a pair with itself.

**Idea.** Trying all pairs of words would take N² / 2 comparisons. Instead, read the words one by one, storing those already read in a set. When you read a word `w`, it forms a pair with a word already read exactly when its reverse is in the set. In Python, the slice `w[::-1]` gives the string `w` backwards: it is a slice `w[a:b]` as in the chapter on strings, but without bounds and with a **step** of -1, which goes through the string from the end to the start. In C++, you build it by going through `w` from the last letter to the first. Each pair is thus counted only once, when its second word is read. For a palindrome, the reverse is the word itself: since you test **before** adding `w`, and the words are distinct, it is never counted.

**Program.**

```python
n = int(input())
seen = set()
pairs = 0
for i in range(n):
    w = input()
    if w[::-1] in seen:
        pairs = pairs + 1
    seen.add(w)
print(pairs)
```

```cpp
#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

int main() {
    int n;
    cin >> n;
    unordered_set<string> seen;
    int pairs = 0;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        string reverse = "";
        for (int k = w.size() - 1; k >= 0; k--) {
            reverse += w[k];
        }
        if (seen.count(reverse) > 0) {
            pairs = pairs + 1;
        }
        seen.insert(w);
    }
    cout << pairs << "\n";
    return 0;
}
```

**Checking by hand** with the words `star`, `level`, `noon`, `rats`, `pots`, `stop`:

| Word read | Reverse | Reverse already seen? | `pairs` |
| --- | --- | --- | --- |
| `star` | `rats` | no | 0 |
| `level` | `level` | no | 0 |
| `noon` | `noon` | no | 0 |
| `rats` | `star` | yes | 1 |
| `pots` | `stop` | no | 1 |
| `stop` | `pots` | yes | 2 |

The program prints `2`. The palindromes `level` and `noon` are not counted, because their reverse is not yet in the set at the time of the test. With 100,000 words, the program makes 100,000 fast membership tests, instead of the 5 billion comparisons of the double loop.

## Key takeaways

- A dictionary maps values to unique keys: `d[key] = value` adds or replaces, `d[key]` reads. In C++: `map` or `unordered_map`.
- Reading a missing key raises `KeyError` in Python and creates the key in C++: test with `in` (Python) or `count` (C++), or use `d.get(key, default)`.
- To count occurrences: `count[x] = count.get(x, 0) + 1` in Python, `count[x]++` in C++.
- A set keeps elements without duplicates and without order: `add`, `in`, `len`, and `|`, `&`, `-` for union, intersection and difference. In C++: `set` or `unordered_set`.
- Membership tests on a set or a dictionary are almost instant, while `x in list` goes through the whole list: on large inputs, that is the difference between a fraction of a second and several tens of seconds.
- Don't modify the keys of a dictionary while going through it, and don't rely on the order of a set or of an `unordered_map` for output.
