A program is a list of instructions that the computer runs in order, from top to bottom. In this chapter, you'll learn the three basic moves of every program: **printing**, **computing** and **reading** numbers.

## Printing a message

```python
print("Hello!")
print(2026)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello!" << "\n";
    cout << 2026 << "\n";
    return 0;
}
```

In Python, `print` displays whatever you give it, then moves to the next line. Text goes between quotes; numbers go without quotes.

In C++, a program always has this shape: the first two lines get printing and reading ready, and your instructions go between the curly braces of `int main()`. `cout << …` prints, and `"\n"` moves to the next line. Every instruction ends with a semicolon. From now on, we'll only show what goes inside `main`.

## Variables

A **variable** is a box with a name, in which you store a value.

```python
pages = 40
pages_read = 27
pages_left = pages - pages_read
print(pages_left)
```

```cpp
int pages = 40;
int pagesRead = 27;
int pagesLeft = pages - pagesRead;
cout << pagesLeft << "\n";
```

This program prints `13`. In C++, the first time you use a box, you say what it holds: `int` means "whole number" (integer). In Python, you don't need to.

What's inside a box can change: `pages_read = pages_read + 3` first computes `pages_read + 3`, then stores the result in `pages_read`. So the `=` sign doesn't mean "is equal to", it means "takes the value".

## Computing

Here are the operations on whole numbers:

- `+`, `-` and `*`: addition, subtraction and multiplication (`*` is the "times" sign);
- `//` in Python, `/` in C++: the quotient of the whole-number division, for example 17 divided by 5 gives `3`;
- `%` in both languages: the remainder of that division, for example 17 % 5 gives `2`, because 17 = 3 × 5 + 2.

Just like in math, multiplications and divisions come before additions and subtractions: `2 + 3 * 4` is `14`. Use parentheses to change the order: `(2 + 3) * 4` is `20`.

Be careful: in Python, `/` gives a decimal number (`17 / 5` is `3.4`). To count whole objects, use `//`.

The quotient and the remainder are often used for conversions. For example, how many hours and minutes are there in 135 minutes?

```python
duration = 135
hours = duration // 60
minutes = duration % 60
print(hours, minutes)
```

```cpp
int duration = 135;
int hours = duration / 60;
int minutes = duration % 60;
cout << hours << " " << minutes << "\n";
```

The program prints `2 15`: 135 minutes is 2 hours and 15 minutes.

## Reading the data

In each problem, your program receives some data: that's the **input**. To read a number that is alone on its line:

```python
n = int(input())
```

```cpp
int n;
cin >> n;
```

In Python, `input()` reads a whole line, as **text**. `int(…)` turns that text into a whole number. Without this conversion, `"3" + "4"` would give the text `"34"`, not the number `7`!

To read several numbers written on the same line, separated by spaces:

```python
a, b = map(int, input().split())
```

```cpp
int a, b;
cin >> a >> b;
```

`input().split()` cuts the line at the spaces, and `map(int, …)` converts each piece into an integer. In C++, `cin >>` reads the next number, whether it's on the same line or on the next one: `cin` doesn't care about lines.

## Printing several things

```python
total = 12
print("Total:", total)
print(3, 4)
```

```cpp
int total = 12;
cout << "Total: " << total << "\n";
cout << 3 << " " << 4 << "\n";
```

Both programs print `Total: 12`, then `3 4` on the next line. In Python, `print` puts a space between the items separated by commas. In C++, `cout` adds nothing: it's up to you to write the spaces.

Your answer is compared word by word with the expected answer. Capital letters and punctuation matter, and nothing else must be printed. So don't write `print("Result:", x)` when only the number is expected: your answer would be rejected. On Kodo, the text between the parentheses of `input(…)` is not printed, but elsewhere it would be: get used to writing `input()` with no message.

## Key takeaways

- `print(…)` in Python, `cout << …` in C++ to print; in C++, you write the spaces and the `"\n"` yourself.
- A variable stores a value: `x = x + 1` computes `x + 1`, then stores the result in `x`.
- `input()` reads text: convert it with `int(…)`. Several numbers on one line: `map(int, input().split())` in Python, `cin >> a >> b;` in C++.
- Whole-number division: `//` in Python, `/` between two `int`s in C++. Remainder: `%`.
- Print exactly what is asked, nothing more.
