To place antennas, colour a map or fill a grid, nothing better is often known than trying the possibilities. But "trying everything" requires method: list each possibility **exactly once**, abandon as early as possible those that cannot succeed, and estimate the number of cases before writing a single line.

After the subsets and permutations of the "Recursion" chapter, this chapter presents subsets encoded by integers, combinations, then **backtracking** and its two tools: pruning and symmetry breaking.

## Subsets encoded by integers

The "Implicit graphs" chapter introduced **masks**: a set of elements numbered from `0` to `n − 1` is encoded by the integer whose bit `i` is 1 if element `i` is in the set; `1 << i` is the mask of `{i}`, and `mask >> i & 1` tells whether `i` is present. The `2^n` subsets of a list of `n` elements therefore correspond exactly to the integers from `0` to `2^n − 1`, and a simple loop lists them all, without recursion.

```python
t = [3, 5, 7, 9, 2]
n = len(t)
for mask in range(1 << n):              # from 0 to 2^n - 1
    chosen = [t[i] for i in range(n) if mask >> i & 1]
    if sum(chosen) == 12:
        print(mask, chosen)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 5, 7, 9, 2};
    int n = t.size();
    for (int mask = 0; mask < (1 << n); mask++) {   // from 0 to 2^n - 1
        int total_sum = 0;
        for (int i = 0; i < n; i++)
            if ((mask >> i) & 1) total_sum += t[i];
        if (total_sum == 12) {
            cout << mask << " [";
            bool first = true;
            for (int i = 0; i < n; i++)
                if ((mask >> i) & 1) {
                    cout << (first ? "" : ", ") << t[i];
                    first = false;
                }
            cout << "]\n";
        }
    }
    return 0;
}
```

The program prints the three subsets with sum 12: `6 [5, 7]`, `9 [3, 9]` and `21 [3, 7, 2]` (21 is `10101`: bits 0, 2 and 4 denote 3, 7 and 2).

The other set operations also take a single instruction, the same in Python and C++ except for the last two:
- `(1 << n) - 1`: the set of all elements (`n` bits set to 1); a mask can also be written in binary with the prefix `0b`: `0b1111110` is 126, the set `{1, 2, 3, 4, 5, 6}`;
- `a | b` and `a & b`: union and intersection (the bitwise "and" sets to 1 the bits that are 1 in both numbers);
- `a & ~b`: the elements of `a` that are not in `b`, since `~b` flips every bit of `b`; in particular, `m & ~(1 << i)` removes `i`;
- `m & (m - 1)`: `m` without its smallest element;
- `m & -m`: the mask containing only the smallest element of `m`;
- the number of elements: `bin(m).count("1")` in Python, `__builtin_popcount(m)` in C++;
- the index of the smallest element, for `m > 0`: `(m & -m).bit_length() - 1` in Python (`bit_length` gives the number of binary digits), `__builtin_ctz(m)` in C++.

**Why these two tricks work.** Subtracting 1 from `m` turns its last 1 bit into 0 and the 0s after it into 1s, without touching the higher bits: it is the borrow of a written subtraction, in binary. The "and" of `m` and `m − 1` therefore erases exactly that bit: `12 = 1100`, `11 = 1011`, `12 & 11 = 1000 = 8`. Next, `~x` equals `−x − 1` (that is its definition, in Python as in C++), so `−m = ~(m − 1)`: above the lowest 1 bit of `m`, the bits of `−m` are the opposite of those of `m`; at its place, `−m` has a 1; below it, 0s. The "and" keeps only that bit: `12 & −12 = 4`.

The previous loop costs `2^n × n` operations, since each sum is recomputed from scratch. A result already computed can be reused: the sum of `m` is that of `m & (m − 1)`, a smaller integer, hence already handled, plus the smallest element of `m`. An array of the `2^n` sums is filled this way in O(2^n).

