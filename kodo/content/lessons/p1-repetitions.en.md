Printing the numbers from 1 to 5 takes five instructions. Printing the numbers from 1 to 1,000 the same way would take a thousand almost identical instructions: it is long, and the slightest typo goes unnoticed. Computers are precisely made to repeat work without getting tired or making mistakes. This chapter introduces the **`for` loop**, which repeats one or more instructions a number of times fixed in advance.

With a loop, this two-line program prints the first 1,000 integers:

```python
for i in range(1, 1001):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 1000; i++) {
        cout << i << "\n";
    }
    return 0;
}
```

## Repeating an instruction

The simplest form repeats a block of instructions a given number of times:

```python
for i in range(3):
    print("Bonjour")
print("Fin")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 3; i++) {
        cout << "Bonjour" << "\n";
    }
    cout << "Fin" << "\n";
    return 0;
}
```

This program prints:

```
Bonjour
Bonjour
Bonjour
Fin
```

A **loop** is an instruction that runs a group of instructions several times; this group is called the **body of the loop**. Each run of the body is called an **iteration** of the loop. Here, the body contains a single instruction, `print("Bonjour")`, and it runs 3 times. When the 3 iterations are over, the program goes on with the instruction that follows the loop, and prints `Fin` only once.

In Python, the line `for i in range(3):` ends with a colon `:`. The body of the loop is made of the following lines that are **indented**, that is, shifted to the right. We use 4 spaces (the editor's Tab key inserts them). It is the indentation, and nothing else, that tells Python where the body starts and where it ends: the line `print("Fin")`, back at the far left, is no longer part of the loop.

In C++, the body of the loop is written between braces `{` and `}`. Indentation is not mandatory there, but we always keep it so that the program stays readable. The line `for (int i = 0; i < 3; i++)` contains three parts separated by semicolons, explained below.

## The loop variable

A **variable** is a name that stands for a value. The `i` in `for i in range(3)` is a special variable, the **loop variable**: the loop itself gives it a new value at each iteration, and you can use it in the body of the loop:

```python
for i in range(5):
    print("Tour", i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 5; i++) {
        cout << "Tour" << " " << i << "\n";
    }
    return 0;
}
```

This program prints:

```
Tour 0
Tour 1
Tour 2
Tour 3
Tour 4
```

At the first iteration, `i` is 0; at the second one, 1; and so on. `range(5)` produces the integers 0, 1, 2, 3 and 4: there are indeed 5 of them, but the sequence **starts at 0** and **stops before 5**. This convention is surprising at first, but almost every programming language shares it: `range(n)` makes exactly n iterations, numbered from 0 to n − 1.

The name `i` is a habit, not an obligation. You can write `for k in range(5)` or `for number in range(5)`, as long as you then use the same name in the body.

## Choosing the start: range(a, b)

With two numbers, `range(a, b)` produces the integers from `a` to `b − 1`: it starts at `a` and stops just **before** `b`.

```python
for i in range(1, 6):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i < 6; i++) {
        cout << i << "\n";
    }
    return 0;
}
```

This program prints 1, 2, 3, 4 and 5, one per line. When `a` is smaller than `b`, the number of iterations is b − a, here 6 − 1 = 5. To print the integers from 1 to n included, you therefore give as bound the number that follows n: `range(1, 11)` to go up to 10, `range(1, 1001)` to go up to 1,000 as in the introduction example. In this chapter, bounds are always numbers written as such in the program.

In C++, the loop `for (int i = 1; i < 6; i++)` reads in three parts:

- `int i = 1`: before the first iteration, the loop variable is created and given the value 1; the word `int` (for *integer*) says that `i` holds a whole number;
- `i < 6`: before each iteration, check that `i` is strictly less than 6; as soon as this is no longer true, the loop stops;
- `i++`: after each iteration, increase `i` by 1.

You can also write `i <= 5`, which means "less than or equal to 5": both versions make exactly the same iterations. It is often clearer to write the last value with `<=`, as in the introduction example.

## Choosing the step: range(a, b, p)

A third number sets the **step**, that is, the gap between two successive values of the loop variable. `range(a, b, p)` produces a, then a + p, then a + 2p, and so on, as long as the value stays strictly less than `b`.

```python
for i in range(0, 50, 10):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 50; i += 10) {
        cout << i << "\n";
    }
    return 0;
}
```

This program prints 0, 10, 20, 30 and 40. The next value would be 50, which is not strictly less than 50: the loop stops. In C++, `i += 10` means "increase `i` by 10"; the third part of the `for` sets the step.

The step gives many sequences directly: even numbers (`range(0, 101, 2)`), odd numbers (`range(1, 100, 2)`), multiples of 7 (`range(7, 100, 7)`)… To find the right parameters, ask yourself three questions: what is the first value? what is the gap between two values? what is the last value, and which number must be given so that it is included? To stop after a last value `d`, it is enough to give a bound slightly larger than `d`, for instance `d + 1`.

## Counting down

The step can be negative. The loop then counts backwards, and stops just **before** reaching `b`, which is now smaller than `a`:

```python
for i in range(10, 0, -2):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 10; i > 0; i -= 2) {
        cout << i << "\n";
    }
    return 0;
}
```

This program prints 10, 8, 6, 4 and 2. The next value would be 0, which is not strictly greater than 0. In C++, the test becomes `i > 0` ("as long as `i` is strictly greater than 0") and the update `i -= 2` ("decrease `i` by 2"). To count from 10 down to 0 included, write `range(10, -1, -2)` in Python, or `i >= 0` in C++.

## Several instructions in the body

The body of a loop can contain as many instructions as you want. At each iteration, they are all run, in order:

```python
for i in range(1, 4):
    print("Etape", i)
    print("---")
print("Termine")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i < 4; i++) {
        cout << "Etape" << " " << i << "\n";
        cout << "---" << "\n";
    }
    cout << "Termine" << "\n";
    return 0;
}
```

This program prints:

```
Etape 1
---
Etape 2
---
Etape 3
---
Termine
```

The two indented instructions are repeated together, three times. The non-indented instruction comes after the loop: it runs only once, at the end. Shifting a single line is therefore enough to completely change what the program does.

## Loops one after the other

A loop is an instruction like any other: you can write several of them one after the other, or mix loops and simple prints. The second loop starts when the first one is completely finished.

```python
print("Montee")
for i in range(1, 4):
    print(i)
print("Descente")
for i in range(2, 0, -1):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Montee" << "\n";
    for (int i = 1; i <= 3; i++) {
        cout << i << "\n";
    }
    cout << "Descente" << "\n";
    for (int i = 2; i >= 1; i--) {
        cout << i << "\n";
    }
    return 0;
}
```

This program prints `Montee`, then 1, 2, 3, then `Descente`, then 2 and 1. The second loop starts at 2 rather than 3, so as not to print the top value twice. In C++, `i--` decreases `i` by 1; you can reuse the name `i` in the second loop, because each `int i` creates a new variable that exists only inside its loop.

## A loop that makes no iteration

If the first value is already past the bound, the loop makes no iteration at all, without any error message. For instance, `range(5, 5)` and `range(10, 1)` are empty: the step is 1, and 10 is not less than 1. Likewise, `range(1, 10, -1)` is empty. The body is then never run, and the program goes straight on.

## Common mistakes

**Being off by one on the bound.** You want the numbers from 1 to 10 and write `range(1, 10)`: the program prints only 1 to 9, because the bound is excluded. This is the most frequent mistake with loops; it is called an **off-by-one error**. To avoid it, always check the first and the last values produced. The fix is `range(1, 11)`.

**Forgetting the colon.** `for i in range(3)` without `:` causes:

```
SyntaxError: expected ':'
```

**Forgetting the indentation.** If the line after the `for` is not shifted, Python finds no body:

```
IndentationError: expected an indented block after 'for' statement on line 1
```

Shift the instructions to repeat by 4 spaces.

**Indenting one line too many, or not enough.** If `print("Termine")` is indented, it belongs to the body and is printed at every iteration. If an instruction that should be repeated is not indented, it runs only once, after the loop. Python reports nothing: the program is valid, but it does not do what you want. Reread the indentation line by line.

**Going the wrong way.** `range(10, 0)` does not count down: without a negative step, it produces nothing, and the program prints nothing. To count backwards, the step must be negative: `range(10, 0, -1)`.

**In C++, a condition that stays true forever.** In `for (int i = 10; i >= 1; i++)`, `i` increases instead of decreasing: the condition `i >= 1` stays true and the loop does not stop (the site ends up interrupting it, with a time limit exceeded). The update must bring `i` closer to the exit: here `i--`.

**In C++, a semicolon after the `for`.** With `for (int i = 0; i < 3; i++);`, the semicolon alone forms an empty body, repeated 3 times; the block between braces that follows is then no longer in the loop and runs only once. If it uses `i`, the compiler rejects the program, because `i` only exists inside the loop:

```
error: 'i' was not declared in this scope
```

Never put a `;` right after the closing parenthesis of a `for`.

## A complete example

**Statement.** Print, in increasing order and one per line, all the integers from 1 to 100 whose last digit is 3 or 8.

**Idea.** Write down the first suitable numbers: 3, 8, 13, 18, 23, 28… Notice that the gap between two consecutive numbers is always 5: from 3 to 8, from 8 to 13, and so on. This is no accident: adding 5 to a number ending in 3 gives a number ending in 8, and adding 5 to a number ending in 8 gives a number ending in 3. The wanted sequence is therefore that of a loop with step 5, starting at 3. The last number less than or equal to 100 ending in 3 or 8 is 98; any bound between 99 and 103 includes it and excludes the next one, 103. We choose 101, which reads "up to 100 included".

**Program.**

```python
# Numbers ending in 3 or 8 are 5 apart.
for i in range(3, 101, 5):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // Numbers ending in 3 or 8 are 5 apart.
    for (int i = 3; i <= 100; i += 5) {
        cout << i << "\n";
    }
    return 0;
}
```

**Checking by hand.** Follow the first iterations: `i` is 3, then 8, then 13, then 18; these are indeed the first expected numbers, with none missing. For the end, look at the last iterations: 88, 93, 98; the next value would be 103, which exceeds 100, so the loop stops after printing 98. Finally, count the iterations: there are two suitable numbers per ten, and 10 tens between 1 and 100, that is 20 numbers. The loop goes from 3 to 98 with step 5, which makes (98 − 3) / 5 + 1 = 20 iterations.

## Key takeaways

- `for i in range(n):` repeats the body n times, with `i` taking the values 0, 1, …, n − 1. The body is made of the indented lines (Python) or the lines between braces (C++).
- `range(a, b)` goes from `a` to `b − 1`: the bound `b` is always **excluded**. To go up to 10 included, write `range(1, 11)`, or `i <= 10` in C++.
- `range(a, b, p)` moves forward by `p` at each iteration; a negative step counts down and stops just before `b`.
- Only the instructions of the body are repeated; what is written after the loop runs only once.
- To write a loop, determine the first value, the step and the last value, then check the first and last iterations by hand.
