Until now, a program ran all its instructions, always in the same order. It could not react to the data: it computed a sum, but it could not tell whether that sum was positive, nor choose between two answers.

This chapter teaches a program to **decide**. An example: a program reads today's temperature and prints `GEL` (frost) if it is below zero, `OK` otherwise. Depending on the value read, a different print statement is run. This idea, doing something or not depending on the data, is at the heart of almost every algorithm.

## Comparing two values

A **comparison** asks a question about two values, whose answer is true or false. There are six **comparison operators**, the same in Python and in C++:

| Operator | Meaning | True example |
| --- | --- | --- |
| `<` | strictly less than | `3 < 5` |
| `>` | strictly greater than | `5 > 3` |
| `<=` | less than or equal to | `4 <= 4` |
| `>=` | greater than or equal to | `7 >= 2` |
| `==` | equal to | `6 == 6` |
| `!=` | different from | `6 != 7` |

Notice that the equality test is written with **two** equal signs. A single `=` is used for assignment, that is, to store a value in a variable. This is the source of a very common mistake, described below.

Comparisons apply to any expressions: `a + b > 10` compares the sum `a + b` with 10, and `n % 2 == 0` tests whether the remainder of `n` divided by 2 is zero, that is, whether `n` is even. You can also compare two words: `word == "yes"` is true if the variable `word` holds exactly the text `yes`.

## The `if` statement

The `if` statement runs a group of instructions **only if** a condition is true. The **condition** is the expression written after `if`; the group of instructions it controls is called a **block**.

```python
t = int(input())
if t < 0:
    print("GEL")
print("FIN")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    if (t < 0) {
        cout << "GEL\n";
    }
    cout << "FIN\n";
    return 0;
}
```

With the input `-3`, the condition `t < 0` is true: the program prints `GEL` then `FIN`. With the input `12`, the condition is false: the block is skipped, and the program only prints `FIN`. The last instruction is not part of the block, so it always runs.

In Python, the `if` line ends with a colon `:`, and the block is made of the **indented** lines that follow, that is, lines shifted to the right (use 4 spaces). The block ends at the first line that comes back to the level of the `if`. In C++, the condition goes between parentheses and the block between braces `{ }`; indentation is only a reading aid there, but you should always respect it.

## `else`: otherwise

Often, you want to do one thing if the condition is true, and another if it is false. You then add an `else` block, which has no condition: it runs exactly when the condition of the `if` is false.

```python
n = int(input())
if n % 2 == 0:
    print("PAIR")
else:
    print("IMPAIR")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "PAIR\n";
    } else {
        cout << "IMPAIR\n";
    }
    return 0;
}
```

With `14`, the remainder of the division by 2 is 0: the program prints `PAIR` (even). With `7`, the remainder is 1, the condition is false, and the program prints `IMPAIR` (odd). In every case, **exactly one** of the two blocks runs, never both, never neither.

This test also works for negative numbers, in Python as in C++: `-6 % 2` is 0 in both languages. However, `-7 % 2` is `1` in Python and `-1` in C++. That is why you test `n % 2 == 0` (even) rather than `n % 2 == 1` (odd), which would be wrong in C++ for a negative number.

## `elif`: several cases

When there are more than two cases, chain them with `elif` in Python (short for *else if*) and `else if` in C++. The conditions are tested **in order**, from top to bottom. As soon as one condition is true, its block runs and all the following cases are ignored. The final `else`, which is optional, handles everything left.

```python
n = int(input())
if n > 0:
    print("POSITIF")
elif n < 0:
    print("NEGATIF")
else:
    print("NUL")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "POSITIF\n";
    } else if (n < 0) {
        cout << "NEGATIF\n";
    } else {
        cout << "NUL\n";
    }
    return 0;
}
```

With `5`, the first condition is true: the program prints `POSITIF` and does not look further. With `-2`, the first is false and the second true: it prints `NEGATIF`. With `0`, both are false: the `else` runs.

The fact that conditions are tested in order is very useful: when you reach an `elif`, you know that all the previous conditions were false. In the next example, which gives a grade to a mark out of 20, the second condition does not need to check that the mark is below 16: if it were 16 or more, the first case would already have handled it.

```python
note = int(input())
if note >= 16:
    print("TRES BIEN")
elif note >= 14:
    print("BIEN")
elif note >= 10:
    print("PASSABLE")
else:
    print("INSUFFISANT")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int note;
    cin >> note;
    if (note >= 16) {
        cout << "TRES BIEN\n";
    } else if (note >= 14) {
        cout << "BIEN\n";
    } else if (note >= 10) {
        cout << "PASSABLE\n";
    } else {
        cout << "INSUFFISANT\n";
    }
    return 0;
}
```

With `15`, the first condition is false and the second true: the program prints `BIEN`. With `9`, none of the three conditions is true: it prints `INSUFFISANT`.

## Nested conditions

A block can hold any instructions, including another `if`. These are called **nested** conditions. The inner `if` is examined only if the outer condition is true.

```python
age = int(input())
height = int(input())
if age >= 12:
    if height >= 140:
        print("ACCES")
    else:
        print("TROP PETIT")
else:
    print("TROP JEUNE")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int age, height;
    cin >> age >> height;
    if (age >= 12) {
        if (height >= 140) {
            cout << "ACCES\n";
        } else {
            cout << "TROP PETIT\n";
        }
    } else {
        cout << "TROP JEUNE\n";
    }
    return 0;
}
```

With `14` then `150`, both conditions are true: `ACCES`. With `14` then `130`, the first is true but not the second: `TROP PETIT` (too short). With `10`, the height is not even examined: `TROP JEUNE` (too young). In Python, indentation tells which `if` each `else` belongs to, so it must be done carefully.

