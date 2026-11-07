Some problems have no known trick: to find the best way to place antennas, colour a map or fill a grid, nothing better is known, in general, than trying the possibilities. But "trying everything" requires method. Each possibility must be listed **exactly once**, those that cannot succeed must be abandoned as early as possible, and the number of cases must be estimated before writing a single line.

The "Recursion" chapter showed how to generate the subsets and permutations of a list. This chapter goes further: subsets encoded by integers, combinations, then **backtracking** with its two main tools, pruning and symmetry breaking.

## Subsets encoded by integers

A subset of a list of `n` elements is encoded by an integer of `n` bits, called a **mask**: bit `i` is 1 if element `i` is chosen. The `2^n` subsets correspond exactly to the integers from `0` to `2^n − 1`, and a simple loop lists them all, without recursion. The test `mask >> i & 1` tells whether element `i` is taken; `1 << i` is the integer whose only bit set is bit `i`.

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

The program prints the three subsets with sum 12: `6 [5, 7]`, `9 [3, 9]` and `21 [3, 7, 2]`. For example, 21 is `10101` in binary: bits 0, 2 and 4 are set, which denotes the elements 3, 7 and 2.

This loop costs `2^n × n` operations, since each sum is recomputed from scratch. One can often do better by reusing a result already computed: `mask & -mask` isolates the lowest bit of the mask, and the sum of the mask is that of the mask without this bit (a smaller integer, hence already handled) plus one element. An array of `2^n` sums is filled this way in O(2^n). Masks are also used to encode sets inside a state: in Python, an integer can have as many bits as needed; in C++, a `long long` has 64.

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

**Cost.** A naive enumeration of the `8^8 ≈ 1.7 × 10⁷` ways to place one queen per row, checked at the end, would make millions of tries for `n = 8`. Backtracking visits only 2,057 nodes: each branch is cut as soon as the new queen is threatened, without developing the next rows. This is the whole point of **checking constraints as early as possible**.

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

The program prints `500 104218`: the best sum is 500 (all numbers are even, 501 is impossible), and the search visited 104,218 nodes. Without the bound, it would visit 669,640, and without any cut, the 2,097,151 nodes of the full tree. Sorting in decreasing order helps: large numbers at the front quickly give a good solution, which makes the bound effective.

A bound must be **optimistic**: it must never underestimate what the branch can reach, otherwise a branch containing the best solution would be cut. Here, `total_sum + rest[i]` is indeed at least any sum reachable in the branch.

## Counting or finding

Three questions must be told apart. **Is there** a solution? Stop as soon as one is found: the function returns a boolean, and each call returns `True` as soon as a recursive call succeeded. **How many** solutions are there? The whole tree must be visited, and each call returns the sum of the numbers of solutions of its branches. **Which is the best**? The tree is visited while keeping the best value, which allows pruning with a bound.

The first question is often much faster than the second: a single successful branch is enough. But when the answer is "no", the whole tree must be visited to be sure. That is the hard case.

## Estimating the size of the tree

Before programming, estimate the number of nodes: it is the product of the numbers of choices at each level, in the worst case. Subsets: `2^n` leaves. Permutations: `n!`. One queen per row: `n^n`, but `n!` if columns already taken are excluded from the start. A Python loop does a few million operations per second, a C++ program a few hundred million: `10!` ≈ 3.6 million is reasonable, `15!` ≈ 1.3 × 10¹² never is.

Pruning makes the estimate more delicate, but it can often be justified by a **recurrence**. Suppose that at each node, an element is chosen and one of the two branches removes at least 3 of them (the element and two neighbours, for example). The number of leaves satisfies `T(n) ≤ T(n − 1) + T(n − 3)`, hence `T(n) ≤ 1.47ⁿ`: about 200,000 for `n = 32`, against 4 billion for `2ⁿ`. For a concrete measure, add a call counter, as in the examples above, and test the most unfavourable cases.

## Breaking symmetries

When several solutions are "the same" up to a transformation, avoid exploring all of them: impose a rule that keeps a single representative of each family. This is **symmetry breaking**, and it can shrink the tree by a large factor.

