A text editor keeps the list of changes: the "Undo" button always undoes the **last** one. At a counter, on the contrary, the person who arrived **first** is served first. These two ways of storing waiting elements come up again and again in algorithmics. The first is called a **stack**, the second a **queue**.

Neither is a complicated new data type: a stack is a list whose end is the only part you touch, a queue is a list whose front you remove and whose end you extend. Their interest lies elsewhere: once you recognise that a problem behaves like a stack or like a queue, the algorithm becomes simple, and each operation only costs a few instructions. This chapter presents both structures, then their classic uses: checking brackets, computing an expression, simulating a waiting line and finding, for each element of a list, the next greater element.

## The stack

A **stack** is a collection where elements are added and removed on the same side, called the **top**. To **push** is to add on top; to **pop** is to remove the top element. So the last element pushed is the first one popped: a stack is said to be **LIFO**, for *last in, first out*. Think of a stack of plates.

In Python, a list makes a very good stack: `append` pushes, `pop()` pops and returns the removed element, `p[-1]` reads the top without removing it, and `len(p) == 0` tests whether the stack is empty. In C++, you can use a `vector` (`push_back`, `pop_back`, `back`, `empty`) or the `stack` type from `<stack>` (`push`, `pop`, `top`, `empty`).

```python
p = []
p.append(1)
p.append(2)
p.append(3)
print(p.pop())
print(p[-1], len(p))
```

```cpp
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> p;
    p.push(1);
    p.push(2);
    p.push(3);
    cout << p.top() << "\n";
    p.pop();
    cout << p.top() << " " << p.size() << "\n";
    return 0;
}
```

The program prints `3`, then `2 2`: the 3, pushed last, comes out first; the top is then the 2, and two elements remain. In C++, `pop()` removes the top without returning it: read `top()` first.

These operations cost a few instructions, whatever the size of the stack: only the end of the list is touched, without moving the other elements.

## Checking brackets

A string of brackets `(`, `)`, `[`, `]` is **well bracketed** if each closing bracket closes the most recent opening bracket of the same type not yet closed, and if all opening brackets are closed. So `([]())` is well bracketed, but neither `([)]` nor `(()` is.

The rule "the most recent not yet closed" is exactly that of a stack. Go through the string: an opening bracket is pushed; a closing bracket must find on top the opening bracket of the same type, which is popped. If the stack is empty or the top does not match, the string is incorrect. At the end, the stack must be empty.

