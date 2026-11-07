In a maze drawn on a grid, nobody gives the list of edges: we only know that we can move from a square to its neighbour if it is not a wall. In a puzzle, no graph is given either: we get a starting position and rules for moving. Yet in both cases there is a hidden graph: the vertices are the possible situations, and the edges join two situations when a rule lets us go from one to the other.

Such a graph is called an **implicit graph**: it is never built, the neighbours of a vertex are computed when they are needed. The searches of the previous chapter apply as they are, with the same proofs. This chapter shows how to write them on grids, then on more abstract state spaces, and how to estimate their cost.

## A grid is a graph

In a grid with `R` rows and `C` columns, each non-wall square `(i, j)` is a vertex. Its neighbours are the squares `(i + di, j + dj)` for the offsets `(di, dj)` of a fixed list: with **4 neighbours** (up, down, left, right), the list is `(-1, 0), (1, 0), (0, -1), (0, 1)`. Before looking at a neighbour, we check that it is inside the grid and that it is not a wall.

The following program computes, with a breadth-first search from square `S` at the top left, the distance of each square, then prints the distance of square `T` at the bottom right and the number of squares reached.

```python
from collections import deque

grid = ["S.#....",
        ".##.##.",
        "...#...",
        ".#...#.",
        "...#..T"]
r, c = len(grid), len(grid[0])
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

dist = [[-1] * c for _ in range(r)]
dist[0][0] = 0                       # S is at the top left
queue = deque([(0, 0)])
while queue:
    i, j = queue.popleft()
    for di, dj in directions:
        ni, nj = i + di, j + dj
        if 0 <= ni < r and 0 <= nj < c and grid[ni][nj] != "#" and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            queue.append((ni, nj))

reached = sum(1 for i in range(r) for j in range(c) if dist[i][j] != -1)
print(dist[r - 1][c - 1], reached)
```

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<string> grid = {"S.#....",
                           ".##.##.",
                           "...#...",
                           ".#...#.",
                           "...#..T"};
    int r = grid.size(), c = grid[0].size();
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, -1, 1};
    vector<vector<int>> dist(r, vector<int>(c, -1));
    dist[0][0] = 0;                      // S is at the top left
    queue<pair<int, int>> q;
    q.push({0, 0});
    while (!q.empty()) {
        auto [i, j] = q.front();
        q.pop();
        for (int d = 0; d < 4; d++) {
            int ni = i + di[d], nj = j + dj[d];
            if (ni >= 0 && ni < r && nj >= 0 && nj < c && grid[ni][nj] != '#' && dist[ni][nj] == -1) {
                dist[ni][nj] = dist[i][j] + 1;
                q.push({ni, nj});
            }
        }
    }
    int reached = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (dist[i][j] != -1) reached++;
    cout << dist[r - 1][c - 1] << " " << reached << "\n";
    return 0;
}
```

The program prints `10 26`: `T` is 10 moves away from `S`, and the 26 free squares are all reached. The vertex here is the pair `(i, j)`, and the distance array is two-dimensional. A square can also be encoded by a single integer `i × C + j`, between `0` and `R × C − 1`: this is useful to store squares in a one-dimensional array or in a dictionary.

**Cost.** There are at most `R × C` vertices, each with at most 4 neighbours: the search costs O(R × C). The same code gives **8 neighbours** (diagonals included) by adding the offsets `(±1, ±1)`, or the moves of a knight with the offsets `(±1, ±2)` and `(±2, ±1)`.

## Filling an area

Counting the islands of a map, the rooms of a plan or the regions of an image amounts to counting the **connected components** of the grid graph. This operation is called **flood fill**: from a square not yet seen, "fill" its whole area, and count how many fills were needed.

```python
def count_islands(grid, directions):
    r, c = len(grid), len(grid[0])
    seen = [[False] * c for _ in range(r)]
    islands = 0
    for i in range(r):
        for j in range(c):
            if grid[i][j] == "#" and not seen[i][j]:
                islands += 1                 # new island: fill it
                seen[i][j] = True
                stack = [(i, j)]
                while stack:
                    x, y = stack.pop()
                    for dx, dy in directions:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == "#" and not seen[nx][ny]:
                            seen[nx][ny] = True
                            stack.append((nx, ny))
    return islands

