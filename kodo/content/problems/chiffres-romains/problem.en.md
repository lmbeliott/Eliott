---
title: Roman numerals
---

## Statement
Convert numbers between the usual notation and Roman numerals, in both directions.

The Roman symbols are worth `I` = 1, `V` = 5, `X` = 10, `L` = 50, `C` = 100, `D` = 500 and `M` = 1000. A number is written by noting its thousands, then its hundreds, its tens and its units, and the values of the symbols are added. Six pairs are exceptions: a symbol placed just before a larger symbol is **subtracted**, which gives `IV` = 4, `IX` = 9, `XL` = 40, `XC` = 90, `CD` = 400 and `CM` = 900. So 1994 is written `MCMXCIV` (1000 + 900 + 90 + 4) and 2026 is written `MMXXVI`.

## Input
The first line contains the integer `Q`. Each of the next `Q` lines contains either an integer written with digits, or a number correctly written in Roman numerals (in uppercase).

## Output
`Q` lines: for each input line, in order, the same number in the other notation.

## Constraints
- 1 ≤ Q ≤ 1,000
- All numbers are between 1 and 3,999.

## Hints
1. To know which way to convert, just look at the first character of the line: a digit or a letter.
2. From digits to Roman: store in two arrays the 13 values `1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1` and the matching symbols `M, CM, D, CD, …, IV, I`. For each value, from the largest to the smallest, while the number is at least this value, write the symbol and subtract the value.
3. From Roman to digits: go through the symbols from left to right. If a symbol is worth less than the one that follows it, subtract its value; otherwise, add it.

## Solution
Read each line as a string; its first character tells the direction of the conversion.

**To Roman numerals.** Prepare two arrays of the same length: the values `1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1` and the symbols `M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I`. Go through these 13 cells in order: while the remaining number is at least the value, append the symbol to the result string and subtract the value. For example, 1994 gives `M` (994 left), `CM` (94 left), `XC` (4 left), then `IV`. Putting the subtractive pairs in the arrays avoids any special case.

**To usual digits.** You need the value of each letter. Without a dictionary, an array of 26 cells indexed by the rank of the letter (`ord(c) - ord("A")`) does the job: store 1 for `I`, 5 for `V`, and so on. Then go through the string by index: the symbol of index `i` is subtracted if it is followed by a larger symbol (`i + 1` must then exist), and added otherwise. For `MCMXCIV`: +1000 −100 +1000 −10 +100 −1 +5 = 1994.

The traps: going outside the string by looking at `s[i + 1]` for the last symbol, and forgetting that the same symbol can repeat (`MMM`, `XXX`): this is the role of the "while" loop in the first conversion.
