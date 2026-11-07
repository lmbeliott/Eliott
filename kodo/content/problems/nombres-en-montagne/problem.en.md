---
title: Mountain numbers
---

## Statement
A number is a **mountain** when its digits, read from left to right, go up and then come back down, like the outline of a mountain.

More precisely, a number is a mountain if one of its digits, which is neither the first nor the last, is a peak: before it, the digits strictly increase, and after it, they strictly decrease. For example:
- `132`, `1352`, `13531` and `140` are mountain numbers;
- `123` isn't one (it never comes down), nor is `321` (it never goes up), nor `1221` (two equal digits in a row), nor `13513` (it goes back up after coming down), nor `7` or `42` (too short).

Write a program that counts the mountain numbers between `A` and `B` (both included).

## Input
A single line containing two integers `A` and `B`.

## Output
A single integer: how many mountain numbers `n` there are such that `A ≤ n ≤ B`.

## Constraints
- 1 ≤ A ≤ B ≤ 100,000

## Hints
1. Split the problem. First write a function `digits(n)` that returns the list of the digits of `n` in order (`1352` gives `[1, 3, 5, 2]`). The last digit of `n` is `n % 10`, and `n // 10` (`n / 10` in C++, between two `int`s) removes this last digit.
2. Then write a function `is_mountain(n)` that returns true or false. The main program will only have to call it for each number from `A` to `B`.
3. In `is_mountain`, move an index `i` forward as long as the next digit is bigger: you reach the peak. Check that the peak is neither at the very beginning nor at the very end. Then keep moving forward as long as the next digit is smaller: the number is a mountain if this way you get all the way to the last digit.

## Solution
We split the work into two functions. In the reference solutions, they're called `chiffres` ("digits") and `est_montagne` ("is mountain"):
- `chiffres(n)` gets the digits one by one with `n % 10` (the last digit) and `n // 10` (the number without its last digit; `n / 10` in C++). We get them from right to left, so we reverse the list at the end;
- `est_montagne(n)` goes through this list in two stages. First the climb: we move forward as long as `c[i] < c[i + 1]`. If we haven't moved (`i = 0`), the number doesn't go up; if we're already at the end, it doesn't come down: in both cases, it isn't a mountain. Then the descent: we move forward as long as `c[i] > c[i + 1]`. The number is a mountain if and only if we finish on the last digit.

The main program simply counts the `n` from `A` to `B` for which `est_montagne(n)` is true.

The traps:
- equal digits: `1221` isn't a mountain, because the climb and the descent must be **strict**. Both loops stop at the flat part, and we don't finish on the last digit;
- a number that goes back up after coming down, like `13513`: the descent stops too early, and it's the final test "am I on the last digit?" that rejects it;
- zeros: `140` is a mountain (`1 < 4 > 0`). The computation with `%` and `//` treats them like any other digit;
- forgetting to include `B`: in Python, the loop is `range(a, b + 1)`.

You could write everything in one big loop, but with two functions, each piece is short and can be checked on its own: for example, you can test `est_montagne(1221)` by hand.
