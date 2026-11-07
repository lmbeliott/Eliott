In level 1, values were processed as they were read, then forgotten. This method has a limit. Suppose you want to print the temperatures of a week that are above the week's average. The average is only known after reading every value, but by then the first values are lost. They should have been kept.

An **array** allows exactly that: store a sequence of values under a single name, then come back to them as many times as you want, in any order. This chapter explains how to create an array, access its cells, traverse it, build it and modify it. With it, many new problems become possible: comparing each value with all the others, counting repetitions, reversing a sequence.

## Creating an array

An array is a sequence of values stored in a precise order. Each value is an **element** of the array. In Python, it is called a **list**, written between square brackets, with elements separated by commas. In C++, you use a `vector`, which requires including `<vector>` and giving the type of the elements between angle brackets: `vector<int>` is an array of integers.

```python
t = [12, 15, 9, 20]
print(t)
print(len(t))
vide = []
print(len(vide))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {12, 15, 9, 20};
    cout << t.size() << "\n";
    vector<int> vide;
    cout << vide.size() << "\n";
    return 0;
}
```

The Python program prints `[12, 15, 9, 20]`, then `4`, then `0`. The function `len` gives the **length** of the array, that is its number of elements; in C++, it is `t.size()`. An array can be **empty**: it then contains no element and its length is 0. C++ cannot print a `vector` in one go with `cout`: you need a loop, as shown further on.

You often need an array of `n` cells all equal to 0. In Python, write `[0] * n`; in C++, `vector<int> t(n, 0)`, or simply `vector<int> t(n)`, because the cells of a `vector` of integers are 0 by default.

## Accessing a cell: the index

Each element occupies a numbered cell. This number is called the **index** (or position) of the element. Careful: indices start at **0**. In an array of length `n`, the first element has index 0 and the last one index `n − 1`. You access the element of index `i` by writing `t[i]`, and you can modify it like a variable.

```python
t = [12, 15, 9, 20]
print(t[0], t[2])
t[1] = 7
t[3] = t[3] + 1
print(t)
print(t[len(t) - 1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {12, 15, 9, 20};
    cout << t[0] << " " << t[2] << "\n";
    t[1] = 7;
    t[3] = t[3] + 1;
    cout << t[0] << " " << t[1] << " " << t[2] << " " << t[3] << "\n";
    cout << t[t.size() - 1] << "\n";
    return 0;
}
```

The program prints `12 9`, then the modified array (`[12, 7, 9, 21]` in Python, `12 7 9 21` in C++), then `21`, the last element. In Python, you can also count from the end with negative indices: `t[-1]` is the last element, `t[-2]` the one before. This notation does not exist in C++.

## Reading an array

Most often, the input gives `N`, then the `N` values on one line. In Python, a single instruction is enough: `list(map(int, input().split()))`. You recognise the reading from level 1: `split()` cuts the line into pieces, `map(int, ...)` converts each piece, and `list(...)` stores everything in a list. In C++, create a `vector` of `n` cells, then fill each cell with `cin`.

```python
n = int(input())
t = list(map(int, input().split()))
print(t[0] + t[n - 1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << t[0] + t[n - 1] << "\n";
    return 0;
}
```

With the input `5` then `3 8 1 6 4`, this program prints `7`, the sum of the first and last elements. If the values are one per line, start from an empty list and add each value read, as shown below.

## Traversing an array

To **traverse** an array is to examine its elements one by one. There are two ways to do it.

**Traversal by value** gives the elements directly: `for x in t:` makes one turn per element, with `x` equal to `t[0]`, then `t[1]`, and so on. In C++, write `for (int x : t)`. It is the simplest form, when you do not need the position.

**Traversal by index** makes an index `i` go from 0 to `n − 1`: `for i in range(len(t)):`, and you use `t[i]` in the loop. Choose it when the position matters, or when you want to look at the neighbours of an element, `t[i - 1]` and `t[i + 1]`.

