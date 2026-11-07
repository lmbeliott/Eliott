So far, every computation used integers. Yet many simple questions lead to numbers that do not divide evenly. Seven people share €100: each one gets €14.285714… The average of three marks, 12, 15 and 14, is 13.666… And 250 people boarding 60-seat coaches need 5 coaches, not 4.17.

These three examples need three different treatments. In the first one, you want an amount printed with two decimals. In the second, an approximate value. In the third, an **integer**, obtained by rounding up. This chapter introduces decimal numbers, how to print them and how to round them, but also their weakness: they are **approximate**. You will see that a good program often avoids them and reasons with integers, which are always exact.

## Decimal numbers

A **floating-point number** (often just called a **float**) is a number that can have a fractional part. In Python, its type is called `float`. It is written with a dot: `3.5`, `-0.25`, `100.0`. The operator `/` (a single slash) is **true division**: its result is always a float, even when the division is exact.

```python
print(7 / 2)
print(10 / 2)
print(10 // 2)
x = 1.5
print(x * 4)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 7.0 / 2 << "\n";
    cout << 10.0 / 2 << "\n";
    cout << 10 / 2 << "\n";
    double x = 1.5;
    cout << x * 4 << "\n";
    return 0;
}
```

The Python program prints `3.5`, `5.0`, `5` and `6.0`. The dot in `5.0` shows that `10 / 2` is a float, whereas `10 // 2` is an integer. As soon as a computation mixes an integer and a float, the result is a float: `1.5 * 4` is `6.0`.

In C++, the type of decimal numbers is called `double`. Be careful: the C++ operator `/` depends on the type of its two operands. If both are integers, it is **integer** division, like Python's `//`. `7 / 2` is `3`, not `3.5`. To get a decimal division, at least one of the two numbers must be a `double`: write `7.0 / 2`, or, with integer variables `a` and `b`, `(double) a / b`. This `(double)` is a **conversion**: it turns the integer value of `a` into a float before the division. Finally, `cout` prints `5` for the float `5.0`: in C++, the output does not show the difference between an integer and a float. Worse, `cout` shows only 6 significant digits of a `double`: `cout << 13.0 / 3` prints `4.33333`, and `cout << 1234567.0` prints `1.23457e+06`. To print a float, you therefore fix the number of decimals with `printf` (see below), or convert it to an integer first.

To read a decimal number, replace `int` with `float` in Python: `x = float(input())`. In C++, just declare the variable as `double` before `cin >> x`.

Two tools often go with floats. The **power** is written `**` in Python: `2 ** 10` is `1024`. Between two integers, with an exponent that is zero or positive, the result is an exact integer, however large: `2 ** 100` is `1267650600228229401496703205376`. With a decimal exponent, the result is a float: `x ** 0.5` gives the **square root** of `x`, and `9 ** 0.5` is `3.0`. In C++, include `<cmath>` and write `pow(2, 10)` and `sqrt(x)`. These two functions always return a `double`, hence an approximate value as soon as the result is large: `(long long) pow(3, 39)` gives 4052555153018976256 instead of 4052555153018976267. For an exact integer power in C++, multiply in a loop, with a `long long`. The **absolute value**, which removes the sign of a number, is `abs(x)` in both languages (in C++, with `<cmath>`): `abs(-3.5)` is `3.5` and `abs(-7)` is `7`.

## Back to an integer: truncate or round

To turn a float into an integer, there are several ways, which do not give the same result.

`int(x)` **truncates**: it removes the fractional part, without rounding. `int(3.7)` is `3`, and `int(-3.7)` is `-3`. Truncation always goes towards zero. In C++, the conversion `(int) x` or `(long long) x` does exactly the same.

`round(x)` **rounds** to the nearest integer: `round(3.7)` is `4` and `round(3.2)` is `3`. The case of an **exact half**, such as 2.5, is tricky. Python rounds it to the nearest **even** integer: `round(2.5)` is `2` and `round(3.5)` is `4`. C++'s `round` (in `<cmath>`) rounds halves away from zero: `round(2.5)` is `3`. So the two languages disagree on this case.

Finally, the **floor** gives the largest integer less than or equal to the number, and the **ceiling** the smallest integer greater than or equal to it. For 3.2, they are 3 and 4; for −3.2, they are −4 and −3. Python provides them as `math.floor(x)` and `math.ceil(x)`, after writing `import math` at the top of the program; C++ as `floor(x)` and `ceil(x)` from `<cmath>`.

```python
import math
x = -3.2
print(int(x), round(x), math.floor(x), math.ceil(x))
```

```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double x = -3.2;
    cout << (int) x << " " << round(x) << " " << floor(x) << " " << ceil(x) << "\n";
    return 0;
}
```

Both programs print `-3 -3 -4 -3`. For a positive number, truncation and floor are the same; for a negative number, they differ.

## Rounding without leaving integers

When you divide two integers and want a rounded integer result, it is better not to go through floats. Everything can be done with `//`, for integers `a ≥ 0` and `b > 0`:

