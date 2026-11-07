The table of contents of a book or the folders of a computer are organised as a **tree**: a starting element, which splits into sub-parts, which split in turn. An expression like `(3 + 4) × (10 − 2 × 3)` has this shape too. And by storing numbers in a well-chosen tree, a number can be searched for or inserted while looking at only a small part of the data.

This chapter defines binary trees, shows how to store them in arrays, presents the four classic traversals with their proofs, then **binary search trees**: their invariant, their operations, and why their efficiency depends on their shape.

## Rooted trees and binary trees

The graphs chapter defined a **tree** as a connected graph without a cycle; a tree with `n` vertices has exactly `n − 1` edges. It is **rooted** by choosing a vertex, the **root**. Every other vertex, called a **node**, then has a unique **parent**: the neighbour through which the path to the root goes. The other neighbours of a node are its **children**; a node without children is a **leaf**. The **ancestors** of a node are the nodes of the path joining it to the root, and its **descendants** the nodes of which it is an ancestor. The **subtree** of a node is made of that node and all its descendants.

The **depth** of a node is the number of edges between it and the root (0 for the root). The **height** of a tree is the largest depth of a node: a tree reduced to its root has height 0, and by convention the empty tree has height −1.

A **binary tree** is a rooted tree where each node has at most two children, and where the **left child** is distinguished from the **right child**: a node with a single child on the left is not the same tree as the one with that child on the right. It can also be defined recursively: a binary tree is either **empty**, or made of a root, a left subtree and a right subtree, which are binary trees themselves. This definition guides every function and every proof of this chapter.

**How many nodes?** At depth `k`, there are at most `2^k` nodes, since each node has at most two children. A tree of height `h` therefore has at most `1 + 2 + … + 2^h = 2^(h+1) − 1` nodes. Conversely, a binary tree with `n` nodes has a height between `log₂(n + 1) − 1` (well-filled tree) and `n − 1` (a path).

## Storing a binary tree in arrays

Number the nodes from 1 to `n` and store, for each node, its left child and its right child in two arrays `left_child` and `right_child`, with `0` for "no child". The exercises give the tree in this form. The root is not always node 1: it is the only node that is nobody's child, and a loop over the two arrays finds it.

For a general rooted tree, the **parent array** is often given (`parent[v]`, and `0` for the root), from which the lists of children are deduced.

Finally, a **complete** binary tree (all levels full, except the last, filled from the left) is stored without any child array: the root has number 1, the children of node `k` are `2k` and `2k + 1`, and its parent `k // 2`.

## Depth-first traversals

**Traversing** a tree means visiting each of its nodes once. The three depth-first traversals follow the recursive definition: handle the root and traverse both subtrees, the left one before the right one. They only differ by the moment the root is handled:
- **preorder**: the root, then the left subtree, then the right subtree;
- **inorder**: the left subtree, then the root, then the right subtree;
- **postorder**: the left subtree, then the right subtree, then the root.

The **level-order traversal** visits the root, then the nodes of depth 1 from left to right, then those of depth 2, and so on: it is the breadth-first search of the graphs chapter, with a queue, enqueuing the left child before the right child.

The following program applies the four traversals to a tree with 7 nodes, then computes its size and height with two recursive functions written on the same model.