```python
t = [4, -2, 7, 0, 5]
total = 0
for x in t:
    total = total + x
print(total)
for i in range(len(t)):
    if t[i] > 0:
        print(i, end=" ")
print()
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {4, -2, 7, 0, 5};
    int total = 0;
    for (int x : t) {
        total = total + x;
    }
    cout << total << "\n";
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] > 0) {
            cout << i << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

The program prints `14`, then the indices of the strictly positive elements: `0 2 4`. In C++, write `(int) t.size()`, because `size()` gives an integer of a special, unsigned type; the conversion avoids warnings and surprises when you subtract.

## Building an array

An array can grow. In Python, `t.append(x)` adds `x` at the end of `t`, and its length increases by 1. In C++, it is `t.push_back(x)`. You often start from an empty array and add the elements one by one. This is how you read `N` values given one per line: `t = []`, then `for i in range(n): t.append(int(input()))`. In C++, nothing changes: `cin` skips newlines just like spaces.

To print all the elements of an array on one line, separated by spaces, Python offers a short notation: `print(*t)`. The star "unpacks" the array, as if you had written `print(t[0], t[1], ...)`. In C++, use a loop.

```python
n = int(input())
carres = []
for i in range(1, n + 1):
    carres.append(i * i)
print(len(carres))
print(*carres)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> carres;
    for (int i = 1; i <= n; i++) {
        carres.push_back(i * i);
    }
    cout << carres.size() << "\n";
    for (int x : carres) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

With the input `5`, the program prints `5`, then `1 4 9 16 25`.

## Two passes over the data

Back to the problem of the introduction: print the values above the average. With an array, you make **two passes**. The first computes the sum; the second, once the average is known, compares each value with it. To avoid floats, note that `x > somme / n` is equivalent to `x × n > somme`, since `n` is positive.

```python
n = int(input())
t = list(map(int, input().split()))
somme = 0
for x in t:
    somme = somme + x
for x in t:
    if x * n > somme:
        print(x, end=" ")
print()
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int somme = 0;
    for (int x : t) {
        somme = somme + x;
    }
    for (int x : t) {
        if (x * n > somme) {
            cout << x << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

With `5` and `3 8 1 6 4`, the sum is 22 and the average 4.4: the program prints `8 6`.

## Maximum, minimum, sum

Finding the largest element is a basic move. Start from the first element, then traverse the array: each time an element is larger than the current maximum, it replaces it.

```python
t = [3, 8, 1, 8, 4]
m = t[0]
pos = 0
for i in range(len(t)):
    if t[i] > m:
        m = t[i]
        pos = i
print(m, pos)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 8, 1, 8, 4};
    int m = t[0];
    int pos = 0;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] > m) {
            m = t[i];
            pos = i;
        }
    }
    cout << m << " " << pos << "\n";
    return 0;
}
```

The program prints `8 1`: the maximum is 8, and its first position is 1. With `>=` instead of `>`, you would get the last position, 3. Initialise with `t[0]` and not with 0: if all elements were negative, a maximum initialised to 0 would be wrong.

Now that these computations have been written by hand, you may use Python's shortcuts: `max(t)`, `min(t)` and `sum(t)` give the maximum, the minimum and the sum of a list. In C++, `max(a, b)` and `min(a, b)` give the larger and smaller of two values; for a whole array, keep the loop, or write `*max_element(t.begin(), t.end())` after including `<algorithm>`.

## The counting array

When the values are small non-negative integers, you can use an array to **count** how many times each one appears. The idea is to use the value as an index: the cell `cpt[v]` holds the number of occurrences of the value `v`. Such an array is called a **counting array** (or frequency array). For marks between 0 and 20, you need 21 cells, with indices 0 to 20.

```python
notes = [12, 15, 12, 20, 9, 12, 15]
cpt = [0] * 21
for x in notes:
    cpt[x] = cpt[x] + 1
for v in range(21):
    if cpt[v] > 0:
        print(v, cpt[v])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> notes = {12, 15, 12, 20, 9, 12, 15};
    vector<int> cpt(21, 0);
    for (int x : notes) {
        cpt[x] = cpt[x] + 1;
    }
    for (int v = 0; v <= 20; v++) {
        if (cpt[v] > 0) {
            cout << v << " " << cpt[v] << "\n";
        }
    }
    return 0;
}
```

The program prints `9 1`, `12 3`, `15 2` and `20 1`. Notice that the values come out in increasing order, since the second loop goes through the indices in order. This array only works if the values are integers small enough to be used as indices: with values up to 10⁹, you would need a billion cells.

## Swapping and reversing

To **swap** two elements is to put each in the other's place. You cannot write `t[i] = t[j]` then `t[j] = t[i]`: after the first instruction, the old value of `t[i]` is lost, and both cells contain `t[j]`. In Python, write `t[i], t[j] = t[j], t[i]`, which first computes the two values on the right, then stores them. In C++, write `swap(t[i], t[j])`.

To **reverse** an array, that is to invert the order of its elements, swap the first with the last, the second with the one before last, and so on. The element of index `i` is swapped with the one of index `n − 1 − i`. Stop in the middle, after `n // 2` swaps: going to the end would swap each pair twice, and the array would return to its starting state.

