Until now, programs always did the same thing: they printed the same numbers every time they ran. A useful program works on **data** that it does not know in advance. A program that computes the total price of a shopping basket must work for any basket, not only for the one its author had in mind.

This chapter explains how a program **reads** data. Here is the first example: a program that reads two numbers and prints their sum. Given `3` and `4`, it prints `7`; given `100` and `-1`, it prints `99`. The program does not change; only the data does.

## Input and output

A program receives text and produces text. The text it receives is called the **input**; the text it prints is called the **output**. On this site, every exercise is tested the same way: the program is given an input, then its output is compared with the expected output.

The input is made of **lines**. A statement always describes its format precisely, for example: "The first line contains an integer `N`. The second line contains `N` integers separated by spaces." The program must read exactly what is announced, in that order, no more and no less.

## Reading a line with `input()`

In Python, `input()` reads **one line** of the input. It gives the text of that line, without the final line break. This text is stored in a variable, like any other value.

```python
word = input()
print(word)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    cin >> word;
    cout << word << "\n";
    return 0;
}
```

If the input contains the line `hello`, this program prints `hello`. The first `input()` consumes the first line; a second `input()` would read the next line, and so on. There is no going back: a line that has been read is consumed.

In C++, you read with `cin >>`, followed by the variable that receives the value. To read a word, the variable has type `string`: you must include `<string>` at the top of the program. Be careful: `cin >>` does not read a whole line but a single **word**: it skips spaces and line breaks, then reads characters up to the next space or line break. In the exercises of this level, words never contain spaces, so both ways give the same result.

## Text is not a number: `int()`

The text given by `input()` is a **string**: a sequence of characters, even if they look like digits. The string `"42"` is made of the character `4` followed by the character `2`; it is not the number 42. You cannot compute with it.

To get a number, you **convert** the string with `int()` (short for *integer*). `int("42")` is the number `42`. Most of the time, both operations are written together: `int(input())` reads a line, then converts it to an integer.

```python
a = int(input())
b = int(input())
print(a + b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << "\n";
    return 0;
}
```

With the following input, on two lines:

```text
3
4
```

the program prints `7`. Python reads the first line, converts it, and stores `3` in `a`; it does the same with the second line for `b`; then it prints the sum.

In C++, the conversion is automatic: since `a` is declared with type `int`, `cin >> a` reads digits and directly builds an integer. Several reads can be chained in one statement: `cin >> a >> b` reads `a` first, then `b`. When numbers can go beyond about two billion, use the type `long long` instead of `int`.

## Several values on one line: `split()`

Often, several values are written on the same line, separated by spaces, for example `3 4`. A single `input()` then gives the string `"3 4"`, which cannot be converted at once: `int("3 4")` raises an error, because `"3 4"` is not how an integer is written.

The `split()` method cuts a string into **pieces**, at every space. `"3 4".split()` gives the two pieces `"3"` and `"4"`. Several spaces in a row count as a single cut, and spaces at the start or end of the line are ignored: `"  3   4 ".split()` also gives `"3"` and `"4"`. When you know how many pieces there are, you store them in as many variables, separated by commas:

```python
a, b = input().split()
a = int(a)
b = int(b)
print(a * b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a * b << "\n";
    return 0;
}
```

With the input `3 4`, this program prints `12`. The first line stores `"3"` in `a` and `"4"` in `b`; the next two lines convert them to integers.

To avoid converting each variable by hand, Python has a shortcut: `map(int, ...)` applies `int` to every piece. The line below reads a line, splits it and converts each piece. This is the form you will use most often.

```python
a, b, c = map(int, input().split())
print(a + b + c)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a + b + c << "\n";
    return 0;
}
```

In C++, nothing changes: `cin >>` skips spaces as well as line breaks. Whether the three numbers are on one line or on three lines, `cin >> a >> b >> c` reads them the same way. In Python, on the contrary, you must know exactly what is on each line: one `input()` per line, and a `split()` as soon as a line holds several values.

A line can also mix a word and a number. In that case, you cannot use `map(int, ...)`, since the word is not an integer: you split the line, then convert only the piece that must be a number. In C++, you simply declare one variable of each type.

```python
word, n = input().split()
n = int(n)
for i in range(n):
    print(word)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    int n;
    cin >> word >> n;
    for (int i = 0; i < n; i++) {
        cout << word << "\n";
    }
    return 0;
}
```

With the input `ha 3`, this program prints three lines `ha`. If you forgot `n = int(n)`, `range(n)` would receive the string `"3"` and Python would stop with `TypeError: 'str' object cannot be interpreted as an integer`.

## Reading N values

In most exercises, the first line says how many values follow. You first read this number `N`, then use a `for` loop that runs `N` times and reads one value each time. The values are processed **as they are read**: at each iteration, you read a value, use it, then move on to the next one. There is no need to keep them all.

First case: one value per line. Each iteration calls `input()`.

```python
n = int(input())
total = 0
for i in range(n):
    x = int(input())
    total = total + x
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

With the input below, the program reads `n = 3`, then runs three iterations: `total` becomes `5`, then `3`, then `13`. It prints `13`.

```text
3
5
-2
10
```

Second case: the `N` values are all on one line, for example `5 -2 10`. In Python, you can no longer call `input()` once per value, since there is only one line. You read that line once, split it, and **go through** its pieces with a `for` loop. The loop `for piece in input().split():` runs once per piece: in the first iteration, the variable `piece` is `"5"`, in the second `"-2"`, in the third `"10"`. Each piece still has to be converted with `int()`.

```python
n = int(input())
total = 0
for piece in input().split():
    x = int(piece)
    total = total + x
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

