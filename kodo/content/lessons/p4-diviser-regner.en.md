The sorts of level 3 make about n²/2 comparisons: for a million numbers, 5 × 10¹¹ comparisons: several minutes in C++, hours in Python. The sort provided by the languages sorts that million in a fraction of a second. This chapter explains how, with a method that goes far beyond sorting: **divide and conquer**. We cut the problem into smaller pieces of the same kind, solve them recursively, then **combine** their solutions.

We study merge sort, with its proof and its cost, then quicksort and its worst case, quickselect, an application to portions of an array, and a method to estimate the cost of any algorithm of this kind. Counting inversions will be the complete example: it is the typical example of a computation that "takes advantage" of a sort.

## The principle

A **divide and conquer** algorithm follows three steps:

1. **Divide**: cut the input into smaller subproblems of the same kind;
2. **Conquer**: solve each subproblem with a recursive call (or directly if it is small enough: this is the **base case**);
3. **Combine**: build the solution of the problem from those of the subproblems.

The binary search of the previous chapter is a very simple case: a single subproblem, the useful half, and nothing to combine. Fast exponentiation too: to compute `x^n`, compute `x^(n/2)` once and square it. Merge sort, on the other hand, solves **two** subproblems and does real work to combine them.

## Merging

The **merge** of two sorted lists `g` and `d` produces a single sorted list containing their elements. Compare the first remaining elements of the two lists, place the smaller one, and start again; when one list is empty, copy the rest of the other.

```python
def fusion(g, d):
    # g and d are sorted; returns their sorted merge
    res = []
    i = j = 0
    # invariant: res contains g[:i] and d[:j], sorted, all <= g[i] and d[j]
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
    res.extend(g[i:])
    res.extend(d[j:])
    return res

def tri_fusion(t):
    if len(t) <= 1:
        return t
    m = len(t) // 2
    return fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))

print(fusion([1, 4, 9], [2, 3, 10, 12]))
print(tri_fusion([5, 2, 9, 1, 5, 6]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// g and d are sorted; returns their sorted merge
vector<int> fusion(const vector<int>& g, const vector<int>& d) {
    vector<int> res;
    size_t i = 0, j = 0;
    // invariant: res contains g[0..i[ and d[0..j[, sorted, all <= g[i] and d[j]
    while (i < g.size() && j < d.size()) {
        if (g[i] <= d[j]) {
            res.push_back(g[i++]);
        } else {
            res.push_back(d[j++]);
        }
    }
    while (i < g.size()) res.push_back(g[i++]);
    while (j < d.size()) res.push_back(d[j++]);
    return res;
}

vector<int> triFusion(const vector<int>& t) {
    if (t.size() <= 1) {
        return t;
    }
    size_t m = t.size() / 2;
    vector<int> g(t.begin(), t.begin() + m), d(t.begin() + m, t.end());
    return fusion(triFusion(g), triFusion(d));
}

void affiche(const vector<int>& t) {
    for (int x : t) cout << x << " ";
    cout << "\n";
}

int main() {
    affiche(fusion({1, 4, 9}, {2, 3, 10, 12}));
    affiche(triFusion({5, 2, 9, 1, 5, 6}));
    return 0;
}
```

The program prints `[1, 2, 3, 4, 9, 10, 12]` then `[1, 2, 5, 5, 6, 9]` (in C++, the same numbers separated by spaces).

**Correctness of the merge.** The invariant written as a comment holds at the start (`res` is empty). At each turn, the element added is the smaller of the two first remaining ones; since `g` and `d` are sorted, it is smaller than every remaining element, so `res` stays sorted and its elements stay at most equal to those remaining. On leaving the loop, one of the two lists is exhausted, and the rest of the other, sorted and at least equal to all of `res`, is copied at the end. **Cost**: each turn places one element, so at most `a + b` turns for lists of lengths `a` and `b`, and at most `a + b − 1` comparisons.

## Merge sort

