A program is a list of orders given to the computer. The simplest order, and the first one to learn, is to **print** something on the screen: a word, a sentence, a number. Printing is also how a program communicates its result: on Kodo, the judge reads what the program prints and compares it with the expected answer.

This chapter shows how to print text and numbers, how to chain several instructions, how to put several values on the same line and how to draw small figures with characters. By the end, you will for instance be able to write a program that prints this frame followed by its width:

```python
print("+-----+")
print("|.....|")
print("+-----+")
print("Largeur :", 7)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "+-----+" << "\n";
    cout << "|.....|" << "\n";
    cout << "+-----+" << "\n";
    cout << "Largeur :" << " " << 7 << "\n";
    return 0;
}
```

The whole lesson is written in the two languages offered by the site, Python and C++. Just read the one you chose.

## Printing text

In Python, you print a text with `print`, followed by parentheses containing the text between quotes:

```python
print("Bonjour")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Bonjour" << "\n";
    return 0;
}
```

This program prints:

```
Bonjour
```

A line of program such as `print("Bonjour")` is called an **instruction** (or statement): it is an order the computer carries out. The text placed between quotes is called a **string**. The quotes are not printed: they only mark where the text starts and where it ends. Everything between them is copied as is, spaces and punctuation included.

In C++, a program always has the same overall shape, which must be written every time:

- `#include <iostream>` asks to use the part of C++ that handles printing and reading;
- `using namespace std;` lets you write `cout` instead of `std::cout`;
- `int main() { … }` is the main part of the program: instructions go between the braces;
- `return 0;` ends the program, signalling that everything went well.

Printing itself is done with `cout` (for *console output*), followed by `<<` and then what you want to print. Several `<<` can be chained. The text `"\n"` is a special character, the **newline**: it moves to the next line. In Python, `print` moves to the next line by itself at the end; in C++, you have to ask for it. Finally, every C++ instruction ends with a semicolon `;`. The semicolon, not the line break, marks the end of the instruction: a long instruction can therefore be written over several lines.

## A sequence of instructions

A program usually contains several instructions, written one below the other. The computer runs them **in order**, from top to bottom, each one once. Such a series of instructions is called a **sequence**.

```python
print("un")
print("deux")
print("trois")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "un" << "\n";
    cout << "deux" << "\n";
    cout << "trois" << "\n";
    return 0;
}
```

This program prints:

```
un
deux
trois
```

Each `print` produces a new line, because Python moves to the next line after each print. In C++, it is the `"\n"` at the end of each instruction that creates the three lines. If you swap two instructions, you swap the two printed lines: the order of the instructions is exactly the order of the output.

In C++, since newlines are not automatic, you can also build a single line with several instructions: `cout << "ab";` then `cout << "cd" << "\n";` print `abcd` on a single line.

## Printing numbers

To print an integer, write it **without quotes**:

```python
print(2026)
print(-15)
print(1000000)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 2026 << "\n";
    cout << -15 << "\n";
    cout << 1000000 << "\n";
    return 0;
}
```

This program prints:

```
2026
-15
1000000
```

A number written without quotes is a numeric value: the computer knows it is a number and will later be able to compute with it. On screen, `print(2026)` and `print("2026")` give the same thing, but they are two values of a different nature: the first one is an **integer**, the second one is a string of four characters. The difference will matter in the chapter on computations.

Never write a space or a comma inside a number: `1 000 000` or `1,000,000` is not a valid number in Python or C++. Write `1000000`.

## Several values on the same line

In Python, you can give several values to `print`, separated by commas. They are printed on the same line, separated by a space:

```python
print("Il reste", 3, "places")
print(1, 2, 4, 8)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Il reste" << " " << 3 << " " << "places" << "\n";
    cout << 1 << " " << 2 << " " << 4 << " " << 8 << "\n";
    return 0;
}
```

This program prints:

```
Il reste 3 places
1 2 4 8
```

In Python, the space between two values is added automatically: do not put one inside the quotes, otherwise you get two. In C++, nothing is added automatically: `cout << 1 << 2` prints `12`, stuck together. You must write the space yourself, with `" "`. You can also include it in a text: `cout << "Il reste " << 3 << " places\n";` prints the same line: the newline `\n` can also be written inside a text.

This is the usual way to print a list of numbers on one line, for instance the first terms of a sequence.

## Empty lines

To skip a line, print a line that contains nothing. In Python, it is `print()` with empty parentheses; in C++, it is a plain newline:

```python
print("haut")
print()
print("bas")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "haut" << "\n";
    cout << "\n";
    cout << "bas" << "\n";
    return 0;
}
```

This program prints three lines: `haut`, an empty line, then `bas`.

On Kodo, the judge compares the output **word by word**: extra spaces and empty lines are ignored. An empty line therefore makes the output easier to read for a human, but does not change the verdict. On the other hand, words and numbers must be exactly the requested ones, in the right order, with the requested upper and lower case.

## Comments

