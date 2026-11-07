A program that passes the examples of the statement can still be wrong: one forgotten case is enough, an array whose values are all negative, a number equal to 0, a loop that does not stop for a particular input. Tests are reassuring, but they only try a small number of inputs. This chapter shows how to **prove** that an algorithm is correct for **all** inputs, with two simple tools: the **invariant**, which explains why the result is the right one, and the **variant**, which explains why the loop stops.

These tools also help to **find** algorithms. Many olympiad problems are solved by noticing a quantity that never changes, or that always decreases. We will apply them to algorithms already met (maximum, GCD), then to two new ones: fast exponentiation and writing in base 2.

## What we want to prove

Before proving a program, you must state precisely what it has to do. The **precondition** describes the accepted inputs: "`t` is a non-empty array", "`a ≥ 0` and `b ≥ 0`". The **postcondition** describes the expected result: "`m` is the largest element of `t`". An algorithm is **correct** if, for every input satisfying the precondition, it stops and its result satisfies the postcondition. So there are two things to show: **termination** (it stops) and **correctness** (the result is the right one).

## The loop invariant

A **loop invariant** is a property of the variables that is true at the start of each turn of the loop, and still true on exit. To establish it, check three points:

1. **Initialisation**: the property holds before the first turn;
2. **Preservation**: if it holds at the start of a turn, it still holds at the end of that turn;
3. **Conclusion**: on exit, the property, together with the stopping condition, gives the postcondition.

This is the same reasoning as an induction in mathematics: true at the start, passed on from one turn to the next, hence true after any number of turns. Here is the computation of the maximum, with its invariant written as a comment.

```python
def maximum(t):
    m = t[0]
    i = 1
    # invariant: m is the maximum of t[0], ..., t[i - 1]
    while i < len(t):
        if t[i] > m:
            m = t[i]
        i = i + 1
    return m

print(maximum([3, 8, 1, 8, 4]), maximum([-5, -2, -9]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maximum(const vector<int> &t) {
    int m = t[0];
    int i = 1;
    // invariant: m is the maximum of t[0], ..., t[i - 1]
    while (i < (int) t.size()) {
        if (t[i] > m) {
            m = t[i];
        }
        i = i + 1;
    }
    return m;
}

int main() {
    cout << maximum({3, 8, 1, 8, 4}) << " " << maximum({-5, -2, -9}) << "\n";
    return 0;
}
```

The program prints `8 -2`. **Initialisation**: before the first turn, `i = 1` and `m = t[0]`, which is indeed the maximum of the single cell `t[0]`. **Preservation**: if `m` is the maximum of `t[0..i − 1]`, then after the `if`, `m` is the larger of this old maximum and `t[i]`, so the maximum of `t[0..i]`; then `i` increases by 1, and the property holds again with the new `i`. **Conclusion**: the loop stops when `i = n`, and the invariant then says that `m` is the maximum of `t[0..n − 1]`, the whole array. This also shows why the initialisation `m = 0` would be wrong: the invariant would not hold at the start, and the program would return 0 for `[-5, -2, -9]`.

The right invariant is rarely "the result is correct": it is a **partial** version of the result, which talks about the part already processed.

## Termination and the variant

A loop `for i in range(n)` always stops after `n` turns. A `while` loop needs an argument. We use a **variant**: an **integer** quantity, **non-negative** while the loop runs, which **strictly decreases** at each turn. A strictly decreasing sequence of non-negative integers cannot be infinite: it has at most as many terms as its starting value, plus one. So the loop stops. For the maximum, `n − i` is a variant.

Without a variant, nothing prevents an infinite loop. The subtraction GCD of level 2 gives an example.

```python
def pgcd_soustractions(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a

print(pgcd_soustractions(12, 18))
```

```cpp
#include <iostream>
using namespace std;

long long pgcdSoustractions(long long a, long long b) {
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
    cout << pgcdSoustractions(12, 18) << "\n";
    return 0;
}
```

