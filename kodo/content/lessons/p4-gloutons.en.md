To give back 87 cents with coins of 50, 20, 10, 5, 2 and 1, a shopkeeper takes the largest possible coin, 50, then again the largest possible for the remaining 37, 20, and so on: 50 + 20 + 10 + 5 + 2. They never go back on a choice, and they get the smallest number of coins. This is a **greedy algorithm**: it builds the solution step by step, making at each step the choice that looks best at the moment.

Greedy algorithms are simple and fast, often a sort followed by a scan. Their difficulty lies elsewhere: they are **often wrong**. With coins of 1, 3 and 4, the same method gives 6 = 4 + 1 + 1, whereas 3 + 3 is enough. This chapter teaches how to **prove** that a greedy algorithm is correct, with the **exchange argument**, and how to refute it, with a **counterexample**. We apply it to problems on time slots, task scheduling, giving change and merging.

## Greedy choice and proof

A greedy algorithm makes decisions one by one, according to a fixed rule ("the largest coin", "the slot that ends first"), without ever reconsidering them. To prove that it gives an optimal solution, we usually show two things:

- **the greedy choice is safe**: there is an optimal solution that makes the same first choice as greedy;
- **the rest is a problem of the same kind**: once this choice is made, what remains is a smaller problem of the same nature, on which we start again (induction).

To show that the choice is safe, start from **any** optimal solution, and **transform** it so that it makes the greedy choice, checking that it stays valid and is not worse. This is the **exchange argument**. The same idea applies to an order: if two neighbouring elements are not placed according to the greedy rule, swap them, and check that the solution does not get worse.

## The most time slots

A room receives booking requests; request i occupies the room from time `début` to time `fin` (excluded). We want to accept **the largest number** of requests, with no two of them overlapping. Several rules look reasonable: the shortest request, the one starting first, the one blocking the fewest other requests. The right one is: **the one that ends first**.

```python
def plus_de_creneaux(creneaux):
    # creneaux: list of (start, end); two chosen slots do not overlap
    choisis = 0
    fin_derniere = -1
    for debut, fin in sorted(creneaux, key=lambda c: c[1]):   # by increasing end
        if debut >= fin_derniere:
            choisis += 1
            fin_derniere = fin
    return choisis

print(plus_de_creneaux([(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11)]))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// creneaux: (start, end); two chosen slots do not overlap
int plusDeCreneaux(vector<pair<int, int>> creneaux) {
    sort(creneaux.begin(), creneaux.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.second < b.second;                          // by increasing end
    });
    int choisis = 0, finDerniere = -1;
    for (auto& c : creneaux) {
        if (c.first >= finDerniere) {
            choisis++;
            finDerniere = c.second;
        }
    }
    return choisis;
}

int main() {
    cout << plusDeCreneaux({{1, 4}, {3, 5}, {0, 6}, {5, 7}, {3, 9}, {5, 9}, {6, 10}, {8, 11}}) << "\n";
    return 0;
}
```

The program prints `3`: it chooses (1, 4), then (5, 7), then (8, 11).

**The choice is safe.** Let `c` be the slot that ends first, and take any optimal solution. Its first slot `o` (the one ending first among its slots) does not end before `c`. Replace `o` by `c`: `c` ends no later than `o`, hence before the start of all the other slots of the solution, which start after the end of `o`. The modified solution is valid and has the same number of slots: it is optimal, and it starts with the greedy choice.

**The rest.** Once `c` is chosen, the slots still possible are those starting after the end of `c`, and we look for the largest number of compatible slots among them: the same problem, smaller. By induction, greedy is optimal. **Cost**: O(n log n) for the sort, then one pass.

The other rules fail, and each is refuted by a small example. Shortest first: with (0, 5), (4, 7) and (6, 11), the shortest one (4, 7) blocks the other two. First to start: (0, 100) blocks everything else. A counterexample with three slots is enough to discard a rule; no number of successful examples is enough to validate it.