```python
t = [3, 5, 7, 9, 2]
n = len(t)
total = [0] * (1 << n)
for m in range(1, 1 << n):
    i = (m & -m).bit_length() - 1          # index of the smallest element of m
    total[m] = total[m & (m - 1)] + t[i]   # m without this element: already computed
print(total[21], sum(1 for m in range(1 << n) if total[m] == 12))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 5, 7, 9, 2};
    int n = t.size();
    vector<int> total(1 << n, 0);
    for (int m = 1; m < (1 << n); m++) {
        int i = __builtin_ctz(m);                  // index of the smallest element of m
        total[m] = total[m & (m - 1)] + t[i];      // m without this element: already computed
    }
    int count = 0;
    for (int m = 0; m < (1 << n); m++)
        if (total[m] == 12) count++;
    cout << total[21] << " " << count << "\n";
    return 0;
}
```

The program prints `12 3`: mask 21 encodes `{3, 7, 2}`, and three masks have sum 12. In Python, an integer can have as many bits as needed; in C++, an `int` has 32 and a `long long` 64: beyond 30 elements, write `1LL << i`, `__builtin_popcountll` and `__builtin_ctzll`.

In practice, `2^20 ≈ 10⁶` subsets are listed without difficulty, `2^25 ≈ 3 × 10⁷` already with difficulty in Python, and `2^40` never.

## Combinations

A **combination** of `k` elements among `n` is a subset of size `k`; there are `C(n, k) = n! / (k! (n − k)!)` of them. To list them without going through the `2^n` subsets, the elements are chosen in increasing order: after choosing `x`, the next one is at least `x + 1`. Imposing an order guarantees that each set is produced only once, instead of `k!` times (once per ordering of its elements).

```python
def combinations(start, chosen):
    if len(chosen) == k:
        result.append("".join(map(str, chosen)))
        return
    # k - len(chosen) more elements are needed: no use starting too late
    for x in range(start, n - (k - len(chosen)) + 2):
        chosen.append(x)
        combinations(x + 1, chosen)
        chosen.pop()

n, k = 5, 3
result = []
combinations(1, [])
print(len(result), *result)
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int n = 5, k = 3;
vector<int> chosen;
vector<string> result;

void combinations(int start) {
    if ((int)chosen.size() == k) {
        string s;
        for (int x : chosen) s += to_string(x);
        result.push_back(s);
        return;
    }
    // k - chosen.size() more elements are needed: no use starting too late
    for (int x = start; x <= n - (k - (int)chosen.size()) + 1; x++) {
        chosen.push_back(x);
        combinations(x + 1);
        chosen.pop_back();
    }
}

int main() {
    combinations(1);
    cout << result.size();
    for (const string &s : result) cout << " " << s;
    cout << "\n";
    return 0;
}
```

The program prints `10`, then the ten combinations of 3 elements among `1 2 3 4 5`, from `123` to `345`. The bound of the loop is a first example of **pruning**: if `r` elements remain to be chosen, the next one cannot exceed `n − r + 1`, otherwise not enough would be left after it. Without this bound, the program would be correct, but it would explore dead branches.

## Backtracking

**Backtracking** builds a solution step by step. At each step, it tries each possible choice, calls itself recursively for the rest, then **undoes** that choice before trying the next one. The set of calls forms the **search tree**: the root is the starting situation, each node is a partial solution, and the leaves are complete solutions or dead ends.

A classic example: placing `n` queens on an `n × n` chessboard so that no two threaten each other (same row, same column or same diagonal). There is exactly one queen per row: they are placed row by row, choosing the column. Three boolean arrays tell whether a column and the two diagonals are already occupied: on one diagonal, `row + column` is constant; on the other, `row − column` is constant (`n` is added to get a positive index).

