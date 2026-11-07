Level 2 added many tools: decimal numbers and rounding, lists, strings, functions, grids, dictionaries and sets. Each one, taken alone, is simple. The difficulty of a review problem lies elsewhere: choosing the right tools, putting them together cleanly, and checking that the program is correct in every case. This chapter reviews these three skills.

## Choosing the right structure

Before writing a loop, ask yourself what information the program must **remember**, and in what form. The following table sums up the choices of the level.

| Need | Structure |
| --- | --- |
| A total, a counter, a maximum | a simple variable |
| Values in order, accessible by their position | a list |
| A text, read or built letter by letter | a string |
| Cells identified by a row and a column | a grid (list of rows) |
| Knowing whether an element has already been seen | a set |
| Associating information with a word, a large number or a pair | a dictionary |
| Counting occurrences of small integers (digits, letters) | a list of counters |
| Counting occurrences of arbitrary values | a frequency dictionary |

Two reflexes avoid most wrong choices. First, as soon as a loop contains a test `x in list`, ask yourself whether a **set** would be better suited: on large inputs, the list makes the program thousands of times slower. Second, don't use decimal numbers when an integer computation is enough: an average compared with a threshold is tested with `total >= threshold × n`, and rounding to the tenth is computed with integer divisions.

## Splitting a problem into functions

A fifty-line program written as a single block is hard to reread and to fix. Split it into **functions**, each in charge of a single task. The method is always the same.

1. **Write the main program with function names that don't exist yet.** For a simulation on a grid: read the grid, call `next_generation` `K` times, print. The main program then reads like a summary of the solution.
2. **Write each function.** It receives what it needs as **parameters** and returns its result with `return`. It prints nothing and reads nothing: the main program handles input and output.
3. **Test each function alone**, on values chosen by hand, before using it in the rest of the program.

Here is a typical function: the number of neighbours of a cell that contain a given character, ignoring the cells outside the grid.

```python
def neighbours(grid, i, j, ch):
    total = 0
    for di in [-1, 0, 1]:
        for dj in [-1, 0, 1]:
            a = i + di
            b = j + dj
            if (di != 0 or dj != 0) and 0 <= a < len(grid) and 0 <= b < len(grid[0]):
                if grid[a][b] == ch:
                    total = total + 1
    return total

g = ["#.#", "...", "##."]
print(neighbours(g, 1, 1, "#"), neighbours(g, 0, 0, "#"))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int neighbours(const vector<string>& grid, int i, int j, char ch) {
    int total = 0;
    for (int di = -1; di <= 1; di++) {
        for (int dj = -1; dj <= 1; dj++) {
            int a = i + di;
            int b = j + dj;
            if ((di != 0 || dj != 0) && 0 <= a && a < (int)grid.size() && 0 <= b && b < (int)grid[0].size()) {
                if (grid[a][b] == ch) {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

int main() {
    vector<string> g = {"#.#", "...", "##."};
    cout << neighbours(g, 1, 1, '#') << " " << neighbours(g, 0, 0, '#') << "\n";
    return 0;
}
```

The program prints `4 0`. The two calls are small tests: the centre cell touches the four `#`, the corner cell touches none. If the function is correct on these examples, edge included, you can use it without thinking about it again.

## Estimating the running time

Before writing a program, estimate the number of operations it will perform, from the constraints of the statement. An order of magnitude is enough: Python runs about 10 million simple operations per second, C++ a few hundred million. With `N ≤ 100,000`, a double loop over all pairs makes 5 billion iterations: that is impossible. A single pass with a dictionary makes 100,000: that is immediate.

When the count is too large, three ideas from level 2 come back often:

- **replace a search in a list with a set or a dictionary**: each `in` test becomes almost instant;
- **look for the partner instead of trying all pairs**: to count the pairs with sum `K`, ask, for each value `x`, how many values `K - x` have already been read, and a frequency dictionary answers at once;
- **turn the question around**: instead of looking for the divisors of each number, start from each divisor `d` and visit its multiples `2d`, `3d`…; instead of handling each query separately, prepare once and for all the set of all possible answers, then each query becomes a simple `in` test.

