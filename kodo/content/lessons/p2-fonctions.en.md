Several exercises of the previous chapters asked you to test whether a number is prime. The test takes a few lines: try the divisors one by one. But if a program must run this test in three places, on three different numbers, you have to copy these lines three times, changing the variable names. The program gets longer, harder to read, and a mistake fixed in one place stays in the two others.

A **function** solves this problem: you write a computation once, give it a name, then use it as many times as you want. This chapter shows how to define a function, what happens when you use it, which variables it can see, how it works with lists, and above all how to use functions to split a problem into small pieces that are easy to check.

## Defining and calling a function

Here is a function that computes the sum of the digits of a positive integer, then two uses of it.

```python
def digit_sum(n):
    s = 0
    while n > 0:
        s = s + n % 10
        n = n // 10
    return s

print(digit_sum(2026))
print(digit_sum(7) + digit_sum(95))
```

```cpp
#include <iostream>
using namespace std;

int digit_sum(int n) {
    int s = 0;
    while (n > 0) {
        s = s + n % 10;
        n = n / 10;
    }
    return s;
}

int main() {
    cout << digit_sum(2026) << "\n";
    cout << digit_sum(7) + digit_sum(95) << "\n";
    return 0;
}
```

This program prints `10`, then `21`.

The line `def digit_sum(n):` is the **header** of the function: the keyword `def`, the chosen name, then, between parentheses, the **parameters**, that is the variables that will receive the data. The indented block below is the **body** of the function. Writing this definition runs nothing: it only tells Python what the name `digit_sum` means.

The computation happens during a **call**: `digit_sum(2026)`. The value between parentheses, called the **argument**, is put into the parameter `n`. The body runs with `n = 2026`. The instruction `return s` ends the function and sends back the value of `s`: this is the **return value**. In the expression that contained the call, the call is replaced by this value, as if you had written `print(10)`. On the second line there are two calls: the first one returns 7, the second one 9 + 5 = 14, and the sum is 21.

In C++, the header gives **types**: the type of the return value before the name (`int`), and the type of each parameter (`int n`). The function must be written **before** `main`, because the compiler reads the file from top to bottom and must know a function before its first call. By the way, `main` is itself a function, which returns an `int`: that is why it ends with `return 0`.

## Several parameters: the GCD

A function can have several parameters, separated by commas. The arguments are put into the parameters **in order**. The **greatest common divisor** of two integers, or **GCD**, is the largest integer that divides both. A first method relies on a simple remark: if `a > b`, every common divisor of `a` and `b` also divides `a - b`, and conversely. So the GCD of `a` and `b` is also the GCD of `a - b` and `b`. You subtract the smaller from the larger until both numbers are equal.

```python
def gcd(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a

print(gcd(12, 18))
```

```cpp
#include <iostream>
using namespace std;

int gcd(int a, int b) {
    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

int main() {
    cout << gcd(12, 18) << "\n";
    return 0;
}
```

The program prints `6`. The call puts 12 into `a` and 18 into `b`. The successive pairs are (12, 18), (12, 6), (6, 6): both numbers are equal, the GCD is 6. This method assumes `a ≥ 1` and `b ≥ 1`, and it can be slow: `gcd(1000000, 1)` needs a million subtractions.

**Euclid's algorithm** is much faster. Subtracting `b` from `a` as many times as possible amounts to replacing `a` with the remainder `a % b`. So you use the property: the GCD of `a` and `b` is the GCD of `b` and `a % b`, and the GCD of `a` and 0 is `a`.

```python
def gcd(a, b):
    while b != 0:
        r = a % b
        a = b
        b = r
    return a
```

```cpp
long long gcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
```

For `gcd(12, 18)`, the pairs are (12, 18), (18, 12), (12, 6), (6, 0), and the function returns 6. The number of turns stays very small: fewer than a hundred, even for numbers close to 10¹⁸.

## `return` stops the function

The instruction `return` ends the function **immediately**, even in the middle of a loop. This is very handy for a function that answers yes or no, called a **boolean function**: it returns `True` or `False`. You usually give it a name that reads like a question, for example `is_prime`.

```python
def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True

for n in range(1, 20):
    if is_prime(n):
        print(n, end=" ")
print()
```

