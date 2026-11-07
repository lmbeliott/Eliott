A Russian doll contains a smaller doll, which contains a smaller one still, down to the last one, which is solid. To count the dolls, it is enough to say: "one, plus the number of dolls inside". The question is asked again, about a smaller object, until the solid doll, for which the answer is immediate.

Many computations can be described this way: the factorial of 5 is 5 times that of 4; the GCD of 84 and 36 is that of 36 and 12; an expression `(3 + 4) × 5` is made of smaller expressions. A function that follows such descriptions calls itself. This chapter shows how to write one, what happens inside the machine, how to prove it correct, how to enumerate all the possibilities of a small problem, and why some recursive functions are disastrously slow.

## A function that calls itself

The **factorial** of an integer n ≥ 0, written n!, is the product 1 × 2 × … × n, with 0! = 1. Notice that n! = n × (n − 1)! as soon as n ≥ 1. This remark translates directly into a program:

```python
def factorial(n):
    if n == 0:
        return 1                      # base case
    return n * factorial(n - 1)       # recursive case

print(factorial(5))
print(factorial(20))
```

```cpp
#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n == 0) {
        return 1;                       // base case
    }
    return n * factorial(n - 1);        // recursive case
}

int main() {
    cout << factorial(5) << "\n";
    cout << factorial(20) << "\n";
    return 0;
}
```

The program prints `120`, then `2432902008176640000`.

A **recursive function** is a function that calls itself. It always has two parts:

- the **base case**: one or more simple situations where the answer is given directly, without a new call (here, n = 0);
- the **recursive case**: the answer is computed from one or more **recursive calls** on smaller data (here, `factorial(n - 1)`).

The base case is essential: without it, the function would call itself forever. The recursive calls must also **get closer** to the base case: `factorial(n - 1)` starts from n and goes down towards 0.

## The call stack

What happens during `factorial(3)`? The call needs `factorial(2)`, which needs `factorial(1)`, which needs `factorial(0)`. Each call is put on hold while the next one works. To see it, add a parameter `depth` used to indent the output:

```python
def factorial(n, depth):
    print("  " * depth + "start", n)
    if n == 0:
        r = 1
    else:
        r = n * factorial(n - 1, depth + 1)
    print("  " * depth + "end", n, "->", r)
    return r

factorial(3, 0)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

long long factorial(int n, int depth) {
    cout << string(2 * depth, ' ') << "start " << n << "\n";
    long long r;
    if (n == 0) {
        r = 1;
    } else {
        r = n * factorial(n - 1, depth + 1);
    }
    cout << string(2 * depth, ' ') << "end " << n << " -> " << r << "\n";
    return r;
}

int main() {
    factorial(3, 0);
    return 0;
}
```

The program prints:

```text
start 3
  start 2
    start 1
      start 0
      end 0 -> 1
    end 1 -> 1
  end 2 -> 2
end 3 -> 6
```

The calls start from the largest to the smallest, and finish in the reverse order: the last one started is the first one finished. Each call has its **own** local variables: at the same moment, there are four different variables `n`, equal to 3, 2, 1 and 0. The machine stores them in the **call stack**: at each call it pushes a **frame** that holds the parameters, the local variables and the place where the computation must resume; at `return`, it pops this frame and resumes the previous call where it had stopped. This is exactly the stack of the chapter "Stacks and queues".

The largest number of frames present at the same time is called the **depth** of the recursion. For `factorial(n)`, it is n + 1.

## Proving a recursive function

To be convinced that a recursive function is correct, you do not unroll every call: you reason by **induction**, as in mathematics.

1. Check that the result is correct in the base case.
2. Assume that the recursive calls, made on smaller data, return the correct result (this is the **induction hypothesis**), and check that the recursive case then returns the correct result too.

For `factorial`: `factorial(0)` returns 1 = 0!. If `factorial(n − 1)` returns (n − 1)!, then `factorial(n)` returns n × (n − 1)! = n!. By induction, `factorial(n)` is correct for every n ≥ 0.

You must also prove **termination**: exhibit a non-negative integer quantity that strictly decreases at each recursive call. It cannot decrease forever, so a base case is eventually reached. For `factorial`, this quantity is n itself. Careful: `factorial(-1)` calls `factorial(-2)`, then `factorial(-3)`… and never stops. The proof only holds for n ≥ 0, which is the condition for using the function.

## Recursion on numbers

The GCD is computed with Euclid's algorithm, seen in level 2: gcd(a, 0) = a, and gcd(a, b) = gcd(b, a mod b) if b > 0. The recursive version copies these two equalities. The digit sum and the power are written the same way.