```python
from collections import deque

#         1
#       /   \
#      2     3
#     / \     \
#    4   5     6
#       /
#      7
left_child = [0, 2, 4, 0, 0, 7, 0, 0]       # 0: no child
right_child = [0, 3, 5, 6, 0, 0, 0, 0]

def preorder(v, res):
    if v != 0:
        res.append(v)
        preorder(left_child[v], res)
        preorder(right_child[v], res)

def inorder(v, res):
    if v != 0:
        inorder(left_child[v], res)
        res.append(v)
        inorder(right_child[v], res)

def postorder(v, res):
    if v != 0:
        postorder(left_child[v], res)
        postorder(right_child[v], res)
        res.append(v)

def size(v):
    if v == 0:
        return 0
    return 1 + size(left_child[v]) + size(right_child[v])

def height(v):
    if v == 0:
        return -1                        # the empty tree
    return 1 + max(height(left_child[v]), height(right_child[v]))

for traversal in (preorder, inorder, postorder):
    res = []
    traversal(1, res)
    print(*res)

levels = []
queue = deque([1])
while queue:
    v = queue.popleft()
    levels.append(v)
    for f in (left_child[v], right_child[v]):
        if f != 0:
            queue.append(f)
print(*levels)
print(size(1), height(1))
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

//         1
//       /   \
//      2     3
//     / \     \
//    4   5     6
//       /
//      7
vector<int> left_child = {0, 2, 4, 0, 0, 7, 0, 0};   // 0: no child
vector<int> right_child = {0, 3, 5, 6, 0, 0, 0, 0};

void preorder(int v, vector<int> &res) {
    if (v == 0) return;
    res.push_back(v);
    preorder(left_child[v], res);
    preorder(right_child[v], res);
}

void inorder(int v, vector<int> &res) {
    if (v == 0) return;
    inorder(left_child[v], res);
    res.push_back(v);
    inorder(right_child[v], res);
}

void postorder(int v, vector<int> &res) {
    if (v == 0) return;
    postorder(left_child[v], res);
    postorder(right_child[v], res);
    res.push_back(v);
}

int size(int v) {
    if (v == 0) return 0;
    return 1 + size(left_child[v]) + size(right_child[v]);
}

int height(int v) {
    if (v == 0) return -1;                         // the empty tree
    return 1 + max(height(left_child[v]), height(right_child[v]));
}

void show(const vector<int> &res) {
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << (i + 1 == (int)res.size() ? "\n" : " ");
}

int main() {
    vector<int> a, b, c;
    preorder(1, a);
    inorder(1, b);
    postorder(1, c);
    show(a);
    show(b);
    show(c);
    vector<int> levels;
    queue<int> q;
    q.push(1);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        levels.push_back(v);
        for (int f : {left_child[v], right_child[v]})
            if (f != 0) q.push(f);
    }
    show(levels);
    cout << size(1) << " " << height(1) << "\n";
    return 0;
}
```

The program prints:

```text
1 2 4 5 7 3 6
4 2 7 5 1 3 6
4 7 5 2 6 3 1
1 2 3 4 5 6 7
7 3
```

These are the preorder, inorder, postorder and level orders, then the size 7 and the height 3 (the path 1, 2, 5, 7).

**Correctness.** By induction on the size of the tree. For the empty tree, each function does nothing (or returns 0, or −1), which is correct. For a non-empty tree, if the calls on the two subtrees, which are smaller, produce their traversals, the function produces the root followed by the left traversal then the right traversal, which is exactly the definition of preorder; likewise for the others. The size is `1 + size(left) + size(right)`, and the height `1 + max(height(left), height(right))`, since the deepest node is in one of the subtrees, one level lower than in that subtree; the convention "empty = −1" indeed gives 0 for a leaf.

**Complexity.** Each function is called once per node and once per missing child (there are `n + 1` of them): O(n). The recursion depth is the height plus 1: on a path of 100,000 nodes, `RecursionError` in Python, `Segmentation fault` in C++. Then use the level-order traversal, and notice that the order of the queue puts each parent before its children: read **backwards**, it puts each node **after** its children, which allows computing sizes and heights without recursion.

## Rebuilding a tree from two traversals

A single traversal is not enough to recover a tree: the paths `1 → 2 → 3` to the left and to the right have the same preorder. But the preorder **and** the inorder determine it entirely, if the nodes are all different.

Take the tree above: preorder `1 2 4 5 7 3 6`, inorder `4 2 7 5 1 3 6`. The root is the first node of the preorder: 1. In the inorder, what comes before 1, `4 2 7 5`, forms the left subtree, and what comes after, `3 6`, the right subtree. The left subtree has 4 nodes: they are also the 4 nodes following the root in the preorder, `2 4 5 7`, and the last 2, `3 6`, form the right subtree. Repeat: the left subtree (preorder `2 4 5 7`, inorder `4 2 7 5`) has root 2, with `4` on the left and `7 5` on the right, and so on.

At each step, the root and the sizes of both subtrees are forced: the tree is **unique**. If the root of a portion is not in the corresponding inorder portion, no tree has these two traversals. By storing the position of each node in the inorder in an array, rebuilding costs O(n). Preorder and postorder, on the other hand, are not enough: a node with a single child gives the same traversals, whether that child is on the left or on the right.

