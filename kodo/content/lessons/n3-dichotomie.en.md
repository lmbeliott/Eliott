In the guessing game, someone picks a number between 1 and 1 000 and answers "higher" or "lower" to each guess. Always guessing the middle of the values still possible gets rid of half of the candidates each time: 10 questions are enough, since 2¹⁰ = 1 024. This is **binary search**. With N possible values, it takes about log₂(N) steps: 17 for 100 000, 60 for 10¹⁸.

## Searching in a sorted list

In a sorted list `t`, the condition `t[i] >= x` is false at the beginning of the list, then true until the end. We look for the **first index where it becomes true**. This index is also the number of values strictly less than x.

We keep an interval `[left, right)` that contains the answer. At the start, `right = len(t)`: the answer is `len(t)` if all the values are smaller than x.

```python
def first_at_least(t, x):
    # first index i such that t[i] >= x (len(t) if there is none)
    left, right = 0, len(t)
    while left < right:
        middle = (left + right) // 2
        if t[middle] < x:
            left = middle + 1     # the answer is after middle
        else:
            right = middle        # middle may be the answer
    return left

t = [3, 7, 7, 12, 20]
print(first_at_least(t, 7))     # 1: a single value < 7
print(first_at_least(t, 13))    # 4
```

```cpp
// first index i such that t[i] >= x (t.size() if there is none)
int first_at_least(const vector<int>& t, int x) {
    int left = 0, right = t.size();
    while (left < right) {
        int middle = (left + right) / 2;
        if (t[middle] < x) left = middle + 1; // the answer is after middle
        else right = middle;                  // middle may be the answer
    }
    return left;
}
// with t = {3, 7, 7, 12, 20}: returns 1 for x = 7, and 4 for x = 13
```

The interval shrinks at every step: the loop always stops. To count the integers **equal** to x: `first_at_least(t, x + 1) − first_at_least(t, x)`.

This function already exists (`bisect_left` in Python, `lower_bound` in C++), but knowing how to write it matters: the same loop is useful elsewhere. And the list must be **sorted**: sort it first, once, in O(N log N); each search then costs O(log N) instead of O(N).

## Searching for the answer itself

Many problems ask for "the smallest value that works": the shortest time, the smallest capacity… Computing the answer directly is hard, but **checking** whether a value v works is easy. And if v works, v + 1 works too: the answers to "does v work?" look like no, no, …, no, yes, yes, yes.

We look for the first "yes" by binary search, without any list. We keep two bounds: `too_small` does not work, `enough` works. We test the middle and move the matching bound, until the two bounds are next to each other.

Example: the smallest side length v such that a square of side v has an area of at least N.

```python
n = 1000
def works(v):
    return v * v >= n

too_small = 0        # 0 * 0 < n: does not work (n >= 1)
enough = n           # n * n >= n: works
while enough - too_small > 1:
    middle = (too_small + enough) // 2
    if works(middle):
        enough = middle
    else:
        too_small = middle
print(enough)        # 32, because 31 * 31 = 961 and 32 * 32 = 1024
```

```cpp
long long n = 1000;
auto works = [&](long long v) { return v * v >= n; };

long long too_small = 0; // 0 * 0 < n: does not work (n >= 1)
long long enough = n;    // n * n >= n: works
while (enough - too_small > 1) {
    long long middle = too_small + (enough - too_small) / 2;
    if (works(middle)) enough = middle;
    else too_small = middle;
}
cout << enough << "\n";  // 32, because 31 * 31 = 961 and 32 * 32 = 1024
```

The total cost is (number of steps) × (cost of one check): for an answer up to 10¹⁸ and a check in O(N), about 60 × N operations. Often, the check is a small greedy algorithm: "with a limit v, how many days are needed at least?".

## Classic traps

- **The starting bounds.** Check that `too_small` does not work and that `enough` works.
- **The infinite loop.** Don't mix the two templates: `left = middle + 1` / `right = middle` go with `while left < right`, and `enough = middle` / `too_small = middle` go with `while enough - too_small > 1`.
- **Overflow in C++.** The bounds can go beyond 2³¹: use `long long`. Inside the check, a sum can even go beyond 2⁶³: stop it as soon as the answer is known to be "yes".

## Key takeaways

- Binary search halves the search interval at each step: O(log N) steps.
- In a sorted list, we look for the first index where a condition becomes true, with an interval `[left, right)`.
- When the question "does v work?" switches from no to yes only once, the answer can be found by binary search, even without a list.
- Choose safe bounds, stick to a single loop template, and think about `long long`.