```python
def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

def power(a, n):
    if n == 0:
        return 1
    return a * power(a, n - 1)

print(gcd(84, 36), digit_sum(2026), power(3, 4))
```

```cpp
#include <iostream>
using namespace std;

long long gcd(long long a, long long b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

int digit_sum(long long n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + digit_sum(n / 10);
}

long long power(long long a, int n) {
    if (n == 0) {
        return 1;
    }
    return a * power(a, n - 1);
}

int main() {
    cout << gcd(84, 36) << " " << digit_sum(2026) << " " << power(3, 4) << "\n";
    return 0;
}
```

The program prints `12 10 81`. For `gcd(84, 36)`, the successive calls are `gcd(36, 12)`, then `gcd(12, 0)`, which returns 12. Termination comes from the second parameter strictly decreasing, since a mod b < b.

The function `power` makes n calls. A simple idea reduces this number a lot: if n is even, a^n = (a^(n/2))², otherwise a^n = a × a^(n−1). The call for n leads to a call for n/2 at least every other call: the number of calls is about 2 × log₂(n), around a hundred for n = 10¹⁸. This **fast exponentiation** will be studied in detail with arithmetic.

## Recursion on lists and strings

A list or a string can also be split into smaller pieces. A string is a **palindrome** if it has at most one letter, or if its first and last letters are equal and what remains between them is a palindrome. Rather than building the middle string, pass the indices `i` and `j` of the portion studied as parameters. Likewise, the maximum of `t[0..i]` is the larger of `t[i]` and the maximum of `t[0..i−1]`.

```python
def is_palindrome(s, i, j):
    # is the portion s[i..j] a palindrome?
    if i >= j:
        return True
    if s[i] != s[j]:
        return False
    return is_palindrome(s, i + 1, j - 1)

def maximum(t, i):
    # largest value among t[0], ..., t[i]
    if i == 0:
        return t[0]
    return max(t[i], maximum(t, i - 1))

word = "ressasser"
print(is_palindrome(word, 0, len(word) - 1))
print(maximum([4, 9, 2, 7], 3))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// is the portion s[i..j] a palindrome?
bool is_palindrome(const string &s, int i, int j) {
    if (i >= j) {
        return true;
    }
    if (s[i] != s[j]) {
        return false;
    }
    return is_palindrome(s, i + 1, j - 1);
}

// largest value among t[0], ..., t[i]
int maximum(const vector<int> &t, int i) {
    if (i == 0) {
        return t[0];
    }
    return max(t[i], maximum(t, i - 1));
}

int main() {
    string word = "ressasser";
    cout << (is_palindrome(word, 0, word.size() - 1) ? "True" : "False") << "\n";
    cout << maximum({4, 9, 2, 7}, 3) << "\n";
    return 0;
}
```

The program prints `True`, then `9`. The proof is by induction on the length j − i + 1 of the portion, which decreases by 2 at each call of `is_palindrome` and by 1 at each call of `maximum`. Passing indices rather than slices such as `s[1:-1]` matters: a slice **copies** the portion, and a sequence of copies of lengths n, n − 2, n − 4… adds up to about n²/4 operations, instead of n/2 calls.

These two functions can just as well be written with a loop. Recursion becomes really useful when a piece of data splits into **several** pieces, or when several choices must be tried at each step.

## Generating all the possibilities

To find the **subsets** of {1, 2, 3} whose sum is 3, you can try them all. For each element, there are two choices: take it or not. A recursive function makes these decisions one by one: `explore(i)` decides for the elements from number `i` on, the elements already taken being stored in the list `chosen`.

```python
def explore(i):
    if i == len(t):                 # every decision has been made
        if sum(chosen) == 3:
            print(chosen)
        return
    explore(i + 1)                  # without t[i]
    chosen.append(t[i])
    explore(i + 1)                  # with t[i]
    chosen.pop()                    # restore the list

t = [1, 2, 3]
chosen = []
explore(0)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {1, 2, 3};
vector<int> chosen;

void explore(int i) {
    if (i == (int)t.size()) {          // every decision has been made
        int s = 0;
        for (int x : chosen) s += x;
        if (s == 3) {
            for (int x : chosen) cout << x << " ";
            cout << "\n";
        }
        return;
    }
    explore(i + 1);                     // without t[i]
    chosen.push_back(t[i]);
    explore(i + 1);                     // with t[i]
    chosen.pop_back();                  // restore the list
}

int main() {
    explore(0);
    return 0;
}
```

