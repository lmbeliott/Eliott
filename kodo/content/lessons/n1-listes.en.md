With a loop, you know how to read `N` numbers and add them up. But at each turn, the new number replaces the old one in the variable: once the loop is over, you can't go back. To keep **all** the numbers in memory, you need a **list**. In C++, it's called a **vector**.

## Creating a list

```python
altitudes = [1200, 1450, 1600]
print(altitudes[0])
print(altitudes[2])
print(len(altitudes))
altitudes[1] = 1500
```

```cpp
vector<int> altitudes = {1200, 1450, 1600};
cout << altitudes[0] << "\n";
cout << altitudes[2] << "\n";
cout << altitudes.size() << "\n";
altitudes[1] = 1500;
```

A list is a row of numbered cells. The number of a cell is called its **position** (or index), and it starts at **0**: `altitudes[0]` is 1200, `altitudes[2]` is 1600. So the program prints `1200`, `1600`, then `3`, the number of elements, given by `len` in Python and `.size()` in C++. The last line changes the content of cell 1.

In a list of `N` elements, the positions go from `0` to `N - 1`. Cell `N` doesn't exist: in Python, using it causes an error; in C++, the program reads garbage or crashes.

In C++, add `#include <vector>` at the top of your program, next to `#include <iostream>`.

## Reading a list

In the problems, a list is often given on two lines: `N`, then the `N` numbers on a single line, separated by spaces.

```python
n = int(input())
marks = list(map(int, input().split()))
```

```cpp
int n;
cin >> n;
vector<int> marks(n);
for (int i = 0; i < n; i++) {
    cin >> marks[i];
}
```

In Python, `input().split()` cuts the line, `map(int, …)` converts each piece, and `list(…)` puts everything in a list. In C++, `vector<int> marks(n)` creates `n` cells, then the loop fills them one by one.

You can also start from an empty list and add elements at the end:

```python
squares = []
for i in range(5):
    squares.append(i * i)
```

```cpp
vector<int> squares;
for (int i = 0; i < 5; i++) {
    squares.push_back(i * i);
}
```

At the end, the list contains 0, 1, 4, 9 and 16.

## Going through a list

There are two ways to go through a list: by **values**, or by **positions**.

```python
for x in marks:
    print(x)
for i in range(n):
    print(i, marks[i])
```

```cpp
for (int x : marks) {
    cout << x << "\n";
}
for (int i = 0; i < n; i++) {
    cout << i << " " << marks[i] << "\n";
}
```

The first loop gives each value directly. The second one gives the position `i`, and `marks[i]` is the value stored at that position. Going through the positions is useful when you need the position itself, or when you want to compare a cell with its **neighbor**. For example, to compare each cell with the previous one, `marks[i - 1]`, you start `i` at 1, because cell 0 has no previous cell.

To go through a list backwards, just make the position go from `N - 1` down to `0`.

## Printing a list on one line

```python
for x in marks:
    print(x, end=" ")
print()
```

```cpp
for (int x : marks) {
    cout << x << " ";
}
cout << "\n";
```

In Python, `end=" "` tells `print` to write a space instead of moving to the next line. The final `print()` moves to the next line once everything is printed.

## Finding the maximum

To find the largest value, you look for it just like you would by hand: you remember the largest value seen so far, and replace it as soon as you find something bigger.

```python
largest = marks[0]
for x in marks:
    if x > largest:
        largest = x
print(largest)
```

```cpp
int largest = marks[0];
for (int x : marks) {
    if (x > largest) {
        largest = x;
    }
}
cout << largest << "\n";
```

We start with the first element of the list, not with 0: if all the values were negative, 0 would be a wrong answer. Python also has `max(marks)`, but you need to know how to do it yourself, because you often want more than the value: its position, for example.

## Several passes

A list keeps the values: so you can go through it a first time to compute something (a sum, a maximum), then a second time to use that result on each element. That's impossible with a simple reading loop.

## Key takeaways

- A list (a `vector` in C++) keeps several values; the positions go from `0` to `N - 1`.
- Reading a list: `list(map(int, input().split()))` in Python; `vector<int> v(n)` and a loop of `cin` in C++.
- You go through a list by values (`for x in my_list`) or by positions (`for i in range(n)`); with neighbors, watch the boundaries.
- For a maximum, start from the first element and compare it with all the others.
- A list lets you go through the data several times.