## Scheduling tasks

A machine must perform `n` tasks, one at a time, without pause, starting at time 0. Task i takes `pᵢ`. The order determines the end time `Cᵢ` of each task, and the problem is to choose the best order. There are `n!` orders: we cannot try them all. The exchange argument on two **neighbouring** tasks is the natural tool. If task `a` is just before `b`, and `t` is the time when `a` starts, swapping `a` and `b` only changes their two end times: `a` used to end at `t + p_a`, and now ends at `t + p_a + p_b`; `b` used to end at `t + p_a + p_b`, and now ends at `t + p_b`. The other tasks do not move.

**Minimising the sum of end times.** If people wait for each task, the sum of the `Cᵢ` is the total waiting time. Before the swap, `a` and `b` contribute `(t + p_a) + (t + p_a + p_b)`; after, `(t + p_b) + (t + p_a + p_b)`. The swap saves `p_a − p_b`: it pays off as soon as `p_a > p_b`. The rule is therefore: **shortest first**. Starting from an optimal order, swap two badly ordered neighbours while there are some, as in bubble sort: the sum cannot increase, and we reach the sorted order, which is therefore optimal.

**Minimising the largest lateness.** If task i should be finished at time `dᵢ`, its **lateness** is `Cᵢ − dᵢ` if positive, 0 otherwise. We want the largest lateness to be as small as possible. The rule is: **earliest deadline first**. If `a` is just before `b` with `d_a > d_b`, after the swap `b` ends earlier, and `a` ends when `b` used to end, but with a later deadline: its new lateness is at most the old lateness of `b`. The largest lateness cannot increase. A useful consequence: a set of tasks can be finished entirely on time if and only if it is in deadline order.

## Sorting with an exchange rule

Swapping two neighbours often gives a **comparison rule** rather than a key. For example, if each task has a duration `p` and a weight `w`, and we minimise the sum of the `w × C`, swapping `a` and `b` shows that `a` must go before `b` if `p_a × w_b < p_b × w_a`. In C++, give this rule to `sort`, as in level 3. In Python, `sort` expects a key; the function `cmp_to_key` of the `functools` module turns a comparison function, which returns a negative number if `a` must go before `b`, a positive one in the opposite case, and 0 on ties, into a key.

```python
from functools import cmp_to_key

def compare(a, b):
    # a = (duration, weight) goes before b if duration_a × weight_b < duration_b × weight_a
    gauche = a[0] * b[1]
    droite = b[0] * a[1]
    if gauche < droite:
        return -1
    if gauche > droite:
        return 1
    return 0

taches = [(3, 1), (1, 2), (4, 4), (2, 1)]
print(sorted(taches, key=cmp_to_key(compare)))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// a = (duration, weight) goes strictly before b if duration_a × weight_b < duration_b × weight_a
bool avant(const pair<long long, long long>& a, const pair<long long, long long>& b) {
    return a.first * b.second < b.first * a.second;
}

int main() {
    vector<pair<long long, long long>> taches = {{3, 1}, {1, 2}, {4, 4}, {2, 1}};
    sort(taches.begin(), taches.end(), avant);
    for (auto& t : taches) {
        cout << "(" << t.first << ", " << t.second << ") ";
    }
    cout << "\n";
    return 0;
}
```

The program prints the tasks in the order `(1, 2)`, `(4, 4)`, `(2, 1)`, `(3, 1)`: the ratios duration / weight are 0.5, 1, 2 and 3. Before sorting with a rule, check that it is **transitive**: if `a` goes before `b` and `b` before `c`, then `a` must go before `c`. Otherwise the sort makes no sense, and C++ may even crash. Here, the rule amounts to comparing the ratios `p / w`, which is transitive. We compare products rather than quotients to stay with integers.

## When greedy fails