The program prints `[3]`, then `[1, 2]` (in C++: `3`, then `1 2`). By induction on n − i, the call `explore(i)` goes exactly once through each of the 2^(n−i) ways of deciding for the remaining elements, and gives the list `chosen` back in the state it found it. The call `explore(0)` therefore sees the 2^n subsets. The `pop` is essential: forgetting it leaves in `chosen` elements of a branch that is already finished.

For **permutations** (the possible orders of the n elements), first choose the element placed first, among all of them, then the second one, among those left, and so on. A list of booleans `used` marks the elements already placed.

```python
def permute(order):
    if len(order) == len(t):
        print(*order)
        return
    for i in range(len(t)):
        if not used[i]:
            used[i] = True
            order.append(t[i])
            permute(order)
            order.pop()
            used[i] = False

t = [1, 2, 3]
used = [False] * len(t)
permute([])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {1, 2, 3};
vector<bool> used(3, false);
vector<int> order;

void permute() {
    if (order.size() == t.size()) {
        for (int x : order) cout << x << " ";
        cout << "\n";
        return;
    }
    for (int i = 0; i < (int)t.size(); i++) {
        if (!used[i]) {
            used[i] = true;
            order.push_back(t[i]);
            permute();
            order.pop_back();
            used[i] = false;
        }
    }
}

int main() {
    permute();
    return 0;
}
```

The program prints the six orders `1 2 3`, `1 3 2`, `2 1 3`, `2 3 1`, `3 1 2`, `3 2 1`, in this order. There are n choices for the first element, n − 1 for the second, and so on: n! permutations in total.

These numbers grow very fast: 2^20 ≈ one million, and 10! ≈ 3.6 million. Full enumeration is only done for small n, about 20 for subsets and 10 for permutations.

## Recursion depth

Each frame takes memory, and the stack has a limited size. In Python, the depth is limited by default to about 1,000 calls:

```python
print(factorial(5000))
```

```cpp
// In C++, the limit comes from the size of the stack (often 8 MB):
// a recursion of a few hundred thousand or million calls
// stops the program.
cout << factorial(10000000) << "\n";
```

Python stops with `RecursionError: maximum recursion depth exceeded`. When the depth is known and reasonable, a few thousand, raise the limit at the start of the program:

```python
import sys
sys.setrecursionlimit(10000)
```

```cpp
// No equivalent in C++: keep the depth reasonable,
// or replace the recursion with a loop.
```

In C++, there is no clear message: when the stack overflows, the program stops abruptly with `Segmentation fault (core dumped)`, which an online judge reports as a runtime error. In both languages, a recursion of depth 10⁵ or more is risky. If each call makes a single recursive call, like `factorial`, a loop does the same work without this risk.

## The cost of naive recursion

The **Fibonacci numbers** are defined by F(0) = 0, F(1) = 1 and F(n) = F(n − 1) + F(n − 2). The direct translation is correct, but very slow. Let us count the calls:

```python
calls = 0

def fib(n):
    global calls
    calls = calls + 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(25), calls)
```

```cpp
#include <iostream>
using namespace std;

long long calls = 0;

long long fib(int n) {
    calls++;
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main() {
    long long f = fib(25);
    cout << f << " " << calls << "\n";
    return 0;
}
```

The program prints `75025 242785`: nearly 250,000 calls for a result that a loop gets in 25 additions. (The keyword `global` lets the function modify a global variable here; it is only used for this kind of measurement.) The reason: `fib(25)` calls `fib(24)` and `fib(23)`, but `fib(24)` calls `fib(23)` again. The same values are recomputed a huge number of times. If A(n) is the number of calls, A(n) = 1 + A(n − 1) + A(n − 2) ≥ 2 A(n − 2): the number of calls at least doubles every two steps. One can even show that A(n) = 2 F(n + 1) − 1. For n = 50, that is about 4 × 10¹⁰ calls: several hours in Python.

The remedy is called **memoization**: store each computed result in a dictionary, and look it up before computing.

```python
memo = {}

def fib(n):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    r = fib(n - 1) + fib(n - 2)
    memo[n] = r
    return r

print(fib(90))
```

```cpp
#include <iostream>
#include <map>
using namespace std;

map<int, long long> memo;

long long fib(int n) {
    if (n < 2) {
        return n;
    }
    if (memo.count(n)) {
        return memo[n];
    }
    long long r = fib(n - 1) + fib(n - 2);
    memo[n] = r;
    return r;
}

int main() {
    cout << fib(90) << "\n";
    return 0;
}
```

The program prints `2880067194370816120` instantly. Each value from 2 to n is computed only once; afterwards, every call that asks for it finds it in the dictionary. So there are about 2n calls in total. Memoization does not change the correctness proof: a value read from the dictionary is a value computed earlier by the same function. It is useful as soon as the same subproblems come back; it is the starting point of dynamic programming, studied later.

