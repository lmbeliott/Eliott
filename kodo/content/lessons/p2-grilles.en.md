A chessboard, a city map cut into squares, an image made of pixels, a table of temperatures recorded each day at each hour: all these data have two dimensions. A value is not located by a single position, but by two: a row number and a column number.

To represent them, you use a **grid**, also called a **two-dimensional array** or a **matrix**: a list whose elements are themselves lists, each one representing a row. This chapter shows how to create and read a grid, go through it, compute sums over its rows, columns and diagonals, look at the **neighbours** of a cell without leaving the grid, and make a grid evolve step by step.

## A list of lists

Here is a grid of 2 rows and 3 columns:

```python
g = [[1, 2, 3],
     [4, 5, 6]]
print(g[1][2])
print(g[0])
print(len(g), len(g[0]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{1, 2, 3},
                             {4, 5, 6}};
    cout << g[1][2] << "\n";
    cout << g[0][0] << " " << g[0][1] << " " << g[0][2] << "\n";
    cout << g.size() << " " << g[0].size() << "\n";
    return 0;
}
```

The Python program prints `6`, then `[1, 2, 3]`, then `2 3`.

`g` is a list of two elements; each one is a **row**, that is a list of three numbers. `g[1]` refers to the second row, `[4, 5, 6]`, and `g[1][2]` to the element at index 2 of that row: 6. You always write **the row first, then the column**. A **cell** is located by its **coordinates** `(i, j)`: `i` is the row number, which increases downwards, and `j` the column number, which increases to the right. Both start at 0, as for lists.

The number of rows is `len(g)`; the number of columns is the length of a row, `len(g[0])`. Throughout this chapter, `n` is the number of rows and `m` the number of columns.

In C++, a grid of integers is a `vector<vector<int>>`: an array whose elements are `vector<int>`. Access is written the same way, `g[i][j]`, and the sizes are given by `g.size()` and `g[0].size()`.

## Going through a grid

To visit every cell, use two nested loops: the outer loop goes through the rows, the inner loop through the columns. This is exactly the pattern of level 1, but instead of computing the content of a cell from `i` and `j`, you read it from the grid.

```python
g = [[3, 0, 7],
     [1, 5, 2]]
n = len(g)
m = len(g[0])
total = 0
for i in range(n):
    for j in range(m):
        print(g[i][j], end=" ")
        total = total + g[i][j]
    print()
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{3, 0, 7},
                             {1, 5, 2}};
    int n = g.size();
    int m = g[0].size();
    int total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << g[i][j] << " ";
            total = total + g[i][j];
        }
        cout << "\n";
    }
    cout << total << "\n";
    return 0;
}
```

The program prints the grid on two lines, `3 0 7` then `1 5 2`, then the sum of all cells, `18`. The body of the inner loop runs `n × m` times, once per cell.

## Rows, columns and diagonals

For the sum of a **row** `i`, fix `i` and let `j` vary. For the sum of a **column** `j`, fix `j` and let `i` vary. To get the sums of all the columns, the outer loop is therefore on `j` and the inner loop on `i`: the order of the loops changes, but the access is still `g[i][j]`.

In a square grid of size `n`, the **main diagonal** is made of the cells where `i == j`, from `(0, 0)` to `(n - 1, n - 1)`. The other diagonal, called the **anti-diagonal**, is made of the cells where `i + j == n - 1`, that is `g[i][n - 1 - i]`. A single loop is enough for each.

```python
g = [[2, 7, 6],
     [9, 5, 1],
     [4, 3, 8]]
n = len(g)
for j in range(n):
    s = 0
    for i in range(n):
        s = s + g[i][j]
    print("column", j, ":", s)
d1 = 0
d2 = 0
for i in range(n):
    d1 = d1 + g[i][i]
    d2 = d2 + g[i][n - 1 - i]
print(d1, d2)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{2, 7, 6},
                             {9, 5, 1},
                             {4, 3, 8}};
    int n = g.size();
    for (int j = 0; j < n; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) {
            s = s + g[i][j];
        }
        cout << "column " << j << " : " << s << "\n";
    }
    int d1 = 0, d2 = 0;
    for (int i = 0; i < n; i++) {
        d1 = d1 + g[i][i];
        d2 = d2 + g[i][n - 1 - i];
    }
    cout << d1 << " " << d2 << "\n";
    return 0;
}
```