world = ["##..#",
         "#..##",
         "..#..",
         ".#..#"]
four = [(-1, 0), (1, 0), (0, -1), (0, 1)]
eight = four + [(-1, -1), (-1, 1), (1, -1), (1, 1)]
print(count_islands(world, four), count_islands(world, eight))
```

```cpp
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int count_islands(const vector<string> &grid, const vector<pair<int, int>> &directions) {
    int r = grid.size(), c = grid[0].size();
    vector<vector<bool>> seen(r, vector<bool>(c, false));
    int islands = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grid[i][j] != '#' || seen[i][j]) continue;
            islands++;                           // new island: fill it
            seen[i][j] = true;
            vector<pair<int, int>> stack = {{i, j}};
            while (!stack.empty()) {
                auto [x, y] = stack.back();
                stack.pop_back();
                for (auto [dx, dy] : directions) {
                    int nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] == '#' && !seen[nx][ny]) {
                        seen[nx][ny] = true;
                        stack.push_back({nx, ny});
                    }
                }
            }
        }
    }
    return islands;
}

int main() {
    vector<string> world = {"##..#",
                            "#..##",
                            "..#..",
                            ".#..#"};
    vector<pair<int, int>> four = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    vector<pair<int, int>> eight = four;
    eight.insert(eight.end(), {{-1, -1}, {-1, 1}, {1, -1}, {1, 1}});
    cout << count_islands(world, four) << " " << count_islands(world, eight) << "\n";
    return 0;
}
```

The program prints `5 3`. With 4 neighbours, the `#` squares form 5 islands; with 8 neighbours, the middle square touches the top right one and the bottom left one diagonally, and three islands merge. A statement must always say which neighbourhood counts.

We use an explicit stack and not a recursive function "mark the square, then call yourself on its neighbours": on a fully free 300 × 300 grid, that recursion would go down to 90,000 nested calls.

## Starting from several sources at once

To compute, for each square, the distance to the **closest** of several sources (the closest fire, the closest exit), we do not run one search per source: we put **all sources in the queue at the start**, at distance 0, then run an ordinary breadth-first search. This is the **multi-source search**.

```python
from collections import deque

grid = ["F....",
        ".##..",
        "...#F",
        "#...."]
r, c = len(grid), len(grid[0])
dist = [[-1] * c for _ in range(r)]
queue = deque()
for i in range(r):
    for j in range(c):
        if grid[i][j] == "F":            # every source, at distance 0
            dist[i][j] = 0
            queue.append((i, j))
while queue:
    i, j = queue.popleft()
    for ni, nj in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):
        if 0 <= ni < r and 0 <= nj < c and grid[ni][nj] != "#" and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            queue.append((ni, nj))
for i in range(r):
    print("".join("#" if grid[i][j] == "#" else str(dist[i][j]) for j in range(c)))
```

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<string> grid = {"F....",
                           ".##..",
                           "...#F",
                           "#...."};
    int r = grid.size(), c = grid[0].size();
    vector<vector<int>> dist(r, vector<int>(c, -1));
    queue<pair<int, int>> q;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grid[i][j] == 'F') {             // every source, at distance 0
                dist[i][j] = 0;
                q.push({i, j});
            }
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [i, j] = q.front();
        q.pop();
        for (int d = 0; d < 4; d++) {
            int ni = i + di[d], nj = j + dj[d];
            if (ni >= 0 && ni < r && nj >= 0 && nj < c && grid[ni][nj] != '#' && dist[ni][nj] == -1) {
                dist[ni][nj] = dist[i][j] + 1;
                q.push({ni, nj});
            }
        }
    }
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grid[i][j] == '#') cout << '#';
            else cout << dist[i][j];
        }
        cout << "\n";
    }
    return 0;
}
```

The program prints:

```text
01232
1##21
234#0
#4321
```

**Why it is correct.** Imagine a fictitious vertex joined to every source. A breadth-first search from that vertex puts all sources at distance 1 in the queue, then proceeds exactly like our program. Its distance to a square is 1 more than the distance from the square to the closest source: the proof of the previous chapter therefore applies as it is. The cost stays O(R × C), whatever the number of sources, instead of a full search per source.

## State spaces

In many problems, the vertex is not a square, but a whole **situation**. A **state** is the description of everything that matters at a given moment, and the **state space** is the set of possible states; the **transitions** (the allowed moves) are the edges. The question "how many moves at least?" becomes a distance, and is solved by a breadth-first search.

Example: a calculator has only two keys, `×2` and `−3`. Starting from `1`, we want to display `5` with as few key presses as possible, never leaving the range from 1 to 1,000. The state is the displayed number; its two neighbours are `2x` and `x − 3`. A dictionary `parent` serves both as marking and as memory of the path.

```python
from collections import deque

