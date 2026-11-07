A loop repeats instructions. But those instructions can themselves contain a loop. To print a rectangle of 3 lines and 5 columns, you repeat 3 times "print a line", and printing a line means repeating 5 times "print a character". To write a multiplication table, you go through the lines, and in each line, through the columns. To find every way of choosing two numbers between 1 and 100, you fix the first one, then let the second one vary.

A loop placed in the body of another loop is called a **nested loop**. This chapter shows how it runs, how to use it to build patterns and go through pairs, and how many turns it makes in total.

## Printing without a line break

So far, each `print` printed a complete line. To build a line piece by piece, one character per turn of a loop, you need to be able to print **without** moving to the next line.

In Python, `print` automatically adds a **line break** after what it prints. The **parameter** `end` lets you choose what is added instead. It goes at the end of the parentheses, after a comma, in the form `end=` followed by a string:

- `print("#", end="")` prints `#` and adds nothing: the next output continues on the same line. `""` is the **empty string**, two quotes with nothing between them;
- `print(x, end=" ")` prints `x` followed by a space, without moving to the next line;
- `print()`, with nothing between the parentheses, only prints the line break: it ends the current line.

Without `end`, everything happens as if you had written `end="\n"`, where `"\n"` is the line break. In C++, there is nothing new: `cout` never moves to the next line on its own, you have to write `"\n"`. To stay on the same line, simply don't write it.

```python
print("#", end="")
print("#", end="")
print("#")
print(1, end=" ")
print(2)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "#";
    cout << "#";
    cout << "#" << "\n";
    cout << 1 << " ";
    cout << 2 << "\n";
    return 0;
}
```

This program prints two lines: `###`, then `1 2`. The first two `print` calls add nothing after their `#`; the third one, without `end`, prints its `#` and then ends the line. The `1` therefore starts a new line, followed by a space, and the `2` completes that line.

With a loop, you print a line of a chosen length. The `print()` placed **after** the loop ends the line:

```python
n = 5
for i in range(n):
    print("*", end="")
print()
print("Fin")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    for (int i = 0; i < n; i++) {
        cout << "*";
    }
    cout << "\n";
    cout << "Fin" << "\n";
    return 0;
}
```

This program prints `*****` on one line, then `Fin` on the next one. Without the `print()` after the loop, `Fin` would be glued to the stars: `*****Fin`.

A remark about spaces. With `print(x, end=" ")` in a loop, every number is followed by a space, including the last one: the line ends with an extra space. This is not a problem on Kodo, because the judge compares the output word by word and ignores extra spaces. On the other hand, `end=""` between two numbers would glue them together: `print(1, end="")` then `print(2)` prints `12`, a single number.

## A loop inside a loop

Here is the rectangle of 3 lines and 5 columns:

```python
for i in range(3):
    for j in range(5):
        print("#", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 5; j++) {
            cout << "#";
        }
        cout << "\n";
    }
    return 0;
}
```

It prints:

```
#####
#####
#####
```

The loop on `i` is the **outer loop**; the loop on `j`, inside it, is the **inner loop**. The rule of execution is: **at each turn of the outer loop, the inner loop makes all its turns**, from start to finish. Here, for `i = 0`, `j` takes the values 0, 1, 2, 3, 4 (five `#`), then `print()` ends the line. For `i = 1`, the inner loop starts again from `j = 0` and makes its five turns again, and so on.

The `print()` is indented at the level of the outer loop, not the inner loop: it runs once per line, after the five `#`. The **indentation** (the shift at the start of the line) tells which loop an instruction belongs to. In C++, the braces do.

In total, the instruction `print("#", end="")` runs 3 × 5 = 15 times. In general, if the outer loop makes `A` turns and the inner loop makes `B` turns each time, the body of the inner loop runs `A × B` times.

## An inner loop that depends on the outer loop

The number of turns of the inner loop can depend on the variable of the outer loop. To print a triangle whose line number `i` (starting from 1) contains `i` characters, write `range(i)` in the inner loop. To make `i` go from 1 to `n`, use `range(1, n + 1)`: with two numbers, `range(a, b)` goes through the integers from `a` to `b - 1`.

```python
n = 4
for i in range(1, n + 1):
    for j in range(i):
        print("*", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 4;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            cout << "*";
        }
        cout << "\n";
    }
    return 0;
}
```

This program prints:

```
*
**
***
****
```

At the first turn of the outer loop, the inner loop makes 1 turn; at the second, 2 turns; at the last, `n` turns. The total number of stars is 1 + 2 + 3 + 4 = 10. For `n` lines, it's 1 + 2 + … + n = n × (n + 1) / 2, about half of n × n.