With the input `3` then `5 -2 10`, this program also prints `13`. The C++ program is exactly the same as in the first case: this is one of the advantages of `cin`. In Python, be careful: the line `for piece in input().split():` reads the line **only once**, before the first iteration, not at every iteration.

Notice that the Python program does not use the value of `n`: the number of iterations is the number of pieces. You still have to read the first line, otherwise the next `input()` would read `3` instead of the line of values.

Third case: each of the `N` lines holds several values. You combine both techniques: a loop of `N` iterations, and in each iteration one `input()` split with `split()`. The program below reads `N` lines of two integers and prints, for each line, the sum of the two.

```python
n = int(input())
for i in range(n):
    a, b = map(int, input().split())
    print(a + b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        cout << a + b << "\n";
    }
    return 0;
}
```

With the input below, the program prints `3`, `6` and `0`, on three lines.

```text
3
1 2
10 -4
0 0
```

The program prints a result before it has read the whole input. This is not a problem: the input and the output are two separate texts. Only the complete output matters, compared with the expected output once the program has finished.

## Remembering the previous value

Processing values as they come has a consequence: when you read a value, the previous ones are lost. If the computation needs the value read just before, you must keep it in a variable, often called `previous`. You read the first value **before** the loop, then the loop reads the `N − 1` remaining values. At the end of each iteration, the value just read becomes the previous value for the next iteration.

The program below reads `N` integers, one per line, and prints the difference between each value and the previous one.

```python
n = int(input())
previous = int(input())
for i in range(n - 1):
    x = int(input())
    print(x - previous)
    previous = x
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, previous;
    cin >> n >> previous;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        cout << x - previous << "\n";
        previous = x;
    }
    return 0;
}
```

With `N = 4` and the values `10`, `13`, `13`, `7`, the program prints `3`, `0` then `-6`. There are `N − 1` differences for `N` values. The order of the last two instructions of the body matters: if you wrote `previous = x` before printing, you would compute `x - x`, and the program would only print `0`s.

## Common mistakes

**Forgetting `int()`.** Without conversion, Python keeps strings. The `+` symbol between two strings glues them together: this is **concatenation**. The program below, with the input `3` then `4`, prints `34` instead of `7`.

```python
a = input()
b = input()
print(a + b)   # prints 34
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    cout << a + b << "\n";   // prints 34: a and b are text
    return 0;
}
```

If you add a string and a number, for example `input() + 1`, Python stops with the message `TypeError: can only concatenate str (not "int") to str`. The fix is the same in both cases: write `int(input())`. In C++, the matching mistake is to declare a `string` variable where a number is expected.

**Converting a line that holds several values.** If the line is `3 4` and you write `a = int(input())`, Python prints `ValueError: invalid literal for int() with base 10: '3 4'`. The message quotes the text it could not convert: you can see the space in it. The fix is to split the line with `split()`.

**Not having the right number of variables.** `a, b = map(int, input().split())` requires exactly two pieces. With three numbers on the line, you get `ValueError: too many values to unpack (expected 2)`; with only one, `ValueError: not enough values to unpack (expected 2, got 1)`. Read the input format in the statement again.

**Reading too many lines.** If you call `input()` once too often, there is nothing left to read and Python prints `EOFError: EOF when reading a line` (*EOF* means "end of file"). It often means you read the values one per line while they are all on a single line, or that the loop runs once too many. In C++, there is no message: the read fails silently and the variable keeps a value unrelated to the input. The result is wrong, with no explanation.

**Printing a prompt.** You sometimes see `input("Enter a number: ")`. The text in the parentheses is **printed** to the output before reading. For a human at a keyboard, that is handy; for the tests, this text is added to the output, which no longer matches the expected output. In the exercises, always write `input()` with nothing inside the parentheses, and print only what the statement asks for.

## A complete example

**Statement.** The first line contains an integer `N`. The second line contains `N` integers separated by spaces. Print, on two lines, the sum of these integers, then the sum of their squares (the square of `x` is `x × x`).

**Idea.** We do not keep the values: we process them as they come. Two **accumulators** are enough, that is, two variables that start at `0` and grow with every value read: `total` receives `x`, and `squares` receives `x * x`. The values are on a single line, so in Python we go through the pieces of that line.

**Program.**

```python
n = int(input())
total = 0
squares = 0
for piece in input().split():
    x = int(piece)
    total = total + x
    squares = squares + x * x
print(total)
print(squares)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    int squares = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        total = total + x;
        squares = squares + x * x;
    }
    cout << total << "\n";
    cout << squares << "\n";
    return 0;
}
```

**Checking by hand.** Take the input `3` then `2 -1 4`. At the start, `total = 0` and `squares = 0`. First iteration: `x = 2`, so `total = 2` and `squares = 4`. Second iteration: `x = -1`, so `total = 1` and `squares = 5`, since the square of `-1` is `1`. Third iteration: `x = 4`, so `total = 5` and `squares = 21`. The program prints `5` then `21`. Direct check: 2 − 1 + 4 = 5, and 4 + 1 + 16 = 21.

It is also worth testing an edge case: with `N = 1` and the single value `0`, the program prints `0` and `0`, which is correct.

## Key takeaways

- `input()` reads a whole line and gives a string; `int()` converts it to an integer. In C++, `cin >> x` directly reads a value of the type of `x`.
- Several values on one line: `a, b = map(int, input().split())` in Python, `cin >> a >> b` in C++.
- To read `N` values, read `N`, then a loop reads and processes one value per iteration. In Python, one `input()` per iteration if the values are one per line, `for piece in input().split():` if they are all on one line.
- To use the value read just before, keep it in a variable `previous`: the first value is read before the loop, and `previous = x` ends each iteration.
- Read exactly what the statement describes, in order: no extra line, no forgotten line.
- Print only what is asked: no message inside `input()`.