The program prints `6`. With `a ≥ 1` and `b ≥ 1`, the sum `a + b` is a variant: each turn removes a number at least equal to 1, and both numbers stay positive. But with `pgcd_soustractions(0, 5)`, the turn computes `b = 5 − 0 = 5`: nothing changes, and the loop runs forever, without any message. The precondition `a ≥ 1` and `b ≥ 1` was essential: it is exactly what guarantees that the variant decreases.

## Euclid's algorithm

Euclid's algorithm computes the GCD of two integers `a ≥ 0` and `b ≥ 0`: while `b ≠ 0`, replace `(a, b)` by `(b, a mod b)`, and the result is the last value of `a`.

```python
def pgcd(a, b):
    # invariant: pgcd(a, b) is the GCD of the two starting numbers
    while b != 0:
        a, b = b, a % b
    return a

print(pgcd(252, 198), pgcd(17, 0), pgcd(0, 9))
```

```cpp
#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    // invariant: pgcd(a, b) is the GCD of the two starting numbers
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main() {
    cout << pgcd(252, 198) << " " << pgcd(17, 0) << " " << pgcd(0, 9) << "\n";
    return 0;
}
```

The program prints `18 17 9`. The successive pairs for `(252, 198)` are `(198, 54)`, `(54, 36)`, `(36, 18)`, `(18, 0)`.

**Correctness.** Write `a = q × b + r` with `r = a mod b`. Every common divisor of `a` and `b` divides `r = a − q × b`; conversely, every common divisor of `b` and `r` divides `a = q × b + r`. So the pairs `(a, b)` and `(b, r)` have exactly the same common divisors, and the same GCD: this is the invariant. On exit, `b = 0`, and the GCD of `a` and 0 is `a`, since every integer divides 0.

**Termination.** `b` is a variant: it is a non-negative integer, and it is replaced by `a mod b`, strictly smaller than `b`.

**Cost.** The variant does not only say that the loop stops: it bounds the number of turns by the value of `b`, which is very pessimistic. We can show better: **in two turns, the first number is at least halved**. After two turns, `(a, b)` has become `(r, r')` with `r = a mod b`. If `b ≤ a / 2`, then `r < b ≤ a / 2`. Otherwise, `b > a / 2`, the quotient is 1, and `r = a − b < a / 2`. In both cases, `r < a / 2`. A number below 10¹⁸ ≈ 2⁶⁰ can only be halved 60 times before reaching 0: there are at most about 120 turns. So the number of turns is proportional to the **number of digits** of `a`, not to its value.

## Fast exponentiation

To compute `x` to the power `n`, the obvious method makes `n − 1` multiplications: impossible for `n = 10¹⁸`. **Fast exponentiation** uses two remarks: if `n` is even, `xⁿ = (x²)^(n/2)`; if `n` is odd, `xⁿ = x × xⁿ⁻¹`. Keep three variables `r`, `x` and `n` with the **invariant** `r × xⁿ = a^N`, where `a` and `N` are the starting values.

```python
def puissance(a, N, m):
    r = 1
    x = a % m
    n = N
    # invariant: r × x^n ≡ a^N (mod m)
    while n > 0:
        if n % 2 == 1:
            r = r * x % m
            n = n - 1
        x = x * x % m
        n = n // 2
    return r

print(puissance(3, 13, 1000), puissance(2, 10**18, 1000000007))
```

```cpp
#include <iostream>
using namespace std;

long long puissance(long long a, long long N, long long m) {
    long long r = 1;
    long long x = a % m;
    long long n = N;
    // invariant: r × x^n ≡ a^N (mod m)
    while (n > 0) {
        if (n % 2 == 1) {
            r = r * x % m;
            n = n - 1;
        }
        x = x * x % m;
        n = n / 2;
    }
    return r;
}

int main() {
    cout << puissance(3, 13, 1000) << " " << puissance(2, 1000000000000000000LL, 1000000007) << "\n";
    return 0;
}
```