```python
s = input()
pile = []
correct = True
for c in s:
    if c == "(" or c == "[":
        pile.append(c)
    else:
        attendu = "(" if c == ")" else "["
        if len(pile) == 0 or pile[-1] != attendu:
            correct = False
            break
        pile.pop()
if correct and len(pile) == 0:
    print("OUI")
else:
    print("NON")
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<char> pile;
    bool correct = true;
    for (char c : s) {
        if (c == '(' || c == '[') {
            pile.push_back(c);
        } else {
            char attendu = (c == ')') ? '(' : '[';
            if (pile.empty() || pile.back() != attendu) {
                correct = false;
                break;
            }
            pile.pop_back();
        }
    }
    if (correct && pile.empty()) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

With `([]())`, the stack goes through `(`, `([`, `(`, `((`, `(` then becomes empty: the program prints `OUI`. With `([)]`, the closing `)` finds `[` on top: `NON`. With `(()`, an opening bracket remains in the stack at the end: `NON`.

**Why it is correct.** Invariant: before each character, the stack holds, in order, the opening brackets already read and not yet closed; the most recent is on top. A closing bracket must close precisely the one on top. **Cost**: each character is pushed at most once and popped at most once, so at most `2n` stack operations for a string of length `n`.

## Evaluating a postfix expression

In **postfix notation**, each operator is written after its two operands: `3 4 +` means `3 + 4`, and `5 1 2 + 4 * + 3 -` means `5 + (1 + 2) × 4 − 3`. This notation never needs brackets, and it is computed with a stack: a number is pushed; an operator pops two values, computes, and pushes the result. Watch the order: the top is the **second** operand.

```python
elements = "5 1 2 + 4 * + 3 -".split()
pile = []
for e in elements:
    if e == "+" or e == "-" or e == "*":
        b = pile.pop()
        a = pile.pop()
        if e == "+":
            pile.append(a + b)
        elif e == "-":
            pile.append(a - b)
        else:
            pile.append(a * b)
    else:
        pile.append(int(e))
print(pile[0])
```

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

int main() {
    istringstream entree("5 1 2 + 4 * + 3 -");
    vector<long long> pile;
    string e;
    while (entree >> e) {
        if (e == "+" || e == "-" || e == "*") {
            long long b = pile.back();
            pile.pop_back();
            long long a = pile.back();
            pile.pop_back();
            if (e == "+") {
                pile.push_back(a + b);
            } else if (e == "-") {
                pile.push_back(a - b);
            } else {
                pile.push_back(a * b);
            }
        } else {
            pile.push_back(stoll(e));
        }
    }
    cout << pile[0] << "\n";
    return 0;
}
```

The program prints `14`. The stack goes through `[5]`, `[5, 1]`, `[5, 1, 2]`, `[5, 3]`, `[5, 3, 4]`, `[5, 12]`, `[17]`, `[17, 3]` and `[14]`. The two operands of an operator are always the two most recent values not yet used: this is the invariant that justifies the algorithm. An expression is ill-formed if an operator finds fewer than two values, or if exactly one value does not remain at the end. (In C++, `istringstream` from `<sstream>` lets you read the words of a string here as you would read the input.)

## The queue

A **queue** is a collection where elements are added on one side, the **back**, and removed from the other, the **front**. To **enqueue** is to add at the back; to **dequeue** is to remove the front element. The first in is the first out: a queue is **FIFO**, for *first in, first out*.

A Python list is **not** a good queue. The call `t.pop(0)` does remove the first element, but it must then shift all the others one cell to the left: for a list of `n` elements, that makes `n − 1` moves. The `collections` module provides the `deque` type, designed for this: `append` enqueues, `popleft()` dequeues, `f[0]` reads the front, and each of these operations costs a few instructions. In C++, the `queue` type from `<queue>` offers `push`, `pop`, `front`, `empty` and `size`.

```python
from collections import deque

f = deque()
f.append("a")
f.append("b")
f.append("c")
print(f.popleft())
print(f[0], len(f))
```

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;

int main() {
    queue<string> f;
    f.push("a");
    f.push("b");
    f.push("c");
    cout << f.front() << "\n";
    f.pop();
    cout << f.front() << " " << f.size() << "\n";
    return 0;
}
```

The program prints `a`, then `b 2`: the first to arrive is the first to leave. A `deque` (a **double-ended queue**) can also add at the front with `appendleft` and remove at the back with `pop`; in C++, the `deque` type from `<deque>` offers `push_front`, `push_back`, `pop_front` and `pop_back`.

## Simulating with a queue

Many processes are simulated with a queue: customers waiting, tasks taking turns, cards put back under a deck. Example: a deck holds the cards 1 to `n`, card 1 on top. Repeat: put the top card on the table, then slide the next card under the deck. We want the order in which the cards are put down.

```python
from collections import deque

n = 6
paquet = deque(range(1, n + 1))
posees = []
while len(paquet) > 0:
    posees.append(paquet.popleft())
    if len(paquet) > 0:
        paquet.append(paquet.popleft())
print(*posees)
```

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    int n = 6;
    queue<int> paquet;
    for (int i = 1; i <= n; i++) {
        paquet.push(i);
    }
    while (!paquet.empty()) {
        cout << paquet.front() << " ";
        paquet.pop();
        if (!paquet.empty()) {
            paquet.push(paquet.front());
            paquet.pop();
        }
    }
    cout << "\n";
    return 0;
}
```

The program prints `1 3 5 2 6 4`. The simulation stops, because each turn puts down one card: the deck loses one element per turn. It makes `n` turns of at most three queue operations. With a list and `pop(0)`, each turn would shift the whole deck: about `n² / 2` moves, that is billions for `n = 100,000`.

## Monotonic stack: the next greater element

For each element of a list, look for the **next greater element**: the first strictly greater value to its right, or `-1` if there is none. For `2 7 3 1 5 8`, the answers are `7 8 5 5 8 -1`. Searching to the right from each position costs up to `n² / 2` comparisons, for example on a decreasing list.

The idea is to keep a stack of **waiting** positions, those whose answer has not been found yet. When a value `x` arrives, it is the answer of all waiting positions whose value is smaller than `x`: pop them, giving them the answer `x`. Then push the position of `x`, which waits in turn.

```python
t = [2, 7, 3, 1, 5, 8]
n = len(t)
reponse = [-1] * n
pile = []
for i in range(n):
    while len(pile) > 0 and t[pile[-1]] < t[i]:
        reponse[pile.pop()] = t[i]
    pile.append(i)
print(*reponse)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 7, 3, 1, 5, 8};
    int n = t.size();
    vector<int> reponse(n, -1);
    vector<int> pile;
    for (int i = 0; i < n; i++) {
        while (!pile.empty() && t[pile.back()] < t[i]) {
            reponse[pile.back()] = t[i];
            pile.pop_back();
        }
        pile.push_back(i);
    }
    for (int x : reponse) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `7 8 5 5 8 -1`. When the 5 arrives, the stack holds the positions of the values `7 3 1`; the 1 then the 3 are popped with the answer 5, and the 7 stays.

**Why it is correct.** Invariant: before processing position `i`, the stack holds exactly the positions `j < i` such that no value between `j + 1` and `i − 1` is greater than `t[j]`, and their values **decrease** (not necessarily strictly) from bottom to top. This is called a **monotonic stack**. When `t[i]` arrives, the waiting positions smaller than `t[i]` are all at the top of the stack, thanks to this order: the `while` loop finds them all, and stops at the first value greater than or equal, below which none is smaller. For each of them, `t[i]` is indeed the first greater value to its right. The positions left in the stack at the end have no answer: they keep `-1`.

**How many operations.** A single step can pop many elements, and you might fear `n²` operations. Count globally instead: each position is pushed once and popped at most once. Over the whole program, there are at most `n` pops, and the `while` loop makes at most `2n` tests in total. The algorithm makes about `n` operations, instead of `n² / 2`.

## Common mistakes

**Popping an empty stack.** `p.pop()` on an empty list raises `IndexError: pop from empty list`, and `p[-1]` raises `IndexError: list index out of range`. In C++, `top()` or `pop()` on an empty stack give no clear message: the program reads garbage or stops with `Segmentation fault`. Always test `len(p) > 0` or `!p.empty()` first, as in the loops above, where this test is written first.

**Getting the value of `pop` in C++.** `int x = p.pop();` does not compile: `error: void value not ignored as it ought to be`. The method `pop` returns nothing; write `int x = p.top(); p.pop();`.

**Forgetting the import.** Using `deque` without `from collections import deque` raises `NameError: name 'deque' is not defined`.

**A queue made with a list.** No error message, but `pop(0)` shifts the whole list at each call: the program exceeds the time limit as soon as the queue is long.

**Swapping operands.** In a postfix expression, `8 3 -` is `5`. The first element popped is the second operand: writing `pile.pop() - pile.pop()` computes `3 − 8`.

## A complete example

**Statement.** The temperature is recorded over `N` consecutive days. For each day, print the number of days to wait for a strictly higher temperature, or `0` if this never happens. `N` can reach 100,000.

**Idea.** This is the next greater element, but a distance is wanted rather than a value. Keep the same stack of waiting positions: when day `i` pops day `j`, the answer of `j` is `i − j`.

**Program.**

```python
n = int(input())
t = list(map(int, input().split()))
attente = [0] * n
pile = []
for i in range(n):
    while len(pile) > 0 and t[pile[-1]] < t[i]:
        j = pile.pop()
        attente[j] = i - j
    pile.append(i)
print(*attente)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    vector<int> attente(n, 0);
    vector<int> pile;
    for (int i = 0; i < n; i++) {
        while (!pile.empty() && t[pile.back()] < t[i]) {
            int j = pile.back();
            pile.pop_back();
            attente[j] = i - j;
        }
        pile.push_back(i);
    }
    for (int x : attente) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

**Checking by hand.** With `7` then `13 12 15 11 9 12 16`, the days are numbered from 0 to 6. Day 2 (15) pops days 1 and 0: waits `1` and `2`. Day 5 (12) pops days 4 (9) and 3 (11): waits `1` and `2`. Day 6 (16) pops days 5 and 2: waits `1` and `4`. Day 6 stays in the stack. The program prints `2 1 4 2 1 1 0`, and you can check directly that, for example, after day 2 (15), the first higher temperature is 16, four days later.

**Why it is correct.** The invariant is that of the monotonic stack: a day is popped exactly by the first day that exceeds it, so `i − j` is indeed the first possible wait. A day never popped is never exceeded and keeps `0`. Each day is pushed once and popped at most once: at most `2N` stack operations, that is a few hundred thousand for `N = 100,000`, instead of 5 billion comparisons for the direct method on decreasing temperatures.

## Key takeaways

- A stack (LIFO) adds and removes at the top: `append`, `pop`, `p[-1]` in Python; `push_back`, `pop_back`, `back` or `stack` in C++. Each operation costs a few instructions.
- A queue (FIFO) adds at the back and removes at the front: `deque` with `append` and `popleft` in Python, `queue` in C++. Never `pop(0)` on a long list.
- Brackets and postfix expressions are handled with a stack: you pop what is "the most recent not yet used".
- A simulation of a waiting line, of round robin or of a card game is programmed directly with a queue; you justify that it stops by finding a quantity that decreases at each turn.
- A monotonic stack gives for each element the next greater (or smaller) one in one pass; the cost is counted globally: each element is pushed once and popped at most once.
- Before each `pop`, `top` or `popleft`, check that the structure is not empty.