**Merge sort** cuts the list into two halves, sorts each recursively, then merges them. A list of 0 or 1 element is already sorted: that is the base case.

**Correctness**, by strong induction on the length `n`. For `n ≤ 1`, the list is returned as is, and it is sorted. For `n ≥ 2`, the two halves have lengths `⌊n/2⌋` and `⌈n/2⌉`, both strictly less than `n`: by the induction hypothesis, the recursive calls sort them. The merge of two sorted lists is sorted and contains all the elements: the result is correct. The same remark proves **termination**: each call works on a strictly shorter list.

**Cost.** Draw the **call tree**: the root sorts `n` elements, its two children `n/2` each, its four grandchildren `n/4`, and so on down to the leaves, of size 1. At level `k`, there are `2^k` calls, each on `n / 2^k` elements: their merges cost about `n` operations in total. The splitting stops when `n / 2^k` reaches 1, so after `log₂ n` levels. The total cost is about **n log₂ n**: O(n log n). For `n = 10⁶`, that is about 2 × 10⁷ operations, instead of 5 × 10¹¹.

The **depth** of the recursion is also `log₂ n`, about 20 for a million elements: no risk of exceeding Python's limit of 1,000 nested calls. Finally, the merge takes the left element on ties (`<=`): two equal elements keep their initial order, and merge sort is **stable**.

## Quicksort

**Quicksort** divides differently: choose an element, the **pivot**, and split the others into two lists, those smaller than the pivot and the rest. Sort each recursively, and just put them end to end, with the pivot in the middle: there is nothing to merge. All the work is in the splitting.

```python
def tri_rapide(t):
    if len(t) <= 1:
        return t
    p = t[0]                                    # the pivot
    petits = [x for x in t[1:] if x < p]
    grands = [x for x in t[1:] if x >= p]
    return tri_rapide(petits) + [p] + tri_rapide(grands)

print(tri_rapide([5, 2, 9, 1, 5, 6]))
print(len(tri_rapide(list(range(5000)))))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> triRapide(const vector<int>& t) {
    if (t.size() <= 1) {
        return t;
    }
    int p = t[0];                               // the pivot
    vector<int> petits, grands;
    for (size_t i = 1; i < t.size(); i++) {
        if (t[i] < p) {
            petits.push_back(t[i]);
        } else {
            grands.push_back(t[i]);
        }
    }
    vector<int> res = triRapide(petits);
    res.push_back(p);
    for (int x : triRapide(grands)) res.push_back(x);
    return res;
}

int main() {
    for (int x : triRapide({5, 2, 9, 1, 5, 6})) cout << x << " ";
    cout << "\n";
    vector<int> t;
    for (int i = 0; i < 5000; i++) t.push_back(i);
    cout << triRapide(t).size() << "\n";
    return 0;
}
```

The first line printed is `[1, 2, 5, 5, 6, 9]`. For the second one, Python stops with `RecursionError: maximum recursion depth exceeded`. The list `0, 1, …, 4999` is already sorted: the pivot is always the smallest element, the list of smaller ones is empty, and the list of larger ones has only one element less. The recursion goes down to a depth of 5,000, and the total number of comparisons is 4,999 + 4,998 + … + 1, about n²/2. C++ does print `5000`, but for a million sorted elements it would make 5 × 10¹¹ comparisons and would probably exceed the size of the stack.

This is the **worst case** of quicksort: O(n²). In the best case, the pivot cuts the list into two halves, and the call tree looks like that of merge sort: O(n log n). If the pivot is chosen **at random** (`random.choice(t)`), one can show (we will admit it) that the average number of comparisons is about 1.39 n log₂ n, whatever the input: no particular input can trap the algorithm, except by extreme bad luck. The sorts of Python and C++ use even safer variants, and guarantee O(n log n).

**Correctness.** By strong induction: `petits` and `grands` are strictly shorter than `t` (the pivot is not in them), so they are sorted by the recursive calls; every element of `petits` is less than `p`, every element of `grands` is at least `p`, and the concatenation is sorted.