```python
t = [1, 2, 3, 4, 5]
n = len(t)
for i in range(n // 2):
    t[i], t[n - 1 - i] = t[n - 1 - i], t[i]
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 2, 3, 4, 5};
    int n = t.size();
    for (int i = 0; i < n / 2; i++) {
        swap(t[i], t[n - 1 - i]);
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `5 4 3 2 1`. With 5 elements, it makes 2 swaps; the middle element does not move.

## Common mistakes

**Going outside the array.** In an array of length 4, `t[4]` does not exist. Python stops with `IndexError: list index out of range`. It is almost always an error of one unit (an **off-by-one** error): a loop `for i in range(1, n + 1)` that uses `t[i]`, or an access to `t[i + 1]` when `i` reaches `n − 1`. In C++, it is worse: **no message**, the program reads a memory cell that does not belong to it, prints an absurd value or crashes. Check the bounds of every loop: to look at `t[i + 1]`, the loop stops at `n − 2`.

**Writing to a cell that does not exist.** After `t = []`, the instruction `t[0] = 5` causes `IndexError: list assignment index out of range`. An empty array has no cell 0. Use `t.append(5)`, or create the array with `[0] * n` from the start.

**Thinking you made a copy.** In Python, `b = t` does not copy the list: `b` and `t` are two names for the **same** list, and modifying `b[0]` also modifies `t[0]`. For a real copy, write `b = list(t)`. In C++, on the contrary, `vector<int> b = t;` makes a copy.

**Modifying the loop variable.** In `for x in t: x = 0`, you change the variable `x`, not the array, which stays intact. To modify the elements, traverse by index: `for i in range(len(t)): t[i] = 0`.

**Taking the maximum of an empty array.** `max([])` causes `ValueError: max() arg is an empty sequence`, and `t[0]` causes an `IndexError`. If the array can be empty, handle this case separately.

## A complete example

**Statement.** Read `N` integers between 0 and 1,000. Print, in input order, those that appear only once. If there are none, print `AUCUN`.

**Idea.** When reading a value, you do not know yet whether it will come back later. So you need two passes. The first fills a counting array of 1,001 cells. The second goes through the values again in order and prints those whose counter is 1. A boolean remembers whether something was printed.

**Program.**

```python
n = int(input())
t = list(map(int, input().split()))
cpt = [0] * 1001
for x in t:
    cpt[x] = cpt[x] + 1
trouve = False
for x in t:
    if cpt[x] == 1:
        print(x, end=" ")
        trouve = True
if trouve:
    print()
else:
    print("AUCUN")
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    vector<int> cpt(1001, 0);
    for (int x : t) {
        cpt[x] = cpt[x] + 1;
    }
    bool trouve = false;
    for (int x : t) {
        if (cpt[x] == 1) {
            cout << x << " ";
            trouve = true;
        }
    }
    if (trouve) {
        cout << "\n";
    } else {
        cout << "AUCUN\n";
    }
    return 0;
}
```

**Checking by hand.** With `6` then `4 7 4 1 9 7`, the first pass gives `cpt[4] = 2`, `cpt[7] = 2`, `cpt[1] = 1` and `cpt[9] = 1`. The second pass examines 4 (counter 2, skipped), 7 (skipped), 4 (skipped), 1 (printed), 9 (printed), 7 (skipped). The program prints `1 9`. With `2` then `5 5`, nothing is printed in the loop, and the program prints `AUCUN`. The program makes two passes over `N` elements and uses an array of 1,001 cells: it stays fast even for `N = 100,000`, whereas comparing each value with all the others would take billions of operations.

## Key takeaways

- An array (`list` in Python, `vector` in C++) stores elements numbered from 0: `t[0]` is the first, `t[n - 1]` the last, and `len(t)` or `t.size()` gives the length.
- Reading: `t = list(map(int, input().split()))` in Python; in C++, `vector<int> t(n)` then `cin >> t[i]` in a loop.
- Traverse by value (`for x in t`) when only the value matters, by index (`for i in range(len(t))`) when the position or the neighbours matter. `append` / `push_back` adds at the end.
- Keeping the values allows several passes: a first one to compute (sum, maximum, counting), a second one to use the result.
- A counting array `cpt[v]` counts the occurrences of small integer values; `t[i], t[j] = t[j], t[i]` (or `swap`) swaps two elements.
- Every access must stay between 0 and `n − 1`: Python reports `IndexError`, C++ reports nothing and gives wrong results.