LIMIT = 1000
target = 5
parent = {1: None}                   # dictionary: state -> previous state
queue = deque([1])
while queue:
    x = queue.popleft()
    if x == target:
        break
    for y in (2 * x, x - 3):
        if 1 <= y <= LIMIT and y not in parent:
            parent[y] = x
            queue.append(y)

path = [target]
while parent[path[-1]] is not None:
    path.append(parent[path[-1]])
path.reverse()
print(len(path) - 1, path)
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    const int LIMIT = 1000;
    int target = 5;
    vector<int> parent(LIMIT + 1, -1);    // -1: not reached yet
    parent[1] = 0;                         // 0: no previous state
    queue<int> q;
    q.push(1);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        if (x == target) break;
        for (int y : {2 * x, x - 3}) {
            if (y >= 1 && y <= LIMIT && parent[y] == -1) {
                parent[y] = x;
                q.push(y);
            }
        }
    }
    vector<int> path = {target};
    while (parent[path.back()] != 0) path.push_back(parent[path.back()]);
    reverse(path.begin(), path.end());
    cout << path.size() - 1 << " [";
    for (int i = 0; i < (int)path.size(); i++) cout << (i ? ", " : "") << path[i];
    cout << "]\n";
    return 0;
}
```

The program prints `4 [1, 2, 4, 8, 5]`: you must go through 8 to come back down to 5. We stop as soon as the target leaves the queue, since states leave in non-decreasing order of distance.

The bound `LIMIT` is essential: without it, the `×2` key produces larger and larger numbers, the state space is infinite, and a search that does not find the target never stops. When the space is bounded, one must justify that the bound loses no solution, or that it is part of the statement.

**Encoding a state.** A state made of several numbers is stored in a **tuple** (Python) or a `pair`, an `array` (C++), which can serve as a dictionary key. When the components are small, it is better encoded as a single integer, which indexes a plain marking array, much faster than a dictionary. A lock with 3 wheels is the integer from 0 to 999 it displays. A square `(i, j)` and a number `k` from `0` to `K − 1` become `(k × R + i) × C + j`, an integer from `0` to `K × R × C − 1`; two different states get different codes, since `j = code % C`, `i = code // C % R` and `k = code // (R × C)` can be recovered.

**Choosing a complete state.** The state must contain everything that influences what comes next. In a maze with doors and keys, the position is not enough: coming back to a square after picking up a key is real progress. The state is then the pair (position, set of keys picked up). For a die rolling on a grid, it is (position, orientation of the die). An incomplete state gives wrong answers; a state that is too rich makes the space too large.

## A set encoded as an integer

For the keys, a **set** still has to be encoded as a number. The possible elements are numbered from `0` to `n − 1` (key `a` is 0, key `b` is 1…) and the set is written in binary, on `n` digits: the digit of rank `k`, called **bit** `k`, is 1 if element `k` is in the set. The resulting integer is called a **mask**. For example, the set `{0, 2, 3}` is written `1101` in binary, that is 2⁰ + 2² + 2³ = 13. The `2^n` possible sets correspond exactly to the integers from `0` (the empty set) to `2^n − 1` (all the elements): with 6 keys, a mask goes from 0 to 63.

