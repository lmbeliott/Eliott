So far, programs printed values written in advance, possibly with the help of a loop. To go further, a program must be able to **compute** and to **remember** intermediate results. For instance, to find the sum of the integers from 1 to 1,000, you must add the numbers one by one while keeping the running total in memory. This chapter presents operations on integers, then **variables**, which let you store a value, change it and reuse it.

```python
somme = 0
for i in range(1, 1001):
    somme = somme + i
print(somme)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int somme = 0;
    for (int i = 1; i <= 1000; i++) {
        somme = somme + i;
    }
    cout << somme << "\n";
    return 0;
}
```

This program prints `500500`. By the end of the chapter, each of its lines will be clear.

## Computing with integers

You can write a computation directly wherever a value is expected, for instance in a print:

```python
print(7 + 5)
print(7 - 5)
print(7 * 5)
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 7 + 5 << "\n";
    cout << 7 - 5 << "\n";
    cout << 7 * 5 << "\n";
    cout << 2 + 3 * 4 << "\n";
    cout << (2 + 3) * 4 << "\n";
    return 0;
}
```

This program prints 12, 2, 35, 14 and 20. A computation such as `2 + 3 * 4` is called an **expression**; the symbols `+`, `-` and `*` (multiplication) are **operators**. The computer **evaluates** the expression, that is, computes its value, then uses it. The priority rules are those of mathematics: multiplication comes before addition, so `2 + 3 * 4` is 2 + 12 = 14. Parentheses impose another order: `(2 + 3) * 4` is 5 × 4 = 20.

Do not confuse `print(7 + 5)`, which prints `12`, with `print("7 + 5")`, which prints the text `7 + 5` as is: between quotes, nothing is computed.

An expression can contain the loop variable. For instance, `print(i * i)` in a loop `for i in range(1, 6)` prints the squares 1, 4, 9, 16 and 25: at each iteration, the expression is evaluated with the current value of `i`.

## Integer division and remainder

On integers, division comes in two pieces. You write it as in primary school: 17 divided by 5 gives 3, remainder 2, because 17 = 5 × 3 + 2. The number 3 is the **quotient** of the **integer division**, the number 2 is the **remainder**.

```python
print(17 // 5)
print(17 % 5)
print(20 % 5)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 17 / 5 << "\n";
    cout << 17 % 5 << "\n";
    cout << 20 % 5 << "\n";
    return 0;
}
```

This program prints 3, 2 and 0. In Python, the quotient is written `//` (two slashes); in C++, it is written `/`, and the result is an integer as soon as both numbers are integers. In both languages, the remainder is written `%` (read "modulo"). For a positive number, the remainder of the division by `b` is always between 0 and b − 1, and it is 0 exactly when the number is a multiple of `b`.

The quotient and the remainder have the same priority as multiplication: they come before `+` and `-`. When several of these operators follow one another, the expression is evaluated **from left to right**. So `2026 // 10 % 10` is computed as `(2026 // 10) % 10`, that is 202 % 10 = 2, and `7 * 9 // 5` as `(7 * 9) // 5` = 63 // 5 = 12, whereas `7 * (9 // 5)` is 7 × 1 = 7. When in doubt, add parentheses.

In this chapter, the quotient and the remainder are only used with positive numbers. With negative numbers, Python and C++ do not always give the same result (`-7 // 2` is −4 in Python, `-7 / 2` is −3 in C++); they only agree when the division is exact.

These two operations are used all the time:

- `n % 10` gives the last digit of `n`, and `n // 10` removes that last digit: with n = 2026, you get 6 and 202;
- a duration of 135 minutes is `135 // 60` = 2 hours and `135 % 60` = 15 minutes;
- `n % 2` is 0 if `n` is even and 1 if it is odd.

In Python, the operator `/` (a single slash) also exists, but it gives a decimal number: `17 / 5` is `3.4`, and even `10 / 2` is `5.0`. In this chapter, only `//` is used in Python.

## Variables

A **variable** is a slot in the computer's memory, designated by a name, that contains a value. You store a value in a variable with the `=` sign: this is an **assignment**.

```python
largeur = 7
hauteur = 4
print(largeur * hauteur)
print(largeur, hauteur)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int largeur = 7;
    int hauteur = 4;
    cout << largeur * hauteur << "\n";
    cout << largeur << " " << hauteur << "\n";
    return 0;
}
```