The three columns have sum 15, and the program finally prints `15 15`: the main diagonal holds 2, 5 and 8, the anti-diagonal 6, 5 and 4. The sum `s` is reset to 0 at the start of each column, like any variable that concerns a single turn of the outer loop.

## Reading a grid

A grid of numbers is usually given like this: a line with `n` and `m`, then `n` lines of `m` numbers. In Python, read each line, turn it into a list of integers, and add it to the grid with `append`. In C++, `cin` reads the numbers one by one, whatever their layout.

```python
n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(map(int, input().split())))
```

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> g(n, vector<int>(m));
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        cin >> g[i][j];
    }
}
```

A grid of **characters**, like a map where `#` is a wall and `.` a free cell, is given line by line, without spaces: `#..#`. In Python, a string can already be read like a list of characters: `g[i][j]` works on a list of strings. But a string cannot be modified. If the program must change cells, turn each line into a list of characters with `list(input())`, and rebuild it for printing with `"".join(row)`. In C++, read a `vector<string>`: C++ `string`s can be modified, `g[i][j] = '#'` is allowed.

```python
n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))
g[0][0] = "@"
for row in g:
    print("".join(row))
```

```cpp
int n, m;
cin >> n >> m;
vector<string> g(n);
for (int i = 0; i < n; i++) {
    cin >> g[i];
}
g[0][0] = '@';
for (int i = 0; i < n; i++) {
    cout << g[i] << "\n";
}
```

## Creating an empty grid

To create a grid of `n` rows and `m` columns filled with zeros, append `n` times a **new** row `[0] * m`. Python offers a shorter way of writing that does exactly the same: `[[0] * m for i in range(n)]` builds a list by evaluating `[0] * m` once for each value of `i`, hence with `n` distinct rows. In C++, `vector<vector<int>> g(n, vector<int>(m, 0));` creates `n` copies of a row of `m` zeros.

```python
n, m = 2, 3
g = []
for i in range(n):
    g.append([0] * m)
h = [[0] * m for i in range(n)]
g[0][1] = 5
h[1][2] = 7
print(g)
print(h)
```

```cpp
int n = 2, m = 3;
vector<vector<int>> g(n, vector<int>(m, 0));
g[0][1] = 5;
```

The Python program prints `[[0, 5, 0], [0, 0, 0]]` then `[[0, 0, 0], [0, 0, 7]]`: each change touches only one cell.

The expression `[[0] * m] * n`, which looks natural, is a **trap**. It creates **a single** row and a list that contains this same row `n` times. The rows are not copies: they are `n` names for the same list. This is called **aliasing**.

```python
g = [[0] * 3] * 2
g[0][1] = 5
print(g)
```

```cpp
// No equivalent in C++: vector<vector<int>> g(2, vector<int>(3, 0));
// always builds distinct rows.
```

This program prints `[[0, 5, 0], [0, 5, 0]]`: by modifying row 0, you also "modified" row 1, since it is the same one. No error message appears, and the program simply gives wrong results. The rule: one row per turn of a loop, with `append` or with `for i in range(n)`.

## The neighbours of a cell

Many grid problems ask you to look at the **neighbours** of a cell. The **4 neighbours** of `(i, j)` are the cell above `(i - 1, j)`, the one below `(i + 1, j)`, the one on the left `(i, j - 1)` and the one on the right `(i, j + 1)`. Rather than writing the same code four times, store the **moves** in two lists: `di` for the change of row, `dj` for the change of column. Neighbour number `d` is `(i + di[d], j + dj[d])`.

