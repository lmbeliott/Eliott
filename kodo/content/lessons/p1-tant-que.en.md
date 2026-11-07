With `for i in range(N)`, you repeat instructions a number of times known in advance. But often that number is unknown. How many times must you divide 1,000 by 2 to reach 1? How many digits does 4,072 have? How many values are left to read, if the input ends with a `0`? In these situations you don't know how many turns to make, but you do know **when to stop**.

This chapter introduces the `while` loop, which repeats instructions **as long as a condition is true**. With it, you can read data until an end value, split a number into digits, or simulate a process until it reaches a threshold.

## The while loop

A **while loop** is written with the keyword `while`, followed by a condition. The indented instructions below it form the **body of the loop**. Here is a first example: start from 1 and double as long as the number is less than 100.

```python
n = 1
while n < 100:
    n = n * 2
print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 1;
    while (n < 100) {
        n = n * 2;
    }
    cout << n << "\n";
    return 0;
}
```

This program prints `128`. To understand why, follow exactly what the machine does. Before each turn, it tests the condition `n < 100`:

- if the condition is true, it runs the body of the loop, then comes back to test the condition;
- if the condition is false, it skips the body and moves on to the rest of the program.

One pass through the body is called a **turn** (or an **iteration**). You can follow the values of `n` in a table; this is called **tracing** the loop by hand:

| Test | `n` before the test | `n < 100`? | `n` after the turn |
| --- | --- | --- | --- |
| 1 | 1 | true | 2 |
| 2 | 2 | true | 4 |
| 3 | 4 | true | 8 |
| 4 | 8 | true | 16 |
| 5 | 16 | true | 32 |
| 6 | 32 | true | 64 |
| 7 | 64 | true | 128 |
| 8 | 128 | false | — |

At the eighth test, `n` is 128: the condition is false, the loop stops and the program prints 128. The printed value is the first power of 2 that is **not** less than 100. This is a good habit: when a `while` loop ends, you know its condition is false.

Two important remarks:

1. The condition is tested **before** each turn, never in the middle. If `n` went over 100 in the middle of the body, the loop would still finish its turn.
2. If the condition is false from the start, the body is **never** run. With `n = 500` at the start, the program above prints `500` right away.

## Counting the turns

Often what matters is not the final value but the **number of turns**. You then add a **counter**: a variable set to 0 before the loop and increased by 1 at each turn. For example, how many times can you divide a number by 2 (integer division) before reaching 1?

```python
n = int(input())
steps = 0
while n > 1:
    n = n // 2
    steps = steps + 1
print(steps)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int steps = 0;
    while (n > 1) {
        n = n / 2;
        steps = steps + 1;
    }
    cout << steps << "\n";
    return 0;
}
```

With the input `1000`, `n` takes the values 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1: there are 9 divisions, and the program prints `9`. With the input `1`, the condition `n > 1` is false right away: no turn at all, the program prints `0`, which is the right answer.

The counter is set to 0 **before** the loop, once. If it were reset to 0 inside the body, it would start over at each turn and could never go above 1.

## for or while?

Any `for` loop can be written with `while`. Both programs below print the numbers from 0 to 4:

```python
for i in range(5):
    print(i)

i = 0
while i < 5:
    print(i)
    i = i + 1
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 5; i++) {
        cout << i << "\n";
    }

    int i = 0;
    while (i < 5) {
        cout << i << "\n";
        i = i + 1;
    }
    return 0;
}
```

With `while`, you have to write yourself the three things that `for` handles on its own: the starting value (`i = 0`), the condition (`i < 5`) and the update (`i = i + 1`). Forgetting the update is a classic mistake, described below.

The rule is simple: when you know the number of turns before the loop starts, use `for`, which is shorter and safer. When you don't, and you only know when to stop, use `while`.

## Reading until a sentinel value

In some problems, the input does not start with the number of values. Instead, a special value marks the end: it is called a **sentinel value**. For example, the input contains integers, one per line, and the last one is `0`. That `0` is not data: it only says "this is the end".

You then write the loop following a very precise pattern:

1. read a first value **before** the loop;
2. the condition checks that the value read is not the sentinel;
3. in the body, process the value, then read the next one **at the end** of the body.

```python
total = 0
x = int(input())
while x != 0:
    total = total + x
    x = int(input())
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int total = 0;
    int x;
    cin >> x;
    while (x != 0) {
        total = total + x;
        cin >> x;
    }
    cout << total << "\n";
    return 0;
}
```

With the input `5`, `-2`, `8`, `0` (one number per line), the program reads 5 and adds it, reads -2 and adds it, reads 8 and adds it, then reads 0: the condition becomes false and the loop stops. It prints `11`. The 0 is never added, because the condition is tested right after each read. If the input contains only `0`, the loop makes no turn and the program prints `0`.

This pattern guarantees that each value is tested **before** it is processed. That is why the read is placed at the end of the body and not at the beginning.

## The digits of a number

For a positive integer `n`, two operations split its decimal writing:

- `n % 10` is the **last digit** of `n` (the remainder of the division by 10);
- `n // 10` is `n` **without its last digit** (in C++, `n / 10` between two integers).

For example, `4072 % 10` is 2 and `4072 // 10` is 407. By repeating, you go through all the digits, from right to left. You don't know how many digits `n` has, but you know when to stop: when nothing is left, that is, when `n` is 0. Here is the sum of the digits:

```python
n = int(input())
total = 0
while n > 0:
    total = total + n % 10
    n = n // 10
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    while (n > 0) {
        total = total + n % 10;
        n = n / 10;
    }
    cout << total << "\n";
    return 0;
}
```

With `4072`, the turns add 2, then 7, then 0, then 4, and `n` goes through 407, 40, 4 and 0. The program prints `13`.

