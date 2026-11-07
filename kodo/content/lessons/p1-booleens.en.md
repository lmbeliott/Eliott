In the previous chapter, each decision relied on a single comparison. But many questions combine several. A temperature is pleasant if it is at least 15 degrees **and** at most 25 degrees. A day is off if it is a Saturday **or** a Sunday. A square of a board is free if it is **not** occupied.

These tests could be written with nested `if`s, but the program would quickly become long and hard to read. This chapter introduces **booleans**, the values true and false, and the three operators that combine them: `and`, `or` and `not`. It also shows how to keep a true/false answer in a variable while reading a sequence of values.

## Booleans

A comparison such as `x < 5` has a value, like a computation. This value is not a number: it is either **true** or **false**. A value that can only be true or false is called a **boolean**. In Python, these two values are written `True` and `False`, with a capital letter. In C++, they are written `true` and `false`, and the type of boolean variables is `bool`.

So you can store the result of a comparison in a variable, then use it later as a condition:

```python
n = int(input())
is_even = n % 2 == 0
print(is_even)
if is_even:
    print("PAIR")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool is_even = n % 2 == 0;
    cout << is_even << "\n";
    if (is_even) {
        cout << "PAIR\n";
    }
    return 0;
}
```

With the input `8`, the comparison `n % 2 == 0` is true: the variable `is_even` is `True`. The Python program prints `True` then `PAIR`. The C++ program prints `1` then `PAIR`, because `cout` writes a boolean as `1` (true) or `0` (false). With the input `7`, it only prints `False` (or `0` in C++).

Notice that we write `if is_even:` and not `if is_even == True:`. Both work, but the first form is simpler: the condition of an `if` is already a boolean. A well-chosen variable name, such as `is_even` or `already_seen`, makes the condition read like a sentence.

In the exercises, you almost never print `True` or `False` directly: the expected output is usually a word such as `OUI` or `NON`. You then use the boolean in an `if`.

## "And": `and`

The `and` operator combines two conditions. The result is true only if **both** conditions are true. In C++, it is written `&&`. The following table, called a **truth table**, lists all the possibilities:

| `a` | `b` | `a and b` |
| --- | --- | --- |
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

The most common use is to test that a number lies in an **interval**, that is, between two bounds:

```python
t = int(input())
if t >= 15 and t <= 25:
    print("AGREABLE")
else:
    print("NON")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    if (t >= 15 && t <= 25) {
        cout << "AGREABLE\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

With `20`, both comparisons are true: the program prints `AGREABLE` (pleasant). With `30`, the first is true but not the second: it prints `NON`. With `15`, the first is true (15 ≥ 15) and so is the second: `AGREABLE`, because the bounds are included.

Python also accepts the shortcut `15 <= t <= 25`, which means the same thing. This shortcut does not exist in C++, as the common mistakes will show.

## "Or": `or`

The `or` operator is true if **at least one** of the two conditions is true. It is false only if both are false. In C++, it is written `||` (two vertical bars).

| `a` | `b` | `a or b` |
| --- | --- | --- |
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

The "or" of programming is **inclusive**: when both conditions are true, the result is true. It is not the "or" of a set menu, "cheese or dessert", which forbids taking both.

```python
day = int(input())
if day == 6 or day == 7:
    print("WEEK-END")
