A **recursive** function is a function that calls itself. It is the ideal tool to explore all the possibilities of a problem: choose a first element, then let the function take care of the rest.

## A function that calls itself

The number of ways to put N different pairs of skis on a rack is N! = N × (N − 1) × … × 1. We can define it from a smaller problem: N! = N × (N − 1)!, and 0! = 1.

```python
def factorial(n):
    if n == 0:
        return 1                    # base case: we stop
    return n * factorial(n - 1)     # call on a smaller problem

print(factorial(5))   # 120
```

```cpp
long long factorial(int n) {
    if (n == 0) return 1;           // base case: we stop
    return n * factorial(n - 1);    // call on a smaller problem
}
// factorial(5) is 120
```

Two rules must be respected: there must be a **base case** that does not call the function again, and each call must get closer to that case. Otherwise, the function calls itself forever and the program crashes. In Python, the depth is limited to about 1 000 nested calls: to go further, you need `sys.setrecursionlimit`, or a loop.

## Listing all the possibilities

To print all the possible orders of N hikers (the **permutations**), we fill the places one by one. The function `explore` chooses who takes the next place among those not yet placed, calls `explore` for the rest, then **undoes** its choice to try the next one.

```python
n = 3
order = []
placed = [False] * (n + 1)

def explore():
    if len(order) == n:
        print(*order)                 # a complete permutation
        return
    for h in range(1, n + 1):
        if not placed[h]:
            placed[h] = True          # choose
            order.append(h)
            explore()                 # explore the rest
            order.pop()               # undo the choice
            placed[h] = False

explore()   # 1 2 3, 1 3 2, 2 1 3, 2 3 1, 3 1 2, 3 2 1
```

```cpp
int n = 3;
vector<int> order;
vector<bool> placed(n + 1, false);

void explore() {
    if ((int)order.size() == n) {     // a complete permutation
        for (int h : order) cout << h << " ";
        cout << "\n";
        return;
    }
    for (int h = 1; h <= n; h++) {
        if (!placed[h]) {
            placed[h] = true;         // choose
            order.push_back(h);
            explore();                // explore the rest
            order.pop_back();         // undo the choice
            placed[h] = false;
        }
    }
}
```

The choices are tried from the smallest to the largest at each place, so the permutations come out in **lexicographic order** (dictionary order), without sorting. This is often the order asked for in problem statements.

You can picture all these calls as a **tree**: the root is the empty list, each call is a node, and each choice is a branch. There are N! leaves: 3 628 800 for N = 10. So listing everything is only possible for small values of N.

## Backtracking and pruning

**Backtracking** means abandoning a branch as soon as we know it will not lead to any solution. This is called **pruning**: we cut a whole branch of the tree, with all its descendants.

For example, to find the bags whose total weight is exactly S, we decide for each bag "I take it" or "I leave it". If the weight already exceeds S, there is no point going on: the weights are positive, so it can only grow.

```python
weights = [5, 3, 4, 2]
S = 7
chosen = []

def search(i, total):
    if total > S:
        return                        # pruning: too heavy, give up
    if i == len(weights):
        if total == S:
            print(chosen)
        return
    chosen.append(weights[i])         # take bag i
    search(i + 1, total + weights[i])
    chosen.pop()
    search(i + 1, total)              # leave bag i

search(0, 0)   # [5, 2] then [3, 4]
```

```cpp
vector<int> weights = {5, 3, 4, 2};
int S = 7;
vector<int> chosen;

void search(int i, int total) {
    if (total > S) return;            // pruning: too heavy, give up
    if (i == (int)weights.size()) {
        if (total == S) {
            for (int w : chosen) cout << w << " ";
            cout << "\n";
        }
        return;
    }
    chosen.push_back(weights[i]);     // take bag i
    search(i + 1, total + weights[i]);
    chosen.pop_back();
    search(i + 1, total);             // leave bag i
}
```

Good pruning changes everything: on some problems, it reduces billions of cases to a few thousand. To prune well, ask yourself: "with this beginning, is it still possible to find a solution, or a solution better than the best one found so far?" If the answer is no, go back up. Two tricks often help: handle the most constraining elements first (the biggest, the rarest), and don't try two identical choices that would lead to the same solutions.

## Key takeaways

- A recursive function always has a base case, and each call gets closer to that case.
- To list possibilities: choose, explore the rest, undo the choice. Trying the choices in increasing order gives lexicographic order.
- The number of possibilities explodes quickly (N!, 2ᴺ): a complete search only works for small N.
- Pruning means abandoning a branch as soon as it cannot give anything: it is what makes backtracking fast.
