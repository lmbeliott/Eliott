A loop can read `N` numbers and add them up. But at each turn, the new number replaces the old one in the variable: once the loop is over, there is no going back. Keeping **all** the numbers in memory takes a **list**. In C++, it's called a **vector**.

## Creating a list

```python
values = [12, 45, 30]
print(values[0])
print(values[2])
print(len(values))
values[1] = 50
```

```cpp
vector<int> values = {12, 45, 30};
cout << values[0] << "\n";
cout << values[2] << "\n";
cout << values.size() << "\n";
values[1] = 50;
```

A list is a row of numbered cells. The number of a cell is called its **position** (or index), and it starts at **0**: `values[0]` is 12, `values[2]` is 30. So the program prints `12`, `30`, then `3`, the number of elements, given by `len` in Python and `.size()` in C++. The last line changes the content of cell 1.

In a list of `N` elements, the positions go from `0` to `N - 1`. Cell `N` doesn't exist: in Python, using it causes an error; in C++, the program reads garbage or crashes.

In C++, `#include <vector>` goes at the top of the program, next to `#include <iostream>`.

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

A list can also start empty, with elements added at the end:

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

The first loop gives each value directly. The second one gives the position `i`, and `marks[i]` is the value stored at that position. Going through the positions is useful when the position itself matters, or to compare a cell with its **neighbor**. For example, to compare each cell with the previous one, `marks[i - 1]`, `i` starts at 1, because cell 0 has no previous cell.

To go through a list backwards, the position goes from `N - 1` down to `0`.

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

The largest value is found the same way as by hand: remember the largest value seen so far, and replace it as soon as something bigger shows up.

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

The search starts with the first element of the list, not with 0: if all the values were negative, 0 would be a wrong answer. Python also has `max(marks)`, but writing the loop by hand matters, because the goal is often more than the value: its position, for example.

## Several passes

A list keeps the values: so it can be gone through a first time to compute something (a sum, a maximum), then a second time to use that result on each element. That's impossible with a simple reading loop.

## Key takeaways

- A list (a `vector` in C++) keeps several values; the positions go from `0` to `N - 1`.
- Reading a list: `list(map(int, input().split()))` in Python; `vector<int> v(n)` and a loop of `cin` in C++.
- A list is gone through by values (`for x in my_list`) or by positions (`for i in range(n)`); with neighbors, watch the boundaries.
- For a maximum, start from the first element and compare it with all the others.
- A list allows several passes over the data.