Three operations, written the same way in Python and C++, are enough:
- `1 << k` (left shift by `k` places) equals 2^k: it is the mask of the set `{k}`;
- `m >> k & 1` is bit `k` of `m`: `m >> k` is the quotient of `m` by 2^k, which erases the last `k` bits, and `& 1` keeps the last bit, like `% 2`;
- `m | (1 << k)` adds `k` to the set: the bitwise "or" `|` sets to 1 every bit that is 1 in either number. If `k` was already in the set, `m` does not change.

```python
m = 0                          # empty set
for k in (3, 0, 2, 3):         # add 3, 0, 2, then 3 a second time
    m = m | (1 << k)
print(m, [k for k in range(6) if m >> k & 1])
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int m = 0;                              // empty set
    for (int k : {3, 0, 2, 3})              // add 3, 0, 2, then 3 a second time
        m = m | (1 << k);
    cout << m << " [";
    bool first = true;
    for (int k = 0; k < 6; k++) {
        if (m >> k & 1) {
            cout << (first ? "" : ", ") << k;
            first = false;
        }
    }
    cout << "]\n";
    return 0;
}
```

The program prints `13 [0, 2, 3]`. In a maze with keys, the state `(i, j, keys)` is encoded as `(keys × R + i) × C + j` and indexes an array of `64 × R × C` cells. Picking up key `k` gives the set `keys | (1 << k)`; a door of letter `k` opens if `keys >> k & 1` equals 1.

## The size of the state space

A search visits each state at most once and examines all its transitions: its cost is **the number of states times the number of transitions per state**. Before programming, we therefore estimate this number:

- a lock with `K` wheels has `10^K` states and `2K` transitions per state: 8 × 10⁴ examinations for `K = 4`, but 1.6 × 10⁹ for `K = 8`;
- the orderings of `N` objects form `N!` states: 40,320 for `N = 8`, but more than 3.6 million for `N = 10`;
- a 40 × 40 grid with 6 possible keys gives 40 × 40 × 2⁶ = 102,400 states.

In Python, a few million examinations already take several seconds: beyond that, a better idea is needed. Often, a property of the problem reduces the space **actually reached**. With two 50,000-litre containers that are filled, emptied and poured into each other, there are 2.5 × 10⁹ possible pairs of contents, but after each operation one of the containers is empty or full: at most 200,000 states are reached, those on the border of the rectangle of contents. The reached states are then stored in a dictionary or a set, instead of an array covering the whole space.

A last remark is often decisive. If every transition can be undone (turning a wheel back, flipping the same pancakes again), the graph is undirected: the distance from `A` to `B` is that from `B` to `A`. To answer many questions "how many moves from `X` to the final position?", a **single** search from the final position is enough.

## Common mistakes

**Negative indices in Python.** `grid[i - 1][j]` with `i = 0` raises **no** error in Python: index `-1` denotes the last row. The search then goes through the border of the grid and gives a wrong answer with no message. You must test `0 <= ni < r` **before** reading the square. In C++, reading outside the array gives an arbitrary value or a `Segmentation fault`.

**Marking too late.** As in any breadth-first search, a state is marked when it enters the queue. Otherwise, the same state may enter it thousands of times, and the program exceeds the time limit.

**A visited set stored in a list.** Testing `state in visited` on a Python list scans the whole list: the search becomes quadratic. Use a `set`, a dictionary, or better, an array indexed by the integer code of the state.

**Precedence of bit operators.** In C++, the test "`k` is not in `m`" written `if (m >> k & 1 == 0)` reads as `if (m >> k & (1 == 0))`, because the comparison comes before `&`: it is always false. Write `if ((m >> k & 1) == 0)`. Also in C++, `1 << k` is an `int`: for `k ≥ 31`, use `1LL << k`.

**An infinite or too large space.** Without a bound on the values, the search does not stop and ends with `MemoryError`. With a state that is too rich, it is correct but too slow: count the states again before programming.