A cell on the border has fewer neighbours: cell `(0, 0)` has no neighbour above and none on the left. Before reading `g[ni][nj]`, you must therefore check that the neighbour is **inside the grid**: `0 <= ni < n` and `0 <= nj < m`. Python accepts this double comparison; in C++, write `0 <= ni && ni < n`.

The following program prints, for each cell of a grid of 3 rows and 4 columns, its number of neighbours:

```python
n, m = 3, 4
di = [-1, 1, 0, 0]
dj = [0, 0, -1, 1]
for i in range(n):
    for j in range(m):
        k = 0
        for d in range(4):
            ni = i + di[d]
            nj = j + dj[d]
            if 0 <= ni < n and 0 <= nj < m:
                k = k + 1
        print(k, end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 3, m = 4;
    int di[4] = {-1, 1, 0, 0};
    int dj[4] = {0, 0, -1, 1};
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            int k = 0;
            for (int d = 0; d < 4; d++) {
                int ni = i + di[d];
                int nj = j + dj[d];
                if (0 <= ni && ni < n && 0 <= nj && nj < m) {
                    k = k + 1;
                }
            }
            cout << k;
        }
        cout << "\n";
    }
    return 0;
}
```

It prints:

```
2332
3443
2332
```

The corners have 2 neighbours, the other border cells 3, the inner cells 4.

The **8 neighbours** add the four diagonal cells: the moves are all combinations of `-1`, `0` and `1` for the row and for the column, except `(0, 0)`, which is the cell itself. You can write two lists of 8 elements, or two loops `for a in range(-1, 2)` and `for b in range(-1, 2)` skipping the case `a == 0 and b == 0`.

The same lists are used to **move in a straight line**: from a cell, repeat `i = i + di[d]` and `j = j + dj[d]` as long as the cell stays inside the grid. This is how you go through all the cells that a chess rook or queen can reach.

## Simulating a step

In a **simulation**, the grid evolves in steps, and the new state of each cell depends on the old state of its neighbours. You must then build the new grid in **another** grid. If you modified the grid in place, the cells examined later would see neighbours that were already updated, and not their state at the start of the step.

To start from a copy of the current grid, be careful: `h = g` copies nothing. As for lists passed to a function, `h` becomes a second name for the same grid. Even `list(g)` is not enough: the new list holds the same rows. You must copy **each row**: `h = [list(row) for row in g]`. In C++, on the contrary, `vector<vector<int>> h = g;` makes a real full copy, rows included.

Once the new grid is filled, replace the old one: `g = h`. Writing a function `step(g)` that returns the new grid makes the program very readable: the main loop becomes `for t in range(k): g = step(g)`.

## Common mistakes

**Leaving the grid.** Reading `g[i + 1][j]` on the last row causes `IndexError: list index out of range`. Always test `0 <= ni < n and 0 <= nj < m` **before** reading the cell; the order matters, because `and` stops as soon as the first condition is false.

**Index -1.** Reading `g[i - 1][j]` on row 0 causes **no** error in Python: index -1 refers to the last element. The program reads the last row of the grid as if it were above the first one, and gives a wrong answer without warning. That's why the check `0 <= ni` is essential.

**In C++, no check at all.** `g[ni][nj]` outside the grid produces no clear message: the program reads an arbitrary value or stops with `Segmentation fault`. Checking the bounds is even more important.

**Swapping `n` and `m`, or `i` and `j`.** A program that writes `range(n)` instead of `range(m)` for the columns works on a square grid and fails on a rectangular one. Always test it on a grid with `n ≠ m`.

**Modifying a string.** With `g[i] = input()`, the instruction `g[i][j] = "#"` causes `TypeError: 'str' object does not support item assignment`. Read the lines with `list(input())`.

**Aliasing.** `[[0] * m] * n` and `h = g` do not create independent rows: a change shows up in several places at once.

## Complete example: a forest fire