```python
def place(row):
    global solutions, nodes
    nodes += 1
    if row == n:
        solutions += 1
        return
    for col in range(n):
        if not column[col] and not diag1[row + col] and not diag2[row - col + n]:
            column[col] = diag1[row + col] = diag2[row - col + n] = True
            place(row + 1)
            column[col] = diag1[row + col] = diag2[row - col + n] = False

for n in range(4, 9):
    column = [False] * n
    diag1 = [False] * (2 * n)          # row + col is constant on one diagonal
    diag2 = [False] * (2 * n + 1)      # row - col is constant on the other
    solutions = nodes = 0
    place(0)
    print(n, solutions, nodes)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int n;
long long solutions, nodes;
vector<bool> column, diag1, diag2;

void place(int row) {
    nodes++;
    if (row == n) {
        solutions++;
        return;
    }
    for (int col = 0; col < n; col++) {
        if (!column[col] && !diag1[row + col] && !diag2[row - col + n]) {
            column[col] = diag1[row + col] = diag2[row - col + n] = true;
            place(row + 1);
            column[col] = diag1[row + col] = diag2[row - col + n] = false;
        }
    }
}

int main() {
    for (n = 4; n <= 8; n++) {
        column.assign(n, false);
        diag1.assign(2 * n, false);          // row + col is constant on one diagonal
        diag2.assign(2 * n + 1, false);      // row - col is constant on the other
        solutions = nodes = 0;
        place(0);
        cout << n << " " << solutions << " " << nodes << "\n";
    }
    return 0;
}
```

The program prints, for `n` from 4 to 8, the number of solutions and the number of nodes visited: `4 2 17`, `5 10 54`, `6 4 153`, `7 40 552` and `8 92 2057`.

**Correctness.** Invariant: when `place(row)` is called, the queens of rows `0` to `row − 1` do not threaten each other, and the three arrays describe exactly the columns and diagonals they occupy. A queen is only placed on an unthreatened square, and the arrays are restored on the way back: the invariant is preserved. Every solution is found exactly once, since its placement is the sequence of choices leading to it, and two different branches differ by the column of the same row.

**Cost.** Listing the `8^8 ≈ 1.7 × 10⁷` ways to place one queen per row, then checking them, would take much longer: backtracking visits only 2,057 nodes, because each branch is cut as soon as the new queen is threatened. This is the whole point of **checking constraints as early as possible**.

## Pruning with a bound

For an **optimisation** problem (finding the best solution), a branch can be cut even if it contains valid solutions: it is enough to prove that none of them will beat the best result already found. To that end, a **bound** is computed: an optimistic estimate of what the branch can give at best.

Example: choose numbers from a list whose sum is as large as possible without exceeding `S`. Sort the list in decreasing order and precompute `rest[i]`, the sum of the elements from index `i` on. In a branch where the current sum is `total_sum`, we cannot exceed `total_sum + rest[i]`: if this value does not exceed the best known result, the branch is abandoned.

```python
t = [30, 42, 58, 26, 54, 58, 96, 92, 24, 84, 62, 64, 34, 82, 28, 94, 2, 88, 40, 96]
S = 501
t.sort(reverse=True)
n = len(t)
rest = [0] * (n + 1)                  # rest[i] = t[i] + t[i + 1] + ... + t[n - 1]
for i in range(n - 1, -1, -1):
    rest[i] = rest[i + 1] + t[i]

best = 0
nodes = 0

def explore(i, total_sum):
    global best, nodes
    nodes += 1
    best = max(best, total_sum)
    if i == n or best == S:
        return
    if total_sum + rest[i] <= best:   # even taking all the rest, no better
        return
    if total_sum + t[i] <= S:              # never go above S
        explore(i + 1, total_sum + t[i])
    explore(i + 1, total_sum)

explore(0, 0)
print(best, nodes)
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {30, 42, 58, 26, 54, 58, 96, 92, 24, 84, 62, 64, 34, 82, 28, 94, 2, 88, 40, 96};
int S = 501, n, best = 0;
long long nodes = 0;
vector<int> rest;

void explore(int i, int total_sum) {
    nodes++;
    best = max(best, total_sum);
    if (i == n || best == S) return;
    if (total_sum + rest[i] <= best) return;     // even taking all the rest, no better
    if (total_sum + t[i] <= S) explore(i + 1, total_sum + t[i]);   // never go above S
    explore(i + 1, total_sum);
}

int main() {
    sort(t.begin(), t.end(), greater<int>());
    n = t.size();
    rest.assign(n + 1, 0);                       // rest[i] = t[i] + t[i + 1] + ... + t[n - 1]
    for (int i = n - 1; i >= 0; i--) rest[i] = rest[i + 1] + t[i];
    explore(0, 0);
    cout << best << " " << nodes << "\n";
    return 0;
}
```