## Quickselect

To find the k-th smallest element of a list, for example the median, we could sort, in O(n log n). **Quickselect** does better: like quicksort, it splits the elements around a pivot, but it only continues in **the** part that contains the answer, since we know how many elements each part contains.

```python
import random

def selection(t, k):
    # k-th smallest element of t (k starts at 1)
    p = random.choice(t)
    petits = [x for x in t if x < p]
    egaux = [x for x in t if x == p]
    if k <= len(petits):
        return selection(petits, k)
    if k <= len(petits) + len(egaux):
        return p
    grands = [x for x in t if x > p]
    return selection(grands, k - len(petits) - len(egaux))

t = [7, 1, 8, 3, 3, 9, 2]
print(selection(t, 1), selection(t, 4), selection(t, 7))
```

```cpp
#include <cstdlib>
#include <iostream>
#include <vector>
using namespace std;

// k-th smallest element of t (k starts at 1)
int selection(const vector<int>& t, int k) {
    int p = t[rand() % t.size()];
    vector<int> petits, grands;
    int egaux = 0;
    for (int x : t) {
        if (x < p) petits.push_back(x);
        else if (x > p) grands.push_back(x);
        else egaux++;
    }
    if (k <= (int) petits.size()) {
        return selection(petits, k);
    }
    if (k <= (int) petits.size() + egaux) {
        return p;
    }
    return selection(grands, k - petits.size() - egaux);
}

int main() {
    vector<int> t = {7, 1, 8, 3, 3, 9, 2};
    cout << selection(t, 1) << " " << selection(t, 4) << " " << selection(t, 7) << "\n";
    return 0;
}
```

The program prints `1 3 9`, whatever the random choices: in order, the list is `1 2 3 3 7 8 9`.

**Average cost.** Call a pivot **good** if it is neither among the smallest quarter of the elements nor among the largest quarter. A random pivot is good with probability about 1/2, and after a good pivot, the part where we continue has at most 3n/4 elements. Just as it takes two coin tosses on average to get "heads", it takes two draws on average to get a good pivot, and each costs at most about n operations. So the size drops below 3n/4 for an average cost of at most 2n, then below (3/4)² n for an average cost of at most 2 × (3/4) n, and so on: in total, at most 2n × (1 + 3/4 + (3/4)² + …) = 8n. Quickselect is therefore O(n) on average, but O(n²) in the worst case, if every pivot happens to be the smallest element. In C++, `nth_element(t.begin(), t.begin() + k - 1, t.end())` does this job in place.

## Divide and conquer on an array

The method applies to many computations other than sorting. Let us look for the largest sum of a **portion** (consecutive cells, at least one) of an array. Cut the array in two: the best portion is entirely on the left, entirely on the right, or **across** the cut. The first two cases are recursive calls. A portion across is made of a suffix of the left half and a prefix of the right half, which can be chosen independently: the best one is the best suffix plus the best prefix, found by two loops.

```python
def meilleure(t, debut, fin):
    # largest sum of a non-empty portion of t[debut:fin]
    if fin - debut == 1:
        return t[debut]
    m = (debut + fin) // 2
    gauche = meilleure(t, debut, m)
    droite = meilleure(t, m, fin)
    # portion across: best suffix of the left + best prefix of the right
    s, suffixe = 0, t[m - 1]
    for i in range(m - 1, debut - 1, -1):
        s += t[i]
        suffixe = max(suffixe, s)
    s, prefixe = 0, t[m]
    for i in range(m, fin):
        s += t[i]
        prefixe = max(prefixe, s)
    return max(gauche, droite, suffixe + prefixe)

t = [2, -5, 3, -1, 4, -2, -8, 5]
print(meilleure(t, 0, len(t)))
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// largest sum of a non-empty portion of t[debut..fin[
long long meilleure(const vector<long long>& t, int debut, int fin) {
    if (fin - debut == 1) {
        return t[debut];
    }
    int m = (debut + fin) / 2;
    long long gauche = meilleure(t, debut, m);
    long long droite = meilleure(t, m, fin);
    // portion across: best suffix of the left + best prefix of the right
    long long s = 0, suffixe = t[m - 1];
    for (int i = m - 1; i >= debut; i--) {
        s += t[i];
        suffixe = max(suffixe, s);
    }
    long long prefixe = t[m];
    s = 0;
    for (int i = m; i < fin; i++) {
        s += t[i];
        prefixe = max(prefixe, s);
    }
    return max({gauche, droite, suffixe + prefixe});
}

int main() {
    vector<long long> t = {2, -5, 3, -1, 4, -2, -8, 5};
    cout << meilleure(t, 0, t.size()) << "\n";
    return 0;
}
```