## Using both variables

In the body of the inner loop, both variables are available: `i` (the line) and `j` (the column). You can compute with them, or test them with an `if`. Here is the multiplication table from 1 to 4:

```python
for i in range(1, 5):
    for j in range(1, 5):
        print(i * j, end=" ")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 4; i++) {
        for (int j = 1; j <= 4; j++) {
            cout << i * j << " ";
        }
        cout << "\n";
    }
    return 0;
}
```

```
1 2 3 4
2 4 6 8
3 6 9 12
4 8 12 16
```

The cell in line `i` and column `j` contains `i × j`. With an `if`, you choose the character to print depending on the position. For example, to draw the diagonal of a square, print `#` when `i == j` and `.` otherwise:

```python
n = 4
for i in range(n):
    for j in range(n):
        if i == j:
            print("#", end="")
        else:
            print(".", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 4;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                cout << "#";
            } else {
                cout << ".";
            }
        }
        cout << "\n";
    }
    return 0;
}
```

```
#...
.#..
..#.
...#
```

To find the right condition for a pattern, write the coordinates `(i, j)` next to each cell and look for what the `#` cells have in common: `i == j` for one diagonal, `i + j == n - 1` for the other diagonal, `i == 0` for the first line, and so on.

## Going through all pairs

A **pair** is a choice of two numbers. With two nested loops from 1 to `n`, you go through all the couples `(i, j)`, including `(2, 2)`, and both `(1, 3)` and `(3, 1)`. Often you want each pair **only once**, with two different numbers. It is then enough to require `i < j`: the inner loop starts at `i + 1`.

```python
n = 5
count = 0
for i in range(1, n + 1):
    for j in range(i + 1, n + 1):
        if (i + j) % 2 == 0:
            count = count + 1
print(count)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            if ((i + j) % 2 == 0) {
                count = count + 1;
            }
        }
    }
    cout << count << "\n";
    return 0;
}
```

This program counts the pairs `i < j` between 1 and 5 whose sum is even. It finds 4: `(1, 3)`, `(1, 5)`, `(2, 4)` and `(3, 5)`. It prints `4`. There are 10 pairs `i < j` between 1 and 5 in total, and n × (n - 1) / 2 in general: that's the number of turns of the inner loop.

This pattern, **enumerating** every possibility and counting those that fit, is one of the most useful methods in algorithmics. It is called **exhaustive search**. It is simple and safe, as long as the number of possibilities stays reasonable.

## Nesting while and for