The program prints `500 104218`: the best sum is 500 (all numbers are even, 501 is impossible), and the search visited 104,218 nodes. Without the bound, it would visit 669,640, and without any cut, the 2,097,151 nodes of the full tree. Sorting in decreasing order quickly gives a good solution, which makes the bound effective.

A bound must be **optimistic**: it must never underestimate what the branch can reach, otherwise a branch containing the best solution would be cut. Here, `total_sum + rest[i]` is indeed at least any sum reachable in the branch.

## Counting or finding

Three questions must be told apart. **Is there** a solution? Each call returns `True` as soon as a recursive call succeeded: the search stops at the first solution. **How many** are there? Each call returns the sum of the results of its branches, and the whole tree is visited. **Which is the best**? The best value is kept, which allows pruning with a bound. The first question is often the fastest, except when the answer is "no": the whole tree must then be visited to be sure.

## Estimating the size of the tree

Before programming, estimate the number of nodes: in the worst case, the product of the numbers of choices at each level. Subsets: `2^n` leaves. Permutations: `n!`. One queen per row: `n^n`, but `n!` if columns already taken are excluded from the start. A Python loop does a few million operations per second, a C++ program a few hundred million: `10!` ≈ 3.6 million is reasonable, `15!` ≈ 1.3 × 10¹² never is.

Pruning makes the estimate more delicate, but it can often be justified by a **recurrence**. Suppose that at each node, an element is chosen and one of the two branches removes at least 3 of them (the element and two neighbours, for example). The number of leaves satisfies `T(n) ≤ T(n − 1) + T(n − 3)`, hence, by induction, `T(n) ≤ 1.47ⁿ`, since 1.47³ ≈ 3.18 exceeds 1.47² + 1 ≈ 3.16: about 200,000 for `n = 32`, against 4 billion for `2ⁿ`. For a concrete measure, add a call counter, as in the examples above, and test the most unfavourable cases.

## Breaking symmetries

When several solutions are "the same" up to a transformation, avoid exploring all of them: impose a rule that keeps a single representative of each family. This is **symmetry breaking**, and it can shrink the tree by a large factor.

- **Order does not matter**: impose increasing elements, as for combinations. A set of `k` elements is then produced once instead of `k!` times.
- **Rotations of a circle**: fix the first element in the first place; each circular arrangement of `n` elements is produced once instead of `n` times.
- **Interchangeable objects**: if packets, colours or machines are identical, putting an object into the first empty packet or the second one gives equivalent situations. Try **a single** empty packet.
- **Equal values**: in a list with duplicates, choosing the first 5 or the second gives the same thing; sort the list and skip a value equal to the one just tried at the same level.

One must prove that the rule loses no solution: each family must keep **at least one** representative, and, when counting, **exactly one**.

## Common mistakes

**Forgetting to undo a choice.** After the recursive call, the state must become exactly what it was: remove the added element, free the column, subtract the object from the packet. Otherwise, the next branches start from a wrong state, and the results are wrong without any error message.

**Copying the state at each call.** Passing `list + [x]` or a copy of the grid is correct, but costs O(n) per node: modify a single state, then restore it.

**A cut that is too aggressive.** A pessimistic bound or a badly justified symmetry rule cuts branches that contained the solution: the program answers fast, but wrong. Always check on small cases against an enumeration with no cut at all.

**Checking too late.** Testing the constraints only once the full solution is built amounts to listing the whole space: check each constraint as soon as its elements are placed.

## Complete example: packets with the same sum

**Statement.** Can a list of positive integers be split into `K` packets with the same sum, each number going into a single packet? The first line gives the numbers, the second `K`; print `YES` or `NO`.