## Binary search trees

A **binary search tree** (BST) is a binary tree in which each node carries a **key**, with the following invariant: for each node `v`, all keys of the left subtree of `v` are smaller than that of `v`, and all those of the right subtree are larger. Beware: the condition concerns **all** nodes of the subtrees, not only the children.

**Fundamental property: the inorder traversal of a BST gives the keys in increasing order.** By induction: the inorder traversal of a non-empty BST writes the keys of the left subtree (in increasing order, by the induction hypothesis, and all smaller than the root), then the root, then the keys of the right subtree (increasing, all larger). Conversely, a tree whose inorder traversal is increasing is a BST.

The invariant guides every operation: by comparing the key sought with that of the current node, we know on which side it lies, and we go down on one side only.

- **Search** for `x`: start from the root; if `x` is smaller than the key of the node, go left, if it is larger, go right, until `x` is found or a missing child is reached.
- **Insert** `x`: go down as for searching, and attach a new node where a missing child was reached. The invariant is preserved, since `x` is on the correct side of each node crossed, which are exactly its ancestors.
- **Minimum**: always go left; the last node has the smallest key, since every other node is to the right of one of its ancestors or in its right subtree.
- **Successor** of `x` (the smallest key strictly larger than `x`): go down as for searching `x`. Each time the key of the node is larger than `x`, it is a candidate, and we continue to the left looking for a smaller one; otherwise, continue to the right.

```python
key = [0]          # node i has key key[i]; index 0 means "no node"
left_child = [0]
right_child = [0]
root = 0

def insert(x):
    global root
    key.append(x)
    left_child.append(0)
    right_child.append(0)
    new_node = len(key) - 1
    if root == 0:
        root = new_node
        return
    v = root
    while True:
        if x < key[v]:
            if left_child[v] == 0:
                left_child[v] = new_node
                return
            v = left_child[v]
        else:
            if right_child[v] == 0:
                right_child[v] = new_node
                return
            v = right_child[v]

def search(x):
    v = root
    while v != 0 and key[v] != x:
        v = left_child[v] if x < key[v] else right_child[v]
    return v != 0

def minimum(v):
    while left_child[v] != 0:
        v = left_child[v]
    return key[v]

def successor(x):
    # smallest key strictly larger than x, or None
    v = root
    best = None
    while v != 0:
        if key[v] > x:
            best = key[v]          # candidate; look for a smaller one on the left
            v = left_child[v]
        else:
            v = right_child[v]
    return best

for x in [50, 30, 70, 20, 40, 60, 80, 35, 45, 65]:
    insert(x)
print(search(45), search(55), minimum(root))
print(successor(45), successor(65), successor(80))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> key = {0}, left_child = {0}, right_child = {0};   // index 0 means "no node"
int root = 0;

void insert(int x) {
    key.push_back(x);
    left_child.push_back(0);
    right_child.push_back(0);
    int new_node = key.size() - 1;
    if (root == 0) {
        root = new_node;
        return;
    }
    int v = root;
    while (true) {
        if (x < key[v]) {
            if (left_child[v] == 0) { left_child[v] = new_node; return; }
            v = left_child[v];
        } else {
            if (right_child[v] == 0) { right_child[v] = new_node; return; }
            v = right_child[v];
        }
    }
}

bool search(int x) {
    int v = root;
    while (v != 0 && key[v] != x) v = (x < key[v]) ? left_child[v] : right_child[v];
    return v != 0;
}

int minimum(int v) {
    while (left_child[v] != 0) v = left_child[v];
    return key[v];
}

// smallest key strictly larger than x, or -1 if there is none
int successor(int x) {
    int v = root, best = -1;
    while (v != 0) {
        if (key[v] > x) {
            best = key[v];             // candidate; look for a smaller one on the left
            v = left_child[v];
        } else {
            v = right_child[v];
        }
    }
    return best;
}

int main() {
    for (int x : {50, 30, 70, 20, 40, 60, 80, 35, 45, 65}) insert(x);
    cout << (search(45) ? "True" : "False") << " " << (search(55) ? "True" : "False") << " " << minimum(root) << "\n";
    cout << successor(45) << " " << successor(65) << " " << successor(80) << "\n";
    return 0;
}
```