- the **floor** of a/b is simply `a // b` (in C++, `a / b`);
- the **ceiling** of a/b is `(a + b - 1) // b`;
- rounding **to the nearest**, an exact half being rounded up, is `(2 * a + b) // (2 * b)`.

The ceiling formula works as follows. If `a` is a multiple of `b`, adding `b − 1` is not enough to reach the next multiple, and the quotient does not change. Otherwise, the remainder of `a` by `b` is at least 1, and adding `b − 1` crosses exactly the next multiple: the quotient grows by 1. For rounding to the nearest, add one half before taking the floor: a/b + 1/2 = (2a + b)/(2b).

```python
a = 250
b = 60
print(a // b, (a + b - 1) // b, (2 * a + b) // (2 * b))
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long a = 250, b = 60;
    cout << a / b << " " << (a + b - 1) / b << " " << (2 * a + b) / (2 * b) << "\n";
    return 0;
}
```

The program prints `4 5 4`. Indeed, 250/60 ≈ 4.17: you fill 4 full coaches, you need 5 for everybody, and the nearest integer is 4. With `a = 240`, it prints `4 4 4`, because the division is exact.

Why not simply write `math.ceil(a / b)`? Because a float only keeps about 16 significant digits. Beyond 2⁵³, about 9 × 10¹⁵, not every integer can be represented. For instance, `int((10**17 + 1) / 1)` is `100000000000000000`: the `+ 1` has been lost. With integers up to 10¹⁸, very common in exercises, only the integer formulas are guaranteed to give the right answer.

The square root has the same flaw. For N = 10¹⁸ − 1, `int(N ** 0.5)` (in C++, `(long long) sqrt(N)`) is `1000000000`, whereas 10⁹ × 10⁹ = 10¹⁸ exceeds N: the largest integer whose square does not exceed N is 999,999,999. When N became a float, it was rounded to 10¹⁸. The approximate value is still a good starting point, provided you **check** it, then correct it, with integer computations such as `r * r <= n`, which are exact.

## Printing an exact number of decimals

`print(13 / 3)` prints `4.333333333333333`. Most often, a statement asks for a fixed number of decimals, for example two. In Python, you use an **f-string**: a string preceded by the letter `f`, in which an expression between braces is replaced by its value. After the value, `:.2f` asks for exactly two digits after the dot, rounded to the nearest.

```python
x = 13 / 3
print(f"{x:.2f}")
print(f"{2:.2f}")
print(f"Moyenne : {x:.1f}")
```

```cpp
#include <cstdio>
using namespace std;

int main() {
    double x = 13.0 / 3;
    printf("%.2f\n", x);
    printf("%.2f\n", 2.0);
    printf("Moyenne : %.1f\n", x);
    return 0;
}
```

Both programs print `4.33`, `2.00` and `Moyenne : 4.3`. The format pads with zeros when needed: `2.00` does have two decimals. In C++, the `printf` function from `<cstdio>` uses the same notation: `%.2f` is replaced by the number that follows, with two decimals. It must be given a `double`: `printf("%.2f", 2)` with an integer prints garbage. Another way, with `cout`, is `cout << fixed << setprecision(2) << x`, including `<iomanip>`.

Do not confuse this format with `round(x, 2)`. `round(3.104, 2)` is the float `3.1`, and `print` shows it as `3.1`, with a single decimal. Only the format guarantees the number of digits printed.

## Precision traps

A computer stores floats in base 2. But many simple base-10 numbers, such as 0.1, have an infinite expansion in base 2, exactly like 1/3 = 0.333… in base 10. So the computer keeps an **approximate** value, very close but not equal.

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

```cpp
#include <cstdio>
using namespace std;

int main() {
    printf("%.17f\n", 0.1 + 0.2);
    printf("%d\n", 0.1 + 0.2 == 0.3);
    return 0;
}
```

Python prints `0.30000000000000004` then `False`. C++ prints `0.30000000000000004` then `0` (false). The error is tiny, but the equality test `==` fails. C++'s `cout` often hides these errors, because it shows only 6 digits by default: it would print `0.3`. The error is still there.

Three rules follow.

1. **Never test two floats for equality with `==`.** If you really must compare them, check that they are very close: `abs(a - b) < 1e-9`, where `1e-9` means 10⁻⁹. This value is called a **tolerance**.
2. **Exact halves are traps.** The number 2.675 is stored as 2.67499999…, so `f"{2.675:.2f}"` gives `2.67`, not `2.68`. This is why serious statements avoid these cases, or impose a rounding rule that you then program with integers.
3. **Work with integers whenever possible.** A price of €19.99 is stored in cents: 1,999. A duration of 2.5 hours becomes 150 minutes. Additions and comparisons are then exact. You convert to euros or hours only when printing.

## Division and remainder of negative numbers

In level 1, `//` and `%` were only used with positive numbers. With negative numbers, Python and C++ do not give the same result.