A **comment** is a text written in the program for the human reader, which the computer ignores. In Python, it starts with `#` and goes to the end of the line. In C++, it starts with `//`.

```python
# First line of the figure
print("*")
print("**")  # second line
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // First line of the figure
    cout << "*" << "\n";
    cout << "**" << "\n";  // second line
    return 0;
}
```

This program prints only `*` then `**`. Comments are used to explain an idea or to split a program into parts. You will find them in every reference solution.

## Drawing with characters

With print instructions alone, you can already build figures: each instruction draws one line, and the complete figure is the sequence of these lines. The real work is not writing the `print`s, it is **finding the pattern**: how many lines, and what each one contains.

The right method is to draw the figure on paper, number the lines, then describe each line with a rule. For instance, for a triangle of height 4 whose line number k contains k stars, you get the lines `*`, `**`, `***` and `****`. Check the number of lines and the number of characters on each one before writing the program.

Since the judge ignores spaces, a figure that must be shifted to the right uses a visible character as filling, usually the dot `.`: the line `..*..` really has five characters, and the shift is part of the answer.

## Common mistakes

When a program contains an error, the computer refuses to run it, or stops, and prints an **error message**. Always read it: it tells you the line and the nature of the problem.

**Forgetting the quotes.** You write `print(Bonjour)` instead of `print("Bonjour")`. Without quotes, Python thinks `Bonjour` is a name it should know:

```
NameError: name 'Bonjour' is not defined
```

The fix is to put the quotes back around the text. In C++, the corresponding error is `error: 'Bonjour' was not declared in this scope`.

**Forgetting a quote or a parenthesis.** With `print("Bonjour)`, the text never ends:

```
SyntaxError: unterminated string literal (detected at line 1)
```

With `print("Bonjour"`, it is the parenthesis that is not closed: `SyntaxError: '(' was never closed`. Every opening quote has a closing quote, every opening parenthesis has a closing parenthesis.

**Writing a capital letter.** `Print("Bonjour")` does not work: Python distinguishes upper and lower case, and `Print` does not exist.

```
NameError: name 'Print' is not defined. Did you mean: 'print'?
```

**Putting a space at the start of a line in Python.** An instruction that starts with one or more spaces causes:

```
IndentationError: unexpected indent
```

In Python, the shift at the start of a line has a precise meaning, which you will see in the next chapter. For now, every instruction starts at the far left.

**Forgetting the semicolon in C++.** If you write `cout << "un" << "\n"` without `;`, the compiler does not see where the instruction ends. It notices when it meets the `cout` of the next line:

```
error: expected ';' before 'cout'
```

Just add the semicolon at the end of the instruction that comes before this `cout`.

**Using curly quotes.** The quotes `“ ”` or `« »` that a word processor inserts automatically are not recognised. You need the straight quotes `"` of the keyboard.

**Getting the printed text wrong.** The program runs, but the judge rejects the answer. Compare the program's output with the example in the statement, word by word: an extra capital letter, a typo or a forgotten line is enough to get a wrong answer.

## A complete example

**Statement.** Print a hollow square of side 5: the border is drawn with `#` and the inside is filled with `.`. Then print, on a last line, the number of `#` used.

**Idea.** First draw the square on paper. It has 5 lines of 5 characters. The first and last lines are part of the border: they contain only `#`, that is `#####`. The three middle lines have a `#` at each end and three dots in between: `#...#`. Then count the `#`: 5 on the first line, 5 on the last one, and 2 on each of the 3 middle lines, that is 5 + 5 + 6 = 16. The program only has to print these six lines, in order.

**Program.**

```python
# Top border
print("#####")
# The three middle lines
print("#...#")
print("#...#")
print("#...#")
# Bottom border
print("#####")
# Number of hashes: 5 + 5 + 3 × 2
print(16)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // Top border
    cout << "#####" << "\n";
    // The three middle lines
    cout << "#...#" << "\n";
    cout << "#...#" << "\n";
    cout << "#...#" << "\n";
    // Bottom border
    cout << "#####" << "\n";
    // Number of hashes: 5 + 5 + 3 × 2
    cout << 16 << "\n";
    return 0;
}
```

**Checking by hand.** Read the program again following the order of the instructions and write on paper what it prints:

```
#####
#...#
#...#
#...#
#####
16
```

There are indeed 5 lines of 5 characters, the border is complete, the inside contains 3 × 3 = 9 dots, and 25 − 9 = 16 confirms the number of hashes. You can now submit the program.

## Key takeaways

- A program is a **sequence** of instructions, each run once, from top to bottom: the order of the instructions is the order of the output.
- You print with `print(…)` in Python and `cout << … << "\n";` in C++. A text is written between straight quotes, a number without quotes.
- `print(a, b, c)` prints several values on one line, separated by a space; in C++, you write the space yourself with `" "`.
- `print()` or `cout << "\n";` prints an empty line. The judge compares word by word and ignores extra spaces.
- For a figure, first find the pattern on paper (number of lines, content of each line), then write the program.
- An error message tells you the line and the nature of the problem: always read it.