The program prints `6`: the portion `3 −1 4` lies across the cut, between index 2 and index 4; the best portion on the left is 3, on the right 5. Each level costs O(n) and there are `log₂ n` levels: O(n log n). Level 3 showed an O(n) sweep for this problem; the interest of the recursive version is its "left, right, across" pattern, which will be used again for questions where no simple sweep exists.

## The cost of a recurrence

The cost `T(n)` of a divide and conquer algorithm satisfies a **recurrence**: it makes `a` calls on inputs of size `n/b`, plus some work `f(n)` to divide and combine. To estimate it, add up the work of each level of the call tree. Three situations arise:

- **The work is the same at each level.** Merge sort: `T(n) = 2 T(n/2) + n`. At level `k`, `2^k` calls each do `n / 2^k`: `n` per level, over `log₂ n` levels, hence O(n log n). Binary search: `T(n) = T(n/2) + 1`, constant work per level, hence O(log n).
- **The work decreases going down.** Quickselect (favourable case): `T(n) = T(n/2) + n`. The sum `n + n/2 + n/4 + …` is dominated by the root: O(n).
- **The work increases going down.** `T(n) = 3 T(n/2) + n`: the levels do `n`, `3n/2`, `9n/4`… The sum is dominated by the leaves, whose number is `3^(log₂ n) = n^(log₂ 3) ≈ n^1.58`.

In short, compare the number of calls `a` with the factor `b^c` by which the work `f(n) = n^c` grows when the size is multiplied by `b`. This result is called the **master theorem**; here it is enough to know how to draw the tree and sum level by level. An unbalanced split changes everything: quicksort in its worst case satisfies `T(n) = T(n − 1) + n`, with `n` levels, hence O(n²).

## Common mistakes

**A split that does not shrink.** If one half can be empty and the other equal to the whole input, the function calls itself again on the same input: `RecursionError` in Python, `Segmentation fault` in C++. With `m = len(t) // 2` and `len(t) ≥ 2`, both halves are non-empty and strictly shorter. For a portion `t[debut:fin]`, the base case must be `fin − debut == 1`, and `m` strictly between `debut` and `fin`.

**The worst case of quicksort.** A fixed pivot (the first element) on a sorted input gives O(n²) and a recursion of depth `n`. The tests of an exercise always contain this case. Choose the pivot at random, or use the language's sort.

**`<` instead of `<=` in the merge.** The sort stays correct, but it is no longer stable, and an inversion count then also counts pairs of equal elements.

**Overflow.** The number of inversions of a list of 10⁵ elements reaches 5 × 10⁹: in C++, an `int` overflows; use a `long long`.

**Too many copies.** In Python, `t[:m]` copies half the list. This is not serious (O(n) per level, which the merge already costs), but copying the whole list at each call of a recursion of depth `n` would cost O(n²).

## A complete example

**Statement.** Read `N` integers. An **inversion** is a pair of positions `i < j` such that `t[i] > t[j]`. Count the inversions, for `N` up to 10⁵. The number of inversions measures the disorder of a list: it is 0 for a sorted list, `N(N − 1)/2` for a list sorted backwards, and it is exactly the number of swaps of neighbours made by bubble sort.