```cpp
#include <iostream>
using namespace std;

bool is_prime(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    for (int n = 1; n < 20; n++) {
        if (is_prime(n)) {
            cout << n << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

The program prints `2 3 5 7 11 13 17 19`. As soon as a divisor is found, `return False` leaves the function: no need to go on. If the loop ends without finding anything, you reach `return True`. The loop stops when `d * d` exceeds `n`: if `n = d × e` with `d ≤ e`, then `d × d ≤ n`, so a number with no divisor up to its square root has no divisor at all. For `n` close to a billion, you make about 31,600 tries instead of a billion.

A boolean function is used directly as a condition: write `if is_prime(n):`, not `if is_prime(n) == True:`.

A function can also return nothing: it prints something or modifies a list. In C++, its return type is `void`. In Python, a function that ends without `return` returns a special value, `None`, which means "nothing".

## Local and global variables

A variable created in a function is **local**: it only exists during the call and is invisible elsewhere. Parameters are local variables too. A variable created outside any function is called **global**.

```python
def double(x):
    y = 2 * x
    return y

y = 5
print(double(10))
print(y)
```

```cpp
#include <iostream>
using namespace std;

int double_of(int x) {
    int y = 2 * x;
    return y;
}

int main() {
    int y = 5;
    cout << double_of(10) << "\n";
    cout << y << "\n";
    return 0;
}
```

The program prints `20`, then `5`. The `y` of the function and the `y` of the main program are two different variables with the same name; changing one does not touch the other. (In C++, `double` is a reserved word, hence the name `double_of`.)

In the same way, when the argument is a number, the parameter receives a **copy** of its value: this is called **pass by value**. In `digit_sum`, the parameter `n` ends at 0, but if you called `digit_sum(x)`, the variable `x` of the main program has not changed.

A Python function can **read** a global variable, but as soon as it **assigns** a value to it, Python considers it a local variable, in the whole function:

```python
counter = 0

def increment():
    counter = counter + 1

increment()
```

```cpp
// In C++, a global variable is declared outside any function
// and can be modified anywhere: this trap does not exist, but the advice
// below still holds.
int counter = 0;

void increment() {
    counter = counter + 1;
}
```

Python stops with `UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value` (older versions write `local variable 'counter' referenced before assignment`). The `counter` on the right is looked up in the function, where it has no value yet. Good practice, in both languages: give the function everything it needs through its **parameters**, and get the result back through its **`return`**: `counter = add_one(counter)`. A function that depends only on its parameters is easy to test and to reuse.

## Splitting a problem

A function can call another one. A program is then built as an assembly of small bricks. To count the prime **palindromes** (numbers that read the same both ways, like 131) between `a` and `b`, write one function to reverse a number, another one to recognise a palindrome, and reuse `is_prime`.

```python
# is_prime is the function written above.
def reverse_number(n):
    r = 0
    while n > 0:
        r = r * 10 + n % 10
        n = n // 10
    return r

def is_palindrome(n):
    return reverse_number(n) == n

def count_prime_palindromes(a, b):
    total = 0
    for n in range(a, b + 1):
        if is_palindrome(n) and is_prime(n):
            total = total + 1
    return total

print(count_prime_palindromes(1, 200))
```

```cpp
// is_prime is the function written above.
int reverse_number(int n) {
    int r = 0;
    while (n > 0) {
        r = r * 10 + n % 10;
        n = n / 10;
    }
    return r;
}

bool is_palindrome(int n) {
    return reverse_number(n) == n;
}

