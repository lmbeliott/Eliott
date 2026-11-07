Level 1 is over: you can print, compute, read the input, decide with conditions and repeat with `for` and `while`, including with nested loops. These few tools are already enough to solve real algorithmic problems. The difficulty is no longer writing an instruction, but **choosing** the right ones and putting them together. This chapter offers a method to approach a problem, recalls the patterns that keep coming back, and shows how to test and fix a program.

## A method to read a problem

Before writing a single line, follow four steps.

1. **Understand the input and the output.** What does each line of the input contain? What must be printed, exactly, and in what format? Read the constraints again: they tell which values are possible (zero? negative? very large?).
2. **Solve the example by hand.** Redo the computation of the example on paper, without a computer. If you can't, you haven't understood the statement yet, and coding won't help.
3. **Find what must be remembered.** Reading the data one by one, what do you need at each moment? A sum, a counter, the best result seen so far, the previous value? Each of these pieces of information becomes a variable. They are called the **state variables** of the program.
4. **Choose the loops.** If the number of repetitions is known (you read `N`, then `N` values), use `for`. If you only know when to stop (a sentinel, a number that must reach a value), use `while`. If you must try every pair, every cell of a grid or every number of a range with a computation for each, nest two loops.

One last check before coding: estimate the **total number of turns** from the constraints. Up to a few million, everything is fine; beyond a hundred million, you need a better idea, often a computation that replaces a loop.

## The patterns that keep coming back

Most level 1 programs combine a small number of patterns. You must recognise them immediately.

- **The counter**: a variable at 0, increased by 1 when a condition is true.
- **The accumulator**: a variable at 0, to which each value is added.
- **The best so far**: a variable that keeps the maximum (or minimum) of the values seen. Initialise it with the **first value**, not with 0, otherwise everything fails when the values are negative.
- **The previous value**: a variable that keeps the last value read, to compare it with the next one (rise, plateau, change).
- **The flag**: a boolean that is `True` at the start and becomes `False` as soon as a counterexample is found ("are all the numbers even?", "is this number prime?").
- **The digits**: `n % 10` and `n // 10` in a `while n > 0` loop.

Here is the best-so-far pattern, with the position of the maximum among `N` values read one per line:

```python
n = int(input())
best = int(input())
position = 1
for i in range(2, n + 1):
    x = int(input())
    if x > best:
        best = x
        position = i
print(best, position)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int best;
    cin >> best;
    int position = 1;
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        if (x > best) {
            best = x;
            position = i;
        }
    }
    cout << best << " " << position << "\n";
    return 0;
}
```

With the values `-5`, `-2`, `-9`, `-2`, the program prints `-2 2`. The first value is read before the loop and serves as the starting point; so the loop starts at the second one. The test `>` (and not `>=`) keeps the **first** position in case of a tie.

## Testing on edge cases

A program that works on the example is not necessarily correct. The judge's tests almost always contain **edge cases**: the extreme situations allowed by the constraints. Before submitting, systematically ask yourself these questions:

- What happens with the smallest possible input: `N = 1`, a single value, the number `0`, no value before the sentinel?
- And with the largest? Do the numbers fit in an `int` in C++, or do you need a `long long`?
- What happens when all the values are equal? When the answer is reached right away, or at the very end?
- Are ties handled correctly: `<` or `<=`, first or last in case of a tie?
- Do negative values, if allowed, break an initialisation at 0?

For each of these questions, build a small input, compute the expected answer by hand, and check that the program gives it.

## Debugging a wrong program

When a program gives a wrong answer, don't change the code at random. Look for **where** it goes wrong.

**Read the error message.** A runtime error gives the line and the cause. For example, `ValueError: invalid literal for int() with base 10: '3 4'` means you read a line containing two numbers with `int(input())`: you needed `split()`. `IndentationError` reports a wrong indentation, and `NameError` a variable used before it got a value, often because of a typo.

**Recognise the verdict.** "Time limit exceeded" almost always comes from an infinite loop (a variable of the condition that doesn't change) or from nested loops that make far too many turns. A "wrong answer" most often comes from a misplaced initialisation, a strict comparison instead of a non-strict one, or a forgotten edge case.

**Print the state.** Temporarily add a print in the loop to see the state variables at each turn:

```python
total = 0
for i in range(1, 4):
    total = total + i * i
    print("turn", i, "total", total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        total = total + i * i;
        cout << "turn " << i << " total " << total << "\n";
    }
    return 0;
}
```

This program prints `turn 1 total 1`, `turn 2 total 5`, `turn 3 total 14`. Compare these values with those computed by hand: the first turn where they differ shows where the mistake is. Don't forget to remove these prints before submitting, as the judge would count them as part of the answer.

## Complete example: counting heat waves

**Statement.** Read `N` daily temperatures (one per line). A **heat wave** is a run of at least 3 consecutive days at 30 degrees or more. Print the number of heat waves.

**Method.** Step 2, by hand: with `31 32 33 20 30 30 35 36 29`, there are two waves (days 1 to 3, then days 5 to 8). Step 3: you must remember the length of the current run of hot days, and the number of waves. Step 4: you know `N`, so a `for` loop. The key idea: a wave is counted **at the moment its run reaches exactly 3 days**. That way, a long wave is counted only once, and you don't need to detect its end.

```python
n = int(input())
run = 0
waves = 0
for i in range(n):
    t = int(input())
    if t >= 30:
        run = run + 1
        if run == 3:
            waves = waves + 1
    else:
        run = 0
print(waves)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int run = 0;
    int waves = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (t >= 30) {
            run = run + 1;
            if (run == 3) {
                waves = waves + 1;
            }
        } else {
            run = 0;
        }
    }
    cout << waves << "\n";
    return 0;
}
```

**Check.** On the example, `run` is 1, 2, 3 (first wave counted), then 0 on day 4, then 1, 2, 3 (second wave counted), 4, then 0. The program prints `2`. Edge cases: `N = 1` gives 0; three days at exactly 30 give 1 (hence `>=`); ten hot days in a row give 1, because `run == 3` is true only once.

## Key takeaways

- Before coding: understand the input and the output, solve the example by hand, identify the state variables, choose the loops.
- `for` when the number of turns is known, `while` when you only know when to stop, two nested loops for pairs and grids.
- Recognise the patterns: counter, accumulator, best so far (initialised with the first value), previous value, flag, digits.
- Estimate the number of turns from the constraints, and think of `long long` in C++.
- Test the edge cases, then debug by printing the state at each turn and comparing it with the computation done by hand.