The program prints `323 719476260`. Indeed, 3¹³ = 1,594,323, whose last three digits are 323. We compute modulo `m` to keep the numbers small: in C++, a product of two numbers below 10⁹ + 7 fits in a `long long`, while 2 to the power 10¹⁸ would have no chance of fitting.

**Correctness.** At the start, `r = 1`, `x = a` and `n = N`: `r × xⁿ = a^N`. If `n` is odd, replacing `r` by `r × x` and `n` by `n − 1` does not change `r × xⁿ`, since `x × xⁿ⁻¹ = xⁿ`. Then `n` is even, and replacing `x` by `x²` and `n` by `n / 2` does not change `xⁿ`. On exit, `n = 0`, so `x⁰ = 1` and `r = a^N`. **Termination**: `n` is a variant, at least halved at each turn. **Cost**: at most 60 turns for `n ≤ 10¹⁸`, and at most two multiplications per turn. The same idea, with the same invariant, lets you compose a function with itself very quickly, or multiply without overflow.

## Writing in base 2

The digits of `N` in base 2 are obtained like those of base 10 at level 1: the last digit is `N % 2`, and the others are those of `N // 2`.

```python
def binaire(N):
    q = N
    chiffres = []
    # invariant: N = q × 2^k + (value of the k digits already obtained)
    while q > 0:
        chiffres.append(str(q % 2))
        q = q // 2
    if len(chiffres) == 0:
        return "0"
    return "".join(chiffres[::-1])

print(binaire(13), binaire(0), binaire(1024))
```

```cpp
#include <iostream>
#include <string>
using namespace std;

string binaire(long long N) {
    long long q = N;
    string envers = "";
    // invariant: N = q × 2^k + (value of the k digits already obtained)
    while (q > 0) {
        envers += (char) ('0' + q % 2);
        q = q / 2;
    }
    if (envers.size() == 0) {
        return "0";
    }
    string s = "";
    for (int i = (int) envers.size() - 1; i >= 0; i--) {
        s += envers[i];
    }
    return s;
}

int main() {
    cout << binaire(13) << " " << binaire(0) << " " << binaire(1024) << "\n";
    return 0;
}
```

The program prints `1101 0 10000000000`. For 13, the successive remainders are 1, 0, 1, 1, read backwards. **Correctness**: at the start, `k = 0` and `N = q`; a turn replaces `q` by `q // 2` while storing the digit `q % 2` at rank `k`, and `q = 2 × (q // 2) + q % 2` keeps the equality. On exit, `q = 0`, and `N` is the value of the digits obtained. **Termination**: `q` strictly decreases while it is positive. **Cost**: one turn per binary digit, about 60 for 10¹⁸.

## Assertions

An **assertion** is a condition that the programmer claims is true at some point of the program. In Python, `assert condition, "message"` does nothing if the condition is true, and stops the program with `AssertionError: message` otherwise. In C++, `assert(condition);`, with `#include <cassert>`, stops the program with a message like ``Assertion `b > 0' failed.``

```python
def division_euclidienne(a, b):
    assert b > 0, "the divisor must be positive"
    q, r = a // b, a % b
    assert a == q * b + r and 0 <= r < b
    return q, r

print(division_euclidienne(17, 5))
print(division_euclidienne(-17, 5))
```

```cpp
#include <cassert>
#include <iostream>
using namespace std;

int main() {
    long long a = -17, b = 5;
    assert(b > 0);
    long long q = a / b, r = a % b;
    assert(a == q * b + r && 0 <= r && r < b);
    cout << q << " " << r << "\n";
    return 0;
}
```

Python prints `(3, 2)`, then `(-4, 3)`. The C++ program, however, prints nothing: in C++, `q` is −3 and the remainder of −17 by 5 is −2, which is not between 0 and 4. The second assertion fails, and the program stops with ``Assertion `a == q * b + r && 0 <= r && r < b' failed.`` The assertion pointed exactly at the place where the assumption "the remainder is non-negative" is false. Putting the invariant of a loop in an assertion, while debugging, detects a reasoning error very early. Remove them, or keep only cheap ones, in the final version.