The program prints `True False 20`, then `50 70 None` (`-1` in the C++ version): 45 is present, 55 is not, the minimum is 20; the successor of 45 is 50, that of 65 is 70, and 80 has none.

**Why the successor is correct.** Candidates are keys larger than `x`. Let `y > x` be a key of the tree: at the last node common to the search paths of `x` and `y`, we go left towards `x` and record that node, whose key is at most `y`. Each candidate recorded afterwards is smaller than the previous one (we are in its left subtree): the last one is at most any key larger than `x`.

## The cost depends on the shape

Searching, inserting, finding the minimum or the successor follow a single path from the root: each operation costs O(h), where `h` is the height of the tree. Everything therefore depends on the shape of the tree, that is on the **insertion order**.

```python
def build(keys):
    # inserts the keys in order; returns (height, total number of comparisons)
    left_child = [0] * (len(keys) + 1)
    right_child = [0] * (len(keys) + 1)
    height = comparisons = 0
    for i in range(2, len(keys) + 1):    # node i carries key keys[i - 1]; 1 is the root
        v, depth = 1, 0
        while True:
            comparisons += 1
            depth += 1
            side = left_child if keys[i - 1] < keys[v - 1] else right_child
            if side[v] == 0:
                side[v] = i
                break
            v = side[v]
        height = max(height, depth)
    return height, comparisons

n = 2000
shuffled = []
x = 1
for _ in range(n):
    x = (x * 1103515245 + 12345) % 2147483648   # pseudo-random sequence
    shuffled.append(x)
print(*build(list(range(1, n + 1))))
print(*build(shuffled))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// inserts the keys in order; returns (height, total number of comparisons)
pair<long long, long long> build(const vector<long long> &keys) {
    int n = keys.size();
    vector<int> left_child(n + 1, 0), right_child(n + 1, 0);
    long long height = 0, comparisons = 0;
    for (int i = 2; i <= n; i++) {        // node i carries key keys[i - 1]; 1 is the root
        int v = 1;
        long long depth = 0;
        while (true) {
            comparisons++;
            depth++;
            vector<int> &side = (keys[i - 1] < keys[v - 1]) ? left_child : right_child;
            if (side[v] == 0) {
                side[v] = i;
                break;
            }
            v = side[v];
        }
        height = max(height, depth);
    }
    return {height, comparisons};
}

int main() {
    int n = 2000;
    vector<long long> sorted_keys, shuffled;
    long long x = 1;
    for (int i = 1; i <= n; i++) {
        sorted_keys.push_back(i);
        x = (x * 1103515245 + 12345) % 2147483648LL;   // pseudo-random sequence
        shuffled.push_back(x);
    }
    auto [h1, c1] = build(sorted_keys);
    auto [h2, c2] = build(shuffled);
    cout << h1 << " " << c1 << "\n" << h2 << " " << c2 << "\n";
    return 0;
}
```

The program prints `1999 1999000`, then `23 24390`. Inserting the numbers from 1 to 2,000 in increasing order, each new key goes to the very bottom right: the tree is a path of height 1,999, it is called **degenerate**, and building it takes nearly two million comparisons, `n²/2`. With the same number of values inserted in a mixed order, the height is only 23 and there are 80 times fewer comparisons. One can show that on average, for a random insertion order, the height is of the order of `log n`.

To **guarantee** a height in O(log n) whatever the order, there are **balanced trees** (AVL trees, red-black trees) that reorganise themselves after each insertion. They are not programmed here; it is enough to know that they exist, and that the ordered sets `set` and `map` of C++ are such trees. Python has none: use a dictionary, or a sorted list with binary search.

## Common mistakes

**Forgetting the empty tree.** A recursive function must handle the case `v = 0` (or `None`) first; otherwise it reads `left_child[0]` and loops, or raises `TypeError: 'NoneType' object is not subscriptable` with a representation by objects.

**Checking the invariant only between parent and child.** The tree with root 5, with 3 on the left and 6 as right child of 3, satisfies the condition between each parent and its children, but is not a BST: 6 is in the left subtree of 5. Check with intervals passed from parent to child, or with the inorder traversal.