else:
    print("SEMAINE")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int day;
    cin >> day;
    if (day == 6 || day == 7) {
        cout << "WEEK-END\n";
    } else {
        cout << "SEMAINE\n";
    }
    return 0;
}
```

Days are numbered from 1 (Monday) to 7 (Sunday). With `6`, the first comparison is true: `WEEK-END`. With `7`, the second one is: `WEEK-END` as well. With `3`, both are false: `SEMAINE` (weekday).

## "Not": `not`

The `not` operator applies to a single condition and gives its opposite: `not a` is true when `a` is false, and false when `a` is true. In C++, it is written `!`, placed in front of the condition.

```python
n = int(input())
multiple_of_3 = n % 3 == 0
if not multiple_of_3:
    print("RESTE", n % 3)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool multiple_of_3 = n % 3 == 0;
    if (!multiple_of_3) {
        cout << "RESTE " << n % 3 << "\n";
    }
    return 0;
}
```

With `10`, the variable `multiple_of_3` is false, so `not multiple_of_3` is true: the program prints `RESTE 1` (remainder 1). With `9`, it prints nothing.

On a comparison, `not` is rarely useful, because there is always an opposite comparison: `not (x < 5)` is more simply written `x >= 5`, and `not (a == b)` is written `a != b`. It is mostly used in front of a boolean variable.

## Combining several operators

You can combine as many conditions as you want. As with `*` and `+` in arithmetic, there are **priorities**: `not` applies first, then `and`, then `or`. So `a or b and c` reads `a or (b and c)`. To avoid any doubt, use **parentheses** as soon as you mix `and` and `or`.

The classic example is the leap year rule: a year is a leap year if it is divisible by 4 but not by 100, or if it is divisible by 400.

```python
a = int(input())
leap = (a % 4 == 0 and a % 100 != 0) or a % 400 == 0
if leap:
    print("OUI")