## Testing or proving

A test shows that a program is correct on **one** input. A thousand tests prove nothing about the thousand-and-first: they can reveal an error, never guarantee its absence. A proof, on the contrary, covers all inputs, but it may contain a reasoning mistake, or not match the code exactly. The two complement each other. The most effective way to test is to write a **naive solution**, slow but obviously correct, and to compare both programs on hundreds of small random inputs. At the first disagreement, you get a small example to study by hand.

## Common mistakes

**An invariant that is false at the start.** Initialising a maximum to 0, a minimum to 0, a product to 0: the invariant does not hold before the first turn, and the proof collapses. Initialise with a real value of the array, or with the neutral element (0 for a sum, 1 for a product).

**A variant that does not decrease.** Forgetting `i = i + 1` in a `while`, or subtracting 0 as in `pgcd_soustractions(0, 5)`: the program does not stop and prints nothing. If a program "hangs", look for the loop whose variant does not decrease.

**A conclusion off by one.** With the condition `while i < n - 1`, the loop stops at `i = n − 1`, and the invariant only talks about `t[0..n − 2]`: the last cell is forgotten. Writing the invariant forces you to check the stopping condition.

**Overflow in C++.** In fast exponentiation, `x * x` exceeds 2⁶³ if `x` exceeds about 3 × 10⁹: reduce modulo `m` before each product, and keep `m` small enough.

## A complete example

**Statement.** Start from an integer `N ≥ 1`. While `N > 0`, divide it by 2 if it is even, and subtract 1 otherwise. How many steps are needed to reach 0, for `N ≤ 10¹⁸`?

**Idea.** Simulate the process. First, make sure that it stops, and quickly: 10¹⁸ steps would be impossible to simulate.

**Program.**

```python
n = int(input())
etapes = 0
while n > 0:
    if n % 2 == 0:
        n = n // 2
    else:
        n = n - 1
    etapes = etapes + 1
print(etapes)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int etapes = 0;
    while (n > 0) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = n - 1;
        }
        etapes = etapes + 1;
    }
    cout << etapes << "\n";
    return 0;
}
```

**Checking by hand.** With `13`: 13 → 12 → 6 → 3 → 2 → 1 → 0, that is 6 steps, and the program prints `6`.

**Termination.** `n` is a variant: it is a positive integer while the loop runs, and each step makes it strictly decrease (halving an integer `n ≥ 2`, or subtracting 1).

**Number of steps.** Reason on the binary writing of `n`. Subtracting 1 from an odd number turns its last digit 1 into 0. Halving an even number erases its last digit, which is a 0. So each digit 1 costs two steps (turning it into 0, then erasing it), except the first one, which disappears with the step 1 → 0; each digit 0 costs one step. With `L` digits of which `u` are 1, `L + u − 1` steps are needed. For 13 = `1101`, this gives `4 + 3 − 1 = 6`, as by hand. So the number of steps is at most `2L − 1`, fewer than 120 for `N ≤ 10¹⁸`: the simulation is instantaneous. The formula is also a very good test: you can compare both methods on thousands of values.

## Key takeaways

- Proving an algorithm means showing that it stops (termination) and that its result satisfies the postcondition for every input satisfying the precondition (correctness).
- A loop invariant is proved in three points: initialisation, preservation, conclusion on exit. It is usually a partial version of the result.
- A variant is a non-negative integer that strictly decreases at each turn: it guarantees termination, and how fast it decreases bounds the number of turns.
- Euclid preserves the GCD and halves the first number at least every two turns; fast exponentiation preserves `r × xⁿ` and halves `n` at each turn: on the order of the number of digits, not of the value.
- An invariant quantity (a sum, a parity, a remainder) often shows that a state is unreachable, or that the result does not depend on the choices.
- Assertions check an invariant during execution; tests compared with a naive solution find errors; only a proof guarantees there are none.