**Statement.** A forest is a grid of `N` rows and `M` columns. Each cell holds a tree `T`, a burning tree `F` or an empty cell `.`. Every minute, simultaneously: a tree with at least one burning neighbour among its 4 neighbours catches fire, and a burning tree becomes an empty cell. The program reads `N`, `M` and `K` then the grid, and prints the forest after `K` minutes.

**Idea.** It is a simulation: every minute, build a new grid from the old one. Modifying in place would be wrong. If you first put out a fire at `(0, 0)`, its neighbour `(0, 1)`, examined right after, would no longer see it and would not catch fire. If on the contrary you set `(0, 1)` on fire as soon as you see it, cell `(0, 2)`, examined next, would see this new fire and catch fire too: the fire would cross the whole row in one minute. The function `step` only reads the old grid `g` and only writes into the new one `h`.

**Program.**

```python
di = [-1, 1, 0, 0]
dj = [0, 0, -1, 1]

def step(g):
    n = len(g)
    m = len(g[0])
    h = [list(row) for row in g]
    for i in range(n):
        for j in range(m):
            if g[i][j] == "F":
                h[i][j] = "."
            elif g[i][j] == "T":
                for d in range(4):
                    ni = i + di[d]
                    nj = j + dj[d]
                    if 0 <= ni < n and 0 <= nj < m and g[ni][nj] == "F":
                        h[i][j] = "F"
    return h

n, m, k = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))
for t in range(k):
    g = step(g)
for row in g:
    print("".join(row))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int di[4] = {-1, 1, 0, 0};
int dj[4] = {0, 0, -1, 1};

vector<string> step(const vector<string> &g) {
    int n = g.size();
    int m = g[0].size();
    vector<string> h = g;   // real copy in C++
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'F') {
                h[i][j] = '.';
            } else if (g[i][j] == 'T') {
                for (int d = 0; d < 4; d++) {
                    int ni = i + di[d];
                    int nj = j + dj[d];
                    if (0 <= ni && ni < n && 0 <= nj && nj < m && g[ni][nj] == 'F') {
                        h[i][j] = 'F';
                    }
                }
            }
        }
    }
    return h;
}

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<string> g(n);
    for (int i = 0; i < n; i++) {
        cin >> g[i];
    }
    for (int t = 0; t < k; t++) {
        g = step(g);
    }
    for (int i = 0; i < n; i++) {
        cout << g[i] << "\n";
    }
    return 0;
}
```

**Checking by hand.** With `N = 3`, `M = 3` and the forest below on the left, here is the state after one minute, then after two minutes:

```
TTT      TFT      F.F
TFT      F.F      ...
TTT      TFT      F.F
```

During the first minute, the central fire goes out, and its four direct neighbours catch fire. The corners do not touch the centre by a side: they stay trees. During the second minute, each corner has two burning neighbours and catches fire, while the four fires go out. With `K = 3`, everything would be empty. Diagonals do not count: that is the definition of the 4 neighbours. Thanks to the bounds check, corner `(0, 0)` only looks at its two neighbours `(1, 0)` and `(0, 1)`.

## Key takeaways

- A grid is a list of rows: `g[i][j]` is the cell in row `i` and column `j`. There are `n = len(g)` rows and `m = len(g[0])` columns; in C++, `vector<vector<int>>` or `vector<string>`.
- Sum of a row: `i` fixed, `j` varies. Sum of a column: `j` fixed, `i` varies. Diagonals of a square: `g[i][i]` and `g[i][n - 1 - i]`.
- Create a grid with a new row per turn of a loop (`[[0] * m for i in range(n)]`), never with `[[0] * m] * n`.
- Go through the neighbours with two lists of moves `di` and `dj` (4 or 8 directions), and check `0 <= ni < n` and `0 <= nj < m` before reading the cell.
- To simulate a step, read the old grid and write into a new one. In Python, copy row by row (`[list(row) for row in g]`); in C++, `h = g` copies everything.