- **Order does not matter**: impose increasing elements, as for combinations. A set of `k` elements is then produced once instead of `k!` times.
- **Rotations of a circle**: fix the first element in the first place; each circular arrangement of `n` elements is produced once instead of `n` times.
- **Interchangeable objects**: if packets, colours or machines are identical, putting an object into the first empty packet or the second one gives equivalent situations. Try **a single** empty packet.
- **Equal values**: in a list with duplicates, choosing the first 5 or the second gives the same thing; sort the list and skip a value equal to the one just tried at the same level.

One must prove that the rule loses no solution: each family must keep **at least one** representative, and, when counting, **exactly one**.

## Common mistakes

**Forgetting to undo a choice.** After the recursive call, the state must become exactly what it was: remove the added element, free the column, subtract the object from the packet. Otherwise, the next branches start from a wrong state, and the results are wrong without any error message.

**Copying the state at each call.** Passing `list + [x]` or a copy of the grid at each call is correct, but costs O(n) per node, and can multiply the time by 10 or 100. Modify a single state, then restore it.

**A cut that is too aggressive.** A pessimistic bound or a badly justified symmetry rule cuts branches that contained the solution: the program answers fast, but wrong. Always check on small cases against an enumeration with no cut at all.

**Checking too late.** Testing the constraints only once the full solution is built amounts to listing the whole space: check each constraint as soon as its elements are placed.

**Not stopping.** For an existence question, forgetting to propagate `True` upwards makes the search visit the whole tree and can turn an instant answer into a time limit exceeded.

## Complete example: packets with the same sum

**Statement.** Can a list of positive integers be split into `K` packets with the same sum, each number going into a single packet? The first line gives the numbers, the second `K`; print `YES` or `NO`.

**Idea.** Each packet must sum to `total / K`: if `K` does not divide the total, or if a number exceeds this target, the answer is `NO`. Otherwise, place the numbers one by one, each into a packet where it still fits. Three ideas shrink the tree: sort the numbers in decreasing order (large ones are the most constrained), stop as soon as a split is found, and try only one empty packet, since empty packets are interchangeable.

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

**Checking by hand.** With `4 3 2 3 5 2 1` and `K = 4`, the total is 20 and the target 5. The sorted numbers are `5 4 3 3 2 2 1`. The 5 fills the first packet; the 4 goes into the second; the first 3 fits neither in the first nor in the second packet (4 + 3 > 5) and goes into the third; the second 3 goes into the fourth. The first 2 does not fit into the second packet, but fits into the third (3 + 2 = 5); the second 2 goes into the fourth, and the 1 completes the second. The program prints `YES`. With `2 2 2 2 3 4 5` and `K = 4`, the target is still 5, but the 4 can only be completed by a 1, which does not exist: the program explores every branch and prints `NO`.

**Correctness.** Without the empty packet rule, the function tries every way to put each number into a packet where it fits: it finds a split if one exists. The rule loses nothing: if a split puts the current number into an empty packet, the contents of that packet and of the first empty packet can be swapped, since both are empty at that moment.

**Cost.** In the worst case, `Kⁿ` placements. The empty packet rule divides this number by about `K!`, and the limit `packet + number ≤ target` cuts bad branches very early; for about twenty numbers, the search stays fast in practice.

## Key takeaways

- A subset is encoded by a **mask** of `n` bits: a loop from `0` to `2^n − 1` lists every subset, and the result of the mask without its lowest bit can be reused.
- **Backtracking** makes a choice, calls itself, then **undoes** that choice; constraints are checked **as early as possible** to cut dead branches.
- To optimise, an **optimistic bound** ("at best, this branch gives…") allows abandoning branches that will not beat the best known result.
- **Finding** a solution stops at the first success; **counting** or proving that there is none requires visiting the whole tree.
- **Estimate the size of the tree** before programming (`2^n`, `n!`, a recurrence like `T(n) ≤ T(n − 1) + T(n − 3)`), and measure with a call counter.
- **Breaking symmetries** (increasing order, fixed first element, a single empty packet, skipped duplicates) shrinks the tree without losing solutions, provided it is justified.