## Deciding inside a loop: the running maximum

By putting an `if` inside a loop, you can make a decision for every value read. The most important example is finding the **maximum** of a sequence of values read one by one. A variable `best` holds the largest value seen **so far**: this is the **running maximum**. For each new value `x`, there is only one question: is `x` larger than `best`? If so, `x` becomes the new running maximum.

The starting value of `best` remains to be chosen. The safest choice is the first value read: on its own, it is the maximum of what has been seen.

```python
n = int(input())
best = int(input())
for i in range(n - 1):
    x = int(input())
    if x > best:
        best = x
print(best)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, best;
    cin >> n >> best;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x > best) {
            best = x;
        }
    }
    cout << best << "\n";
    return 0;
}
```

With `N = 4` and the values `-5`, `-2`, `-9`, `-3`: `best` is first `-5`. Then `-2 > -5`, so `best` becomes `-2`. Then `-9` and `-3` are not larger than `-2`, nothing changes. The program prints `-2`. The minimum is found the same way, replacing `>` with `<`.

The same pattern lets you **count**: a counter starts at 0, and an `if` inside the loop adds 1 to it every time the value read satisfies the condition you want.

## Common mistakes

**Mixing up `=` and `==`.** In Python, `if x = 0:` is rejected before running: `SyntaxError: invalid syntax`, often with the hint *Maybe you meant '==' instead of '='?*. The fix is `if x == 0:`. In C++, it is more dangerous: `if (x = 0)` is accepted by the compiler. This statement stores 0 in `x`, then treats the condition as false. The program runs but gives a wrong result, and `x` has lost its value. You must write `if (x == 0)`.

**Forgetting the colon or the indentation.** `if x > 0` without `:` gives `SyntaxError: expected ':'`. A block that is not indented gives `IndentationError: expected an indented block after 'if' statement`. In C++, forgetting the braces is silent: without them, only the first instruction after the `if` is controlled by the condition, the following ones always run. So always write the braces.

**Overlapping cases, in the wrong order.** With `elif`, only the first true case counts. In the program below, a mark of 17 satisfies the first condition and prints `PASSABLE`: the case `note >= 16` is never reached.

```python
note = int(input())
if note >= 10:
    print("PASSABLE")
elif note >= 16:
    print("TRES BIEN")   # never runs
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int note;
    cin >> note;
    if (note >= 10) {
        cout << "PASSABLE\n";
    } else if (note >= 16) {
        cout << "TRES BIEN\n";   // never runs
    }
    return 0;
}
```

The fix is to test the most demanding case first, as in the grades example above.

**Writing separate `if`s instead of an `elif`.** `if` statements that follow each other are all examined, independently of each other. If you replace the `elif`s of the grades program with `if`s, a mark of 17 satisfies three conditions and prints three lines. When the cases exclude each other, use `elif` (or `else if`).

**Starting the maximum at 0.** If you write `best = 0` before the loop and all the values are negative, none is larger than 0: the program prints `0`, a value that is not even in the input. Start from the first value read.

**Forgetting a case.** To compare two numbers `a` and `b`, there are three possibilities: `a < b`, `a > b` and `a == b`. A program that only plans for the first two is wrong on ties. Always ask yourself what happens when two values are equal.

## A complete example

**Statement.** The temperature is recorded for `N` days (one value per line). Print the largest rise from one day to the next, that is, the largest value of "today's temperature minus yesterday's temperature". If the temperature never went up, print `0`.

**Idea.** We combine two techniques. To compute a rise, we need yesterday's temperature: we keep it in a variable `previous`, updated at each iteration. For each new day, the rise is `t - previous`. We keep the largest rise in a variable `record`, like a running maximum. Since the answer must be `0` when there is no rise, this time we can start from `record = 0`: a drop, which is negative, will never replace 0.

**Program.**

```python
n = int(input())
previous = int(input())
record = 0
for i in range(n - 1):
    t = int(input())
    if t - previous > record:
        record = t - previous
    previous = t
print(record)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, previous;
    cin >> n >> previous;
    int record = 0;
    for (int i = 0; i < n - 1; i++) {
        int t;
        cin >> t;
        if (t - previous > record) {
            record = t - previous;
        }
        previous = t;
    }
    cout << record << "\n";
    return 0;
}
```

**Checking by hand.** With `N = 5` and the temperatures `3`, `7`, `5`, `11`, `10`. At the start, `previous = 3` and `record = 0`. Day 2: rise 7 − 3 = 4, larger than 0, so `record = 4`; `previous = 7`. Day 3: rise 5 − 7 = −2, nothing changes; `previous = 5`. Day 4: rise 11 − 5 = 6 > 4, so `record = 6`; `previous = 11`. Day 5: rise −1, nothing changes. The program prints `6`, the rise from day 3 to day 4.

An edge case: with always decreasing temperatures, such as `9`, `4`, `1`, no rise goes above 0 and the program correctly prints `0`. Notice also that `previous = t` is placed **after** the `if`, outside its block: yesterday's value must be updated at every iteration, whether there was a record or not.

## Key takeaways

- A comparison (`<`, `>`, `<=`, `>=`, `==`, `!=`) is true or false. Equality is written `==`; a single `=` is an assignment.
- `if` runs a block only if its condition is true; `else` handles the opposite case. Exactly one of the two blocks runs.
- With `elif` (`else if` in C++), cases are tested in order and only the first true case runs: put the most demanding cases first.
- An `if` inside a loop handles each value read: running maximum, minimum, counting.
- A running maximum starts from the first value read, not from 0.
- Always think about ties and edge cases.
