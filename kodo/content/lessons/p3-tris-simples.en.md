A teacher wants to publish the marks of a test from the lowest to the highest, find the middle mark, spot two papers with exactly the same mark. All these tasks become simple once the marks are **sorted**: the lowest is at the start, the middle mark is in the middle, and two equal marks are side by side.

To **sort** a list is to reorder its elements so that they are in increasing order: `t[0] ≤ t[1] ≤ … ≤ t[n − 1]`. The values do not change, only their places. This chapter presents three sorting methods that you write yourself, selection sort, insertion sort and counting sort, each with the proof that it really sorts and the number of operations it needs. It then presents the ready-made sorts of Python and C++, which are allowed from now on, and how to use a sort to solve a problem.

## Selection sort

The idea is the one of a player laying out cards on the table: find the smallest and put it first, then the smallest of the remaining cards, and so on. On a list, at step `i`, look for the position `m` of the smallest element among `t[i], t[i + 1], …, t[n − 1]`, then **swap** `t[i]` and `t[m]`.

```python
t = [5, 2, 4, 1, 3]
n = len(t)
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if t[j] < t[m]:
            m = j
    t[i], t[m] = t[m], t[i]
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 2, 4, 1, 3};
    int n = t.size();
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) {
            if (t[j] < t[m]) {
                m = j;
            }
        }
        swap(t[i], t[m]);
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `1 2 3 4 5`. The successive states are `[1, 2, 4, 5, 3]` (the 1 swapped with the 5), `[1, 2, 4, 5, 3]` (the 2 is already in place), `[1, 2, 3, 5, 4]`, then `[1, 2, 3, 4, 5]`. The loop stops at `n − 2`: when the first `n − 1` places are right, the last one is necessarily right.

**Why it is correct.** Use an invariant, as in the previous chapter: *before step `i`, cells `t[0]` to `t[i − 1]` hold the `i` smallest elements of the list, in increasing order*. At the start (`i = 0`), there is nothing to check. If the invariant holds before step `i`, the step puts in `t[i]` the minimum of the remaining elements: it is greater than or equal to all those already placed, and less than or equal to all those left. So the invariant holds before step `i + 1`. At the end, it says that the whole list is sorted. Both loops are `for` loops: the program stops.

**How many operations.** Step `i` makes `n − 1 − i` comparisons, whatever the list. In total: `(n − 1) + (n − 2) + … + 1 = n × (n − 1) / 2` comparisons, that is about `n² / 2`. There are at most `n − 1` swaps, one per step. Selection sort therefore makes many comparisons, always the same number, but very few swaps.

## Insertion sort

This is the method of a player who receives cards one by one and inserts each new card at its place in the already ordered hand. On a list, the part `t[0..i − 1]` is already sorted; take `t[i]` and move it back, swapping it with its left neighbour, as long as that neighbour is larger.

```python
t = [5, 2, 4, 1, 3]
n = len(t)
for i in range(1, n):
    j = i
    while j > 0 and t[j - 1] > t[j]:
        t[j - 1], t[j] = t[j], t[j - 1]
        j = j - 1
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 2, 4, 1, 3};
    int n = t.size();
    for (int i = 1; i < n; i++) {
        int j = i;
        while (j > 0 && t[j - 1] > t[j]) {
            swap(t[j - 1], t[j]);
            j--;
        }
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `1 2 3 4 5`. The states after each insertion are `[2, 5, 4, 1, 3]`, `[2, 4, 5, 1, 3]`, `[1, 2, 4, 5, 3]` (the 1 moved back three cells) and `[1, 2, 3, 4, 5]`. The order of the two conditions of the `while` matters: `j > 0` is tested first, so that `t[-1]` is never read.

**Why it is correct.** Invariant: *before step `i`, cells `t[0]` to `t[i − 1]` hold the same elements as at the start, in increasing order*. Step `i` moves `t[i]` back until its left neighbour is less than or equal to it, or until it reaches cell 0; the elements it passes are all larger than it and stay sorted among themselves. So the part `t[0..i]` is sorted. The `while` loop stops, since `j` decreases by 1 at each turn and does not go below 0.

**How many operations.** It all depends on the list. An **inversion** is a pair of positions `i < j` such that `t[i] > t[j]`. Each swap of insertion sort involves two neighbours in the wrong order: it removes exactly one inversion and does not change the other pairs. So the number of swaps equals the number of inversions of the initial list. An already sorted list has none: the sort only makes `n − 1` comparisons. A strictly decreasing list has `n × (n − 1) / 2`, the maximum. Insertion sort is therefore very fast on an **almost sorted** list, and as slow as selection sort in the worst case.

## Counting sort

When the values are integers between 0 and a small bound `V − 1`, you can sort without any comparison. Count how many times each value appears in a **counting array**, then rewrite the values in increasing order, each as many times as it was counted.

```python
t = [3, 0, 2, 3, 1, 0, 3]
V = 4
cpt = [0] * V
for x in t:
    cpt[x] = cpt[x] + 1
resultat = []
for v in range(V):
    for _ in range(cpt[v]):
        resultat.append(v)
print(*resultat)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 0, 2, 3, 1, 0, 3};
    int V = 4;
    vector<int> cpt(V, 0);
    for (int x : t) {
        cpt[x]++;
    }
    vector<int> resultat;
    for (int v = 0; v < V; v++) {
        for (int k = 0; k < cpt[v]; k++) {
            resultat.push_back(v);
        }
    }
    for (int x : resultat) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `0 0 1 2 3 3 3`. The result is correct: each value is written exactly as many times as it appears, and the values come out in increasing order since they are visited in that order. The cost is about `n` operations to count and `n + V` to rewrite. For 100,000 marks out of 20, that is a few hundred thousand operations, instead of 5 billion comparisons for selection sort. The limit is memory: with values up to 10⁹, you would need an array of a billion cells.

## Stability

You often sort elements according to only a part of them: students by their mark, words by their length. This part is called the **key** of the sort. Two different elements can then have the same key. A sort is **stable** if it leaves elements with the same key in their initial order.

Insertion sort is stable: an element only moves back in front of a **strictly** larger neighbour, it never passes an element with the same key. With `>=` instead of `>`, it would no longer be stable. Selection sort, however, is not stable: with the students `(12, ana)`, `(12, bob)`, `(8, eva)` sorted by mark, the first step swaps `(12, ana)` with `(8, eva)`, and you get `(8, eva)`, `(12, bob)`, `(12, ana)`: `bob` has moved in front of `ana`.

Counting sort can be made stable: instead of counting the elements, store them in one list per key value, in reading order, then join the lists. This is what the following program does, sorting words by length.

```python
mots = ["chat", "a", "bus", "ours", "le"]
paquets = []
for _ in range(5):
    paquets.append([])
for m in mots:
    paquets[len(m)].append(m)
resultat = []
for longueur in range(5):
    for m in paquets[longueur]:
        resultat.append(m)
print(*resultat)
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> mots = {"chat", "a", "bus", "ours", "le"};
    vector<vector<string>> paquets(5);
    for (const string& m : mots) {
        paquets[m.size()].push_back(m);
    }
    for (int longueur = 0; longueur < 5; longueur++) {
        for (const string& m : paquets[longueur]) {
            cout << m << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

The program prints `a le bus chat ours`: `chat` stays in front of `ours`, because it was read first.

## Python and C++ sorts

Hand-written sorts make about `n² / 2` comparisons in the worst case: 5 billion for `n = 100,000`, far too many. Languages provide a much faster sort, which makes about `n × log₂(n)` comparisons, that is about 1.7 million for `n = 100,000`. Level 4 will explain how; from now on, you are allowed to use it.

In Python, `t.sort()` sorts the list `t` in place, and `sorted(t)` returns a **new** sorted list without changing `t`. The parameter `reverse=True` sorts in decreasing order. The parameter `key` gives a function that computes the key of each element: `sorted(mots, key=len)` sorts words by length. Python's sort is stable.

Tuples compare like words in a dictionary: first the first element, then the second in case of a tie, and so on. To sort students by decreasing mark, then by name for equal marks, use the key `(-note, nom)`.

```python
eleves = [("bob", 12), ("eva", 15), ("ana", 12)]

def cle(e):
    return (-e[1], e[0])

print(sorted(eleves, key=cle))
print(sorted([5, 1, 4], reverse=True))
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

bool avant(const pair<string, int>& a, const pair<string, int>& b) {
    if (a.second != b.second) {
        return a.second > b.second;   // decreasing mark
    }
    return a.first < b.first;         // then increasing name
}

int main() {
    vector<pair<string, int>> eleves = {{"bob", 12}, {"eva", 15}, {"ana", 12}};
    sort(eleves.begin(), eleves.end(), avant);
    for (auto& e : eleves) {
        cout << e.first << " " << e.second << "\n";
    }
    vector<int> t = {5, 1, 4};
    sort(t.begin(), t.end(), greater<int>());
    cout << t[0] << " " << t[1] << " " << t[2] << "\n";
    return 0;
}
```

Python prints `[('eva', 15), ('ana', 12), ('bob', 12)]` then `[5, 4, 1]`. In C++, `sort(t.begin(), t.end())` sorts a `vector` in increasing order (it needs `#include <algorithm>`), and `greater<int>()` gives decreasing order. `pair` and `tuple` also compare element by element. For another order, write a comparison function that answers the question "must `a` come **strictly** before `b`?". Careful: `sort` is not stable; when stability matters, use `stable_sort`, which is used the same way. Python also accepts a function written directly in the call: `key=lambda e: (-e[1], e[0])` is a shortcut for the function `cle` above.

## Sorting to solve a problem

Many problems become simple on a sorted list, because elements close in value are close in position there. Three examples:

- **Duplicates.** Two equal values are neighbours after sorting: comparing each element with the next one is enough.
- **Median.** The middle element of the sorted list.
- **Smallest gap.** If `a ≤ b ≤ c`, then `c − a = (c − b) + (b − a)` is at least as large as `b − a`: the smallest gap between two values is reached by two neighbours of the sorted list.

In each case, you pay for the sort once, then a single pass is enough, instead of comparing all pairs.

## Common mistakes

**Writing `t = t.sort()`.** The method `sort` sorts in place and returns `None`. After this line, `t` is `None`, and `t[0]` raises `TypeError: 'NoneType' object is not subscriptable`. Write `t.sort()` alone, or `t = sorted(t)`.

**Sorting numbers read as text.** `sorted(["10", "9", "100"])` gives `['10', '100', '9']`: strings compare character by character, and `"1"` comes before `"9"`. Convert with `int` before sorting.

**A comparison with `<=` in C++.** The function given to `sort` must answer "strictly before". With `return a <= b;`, two equal elements each come before the other; the result can be wrong and the program can even stop with `Segmentation fault`. Write `<`.

**Losing the initial positions.** After a sort, you no longer know where each element was. If the statement asks for positions, sort pairs `(value, position)`.

**Forgetting stability.** A hand-written selection sort, or `sort` in C++, can swap two elements with the same key. If the initial order must be kept for equal keys, use `sorted` in Python, `stable_sort` in C++, or a key that separates everyone.

## A complete example

**Statement.** Read `N` distinct integers. Print the smallest gap `|a − b|` between two of them, then the number of pairs with that gap. With `N` up to 100,000.

**Idea.** Comparing all pairs costs `N² / 2`, 5 billion operations. Sort the list; the smallest gap is then reached between two neighbours. Compute all the gaps between neighbours, their minimum `d`, and count the neighbours at distance `d`.

**Program.**

```python
n = int(input())
t = list(map(int, input().split()))
t.sort()
d = t[1] - t[0]
for i in range(1, n - 1):
    d = min(d, t[i + 1] - t[i])
nb = 0
for i in range(n - 1):
    if t[i + 1] - t[i] == d:
        nb = nb + 1
print(d, nb)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    sort(t.begin(), t.end());
    long long d = t[1] - t[0];
    for (int i = 1; i < n - 1; i++) {
        d = min(d, t[i + 1] - t[i]);
    }
    int nb = 0;
    for (int i = 0; i < n - 1; i++) {
        if (t[i + 1] - t[i] == d) {
            nb++;
        }
    }
    cout << d << " " << nb << "\n";
    return 0;
}
```

**Checking by hand.** With `6` then `14 3 9 20 6 17`, the sorted list is `3 6 9 14 17 20`. The gaps between neighbours are `3 3 5 3 3`. The minimum is 3, reached 4 times: the program prints `3 4`. Comparing all pairs, you do find the four pairs `(3, 6)`, `(6, 9)`, `(14, 17)` and `(17, 20)`, and no other pair at distance 3.

**Why it is correct.** After sorting, `t[0] < t[1] < … < t[n − 1]`, since the values are distinct. For a pair of non-neighbours `i < j` with `j ≥ i + 2`, the gap `t[j] − t[i]` is the sum of the gaps between neighbours from `i` to `j`, so at least `2d`, which is strictly greater than `d` because `d > 0`. So the minimum is only reached by neighbours, and counting them is enough. The program makes one sort, then two passes of `N` steps: a few million operations at most, instead of 5 billion. If values could repeat, `d` would be 0 and three equal values would form three pairs, one of them not neighbours: you would have to count differently.

## Key takeaways

- Selection sort puts at each step the minimum of the remaining elements: always about `n² / 2` comparisons, at most `n − 1` swaps; it is not stable.
- Insertion sort moves each element back into the already sorted part: one swap per inversion, so very fast on an almost sorted list and slow in the worst case; it is stable.
- Counting sort sorts small integers without comparisons, in about `2n + V` operations; done with one list per value, it is stable.
- The correctness of a sort is proved with an invariant on the part already processed; its cost is measured in comparisons and swaps.
- `sorted`, `sort`, `key=` and tuples in Python, `sort`, `stable_sort` and strict comparison functions in C++ sort in about `n × log₂(n)` comparisons: these are the tools to use from now on.
- Sorting first makes close elements neighbours: duplicates, median and smallest gap are then found in a single pass.
