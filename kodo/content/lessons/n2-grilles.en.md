A city map, a game board, an image made of pixels: many problems take place on a **grid**, that is, a two-dimensional table with rows and columns.

## Reading a grid

In the problems, a grid is given as `H` lines of `W` characters, for example `.` for a free cell and `#` for a wall:

```text
3 5
..#..
.##..
.....
```

Each line is stored in a list. The cell in row `i` and column `j` is then `grid[i][j]`: first the row, then the column. Numbers start at `0`, row `0` is **at the top** and column `0` **on the left**.

```python
h, w = map(int, input().split())
grid = []
for _ in range(h):
    grid.append(input())
print(grid[0][2])   # #: row 0, column 2
```

```cpp
int h, w;
cin >> h >> w;
vector<string> grid(h);
for (int i = 0; i < h; i++) {
    cin >> grid[i];
}
cout << grid[0][2] << "\n";   // #: row 0, column 2
```

## Going through all the cells

Visiting every cell takes two nested loops: one over the rows, one over the columns. Here, the program counts the walls:

```python
walls = 0
for i in range(h):
    for j in range(w):
        if grid[i][j] == "#":
            walls += 1
print(walls)
```

```cpp
int walls = 0;
for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
        if (grid[i][j] == '#') {
            walls++;
        }
    }
}
cout << walls << "\n";
```

The same double loop can **find a cell**: when `grid[i][j]` is the character searched for, the program remembers `i` and `j`.

## A grid that changes

A second grid is often needed to write down information: the cells already visited, a counter for each cell… It is created with the same size, filled with a starting value.

```python
seen = []
for i in range(h):
    seen.append([False] * w)
seen[1][3] = True
```

```cpp
vector<vector<bool>> seen(h, vector<bool>(w, false));
seen[1][3] = true;
```

In Python, avoid `[[False] * w] * h`: it creates `h` copies of **the same** row, and changing one cell would change the whole column. Another detail: a character in a Python string can't be changed. To change the grid itself, each line is read with `list(input())`, which gives a list of characters. In C++, a `vector<string>` can be changed directly, and a `vector<vector<char>>` also works.

## The neighbours of a cell

The four neighbours of cell `(i, j)` are the one above `(i - 1, j)`, below `(i + 1, j)`, on the left `(i, j - 1)` and on the right `(i, j + 1)`. Rather than writing the same code four times, the four **offsets** go in a list, and a loop goes over them.

Watch out for the edges: a cell on the edge has neighbours outside the grid. A cell must **always** be checked to be inside the grid before it is read. In Python, it's even more of a trap because `grid[-1]` doesn't cause an error: it's the last row.

```python
count = 0   # number of walls next to cell (i, j)
for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
    nr = i + dr
    nc = j + dc
    if 0 <= nr < h and 0 <= nc < w and grid[nr][nc] == "#":
        count += 1
```

```cpp
int dr[4] = {-1, 1, 0, 0};
int dc[4] = {0, 0, -1, 1};
int count = 0;   // number of walls next to cell (i, j)
for (int d = 0; d < 4; d++) {
    int nr = i + dr[d];
    int nc = j + dc[d];
    if (nr >= 0 && nr < h && nc >= 0 && nc < w && grid[nr][nc] == '#') {
        count++;
    }
}
```

The bounds check is written **before** reading the cell: with `and` (or `&&`), if one condition is false, the next ones aren't even evaluated.

For the eight neighbours (diagonals included), two loops run on `dr` and `dc` going from `-1` to `1`, skipping the case `dr = dc = 0`, which is the cell itself.

## Moving around a grid

To move a robot or a game piece around, the program keeps its position `(r, c)` and its direction as an offset `(dr, dc)`: `(-1, 0)` to go up, `(1, 0)` to go down, `(0, -1)` to go left, `(0, 1)` to go right. One step is `r += dr` and `c += dc`. Before moving, it checks that the target cell is inside the grid and free.

## Key takeaways

- `grid[i][j]`: row `i` first, then column `j`, starting from `0` at the top left.
- Two nested loops go through all the cells.
- Before reading a neighbouring cell, always check that it's inside the grid.
- A list of offsets `(dr, dc)` avoids copying the same code four times.
- A second grid (of booleans, of counters…) records what has already been seen.