## Common mistakes

**Forgetting the base case**, or writing a base case that is never reached: `factorial(-1)`, or a function that tests `n == 0` while n decreases by 2 from an odd number. Result: `RecursionError` in Python, `Segmentation fault` in C++.

**Forgetting the `return` before the recursive call.** Writing `gcd(b, a % b)` instead of `return gcd(b, a % b)` computes the result and throws it away: the function returns `None`, and a computation like `gcd(84, 36) + 1` causes `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`.

**Forgetting to undo a choice.** In `explore` or `permute`, every `append` must be followed by a `pop`, and every `used[i] = True` by a return to `False`, otherwise the following branches start from a wrong state.

**Recomputing endlessly.** A function that makes two or more recursive calls on overlapping data, like `fib`, can make an exponential number of calls. If the program is slow on medium-sized data, count the calls, and memoize.

## Complete example: splitting an integer

**Statement.** Print all the ways to write an integer N (1 ≤ N ≤ 20) as a sum of strictly positive integers, each sum being written with non-increasing terms (so 2 + 1 + 1 and 1 + 2 + 1 count as a single way). The sums are printed one per line, from largest to smallest in dictionary order, followed by their number.

**Idea.** Choose the terms one by one. After writing terms whose last one is m, what remains is to write `rest`, with terms at most m. The next term k goes from `min(rest, m)` down to 1; for each k, write k, then split `rest − k` with terms at most k. When `rest` is 0, the sum is complete.

**Program.**

```python
def split(rest, m, terms):
    # prints every possible ending: sum 'rest', terms <= m
    # and returns how many there are
    if rest == 0:
        print(" + ".join(map(str, terms)))
        return 1
    total = 0
    for k in range(min(rest, m), 0, -1):
        terms.append(k)
        total = total + split(rest - k, k, terms)
        terms.pop()
    return total

n = int(input())
print(split(n, n, []))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> terms;

// prints every possible ending: sum 'rest', terms <= m
// and returns how many there are
int split(int rest, int m) {
    if (rest == 0) {
        for (int i = 0; i < (int)terms.size(); i++) {
            if (i > 0) cout << " + ";
            cout << terms[i];
        }
        cout << "\n";
        return 1;
    }
    int total = 0;
    for (int k = min(rest, m); k >= 1; k--) {
        terms.push_back(k);
        total += split(rest - k, k);
        terms.pop_back();
    }
    return total;
}

int main() {
    int n;
    cin >> n;
    int total = split(n, n);
    cout << total << "\n";
    return 0;
}
```

**Checking by hand.** With N = 4, the call `split(4, 4, [])` first tries k = 4, and `split(0, 4, [4])` prints `4`. Then k = 3: 1 remains, and the only possible term is 1, hence `3 + 1`. Then k = 2: 2 remains with terms at most 2, which gives `2 + 2` then `2 + 1 + 1`. Finally k = 1 gives `1 + 1 + 1 + 1`. The program prints these five lines, then `5`, the value returned by the first call.

**Correctness.** By induction on `rest`: `split(rest, m, terms)` prints once each non-increasing sequence of terms at most m whose sum is `rest`, preceded by the terms already chosen. Such a sequence starts with a term k between 1 and `min(rest, m)`, and ends with a non-increasing sequence of sum `rest − k` with terms at most k: exactly what the recursive call provides. Since k decreases in the loop, the sums come out from largest to smallest. **Termination**: `rest` decreases by at least 1 at each call.

**Cost.** The depth does not exceed N + 1. The number of lines printed grows fast, 627 for N = 20, but each call either prints a line or extends a sum that will print one: the work stays proportional to the size of what is printed.

## Key takeaways

- A recursive function has a **base case**, handled without a call, and a **recursive case**, which calls itself on smaller data, so that the base case is always reached.
- Each call has its own variables, stored in a frame of the **call stack**; the last call started is the first one finished.
- A recursive function is proved **by induction**: correct base case, and correct recursive case if the smaller calls are correct; termination is proved with an integer quantity that strictly decreases.
- To enumerate subsets and permutations, make the decisions one by one, and **undo** each choice after the call (`pop`, `used[i] = False`). There are 2^n subsets and n! permutations.
- Depth is limited: `RecursionError` in Python beyond about 1,000 calls, to be raised with `sys.setrecursionlimit`; `Segmentation fault` in C++ when the stack overflows.
- A recursion that recomputes the same values, like Fibonacci, can make an exponential number of calls: **memoization** in a dictionary brings the computation down to one call per distinct value.