This program prints `28`, then `7 4`. The line `largeur = 7` reads "largeur receives 7". Afterwards, wherever the name `largeur` appears in an expression, it is replaced with the value stored in the variable. You print the content of a variable by writing its name without quotes: `print(largeur)` prints `7`, whereas `print("largeur")` prints the word `largeur`.

In C++, a variable must be **declared** before it is used: write its **type** in front of its name, the first time. The type `int` means an integer. Afterwards, use the variable without repeating the type.

A variable name is made of letters, digits and the character `_`, with no space, no accent and not starting with a digit: `somme`, `nb_coins`, `x2` are fine. Case matters: `Somme` and `somme` are two different variables. Choose names that describe the content; it makes the program much easier to reread.

## Changing a variable

A variable can change its value during the program: a new assignment replaces the old value, which is lost.

```python
x = 5
print(x)
x = 8
print(x)
x = x + 1
print(x)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    cout << x << "\n";
    x = 8;
    cout << x << "\n";
    x = x + 1;
    cout << x << "\n";
    return 0;
}
```

This program prints 5, 8 then 9. The line `x = x + 1` is not an equation (which would always be false): the `=` sign is not an equality, it is an order. The computer runs an assignment in two steps:

1. it evaluates the expression to the right of `=`, with the **current** values of the variables: `x + 1` is 8 + 1 = 9;
2. it stores the result in the variable on the left: `x` is now 9.

Increasing a variable by 1 is called **incrementing** it. It is so frequent that there are short forms: `x += 1` in Python and C++, or `x++` in C++. Likewise, `x -= 3` decreases `x` by 3 and `x *= 2` doubles `x`. You recognise the update `i++` or `i += 10` of C++ `for` loops: the loop variable is a variable like any other.

To understand a program that changes variables, make an **execution trace**: a table giving, after each instruction, the value of each variable. It is the most useful tool to find a mistake.

## Accumulating in a loop

Back to the introduction program. The variable `somme` acts as an **accumulator**: it starts at 0, and at each iteration, the value of `i` is added to it. Here is the trace for a shorter loop, `for i in range(1, 5)`:

| moment | i | somme |
| --- | --- | --- |
| before the loop | – | 0 |
| after iteration 1 | 1 | 1 |
| after iteration 2 | 2 | 3 |
| after iteration 3 | 3 | 6 |
| after iteration 4 | 4 | 10 |

After the loop, `somme` is 10 = 1 + 2 + 3 + 4. The pattern is always the same:

1. **initialise** the accumulator before the loop, with the value that fits an empty total (0 for a sum);
2. update it in the body of the loop;
3. use it after the loop.

For a product, initialise to 1 and not 0, otherwise the result would always stay 0:

```python
produit = 1
for i in range(1, 6):
    produit = produit * i
print(produit)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int produit = 1;
    for (int i = 1; i <= 5; i++) {
        produit = produit * i;
    }
    cout << produit << "\n";
    return 0;
}
```

This program prints 120 = 1 × 2 × 3 × 4 × 5.

A variable updated at each iteration is not necessarily a total. It can follow a quantity that evolves: a population that doubles, an account that earns interest, a clock that moves forward. In that case, you often print the value at each iteration, and the order of the instructions in the body matters: printing then updating gives the starting value first, updating then printing first gives the value after one iteration.

## Updating several variables

When two variables must change at the same time, pay attention to the order of the assignments. For instance, to **swap** the values of `a` and `b`, the following code is wrong:

```python
a = 3
b = 9
a = b
b = a
print(a, b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 3;
    int b = 9;
    a = b;
    b = a;
    cout << a << " " << b << "\n";
    return 0;
}
```

It prints `9 9`: after `a = b`, the old value of `a` is lost, and `b = a` copies 9. The solution is to save the old value in a **temporary variable**:

```python
a = 3
b = 9
t = a
a = b
b = t
print(a, b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 3;
    int b = 9;
    int t = a;
    a = b;
    b = t;
    cout << a << " " << b << "\n";
    return 0;
}
```

This program correctly prints `9 3`. The same idea applies whenever a new value is computed from several old values: first compute everything that depends on the old values, then do the assignments.

## The size of integers in C++