Back to coins. Greedy is optimal for 1, 2, 5, 10, 20, 50; it also is as soon as each value divides the next (proved by showing that an optimal solution always uses fewer than `c_{i+1} / c_i` coins of value `cᵢ`). But it is not for 1, 3, 4. To find a counterexample, compare greedy with an **exact** computation. The smallest number of coins `opt(s)` to form `s` is computed in increasing order of amounts: the last coin added has some value `c ≤ s`, and the rest `s − c` must be formed in the best way, so `opt(s) = 1 + min(opt(s − c))` over the coins `c ≤ s`, with `opt(0) = 0`.

```python
pieces = [1, 3, 4]
limite = 20
opt = [0] * limite          # opt[s]: smallest number of coins to form s
for s in range(1, limite):
    opt[s] = 1 + min(opt[s - c] for c in pieces if c <= s)

def glouton(s):
    nb = 0
    for c in reversed(pieces):
        nb += s // c
        s = s % c
    return nb

for s in range(1, limite):
    if glouton(s) > opt[s]:
        print(s, glouton(s), opt[s])
        break
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<int> pieces = {1, 3, 4};

int glouton(int s) {
    int nb = 0;
    for (int i = pieces.size() - 1; i >= 0; i--) {
        nb += s / pieces[i];
        s = s % pieces[i];
    }
    return nb;
}

int main() {
    int limite = 20;
    vector<int> opt(limite, 0);   // opt[s]: smallest number of coins to form s
    for (int s = 1; s < limite; s++) {
        opt[s] = s;
        for (int c : pieces) {
            if (c <= s) opt[s] = min(opt[s], 1 + opt[s - c]);
        }
    }
    for (int s = 1; s < limite; s++) {
        if (glouton(s) > opt[s]) {
            cout << s << " " << glouton(s) << " " << opt[s] << "\n";
            break;
        }
    }
    return 0;
}
```

The program prints `6 3 2`: for 6, greedy uses 3 coins and the optimum 2. This method is the right habit with any greedy algorithm: write an exact solution, slow but safe, and compare the two on every small case. A disagreement gives a counterexample; the absence of disagreement proves nothing, but it makes a proof plausible and helps find it.

## Merging at the lowest cost

We have piles of tokens, of sizes `4, 3, 6, 2`. Merging two piles costs the total number of tokens of the new pile, and we merge until a single pile remains. The greedy rule is: **merge the two smallest piles**. To justify it, draw the merge tree: each initial pile is a leaf, and its number of tokens is counted once per merge involving it, that is as many times as its depth in the tree. In an optimal tree, the two deepest leaves can be swapped with the two smallest piles without increasing the cost (a smaller pile placed deeper costs less): so there is an optimal tree where the two smallest piles are merged together. Replace them by their sum, and start again on a smaller problem. This is **Huffman's algorithm**, which is also used to compress files.

At each step we must find the two smallest piles, while new piles appear. A **priority queue** does this efficiently: it stores numbers, and gives or removes the smallest in O(log n). In Python, the `heapq` module works on an ordinary list: `heapify(t)` prepares it, `heappush(t, x)` adds `x`, `heappop(t)` removes and returns the smallest. To get the largest, store the numbers with a minus sign. In C++, `priority_queue` (in `<queue>`) gives the largest; with `greater<long long>`, it gives the smallest.

```python
import heapq

def cout_des_fusions(tas):
    file = list(tas)
    heapq.heapify(file)                 # priority queue: smallest first
    total = 0
    while len(file) > 1:
        a = heapq.heappop(file)         # the two smallest piles
        b = heapq.heappop(file)
        total += a + b
        heapq.heappush(file, a + b)
    return total

print(cout_des_fusions([4, 3, 6, 2]))
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

long long coutDesFusions(const vector<long long>& tas) {
    // priority queue giving the smallest first
    priority_queue<long long, vector<long long>, greater<long long>> file(tas.begin(), tas.end());
    long long total = 0;
    while (file.size() > 1) {
        long long a = file.top(); file.pop();   // the two smallest piles
        long long b = file.top(); file.pop();
        total += a + b;
        file.push(a + b);
    }
    return total;
}

int main() {
    cout << coutDesFusions({4, 3, 6, 2}) << "\n";
    return 0;
}
```

