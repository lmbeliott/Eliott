Printing 100 numbers does not take 100 copies of `print`. A **loop** repeats a block of instructions as many times as needed. Thanks to loops, a program of just a few lines can handle thousands of pieces of data.

## Repeating N times: the for loop

```python
for i in range(5):
    print("Hello")
```

```cpp
for (int i = 0; i < 5; i++) {
    cout << "Hello\n";
}
```

This program prints `Hello` five times. Just like with `if`, the repeated block is the indented block in Python, or the block between curly braces in C++. Each pass through the block is called a **turn** of the loop.

The variable `i` is the **loop variable**: it's `0` on the first turn, `1` on the second, and so on up to `4`. In Python, `range(5)` gives the numbers from 0 to 4: it starts at 0 and stops **before** 5. In C++, the `for` line says it all: the loop starts at `i = 0`, keeps going as long as `i < 5`, and `i++` adds 1 to `i` after each turn.

## Choosing the loop variable's values

The start, the end and the step of the loop variable can all be chosen:

```python
for i in range(1, 6):
    print(i)
for i in range(10, 0, -2):
    print(i)
```

```cpp
for (int i = 1; i <= 5; i++) {
    cout << i << "\n";
}
for (int i = 10; i > 0; i -= 2) {
    cout << i << "\n";
}
```

The first loop prints 1, 2, 3, 4, 5. The second one prints 10, 8, 6, 4, 2: it starts at 10 and goes back by 2 at each turn. In Python, `range(start, stop, step)` always stops **just before** `stop`, even when going backwards.

## Reading N numbers

Often, the input starts with a number `N`, followed by `N` lines that each contain a number. The program reads `N`, then one line at each turn of the loop:

```python
n = int(input())
for i in range(n):
    x = int(input())
    print(x * 2)
```

```cpp
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    cout << x * 2 << "\n";
}
```

This program prints each of the `N` numbers multiplied by 2. At each turn, `x` receives a new number and forgets the old one.

## Adding up a total

A sum uses an **accumulator**: a variable that starts at 0 **before** the loop, and to which something is added at each turn.

```python
total = 0
for day in range(1, 8):
    total = total + day
print(total)
```

```cpp
int total = 0;
for (int day = 1; day <= 7; day++) {
    total = total + day;
}
cout << total << "\n";
```

This program computes 1 + 2 + 3 + 4 + 5 + 6 + 7 and prints `28`. The result is printed **after** the loop, only once. `total += day` is the short form, in both languages.

## Counting

A **counter** works the same way, but 1 is added only when a condition is true. How many multiples of 7 are there between 1 and 100?

```python
count = 0
for i in range(1, 101):
    if i % 7 == 0:
        count = count + 1
print(count)
```

```cpp
int count = 0;
for (int i = 1; i <= 100; i++) {
    if (i % 7 == 0) {
        count = count + 1;
    }
}
cout << count << "\n";
```

The program prints `14`. The indentation matters: the `if` is inside the loop, and the line that adds 1 is inside the `if`.

## Repeating as long as: the while loop

Sometimes the number of turns is not known in advance. Someone puts 15 euros aside every week to buy a 200-euro bike. How many weeks does it take?

```python
savings = 0
weeks = 0
while savings < 200:
    savings = savings + 15
    weeks = weeks + 1
print(weeks)
```

```cpp
int savings = 0;
int weeks = 0;
while (savings < 200) {
    savings = savings + 15;
    weeks = weeks + 1;
}
cout << weeks << "\n";
```

The `while` loop checks the condition **before** each turn. As long as it's true, the block is repeated; as soon as it becomes false, the loop stops and the program carries on after it. Here, it prints `14`: after 13 weeks, the savings are only 195 euros.

Be careful: if the condition never becomes false, the loop runs forever and the program never stops. Each turn must bring the loop closer to the exit.

## Key takeaways

- `for i in range(n)` in Python, `for (int i = 0; i < n; i++)` in C++: the block is repeated `n` times, with `i` going from 0 to `n - 1`.
- `range(start, stop, step)` stops just before `stop`.
- Accumulators and counters: set to 0 **before** the loop, changed **inside** the loop, printed **after**.
- `while condition` repeats as long as the condition is true; the condition must eventually become false.