else:
    print("NON")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a;
    cin >> a;
    bool leap = (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
    if (leap) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

For 2024, the parenthesis is true (divisible by 4, not by 100): `OUI`. For 1900, the parenthesis is false (divisible by 100) and 1900 is not divisible by 400: `NON`. For 2000, the parenthesis is false, but the second part is true: `OUI`. A single line replaces the chain of four cases from the previous chapter.

Two rules, called **De Morgan's laws**, turn the negation of a combination into something else:
- `not (a and b)` is equivalent to `(not a) or (not b)`;
- `not (a or b)` is equivalent to `(not a) and (not b)`.

For example, "`t` is not between 15 and 25", that is, `not (t >= 15 and t <= 25)`, can also be written `t < 15 or t > 25`. The `and` becomes an `or` when the negation moves inside.

Finally, Python and C++ evaluate a combination from left to right and stop as soon as the result is known: this is **short-circuit evaluation**. In `a and b`, if `a` is false, `b` is not even computed, since the result will be false anyway. This is useful as a protection: `d != 0 and n % d == 0` never computes `n % 0`, which would cause an error.

## Flags and counters

A boolean variable can be used as a **flag**: it remembers a piece of information while a sequence of values is read. To check that **all** values have a property, start from `True`, and set the flag to `False` as soon as a value does not have it. Once lowered, the flag is never raised again. To check that **at least one** value has the property, do the opposite: start from `False` and switch to `True` as soon as a value satisfies it.

To know **how many** values have a property, use a **counter**: it starts at 0, and is increased by 1 for each value that satisfies the condition. The condition can be as complex as needed.

```python
n = int(input())
all_positive = True
in_range = 0
for i in range(n):
    x = int(input())
    if x < 0:
        all_positive = False
    if x >= 10 and x <= 20:
        in_range = in_range + 1
if all_positive:
    print("OUI")
else:
    print("NON")
print(in_range)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool all_positive = true;
    int in_range = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x < 0) {
            all_positive = false;
        }
        if (x >= 10 && x <= 20) {
            in_range = in_range + 1;
        }
    }
    if (all_positive) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    cout << in_range << "\n";
    return 0;
}
```

With `N = 4` and the values `12`, `-3`, `20`, `7`: the flag is lowered at the second value, and two values (12 and 20) are between 10 and 20. The program prints `NON` then `2`.

## Common mistakes

**Writing `x == 1 or 2`.** You want to test whether `x` is 1 or 2. But Python reads `(x == 1) or 2`, and the number `2`, used as a condition, counts as true (any non-zero number is considered true). So the condition is **always** true, with no error message. You must repeat the comparison: `x == 1 or x == 2`. In C++, `x == 1 || 2` has exactly the same problem.

**Chaining comparisons in C++.** In C++, `15 <= t <= 25` is accepted by the compiler, but does not do what you think. It first computes `15 <= t`, which is `0` or `1`, then compares that `0` or `1` with 25: the result is always true. With `t = 100`, the program prints `AGREABLE`. You must write `t >= 15 && t <= 25`.

**Leaving out part of the comparison.** `if x > 5 and < 10:` is rejected by Python with `SyntaxError: invalid syntax`. Each side of an `and` must be a complete condition: `x > 5 and x < 10`.

**Negating a combination wrongly.** The negation of "`t` between 15 and 25" is not `t < 15 and t > 25`, which is always false (no number is both smaller than 15 and larger than 25). According to De Morgan's laws, it is `t < 15 or t > 25`.

**Raising the flag in the wrong place.** If you write `all_positive = True` inside the loop, the flag is reset to true at every iteration, and only the last value counts. The initialisation goes **before** the loop. Likewise, do not write `else: all_positive = True`: a positive value must not erase a negative value seen earlier.

**Printing the boolean instead of the expected word.** `print(x > 0)` prints `True` or `False` in Python, and `1` or `0` in C++. If the statement expects `OUI` or `NON`, the output is wrong: go through an `if`.

## A complete example

**Statement.** Read `N` integers, one per line. Print `OUI` if the sequence is strictly increasing (each value is strictly larger than the previous one), `NON` otherwise. Then print, on a second line, the number of values that are even and (strictly) positive.

**Idea.** For the increase, compare each value with the previous one, kept in a variable. A single pair of values in the wrong order is enough for the answer to be `NON`: this is a job for a flag. Start from `increasing = True`, and set it to `False` as soon as a value is not larger than the previous one. For the second question, a counter with an `and` condition. Careful: the first value must be counted too, since it is read before the loop.

**Program.**

```python
n = int(input())
previous = int(input())
increasing = True
count = 0
if previous % 2 == 0 and previous > 0:
    count = 1
for i in range(n - 1):
    x = int(input())
    if x <= previous:
        increasing = False
    if x % 2 == 0 and x > 0:
        count = count + 1
    previous = x
if increasing:
    print("OUI")
else:
    print("NON")
print(count)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, previous;
    cin >> n >> previous;
    bool increasing = true;
    int count = 0;
    if (previous % 2 == 0 && previous > 0) {
        count = 1;
    }
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x <= previous) {
            increasing = false;
        }
        if (x % 2 == 0 && x > 0) {
            count = count + 1;
        }
        previous = x;
    }
    if (increasing) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    cout << count << "\n";
    return 0;
}
```

**Checking by hand.** With `N = 5` and the values `-4`, `2`, `6`, `6`, `9`. The first value, `-4`, is even but not positive: the counter stays at 0. Then `2 > -4`, the flag does not move, and 2 is even and positive: counter at 1. Next `6 > 2`, and 6 is counted: counter at 2. Then `6 <= 6`: the sequence is not strictly increasing, the flag becomes false; this 6 is counted: counter at 3. Finally `9 > 6`, but the flag stays down; 9 is odd. The program prints `NON` then `3`.

The test `x <= previous` is the exact negation of "`x` is strictly larger than `previous`". Writing `x < previous` would be a mistake: two equal values must not be accepted. With `N = 1`, the loop runs zero times and the program answers `OUI`: a sequence of a single value is indeed strictly increasing.

## Key takeaways

- A boolean is true or false (`True`/`False` in Python, `true`/`false` in C++). A comparison is a boolean, which can be stored in a variable.
- `and` (`&&`) is true if both conditions are true; `or` (`||`) if at least one is; `not` (`!`) gives the opposite.
- Use parentheses as soon as you mix `and` and `or`. To negate a combination, `and` and `or` swap (De Morgan's laws).
- Each side of an `and` or an `or` is a complete comparison: `x == 1 or x == 2`, and in C++ `a <= x && x <= b`.
- A flag initialised before the loop checks "all values" or "at least one value"; a counter tells how many values satisfy a condition.