**Equal keys.** Choose a convention (refuse duplicates, or send them to the right) and stick to it everywhere.

**Recursion on a degenerate tree.** A BST built from sorted data is a path: a recursive function reaches depth `n`. Prefer loops (`while`) to search and insert, and a traversal with a queue or a stack for the rest.

## Complete example: the tree of an expression

**Statement.** An arithmetic expression is given as a binary tree: each leaf carries an integer, each other node an operation `+`, `-` or `*` and has exactly two children. The root is node 1. Print the fully parenthesised expression, then its value. Each line of the input gives the label of a node and its two children (`0 0` for a leaf).

**Idea.** The value of a node is obtained from the values of its two children: this is a **postorder traversal**. Writing the expression puts the operation between its two operands: this is an **inorder traversal**, with parentheses around each operation.

```python
import sys
sys.setrecursionlimit(10000)

def value(v):
    # postorder traversal: both children first, then the operation
    if left_child[v] == 0:
        return int(label[v])
    a = value(left_child[v])
    b = value(right_child[v])
    if label[v] == "+":
        return a + b
    if label[v] == "-":
        return a - b
    return a * b

def write(v):
    # inorder traversal, with parentheses around each operation
    if left_child[v] == 0:
        return label[v]
    return "(" + write(left_child[v]) + " " + label[v] + " " + write(right_child[v]) + ")"

n = int(input())
label = [""] * (n + 1)
left_child = [0] * (n + 1)
right_child = [0] * (n + 1)
for i in range(1, n + 1):
    e, g, d = input().split()
    label[i], left_child[i], right_child[i] = e, int(g), int(d)
print(write(1))
print(value(1))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<string> label;
vector<int> left_child, right_child;

// postorder traversal: both children first, then the operation
long long value(int v) {
    if (left_child[v] == 0) return stoll(label[v]);
    long long a = value(left_child[v]);
    long long b = value(right_child[v]);
    if (label[v] == "+") return a + b;
    if (label[v] == "-") return a - b;
    return a * b;
}

// inorder traversal, with parentheses around each operation
string write(int v) {
    if (left_child[v] == 0) return label[v];
    return "(" + write(left_child[v]) + " " + label[v] + " " + write(right_child[v]) + ")";
}

int main() {
    int n;
    cin >> n;
    label.assign(n + 1, "");
    left_child.assign(n + 1, 0);
    right_child.assign(n + 1, 0);
    for (int i = 1; i <= n; i++) cin >> label[i] >> left_child[i] >> right_child[i];
    cout << write(1) << "\n";
    cout << value(1) << "\n";
    return 0;
}
```

**Checking by hand.** With the following input:

```text
9
* 2 3
+ 4 5
- 6 7
3 0 0
4 0 0
10 0 0
* 8 9
2 0 0
3 0 0
```

node 2 is worth 3 + 4 = 7, node 7 is worth 2 × 3 = 6, node 3 is worth 10 − 6 = 4, and the root 7 × 4 = 28. The program prints `((3 + 4) * (10 - (2 * 3)))`, then `28`.

**Correctness and cost.** By induction on the size of the subtree: `value(v)` returns the value of the sub-expression rooted at `v`, and `write(v)` its parenthesised writing. Each node is visited once per function: O(n), apart from building the strings.

## Key takeaways

- A **binary tree** is empty, or a root with a left subtree and a right subtree; it is stored in two arrays `left_child` and `right_child` (0 for "no child"), and the root is the only node that is nobody's child.
- **Preorder**, **inorder** and **postorder** traversals follow the recursive definition and cost O(n); the **level-order** traversal uses a queue. Proofs go by induction on the size.
- The **height** is `1 + max(height(left), height(right))`, with −1 for the empty tree; a tree of height `h` has at most `2^(h+1) − 1` nodes.
- Preorder and inorder determine a tree **uniquely**; it is rebuilt recursively in O(n).
- In a **binary search tree**, the whole left subtree is smaller and the whole right subtree larger; the inorder traversal is sorted; search, insertion, minimum and successor cost O(h).
- Without balancing, a BST can **degenerate** into a path (sorted data): `h = n − 1` and `n` insertions cost O(n²). Balanced trees guarantee O(log n).
