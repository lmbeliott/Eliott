So far, programs always did the same thing, whatever the data. With a **condition**, a program can make choices: print one message or another, depending on the numbers it has read.

## If… else

A test is passed with at least 30 points:

```python
points = int(input())
if points >= 30:
    print("Test passed")
else:
    print("Test failed")
```

```cpp
int points;
cin >> points;
if (points >= 30) {
    cout << "Test passed\n";
} else {
    cout << "Test failed\n";
}
```

If the condition `points >= 30` is true, the program runs the first block; otherwise, it runs the `else` block. Never both.

In Python, the `if` and `else` lines end with a colon `:`, and each block is **shifted to the right** (this is called "indented") by 4 spaces. This shift is what tells Python which lines belong to the block. In C++, the condition goes between parentheses and the block between curly braces `{ }`.

The `else` is optional: an `if` on its own runs its block when the condition is true, and does nothing otherwise.

## Comparisons

A condition often compares two values. The operators are the same in Python and in C++:

- `==`: equal to;
- `!=`: not equal to;
- `<` and `>`: strictly less than, strictly greater than;
- `<=` and `>=`: less than or equal to, greater than or equal to.

Watch out for the double equals sign: `x = 5` stores 5 in `x`, whereas `x == 5` **asks** whether `x` is 5.

Statements deserve a careful read: "at least 8" is written `>= 8`, "more than 8" or "strictly greater than 8" is written `> 8`, "at most 8" is written `<= 8`.

The remainder of a division, `%`, is very useful in conditions. For example, a number is even when the remainder of its division by 2 is 0:

```python
n = int(input())
if n % 2 == 0:
    print("even")
else:
    print("odd")
```

```cpp
int n;
cin >> n;
if (n % 2 == 0) {
    cout << "even\n";
} else {
    cout << "odd\n";
}
```

## Several cases: elif

When there are more than two cases, the tests are chained with `elif` in Python (short for "else if"), and `else if` in C++:

```python
points = int(input())
if points < 30:
    print("Test failed")
elif points < 80:
    print("Test passed")
else:
    print("Excellent")
```

```cpp
int points;
cin >> points;
if (points < 30) {
    cout << "Test failed\n";
} else if (points < 80) {
    cout << "Test passed\n";
} else {
    cout << "Excellent\n";
}
```

The tests are done **in order**, and only the first true test is run: the following ones are skipped. So when the program reaches `points < 80`, it already knows that `points` is at least 30. The final `else` catches every case that is left.

The order of the tests matters: if `points < 80` were tested first, a test would never be announced as failed.

In Python, the `elif` line also ends with a colon `:`, and its block is indented.

## Combining conditions

Several conditions can be combined:

- `and` in Python, `&&` in C++: true if both conditions are true;
- `or` in Python, `||` in C++: true if at least one of the two is true;
- `not` in Python, `!` in C++: flips a condition.

A park closes if the wind is above 60 km/h or if it's colder than −20 degrees:

```python
wind, temperature = map(int, input().split())
if wind > 60 or temperature < -20:
    print("CLOSED")
else:
    print("OPEN")
```

```cpp
int wind, temperature;
cin >> wind >> temperature;
if (wind > 60 || temperature < -20) {
    cout << "CLOSED\n";
} else {
    cout << "OPEN\n";
}
```

To check that a number is between two values, Python accepts the math notation: `12 <= age <= 17`. C++ requires `12 <= age && age <= 17`. Be careful: `12 <= age <= 17` is accepted by the C++ compiler, but it does something else entirely.

## Testing the edge cases

Once the program is written, it should be tried with the "boundary" values: if the rule says "at least 30", test 29, 30 and 31. That's where most mistakes hide.

## Key takeaways

- `if` / `else` let a program choose. In Python: colon and indentation; in C++: parentheses and curly braces.
- `==` compares, `=` stores a value.
- With `elif` (`else if`), only the first true test is run: the order of the tests matters.
- `and`, `or`, `not` in Python are written `&&`, `||`, `!` in C++. In C++, no `a <= x <= b`: it is `a <= x && x <= b`.
- Always test the boundary values.