- In Python, `a // b` is the **floor** of a/b: `-7 // 2` is `-4`, because −3.5 is rounded down. The remainder `a % b` then has the sign of `b`: `-7 % 2` is `1`. For `b > 0`, the remainder is always between 0 and b − 1.
- In C++, `a / b` **truncates** towards zero: `-7 / 2` is `-3`. The remainder has the sign of `a`: `-7 % 2` is `-1`.

In both languages, the relation a = b × q + r still holds: −7 = 2 × (−4) + 1 in Python, and −7 = 2 × (−3) + (−1) in C++. The two languages agree when `a` is positive or when the division is exact.

Python's version is often the most convenient. A clock showing 10 o'clock that goes back 13 hours shows `(10 - 13) % 24`, that is 21 in Python, but −3 in C++. To get in C++ a remainder always between 0 and b − 1 (with `b > 0`), write `((a % b) + b) % b`. The first `%` gives a remainder between −(b − 1) and b − 1, adding `b` makes it positive, and the second `%` brings it back below `b`.

```python
h = 10
d = -13
print((h + d) % 24)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int h = 10, d = -13;
    cout << ((h + d) % 24 + 24) % 24 << "\n";
    return 0;
}
```

Both programs print `21`. Likewise, to get in C++ the floor of a division by `b > 0` when `a` may be negative, correct the quotient: compute `q = a / b`, then subtract 1 from `q` if `a % b` is negative.

One consequence traps beginners in C++: the test `x % 2 == 1` is false for a negative odd integer, since `-7 % 2` is `-1`. To test whether a number is odd, write `x % 2 != 0`, which works in both languages.

## Common mistakes

**Dividing by zero.** `print(5 / 0)` stops Python with `ZeroDivisionError: division by zero`; so do `5 // 0` and `5 % 0`. In C++, an integer division by zero stops the program abruptly (often with the message `Floating point exception`). Make sure, with an `if`, that the divisor is not zero.

**Forgetting the conversion in C++.** With `int s = 41, n = 3;`, the instruction `double m = s / n;` stores `13` in `m`: the division is an integer one, and the conversion to `double` comes too late. Write `double m = (double) s / n;`, which gives 13.666…

**Giving a float to `range`.** `range(n / 2)` causes `TypeError: 'float' object cannot be interpreted as an integer`, because `n / 2` is a float even when `n` is even. Write `range(n // 2)`.

**Reading a decimal number with `int`.** If the line contains `3.5`, `int(input())` causes `ValueError: invalid literal for int() with base 10: '3.5'`. Use `float(input())`.

**Comparing with `==`.** A program that tests `if x == 0.3:` after computations on floats may never enter the `if`. Compare with a tolerance, or work with integers.

## A complete example

**Statement.** A trip is `D` metres long and is travelled at `V` metres per minute. Print its duration in minutes, rounded up to the next minute, then the same duration in hours and minutes, on a second line. We have 1 ≤ D ≤ 10¹⁸ and 1 ≤ V ≤ 10⁹.

**Idea.** The exact duration is D/V minutes. We want its ceiling, and the numbers are too large for a float: use the integer formula `(D + V - 1) // V`. Then split the minutes into hours and minutes with `//` and `%`, as in level 1. In C++, `D + V - 1` can reach about 10¹⁸, which fits in a `long long`.

**Program.**

```python
d, v = map(int, input().split())
minutes = (d + v - 1) // v      # ceiling of d / v
print(minutes)
print(minutes // 60, minutes % 60)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long d, v;
    cin >> d >> v;
    long long minutes = (d + v - 1) / v;   // ceiling of d / v
    cout << minutes << "\n";
    cout << minutes / 60 << " " << minutes % 60 << "\n";
    return 0;
}
```

**Checking by hand.** With `D = 7000` and `V = 75`, the exact duration is 93.33… minutes, so we expect 94. The program computes 7,074 // 75. Since 75 × 94 = 7,050 ≤ 7,074 < 7,125 = 75 × 95, the quotient is 94. Then 94 // 60 = 1 and 94 % 60 = 34: the program prints `94`, then `1 34`. With `D = 7500`, the division is exact (100 minutes): 7,574 // 75 = 100, because 75 × 101 = 7,575 exceeds 7,574. The program prints `100`, then `1 40`, without wrongly rounding up to 101.

## Key takeaways

- `/` gives a float in Python; in C++, `/` between two integers is integer division, and you must write `(double) a / b` for a decimal division.
- `int(x)` truncates towards zero, `round(x)` rounds to the nearest (exact halves differ between languages), `floor` and `ceil` round down and up.
- For `a ≥ 0` and `b > 0`: ceiling `(a + b - 1) // b`, nearest `(2 * a + b) // (2 * b)`. These integer formulas are exact, even for very large numbers.
- To print exactly k decimals: `f"{x:.2f}"` in Python, `printf("%.2f\n", x)` in C++.
- Floats are approximate, and so are `pow` and `sqrt`: no `==` between floats, and prefer counting in integers (cents, minutes), or check an approximate result with integers.
- With negative numbers, Python's `//` and `%` round down, C++'s `/` and `%` round towards zero; in C++, `((a % b) + b) % b` gives a remainder between 0 and b − 1.