int count_prime_palindromes(int a, int b) {
    int total = 0;
    for (int n = a; n <= b; n++) {
        if (is_palindrome(n) && is_prime(n)) {
            total = total + 1;
        }
    }
    return total;
}
// in main: cout << count_prime_palindromes(1, 200) << "\n";
```

The program prints `10`: the numbers 2, 3, 5, 7, 11, 101, 131, 151, 181 and 191. The function `is_palindrome` directly returns the value of the comparison, which is already a boolean.

Each brick is short and can be checked on its own: `print(reverse_number(1230))` must print `321`. This way of working is called **decomposition**: first write the main program as if the functions already existed ("for each number, if it is a palindrome and prime…"), then write each function, and test it before moving on to the next one.

## Returning several values

To simplify a fraction `p/q`, you must return two numbers. In Python, write `return a, b`, and get both values back with a multiple assignment, as in `a, b = map(int, input().split())`.

In C++, a function returns only one value. You then use **pass by reference**: a parameter declared with `&`, such as `int &a`, is not a copy but **another name** for the variable passed as argument. What the function writes into `a` is written directly into the caller's variable.

```python
# gcd is Euclid's function written above.
def simplify(p, q):
    d = gcd(p, q)
    return p // d, q // d

a, b = simplify(12, 18)
print(a, b)
```

```cpp
// gcd is Euclid's function written above.
void simplify(long long p, long long q, long long &a, long long &b) {
    long long d = gcd(p, q);
    a = p / d;
    b = q / d;
}

int main() {
    long long a, b;
    simplify(12, 18, a, b);
    cout << a << " " << b << "\n";
    return 0;
}
```

The program prints `2 3`. Without the `&`, the C++ function would modify copies, and `a` and `b` would keep arbitrary values.

## Functions and lists

A list passed to a Python function is **not copied**: the parameter is another name for the same list. Everything the function changes in the list (`t[i] = …`, `t.append(…)`) is visible after the call. Here is a function that reverses the part of a list between positions `i` and `j`, by swapping the ends and moving towards the middle:

```python
def reverse_part(t, i, j):
    while i < j:
        x = t[i]
        t[i] = t[j]
        t[j] = x
        i = i + 1
        j = j - 1