## Detecting a cycle

Many simulations repeat the same transformation: a number becomes another number, a robot moves from one cell to the next. What describes the situation at a given time is called the **state**. When there are only finitely many possible states, and the next state depends only on the current one, the sequence must one day come back to a state already seen. From then on, it follows exactly the same path again. It therefore has the shape of a **tail**, gone through once, followed by a **cycle**, repeated forever.

To spot that moment, keep a dictionary that maps each state to the **time** of its first appearance. In the following example, the state is an integer, replaced at each step by the sum of the squares of its digits. The program reads the starting value and a number of steps `K`, then prints the time when the cycle starts, the length of the cycle, and the value obtained after `K` steps.

```python
def next_value(x):
    s = 0
    while x > 0:
        s = s + (x % 10) * (x % 10)
        x = x // 10
    return s

x, k = map(int, input().split())
seq = [x]            # seq[t] = value after t steps
first_time = {x: 0}  # value -> time of its first appearance
y = next_value(x)
while y not in first_time:
    first_time[y] = len(seq)
    seq.append(y)
    y = next_value(y)
start = first_time[y]
length = len(seq) - start
if k < len(seq):
    value = seq[k]
else:
    value = seq[start + (k - start) % length]
print(start, length, value)
```

```cpp
#include <iostream>
#include <map>
#include <vector>
using namespace std;

int next_value(int x) {
    int s = 0;
    while (x > 0) {
        s = s + (x % 10) * (x % 10);
        x = x / 10;
    }
    return s;
}

int main() {
    int x;
    long long k;
    cin >> x >> k;
    vector<int> seq = {x};        // seq[t] = value after t steps
    map<int, int> first_time;     // value -> time of its first appearance
    first_time[x] = 0;
    int y = next_value(x);
    while (first_time.count(y) == 0) {
        first_time[y] = seq.size();
        seq.push_back(y);
        y = next_value(y);
    }
    long long start = first_time[y];
    long long length = seq.size() - start;
    int value;
    if (k < (long long) seq.size()) {
        value = seq[k];
    } else {
        value = seq[start + (k - start) % length];
    }
    cout << start << " " << length << " " << value << "\n";
    return 0;
}
```

With the input `2 1000000`, the sequence is 2, 4, 16, 37, 58, 89, 145, 42, 20, then `next_value(20)` gives 4 again, already seen at time 1. The tail contains only 2, the cycle starts at time `start = 1` and contains `length = 9 - 1 = 8` values. After time `start`, the sequence comes back to the same place every 8 steps: the value at time `K` is therefore the one at time `start + (K - start) % length`, here 1 + 999,999 % 8 = 8. The program prints `1 8 20` without simulating a million steps.

The loop stops because the states are finitely many: a number with at most 10 digits has a sum of squared digits of at most 10 × 81 = 810. It makes at most as many iterations as there are states, even if `K` is 10¹⁸. The number of different values met is `len(seq)`. The dictionary is essential: with an `in` test on the list `seq`, each step would go through the whole path again.

## Testing edge cases

A program that gives the right answer on the example is not necessarily correct. Before submitting, build small inputs for the **edge cases** of level 2, and compute the expected answer by hand:

- **extreme sizes**: a list of a single element, a one-letter word, a grid with a single row or a single column, and the maximal size allowed;
- **the edges of a grid**: a corner cell has only three neighbours;
- **duplicates**: the same value, the same key, the same word twice; and all values equal;
- **ties**: when two candidates have the same score, the statement says which one to choose, and the program must respect it (first seen, smallest…);
- **rounding**: a value that falls exactly halfway, like `12.25` to be rounded to the tenth;
- **negative remainders**: in Python `-1 % 26` is `25`, in C++ it is `-1`;
- **large numbers**: in C++, anything that can exceed 2 × 10⁹ is stored in a `long long`;
- **huge numbers of steps**: if `K` can be 10¹⁸, do not simulate `K` steps, look for a cycle.

