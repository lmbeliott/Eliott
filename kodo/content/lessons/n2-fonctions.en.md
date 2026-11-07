When a program grows, it quickly becomes hard to read: dozens of lines, loops inside loops, the same calculation copied in three places. **Functions** let you give a name to a piece of calculation, then reuse it as many times as you want.

## Defining and calling a function

A function receives values, its **parameters**, and **returns** a result with `return`. Here is a function that turns a time of day into minutes since midnight:

```python
def to_minutes(hours, minutes):
    return hours * 60 + minutes

start = to_minutes(8, 15)    # 495
end = to_minutes(12, 40)     # 760
print(end - start)           # 265
```

```cpp
int to_minutes(int hours, int minutes) {
    return hours * 60 + minutes;
}

int main() {
    int start = to_minutes(8, 15);   // 495
    int end = to_minutes(12, 40);    // 760
    cout << end - start << "\n";     // 265
    return 0;
}
```

The function is written only once and used twice. If it contains a mistake, you fix it in a single place.

In C++, you have to give the **type** of what the function returns (`int`, `bool`, `string`…) and the type of each parameter. The function must be written **before** `main`, otherwise the compiler doesn't know it yet. A function that returns nothing has the type `void`.

A function can also return text. In C++, its type is then `string`, and `to_string(n)` turns a number into text:

```python
def two_digits(n):
    if n < 10:
        return "0" + str(n)   # 7 gives "07"
    return str(n)
```

```cpp
string two_digits(int n) {
    if (n < 10) {
        return "0" + to_string(n);   // 7 gives "07"
    }
    return to_string(n);
}
```

A list is returned the same way, with the type `vector<int>` in C++.

## Returning is not printing

`return` gives the result back to the code that called the function: it can store it in a variable, compare it, pass it to another function. `print` (or `cout`) writes it on the screen, and the program can't do anything with it any more. In the vast majority of cases, a function should **return** its result, and the main program does the printing.

As soon as `return` runs, the function stops. That's often used in functions that answer true or false:

```python
def is_vowel(c):
    if c in "aeiouy":
        return True
    return False

print(is_vowel("e"))   # True
```

```cpp
bool is_vowel(char c) {
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') {
        return true;
    }
    return false;
}

int main() {
    cout << is_vowel('e') << "\n";   // 1 (true)
    return 0;
}
```

## Tidy variables

The variables created inside a function, and its parameters, are **local**: they only exist during the call. So two functions can each have a variable called `total` without mixing them up. To get a value out of a function, you return it with `return`.

In C++, parameters are **copies**: if the function changes its parameter `n`, the variable passed by the main program doesn't change. In Python, it's the same for numbers and strings (but careful: a list changed inside a function is changed for everyone).

## Splitting a problem

The real power of functions is cutting a big problem into small, simple pieces. For example, to count the numbers from 1 to 1,000 whose digits add up to 10, you first write a function for the sum of the digits, then use it in the main loop:

```python
def digit_sum(n):
    total = 0
    while n > 0:
        total += n % 10    # the last digit
        n = n // 10        # remove it
    return total

count = 0
for n in range(1, 1001):
    if digit_sum(n) == 10:
        count += 1
print(count)
```

```cpp
int digit_sum(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;   // the last digit
        n = n / 10;        // remove it
    }
    return total;
}

int main() {
    int count = 0;
    for (int n = 1; n <= 1000; n++) {
        if (digit_sum(n) == 10) {
            count++;
        }
    }
    cout << count << "\n";
    return 0;
}
```

Notice that `digit_sum` changes `n`, but only its own local copy: the variable `n` of the loop isn't touched.

A good method: before writing the program, ask yourself "which small questions do I need to answer?". Each question becomes a function, with a name that says what it does (`is_leap_year`, `to_minutes`, `digits`…). A function can call another function: write the simplest ones first, check them by hand on one or two examples, then build the next ones on top of them.

## Key takeaways

- A function gives a name to a calculation: you write it once, and call it as often as you want.
- `return` gives back the result and stops the function; the main program does the printing.
- The variables of a function are local; number and string parameters are copies (a Python list is shared).
- In C++, you give the return type and the type of each parameter, and you write the function before `main`.
- For a complicated problem, split it into small functions, and write and check the simplest ones first.