**Idea.** Comparing every pair costs `N²/2 = 5 × 10⁹` comparisons: too slow. Cut the list in two. An inversion has both positions on the left, or both on the right (recursive calls), or else `i` on the left and `j` on the right. For the latter, the exact position inside each half no longer matters: we can sort the halves. So we take advantage of merge sort. During the merge, when we place an element `d[j]` from the right because it is strictly smaller than `g[i]`, it is also smaller than `g[i + 1]`, …, up to the end of `g`, since `g` is sorted: it forms an inversion with each of the `len(g) − i` elements remaining on the left.

```python
def tri_et_inversions(t):
    # returns (t sorted, number of inversions of t)
    if len(t) <= 1:
        return t, 0
    m = len(t) // 2
    g, inv_g = tri_et_inversions(t[:m])
    d, inv_d = tri_et_inversions(t[m:])
    res = []
    inv = inv_g + inv_d
    i = j = 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
            inv += len(g) - i       # d[j] forms an inversion with g[i], ..., g[end]
    res.extend(g[i:])
    res.extend(d[j:])
    return res, inv

n = int(input())
t = list(map(int, input().split()))
print(tri_et_inversions(t)[1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<long long> t, tmp;

// sorts t[debut..fin[ and returns its number of inversions
long long triEtInversions(int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int m = (debut + fin) / 2;
    long long inv = triEtInversions(debut, m) + triEtInversions(m, fin);
    int i = debut, j = m, k = debut;
    while (i < m && j < fin) {
        if (t[i] <= t[j]) {
            tmp[k++] = t[i++];
        } else {
            tmp[k++] = t[j++];
            inv += m - i;           // t[j] forms an inversion with t[i], ..., t[m - 1]
        }
    }
    while (i < m) tmp[k++] = t[i++];
    while (j < fin) tmp[k++] = t[j++];
    for (int p = debut; p < fin; p++) {
        t[p] = tmp[p];
    }
    return inv;
}

int main() {
    int n;
    cin >> n;
    t.resize(n);
    tmp.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << triEtInversions(0, n) << "\n";
    return 0;
}
```

The C++ version sorts in place, in the array `t`, with an auxiliary array `tmp`: this avoids creating vectors at each call.

**Correctness.** Each inversion `(i, j)` "across" is counted exactly once: when `t[j]` is placed, `t[i]` is still on the left (it is larger, it could not have been placed before), and it is among the `len(g) − i` counted elements. A pair of equal elements is never counted, because on ties the left element is placed first.

**Checking by hand.** With `3 1 4 1 2`: the inversions are (3, 1), (3, 1), (3, 2), (4, 1) and (4, 2), that is 5, and the program prints `5`. In detail, the left half `3 1` contains 1 inversion, the right half `4 1 2` contains 2, and the merge of `1 3` with `1 2 4` adds 2: the 1 and the 2 from the right each go before the 3.

**Cost.** The same as merge sort, O(N log N): about 1.7 million operations for N = 10⁵.

## Key takeaways

- Divide and conquer: cut into subproblems of the same kind, solve them recursively, combine. Correctness is proved by strong induction on the size, and termination comes from each call working on a strictly smaller input.
- Merge sort cuts in two, sorts recursively and merges in linear time: O(n log n) in every case, with a recursion depth of log₂ n. Merging with `<=` makes it stable.
- Quicksort splits around a pivot: O(n log n) on average with a random pivot, but O(n²) and a depth of `n` on a sorted input with a fixed pivot.
- Quickselect only continues in the useful part: the k-th smallest element in O(n) on average.
- To count pairs (inversions, gaps, sums of portions), count those of each half recursively, then those "across", taking advantage of sorted halves.
- To estimate the cost, draw the call tree and add up the work level by level: `2T(n/2) + n` gives O(n log n), `T(n/2) + n` gives O(n), `T(n − 1) + n` gives O(n²).