`while` loops nest just like `for` loops. A frequent case: for each number from 1 to `n`, look at its digits. The outer loop is a `for` (you know the number of turns), the inner loop a `while` (you don't know the number of digits). Here are the numbers from 1 to 40 whose digit sum is 5:

```python
for n in range(1, 41):
    m = n
    total = 0
    while m > 0:
        total = total + m % 10
        m = m // 10
    if total == 5:
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int n = 1; n <= 40; n++) {
        int m = n;
        int total = 0;
        while (m > 0) {
            total = total + m % 10;
            m = m / 10;
        }
        if (total == 5) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

The program prints `5`, `14`, `23` and `32`, one per line. Two points are essential. First, the inner loop works on a **copy** `m` of `n`: if it destroyed `n` directly, `n` would be 0 after the inner loop. In Python, `print(n)` would then print 0 (the next turn of the `for` loop does move on to the next number, but the result is wrong). In C++, it is worse: `n` goes back to 0, then `n++` sets it to 1, and the outer loop starts over forever. Second, `total` is reset to 0 **at the start of each turn of the outer loop**, just before the inner loop: each number has its own sum.

## How many turns?

A nested loop quickly makes a lot of turns. Two loops of 1,000 turns each run the body of the inner loop a million times. A computer does a few hundred million simple operations per second in C++, and Python is 10 to 50 times slower. A million turns is therefore fast in both languages, but two loops of 100,000 turns (ten billion passes) take far too long. Before writing nested loops, estimate the total number of turns from the constraints of the statement.

## Common mistakes

### The counter initialised at the wrong level

```python
total = 0
for n in range(1, 41):
    m = n
    while m > 0:
        total = total + m % 10
        m = m // 10
    if total == 5:
        print(n)
```

```cpp
int total = 0;
for (int n = 1; n <= 40; n++) {
    int m = n;
    while (m > 0) {
        total = total + m % 10;
        m = m / 10;
    }
    if (total == 5) {
        cout << n << "\n";
    }
}
```

Here, `total` is set to 0 only once, before the outer loop: it adds up the digits of **all** the numbers. It is 1 after the number 1, then 3, then 6, and keeps growing: it is never exactly 5, and the program prints nothing at all. The rule: a variable about a single turn of the outer loop is initialised at the start of that turn; a variable about the whole computation (like the total number of pairs) is initialised before the outer loop.

### The same variable for both loops

```python
for i in range(1, 4):
    for i in range(1, 4):
        print(i * i, end=" ")
    print()
```

```cpp
for (int i = 1; i <= 3; i++) {
    for (int i = 1; i <= 3; i++) {
        cout << i * i << " ";
    }
    cout << "\n";
}
```

You wanted the multiplication table, and you get the line `1 4 9` three times: inside the inner loop, `i` refers to the variable of the inner loop, and the line number is lost. Each loop must have its own variable: `i` for lines, `j` for columns.

### The misplaced or forgotten line break

In the rectangle program, if `print()` is indented into the inner loop, it runs after each character: you get a single `#` per line, on 15 lines. If it is forgotten, the 15 `#` are printed on a single line. And if you forget `end=""` in `print("#", end="")`, each `#` is followed by a line break: you also get 15 lines of a single `#`. Always check the indentation: one line break per turn of the outer loop.

A frequent typo is to forget the comma before `end`: `print("#" end="")`. Python then refuses to run the program and prints `SyntaxError: invalid syntax. Perhaps you forgot a comma?`, pointing at the faulty line.

### An inner while loop that doesn't start over

```python
i = 0
j = 0
while i < 3:
    while j < 5:
        print("#", end="")
        j = j + 1
    print()
    i = i + 1
```

```cpp
int i = 0;
int j = 0;
while (i < 3) {
    while (j < 5) {
        cout << "#";
        j = j + 1;
    }
    cout << "\n";
    i = i + 1;
}
```

This program prints one line of five `#`, then two empty lines. After the first line, `j` is 5 and is never reset to 0: the inner loop makes no more turns. With `while`, the initialisation `j = 0` must go **inside** the outer loop, just before the inner loop.

## Complete example: perfect numbers

**Statement.** A number is **perfect** if it is equal to the sum of its divisors other than itself. For example, 6 is perfect, because its divisors other than 6 are 1, 2 and 3, and 1 + 2 + 3 = 6. The program reads an integer `N` (1 ≤ N ≤ 1,000) and prints all perfect numbers between 1 and `N`, one per line.

**Idea.** You don't know how to recognise a perfect number directly: test each candidate. The outer loop goes through the numbers `n` from 1 to `N`. For each one, the inner loop goes through the possible divisors `d` from 1 to `n - 1`, and adds `d` to a sum when `n % d == 0`. After the inner loop, compare the sum with `n`. The sum is reset to 0 at the start of each outer turn. The number of turns is at most 1,000 × 1,000 / 2, half a million: that's fast.

**Program.**

```python
N = int(input())
for n in range(1, N + 1):
    total = 0
    for d in range(1, n):
        if n % d == 0:
            total = total + d
    if total == n:
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;
    for (int n = 1; n <= N; n++) {
        int total = 0;
        for (int d = 1; d < n; d++) {
            if (n % d == 0) {
                total = total + d;
            }
        }
        if (total == n) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

**Checking by hand** with `N = 6`. For `n = 1`, the inner loop makes no turn: the sum is 0, different from 1. For `n = 4`, the divisors tested are 1, 2, 3; only 1 and 2 divide 4, the sum is 3. For `n = 6`, the divisors are 1, 2 and 3, the sum is 6: the program prints `6`. The other numbers (2, 3, 5) give a sum of 1, and 4 gives 3. With `N = 1000`, the program prints `6`, `28` and `496`.

## Key takeaways

- In a nested loop, the inner loop makes all its turns at each turn of the outer loop. The inner body runs (outer turns) × (inner turns) times.
- `print(x, end="")` prints without a line break, `print()` ends the line; in C++, you write `"\n"` only to move to the next line. The indentation (or the braces) tells which loop each instruction belongs to: one line break per outer turn for a pattern.
- The inner loop can depend on the outer variable: `range(i)` for a triangle, `range(i + 1, n + 1)` for the pairs `i < j`.
- Enumerating every possibility and counting those that fit (exhaustive search) works as long as the total number of turns stays around a few million.
- Each loop has its own variable; whatever concerns a single outer turn (sum, counter, `j = 0` of a `while`) is initialised at the start of that turn.