In Python, an integer can be as large as you want. In C++, a variable of type `int` can only hold values between about −2.1 × 10⁹ and 2.1 × 10⁹ (exactly 2,147,483,647 at most). If a computation exceeds this limit, an **overflow** happens: the result is wrong, without any error message. For instance, `int x = 100000; cout << x * x;` does not print 10,000,000,000 but an absurd number.

For large values, use the type `long long`, which goes up to about 9.2 × 10¹⁸: `long long x = 100000;` then `x * x` correctly gives 10000000000. As soon as a result can exceed two billion, declare the variables as `long long`.

## Common mistakes

**Using a variable before giving it a value.** If `total = total + i` appears without `total` having been initialised:

```
NameError: name 'total' is not defined
```

In C++, an undeclared variable causes `error: 'total' was not declared in this scope`. More treacherous: a variable declared without a value (`int total;`) contains an arbitrary value, and the result is wrong without any message. Always write `int total = 0;`.

**Initialising the accumulator inside the loop.** If `somme = 0` is indented in the body, the sum is reset to zero at each iteration, and at the end you only get the last term. Initialisation goes **before** the loop.

**Printing inside the loop instead of after.** If `print(somme)` is indented, the program prints every intermediate sum instead of the final result only. For each line, ask yourself whether it must run at each iteration or only once.

**A typo in a name.** In Python, `somme = some + i` causes an error, but `some = somme + i` silently creates a new variable `some`, and `somme` never changes. If a result stays stuck at its initial value, check the spelling of the names.

**Using `/` in Python.** `print(7 / 2)` prints `3.5`, and `print(8 / 2)` prints `4.0`: the answer is no longer an integer and the judge rejects it. For an integer quotient, write `//`.

**Forgetting overflow in C++.** A C++ program that prints a negative number where a large positive number is expected has almost always overflowed. The fix is to switch the variables involved to `long long`.

## A complete example

**Statement.** The n-th **triangular number** is the number of marbles needed to form a triangle of n rows, with 1 marble on the first row, 2 on the second one, and so on up to n marbles on the last one. Print the first 10 triangular numbers, one per line, each preceded by its rank.

**Idea.** The n-th triangular number is 1 + 2 + … + n. You could recompute this sum for each n, but it is useless: going from a triangle of n − 1 rows to a triangle of n rows, you simply add a row of n marbles. So keep an accumulator `billes` (marbles), initialised to 0 (the empty triangle), and at each iteration, for n going from 1 to 10, add n to it and then print it. Here, printing happens inside the loop, because we want all the intermediate values.

**Program.**

```python
billes = 0
for n in range(1, 11):
    # Add row number n, which contains n marbles.
    billes = billes + n
    print(n, billes)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int billes = 0;
    for (int n = 1; n <= 10; n++) {
        // Add row number n, which contains n marbles.
        billes = billes + n;
        cout << n << " " << billes << "\n";
    }
    return 0;
}
```

**Checking by hand.** Trace the first iterations. At iteration 1, `billes` goes from 0 to 1, and the program prints `1 1`. At iteration 2, `billes` goes from 1 to 3: `2 3`. At iteration 3, from 3 to 6: `3 6`. At iteration 4, from 6 to 10: `4 10`. These are indeed 1, 1 + 2, 1 + 2 + 3 and 1 + 2 + 3 + 4. For the last iteration, check with the well-known formula n × (n + 1) / 2, which gives 10 × 11 / 2 = 55: the last printed line must be `10 55`. If printing and updating had been swapped, the first line would be `1 0`, which is wrong.

## Key takeaways

- The operators on integers are `+`, `-`, `*`, the quotient `//` (Python) or `/` (C++), and the remainder `%`. Multiplication comes before addition; parentheses impose an order.
- A **variable** stores a value under a name. `x = expression` first evaluates the expression with the current values, then stores the result in `x`. In C++, declare the variable with its type (`int`, `long long`).
- `x = x + 1` updates a variable from its old value; for several linked variables, go through a temporary variable.
- An **accumulator** is initialised before the loop (0 for a sum, 1 for a product), updated in the loop, and used after it.
- In C++, an `int` does not exceed about 2 × 10⁹: beyond that, use `long long`.
- When in doubt, make an execution trace: the value of each variable after each instruction.
