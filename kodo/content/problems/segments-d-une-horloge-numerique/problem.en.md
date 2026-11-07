---
title: Segments of a digital clock
---

## Statement
A digital clock shows the time in the form `hh:mm` with four digits. Each digit is drawn with 7 segments, named from `a` to `g`:

```
 aaa
f   b
f   b
 ggg
e   c
e   c
 ddd
```

Here are the segments that are lit for each digit:

| Digit | Segments | Digit | Segments |
| --- | --- | --- | --- |
| `0` | `abcdef` | `5` | `acdfg` |
| `1` | `bc` | `6` | `acdefg` |
| `2` | `abdeg` | `7` | `abc` |
| `3` | `abcdg` | `8` | `abcdefg` |
| `4` | `bcfg` | `9` | `abcdfg` |

Every minute, the display moves to the next time, and some segments **toggle**: they turn on or off. For example, from `09:59` to `10:00`, the first digit goes from `0` to `1`: segments `a`, `d`, `e` and `f` turn off, which makes 4 toggles. After `23:59`, the clock shows `00:00`.

Write a program that answers `Q` questions: for each one, the clock moves forward minute by minute from a start time to an end time, and the program prints the total number of segment toggles.

## Input
- The first line contains the integer `Q`, the number of questions.
- Each of the next `Q` lines contains two times `hh:mm` separated by a space: the start time, then the end time.

If the end time is before the start time, the clock goes through `00:00`. If the two times are equal, the clock does not move.

## Output
`Q` lines: for each question, in order, the total number of segments that toggle while the clock moves from the start time to the end time.

## Constraints
- 1 ≤ Q ≤ 20
- Times go from `00:00` to `23:59`.

## Hints
1. Break the problem down. A function `bascules(x, y)` (*bascule* means "toggle") counts the segments that change when a digit `x` becomes a digit `y`: these are the letters from `a` to `g` present in one of the two drawings but not in the other.
2. Count times in minutes since `00:00` (from 0 to 1,439): moving forward one minute means going from `t` to `(t + 1) % 1440`. A function `chiffres(t)` (*digits*) gives back the four digits on display: `t // 60` gives the hours, `t % 60` the minutes.
3. A function `transition(t)` adds up the toggles of the four digits between `t` and the next minute. The main program starts from the start time and calls `transition` until it reaches the end time.

## Solution
We split the problem into small functions, each easy to check on its own:
- `en_minutes(h)` turns `"09:59"` into `599` (9 × 60 + 59);
- `chiffres(t)` goes the other way and returns the four digits on display: `t // 60` hours and `t % 60` minutes, each split into tens and units;
- `bascules(x, y)` goes through the 7 letters from `a` to `g` and counts those that are lit in only one of the two digits;
- `transition(t)` adds up `bascules` over the four positions, between the digits of `t` and those of `(t + 1) % 1440`.

The main program starts from the start minute and moves forward until it reaches the end minute, adding `transition(t)` at each step. The `% 1440` takes the clock from `23:59` (minute 1,439) to `00:00` (minute 0), which handles by itself the case where the end is before the start.

In the first example, from `09:59` to `10:00`: `0` becomes `1` (4 toggles), `9` becomes `0` (`e` turns on, `g` turns off: 2), `5` becomes `0` (`b` and `e` turn on, `g` turns off: 3), `9` becomes `0` (2). That makes 11, then from `10:00` to `10:01`, the last digit goes from `0` to `1`: 4 more, so 15.

Traps:
- a digit that does not change toggles no segment, and `bascules(x, x)` must return 0;
- a segment lit in both digits (like `b` and `c` between `0` and `1`) does not toggle;
- when the two times are equal, the answer is 0: the clock does not go all the way around.

A question takes at most 1,439 steps, each with four calls to `bascules`: it is very fast.