**Idea.** Each packet must sum to `total / K`: if `K` does not divide the total, or if a number exceeds this target, the answer is `NO`. Otherwise, place the numbers one by one, each into a packet where it still fits. To shrink the tree, sort the numbers in decreasing order (large ones are the most constrained), stop at the first split found, and try only one empty packet, since they are interchangeable.

```python
def fill_packets(i):
    # put objects i, i + 1, ... into the packets; true if possible
    if i == len(t):
        return True
    for p in range(k):
        if packets[p] + t[i] <= target:
            packets[p] += t[i]
            if fill_packets(i + 1):
                return True
            packets[p] -= t[i]
        if packets[p] == 0:
            break          # empty packets are interchangeable: a single try
    return False

t = list(map(int, input().split()))
k = int(input())
total = sum(t)
t.sort(reverse=True)       # large objects first: failures come earlier
if total % k != 0 or t[0] > total // k:
    print("NO")
else:
    target = total // k
    packets = [0] * k
    print("YES" if fill_packets(0) else "NO")
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

vector<int> t, packets;
int k, target;

// put objects i, i + 1, ... into the packets; true if possible
bool fill_packets(int i) {
    if (i == (int)t.size()) return true;
    for (int p = 0; p < k; p++) {
        if (packets[p] + t[i] <= target) {
            packets[p] += t[i];
            if (fill_packets(i + 1)) return true;
            packets[p] -= t[i];
        }
        if (packets[p] == 0) break;   // empty packets are interchangeable: a single try
    }
    return false;
}

int main() {
    string row;
    getline(cin, row);
    istringstream stream(row);
    int x, total = 0;
    while (stream >> x) {
        t.push_back(x);
        total += x;
    }
    cin >> k;
    sort(t.begin(), t.end(), greater<int>());   // large objects first: failures come earlier
    if (total % k != 0 || t[0] > total / k) {
        cout << "NO\n";
    } else {
        target = total / k;
        packets.assign(k, 0);
        cout << (fill_packets(0) ? "YES" : "NO") << "\n";
    }
    return 0;
}
```

**Checking by hand.** With `4 3 2 3 5 2 1` and `K = 4`, the target is 20 / 4 = 5. The sorted numbers are `5 4 3 3 2 2 1`: the 5, the 4 and the two 3s each take a packet, the two 2s complete the packets of the 3s, and the 1 that of the 4. The program prints `YES` without ever backtracking. With `2 2 2 2 3 4 5` and `K = 4`, the target is still 5, but the 4 can only be completed by a 1, which does not exist: the program explores every branch and prints `NO`.

**Correctness.** Without the empty packet rule, the function tries every way to put each number into a packet where it fits: it finds a split if one exists. The rule loses nothing: if a split puts the current number into an empty packet other than the first one, swap in it the roles of that packet and of the first empty packet. Since both are empty at that moment, the resulting split is still valid, and it puts the number into the first empty packet.

**Cost.** In the worst case, `Kⁿ` placements. The empty packet rule divides this number by about `K!`, and the limit `packet + number ≤ target` cuts bad branches very early; for about twenty numbers, the search stays fast in practice.

## Key takeaways

- A subset is encoded by a **mask** of `n` bits: a loop from `0` to `2^n − 1` lists every subset; `|`, `&`, `~`, `m & (m − 1)` and `m & −m` handle sets, and the result of `m & (m − 1)`, already computed, can be reused.
- **Backtracking** makes a choice, calls itself, then **undoes** that choice; constraints are checked **as early as possible** to cut dead branches.
- To optimise, an **optimistic bound** ("at best, this branch gives…") allows abandoning branches that will not beat the best known result.
- **Finding** a solution stops at the first success; **counting** or proving that there is none requires visiting the whole tree.
- **Estimate the size of the tree** before programming (`2^n`, `n!`, a recurrence like `T(n) ≤ T(n − 1) + T(n − 3)`), and measure with a call counter.
- **Breaking symmetries** (increasing order, fixed first element, a single empty packet, skipped duplicates) shrinks the tree without losing solutions, provided it is justified.