The program prints `29`: merge 2 and 3 (cost 5), then 4 and 5 (cost 9), then 6 and 9 (cost 15). Merging in the given order, 4 + 3, then 7 + 6, then 13 + 2, would cost 7 + 13 + 15 = 35. **Cost**: `n − 1` merges, each in O(log n), that is O(n log n).

## Common mistakes

**A greedy algorithm without proof.** This is the most frequent mistake: the program passes the examples, then fails on a hidden test. Before coding, look for a counterexample to the rule on three or four elements, and compare with an exhaustive solution on small cases.

**The wrong sorting key.** Sorting slots by start instead of end, tasks by duration instead of deadline: the program runs, gives plausible and wrong answers. The proof tells exactly which key to use.

**A non-transitive rule.** A comparison function must define a true order, and answer "strictly before" in C++. An inconsistent rule can make `sort` crash with `Segmentation fault`.

**Overflow.** Sums of end times or of merge costs quickly exceed 2³¹; so do the products of an exchange rule. In C++, use `long long`.

**Forgetting the minus sign with `heapq`.** `heapq` always gives the smallest element; to remove the largest, store `-x` and take the opposite on the way out.

## A complete example

**Statement.** A counter must serve `N` people; the operation of person i takes `dᵢ` minutes. Each person waits from time 0 until the end of their own operation. In which order should they be served so that the sum of waiting times is as small as possible? Print this sum. For example, with the durations `5 2 8 1`.

**Idea.** The waiting time of the person served in position k is the sum of the durations of the first k operations: this is the sum of end times, minimised by the rule "shortest first" (section "Scheduling tasks"). Sort, then accumulate.

```python
n = int(input())
durees = sorted(map(int, input().split()))   # shortest first

instant = 0
attente = 0
for d in durees:
    instant += d                # end of this operation
    attente += instant
print(attente)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> durees(n);
    for (int i = 0; i < n; i++) {
        cin >> durees[i];
    }
    sort(durees.begin(), durees.end());       // shortest first
    long long instant = 0, attente = 0;
    for (long long d : durees) {
        instant += d;                         // end of this operation
        attente += instant;
    }
    cout << attente << "\n";
    return 0;
}
```

**Checking by hand.** In the order 1, 2, 5, 8, the operations end at times 1, 3, 8 and 16: the sum is 28, and the program prints `28`. In the order of the statement, 5, 2, 8, 1, they would end at 5, 7, 15 and 16, for a sum of 43.

**Another proof.** We can also count differently: the duration served in position k is counted in the waiting time of everyone served from position k on, that is `N − k + 1` times. The sum is therefore `Σ (N − k + 1) × d_(k)`, and to minimise it, the largest coefficients must go with the smallest durations: this is the **rearrangement inequality**, which gives the same order again.

**Cost.** O(N log N) for the sort. Trying every order would cost N!, already 3.6 million for N = 10.

## Key takeaways

- A greedy algorithm makes at each step the choice that looks best, without going back. It is fast (often a sort then a scan), but it must be **proved** correct.
- The exchange argument: start from any optimal solution, modify it so that it makes the greedy choice without making it worse, then start again on the remaining problem. For an order, swap two badly ordered neighbours.
- Slots: the most slots are obtained by taking the one that ends first. Tasks: shortest first minimises the sum of end times, earliest deadline first minimises the largest lateness.
- A comparison rule coming from an exchange is given to `sort` in C++, and to `sorted` through `functools.cmp_to_key` in Python; it must be transitive.
- A single counterexample refutes a greedy algorithm (coins 1, 3, 4: 6 = 3 + 3). They are found by comparing with an exact computation on small cases.
- A priority queue (`heapq`, `priority_queue`) gives the minimum in O(log n): it is used when greedy must choose among changing elements, as in Huffman's merges.