t = [1, 2, 3, 4, 5, 6]
reverse_part(t, 1, 4)
print(t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

void reverse_part(vector<int> &t, int i, int j) {
    while (i < j) {
        int x = t[i];
        t[i] = t[j];
        t[j] = x;
        i = i + 1;
        j = j - 1;
    }
}

int main() {
    vector<int> t = {1, 2, 3, 4, 5, 6};
    reverse_part(t, 1, 4);
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `[1, 5, 4, 3, 2, 6]` in Python and `1 5 4 3 2 6` in C++. The function returns nothing: its effect is the change in the list.

A function can also **build** a list and return it. It creates a local list, fills it, then returns it with `return`. In C++, the return type is then `vector<int>`.

```python
def divisors(n):
    result = []
    for d in range(1, n + 1):
        if n % d == 0:
            result.append(d)
    return result

t = divisors(12)
print(len(t))
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> divisors(int n) {
    vector<int> result;
    for (int d = 1; d <= n; d++) {
        if (n % d == 0) {
            result.push_back(d);
        }
    }
    return result;
}

int main() {
    vector<int> t = divisors(12);
    cout << t.size() << "\n";
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `6`, then `1 2 3 4 6 12`. Each call creates a new list `result`: two calls `divisors(12)` and `divisors(15)` return two independent lists.

Be careful: **assigning** a new list to the parameter changes nothing for the caller. If the function writes `t = [0] * len(t)`, the local name `t` now refers to another list, and the original list is untouched. To build a new list, return it with `return`, like `divisors` above. Conversely, if the caller wants to keep its list unchanged, it passes a copy, obtained with `list(t)`.

In C++, it is the other way round: a parameter `vector<int> t` is a **copy**. The changes are lost at the end of the call, and copying a large array at each call takes time. Write `vector<int> &t` to modify the caller's array, and `const vector<int> &t` to read it without copying it (`const` forbids modifying it).

## Common mistakes

**Forgetting `return`.** A function that computes the right result without returning it returns `None`. `print(digit_sum(2026))` then prints `None`, and `digit_sum(7) + 1` causes `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`. In C++, the program compiles but the result is garbage; the option `-Wall` shows `warning: no return statement in function returning non-void` (or `control reaches end of non-void function` if only one of the paths forgets the `return`). A `print` in the function does not replace a `return`: it prints, but passes nothing back to the program.

**Returning too early.** In `is_prime`, writing `else: return True` inside the loop would give the answer after the first divisor tested: 9 would be declared prime, because 2 does not divide it. You can only conclude "prime" **after** the loop.

**Forgetting the parentheses.** `if is_prime:` tests the function itself, which always counts as true, and `print(is_prime)` prints `<function is_prime at 0x7f…>`. A call is always written with parentheses: `is_prime(n)`.

**A wrong number of arguments.** `gcd(12)` causes `TypeError: gcd() missing 1 required positional argument: 'b'`; in C++, `error: too few arguments to function`.

**Calling a function before defining it.** Python runs the file from top to bottom: a call placed before the `def` gives `NameError: name 'gcd' is not defined`. In C++, the error is `error: 'gcd' was not declared in this scope`. Write all functions at the top of the file.

**Hiding a name.** A variable with the name of a function replaces it. After `max = 0`, the call `max(a, b)` causes `TypeError: 'int' object is not callable`. Avoid naming your variables `max`, `min`, `sum`, `len`, `list` or like one of your functions.

## Complete example: narcissistic numbers

**Statement.** An integer with `k` digits is **narcissistic** if it equals the sum of the `k`-th powers of its digits. For example, 153 has three digits and 1³ + 5³ + 3³ = 1 + 125 + 27 = 153. The program reads two integers `A` and `B` (1 ≤ A ≤ B ≤ 100,000) and prints, one per line, the narcissistic numbers between `A` and `B`.

**Idea.** Split the problem. You need to count the digits of a number (`digit_count`), compute a power (`power`), then test a number (`is_narcissistic`), which uses the first two. The main program just goes through the numbers from `A` to `B`. There are at most 100,000 numbers, with at most 6 digits, and each power needs at most 6 multiplications: a few million operations, which is reasonable.

**Program.**

```python
def digit_count(n):
    k = 0
    while n > 0:
        k = k + 1
        n = n // 10
    return k

def power(a, k):
    result = 1
    for i in range(k):
        result = result * a
    return result

def is_narcissistic(n):
    k = digit_count(n)
    s = 0
    m = n
    while m > 0:
        s = s + power(m % 10, k)
        m = m // 10
    return s == n

a, b = map(int, input().split())
for n in range(a, b + 1):
    if is_narcissistic(n):
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int digit_count(int n) {
    int k = 0;
    while (n > 0) {
        k = k + 1;
        n = n / 10;
    }
    return k;
}

int power(int a, int k) {
    int result = 1;
    for (int i = 0; i < k; i++) {
        result = result * a;
    }
    return result;
}

bool is_narcissistic(int n) {
    int k = digit_count(n);
    int s = 0;
    int m = n;
    while (m > 0) {
        s = s + power(m % 10, k);
        m = m / 10;
    }
    return s == n;
}

int main() {
    int a, b;
    cin >> a >> b;
    for (int n = a; n <= b; n++) {
        if (is_narcissistic(n)) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

**Checking by hand.** With the input `150 410`. For `n = 153`, `digit_count` returns 3; the loop adds `power(3, 3) = 27`, then `power(5, 3) = 125`, then `power(1, 3) = 1`: the sum is 153, equal to `n`, and the program prints `153`. For `n = 154`, the sum is 64 + 125 + 1 = 190: nothing is printed. In the end the program prints `153`, `370`, `371` and `407`. Note that `is_narcissistic` works on a copy `m` of `n`: without it, `n` would be 0 at the time of the final comparison. Each function can also be tested on its own: `power(2, 10)` must be 1024, `digit_count(100000)` must be 6.

## Key takeaways

- `def name(parameters):` defines a function; a call `name(arguments)` puts the arguments into the parameters, in order, runs the body, and `return` sends back the result and stops the function at once.
- In C++, you give the return type (`int`, `bool`, `void`…) and the type of each parameter, and you write the functions before `main`.
- The variables of a function are local. Pass the data through the parameters and get the result back with `return`, rather than modifying global variables.
- For a number, the parameter is a copy. A Python list is not copied: the function can modify it. In C++, `&` gives access to the caller's variable (`int &x`, `vector<int> &t`).
- A boolean function (`is_prime`, `is_palindrome`) is used directly in an `if`; you only conclude "true" after checking everything.
- Splitting a problem into small functions, tested one by one, makes a program shorter, more readable and safer.