**Recursive flood fill.** On a large area, it exceeds the recursion depth: `RecursionError` in Python, `Segmentation fault` in C++. Use a queue or a stack.

## Complete example: the lock

**Statement.** A lock has 3 wheels, each showing a digit from 0 to 9; it therefore displays a code from `000` to `999`, and it shows `000` at the start. A move turns one wheel by one notch, up or down (after 9 comes 0, and before 0 comes 9). Some codes are forbidden: the lock jams if it displays them. Compute the minimum number of moves to display the target code, or `-1`. The input gives the target, then the number `K` of forbidden codes, then those codes.

**Idea.** A state is the displayed code, seen as an integer from 0 to 999. Its 6 neighbours are obtained by changing one digit: the digit of weight `p` (1, 10 or 100) is `x // p % 10`, and replacing it with `n` gives `x + (n − digit) × p`. A breadth-first search from 0, refusing forbidden codes, gives the answer.

```python
from collections import deque

target = int(input())
k = int(input())
forbidden = set(map(int, input().split())) if k > 0 else set()

def neighbours(x):
    # turn one of the 3 wheels by one notch, in either direction
    res = []
    for p in (1, 10, 100):
        digit = x // p % 10
        for new in ((digit + 1) % 10, (digit + 9) % 10):
            res.append(x + (new - digit) * p)
    return res

dist = [-1] * 1000
if 0 not in forbidden:
    dist[0] = 0
    queue = deque([0])
    while queue:
        x = queue.popleft()
        for y in neighbours(x):
            if dist[y] == -1 and y not in forbidden:
                dist[y] = dist[x] + 1
                queue.append(y)
print(dist[target])
```

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int target, k;
    cin >> target >> k;
    vector<bool> forbidden(1000, false);
    for (int i = 0; i < k; i++) {
        int x;
        cin >> x;
        forbidden[x] = true;
    }
    vector<int> dist(1000, -1);
    if (!forbidden[0]) {
        dist[0] = 0;
        queue<int> q;
        q.push(0);
        while (!q.empty()) {
            int x = q.front();
            q.pop();
            // turn one of the 3 wheels by one notch, in either direction
            for (int p : {1, 10, 100}) {
                int digit = x / p % 10;
                for (int next : {(digit + 1) % 10, (digit + 9) % 10}) {
                    int y = x + (next - digit) * p;
                    if (dist[y] == -1 && !forbidden[y]) {
                        dist[y] = dist[x] + 1;
                        q.push(y);
                    }
                }
            }
        }
    }
    cout << dist[target] << "\n";
    return 0;
}
```

**Checking by hand.** With target `008` and the single forbidden code `009`, we would like to go straight down: `000 → 009 → 008`, but `009` is forbidden. Going up to 8 costs 8 moves. The search finds better: `000 → 010 → 019 → 018 → 008`, in 4 moves, going through another wheel to get around the forbidden code. The program prints `4`. With target `123` and the forbidden codes `100`, `010` and `001`, every first move upwards is blocked; the program prints `8`, two more than the usual 6 moves.

**Correctness and cost.** The implicit graph has 1,000 vertices; two codes are joined if they differ by one notch on one wheel. The breadth-first search computes exact distances by the proof of the previous chapter. It examines at most 1,000 × 6 transitions.

## Key takeaways

- An **implicit graph** is never built: the neighbours of a vertex are computed when it is processed. The searches and their proofs apply unchanged.
- On a grid, neighbours come from a list of **offsets** (4 neighbours, 8 neighbours, knight); check the **borders before** reading the square, especially in Python where index `-1` is valid.
- **Flood fill** counts the areas of a grid; write it with a stack or a queue, not recursively.
- The **multi-source search** puts every source in the queue at the start: a single search gives the distance to the closest source.
- A **state** describes everything that matters (position, keys, orientation…); encode it as a tuple or, better, as an **integer** indexing a marking array. A set becomes a **mask**: `1 << k`, `m >> k & 1`, `m | (1 << k)`.
- The cost of a search is **number of states × transitions per state**: estimate it before programming, bound the space, and store only the reached states when the space is huge.