## Reading error messages

When the program stops, Python prints the faulty line and a message. The most common ones at level 2:

- `IndexError: list index out of range` (or `string index out of range`): an index goes beyond the size. Look for a loop that goes one turn too far, or a neighbouring cell taken outside the grid. Careful, an index `-1` raises no error: it silently reads the last element;
- `KeyError: 'kiwi'`: reading a key missing from a dictionary. Test with `in` or use `get`;
- `TypeError: unhashable type: 'list'`: a list used as a key or put in a set. Use a tuple;
- `RuntimeError: dictionary changed size during iteration`: keys added or removed while going through the dictionary;
- `ValueError: invalid literal for int() with base 10`: an `int()` applied to a line that contains several numbers or a word; a `split()` was missing;
- `ZeroDivisionError: division by zero`: an average computed over zero values, a forgotten edge case.

In C++, most of these errors produce **no message**: an index outside the array reads a random value or crashes the program, and `d[key]` creates the key instead of reporting that it is missing. A "wrong answer" verdict with no obvious reason should make you think of these two causes.

Finally, the "time limit exceeded" verdict almost always comes from a `while` loop that doesn't stop, or from an `in` test on a list where a set or a dictionary was needed.

## Complete example: the most varied line

**Statement.** Read a grid of `R` rows of `C` letters. Print the largest number of different letters found in a row or in a column.

**Choice of structures.** The grid is a list of strings. To count the different letters of a sequence of letters, the set is the exact tool: its size is the number of distinct elements.

**Splitting.** Two functions: `distinct(letters)` returns the number of different letters of a string, and `column(grid, j)` builds the string formed by column `j`. The main program applies `distinct` to each row and each column and keeps the maximum.

```python
def distinct(letters):
    return len(set(letters))

def column(grid, j):
    c = ""
    for row in grid:
        c = c + row[j]
    return c

r, c = map(int, input().split())
grid = []
for i in range(r):
    grid.append(input())

best = 0
for row in grid:
    best = max(best, distinct(row))
for j in range(c):
    best = max(best, distinct(column(grid, j)))
print(best)
```

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <string>
#include <vector>
using namespace std;

int distinct(const string& letters) {
    set<char> seen;
    for (char x : letters) {
        seen.insert(x);
    }
    return seen.size();
}

string column(const vector<string>& grid, int j) {
    string c = "";
    for (string row : grid) {
        c += row[j];
    }
    return c;
}

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> grid(r);
    for (int i = 0; i < r; i++) {
        cin >> grid[i];
    }
    int best = 0;
    for (string row : grid) {
        best = max(best, distinct(row));
    }
    for (int j = 0; j < c; j++) {
        best = max(best, distinct(column(grid, j)));
    }
    cout << best << "\n";
    return 0;
}
```

**Checking.** With the grid `aab` / `bcd` / `aae`, the rows have 2, 3 and 2 different letters; the columns `aba`, `aca` and `bde` have 2, 2 and 3. The program prints `3`. Edge cases: a grid of a single cell gives 1; a grid where all letters are equal gives 1; a grid with a single row `abc` gives 3, through the row, while each column has only one letter. Each function can also be tested alone: `distinct("abracadabra")` must be 5, and `column(["ab", "cd"], 1)` must be `"bd"`.

## Key takeaways

- Before coding, choose the structure of each piece of information: variable, list, string, grid, set or dictionary. A repeated `in` test is done on a set, not on a list.
- Stay with integers as long as possible; rounding is computed with integer divisions.
- Split into functions that receive parameters and return a result, without reading or printing, and test each one alone on small examples.
- Estimate the number of operations from the constraints. A simulation over finitely many states ends up looping: a dictionary "state → time of first appearance" spots the cycle and lets you jump directly to step `K`.
- Test edge cases: size 1, grid edges, duplicates, ties, values halfway for rounding, negative remainders, large numbers.
- Read error messages (`IndexError`, `KeyError`, `TypeError`, `ValueError`…); in C++, a wrong answer without a message points to an index outside the array or a key created by `[]`.