Two details matter. First, the loop **destroys** `n`: at the end, `n` is 0. If you still need the original number, copy it into another variable before the loop. Second, the number `0` is a special case: the loop makes no turn. For the sum of the digits it doesn't matter (the sum is indeed 0), but to count the digits you must answer 1, not 0. You then handle that case with an `if` before the loop.

## Simulating until a condition

A `while` loop also lets you **simulate** a process step by step, until a condition is met. Example: an amount of 1,000 earns 7% per year; each year, 7% of its value, rounded down, is added to it. After how many years does it exceed 2,000?

```python
amount = 1000
years = 0
while amount <= 2000:
    amount = amount + amount * 7 // 100
    years = years + 1
print(years, amount)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int amount = 1000;
    int years = 0;
    while (amount <= 2000) {
        amount = amount + amount * 7 / 100;
        years = years + 1;
    }
    cout << years << " " << amount << "\n";
    return 0;
}
```

The program prints `11 2098`: the amount becomes 1,070, then 1,144, then 1,224, and so on up to 2,098 in the eleventh year. The condition of the loop is the **opposite** of the stopping condition: you want to stop when the amount exceeds 2,000, so you go on as long as it is less than or equal to 2,000.

To write a simulation, ask yourself three questions: which variables describe the state at a given moment (here, the amount and the number of years)? How do you go from one step to the next? When do you stop?

## Common mistakes

### The infinite loop

If nothing changes in the body of the loop, the condition stays true forever: this is an **infinite loop**. The program never stops, and the judge eventually cuts it off with the verdict "Time limit exceeded".

```python
i = 0
while i < 5:
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 0;
    while (i < 5) {
        cout << i << "\n";
    }
    return 0;
}
```

This program prints `0` endlessly: `i` is never changed. The body is missing `i = i + 1`. Before writing a `while` loop, always check that **at least one variable of the condition changes at each turn**, and that it changes in the right direction.

The same trap exists with a sentinel: if you forget the read `x = int(input())` at the end of the body, `x` keeps the same value and the loop never stops. In Python you sometimes get another error: if you read too many times, the program tries to read past the end of the input and stops with `EOFError: EOF when reading a line`.

### The condition that skips the stopping value

```python
n = 10
while n != 0:
    n = n - 3
```

```cpp
int n = 10;
while (n != 0) {
    n = n - 3;
}
```

Here `n` is 10, 7, 4, 1, then -2, -5… It is never exactly 0, so the loop is infinite. Fix it with a non-strict comparison: `while n > 0`. As a general rule, a condition with `<`, `>`, `<=` or `>=` is safer than a condition with `!=` when a variable moves by jumps.

### One turn too many or too few

Between "exceed" and "reach" there is often a difference of one turn. With `while amount <= 2000`, the loop goes on when the amount is exactly 2,000; with `while amount < 2000`, it stops. Both are correct, but for different questions. To choose, test by hand the case where the value lands exactly on the limit.

### The counter reset at the wrong place

```python
steps = 0
while n > 1:
    steps = 0
    n = n // 2
    steps = steps + 1
```

```cpp
int steps = 0;
while (n > 1) {
    steps = 0;
    n = n / 2;
    steps = steps + 1;
}
```

This program always prints 1 (or 0 if `n` is 1 at the start), because the counter is reset to 0 at each turn. The initialisation goes **before** the loop.

### Overflow in C++

A C++ `int` does not go beyond about 2 × 10⁹. When a loop doubles a number or makes a value grow, the result can go past that limit and become wrong without any error message. You then use the type `long long`, which goes up to about 9 × 10¹⁸. In Python, integers have no limit.

## Complete example: the largest digit

**Statement.** The program reads an integer `N` (0 ≤ N ≤ 10⁹) and prints the largest digit of its decimal writing.

**Idea.** You don't know the number of digits: go through them with a `while` loop, from right to left, using `% 10` and `// 10`. Keep in a variable `best` the largest digit seen so far. At each turn, if the current digit is larger than `best`, update `best`. At the start, `best` is 0: that's a good initial value, because every digit is at least 0. It also handles the case `N = 0`: the loop makes no turn, and the answer 0 is correct.

**Program.**

```python
n = int(input())
best = 0
while n > 0:
    digit = n % 10
    if digit > best:
        best = digit
    n = n // 10
print(best)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int best = 0;
    while (n > 0) {
        int digit = n % 10;
        if (digit > best) {
            best = digit;
        }
        n = n / 10;
    }
    cout << best << "\n";
    return 0;
}
```

**Checking by hand** with `N = 3916`:

| Turn | `n` at the start | `digit` | `best` after | `n` at the end |
| --- | --- | --- | --- | --- |
| 1 | 3916 | 6 | 6 | 391 |
| 2 | 391 | 1 | 6 | 39 |
| 3 | 39 | 9 | 9 | 3 |
| 4 | 3 | 3 | 9 | 0 |

After the fourth turn, `n` is 0: the condition `n > 0` is false, and the program prints `9`. Also check the edge cases: with `N = 7`, one turn, answer 7; with `N = 0`, no turn, answer 0; with `N = 1000000000`, ten turns, answer 1.

## Key takeaways

- `while condition:` repeats the body as long as the condition is true. It is tested before each turn; if it is false from the start, the body is never run.
- Choose `for` when the number of turns is known in advance, `while` when you only know when to stop.
- To read until a sentinel: one read before the loop, one read at the end of the body, and the condition compares the value read with the sentinel.
- `n % 10` gives the last digit, `n // 10` removes it; repeat while `n > 0`, without forgetting the case `n = 0`.
- Each turn must bring the loop closer to its end: otherwise it's an infinite loop. Counters are initialised before the loop.
- Always check a loop by tracing it by hand on a small example and on the edge cases.
