Searching for a pattern of length `M` in a text of length `N` by comparing letter by letter at each position costs O(N × M). On a text like `aaaa…a`, that's the worst case. This chapter presents three tools that avoid these repeated comparisons: the Z-function, polynomial hashing and Manacher's algorithm.

## The Z-function

For a word `s` of length `n`, `z[i]` is the length of the longest common prefix of `s` and `s[i:]`. For example, for `aabaab`, `z = [6, 1, 0, 3, 1, 0]`.

The trick: we keep the rightmost **box** `[g, d[` found so far, a piece equal to the start of the word. If `i` is inside the box, `s[i..d-1]` is a copy of `s[i-g..d-g-1]`, so `z[i]` is at least `min(d - i, z[i - g])`. We then extend letter by letter. Each successfully compared letter moves `d` forward, and `d` never goes back: the whole thing is **O(n)**.

```python
def z_function(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    g, d = 0, 0
    for i in range(1, n):
        if i < d:
            z[i] = min(d - i, z[i - g])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > d:
            g, d = i, i + z[i]
    return z
```

```cpp
vector<int> zFunction(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    z[0] = n;
    for (int i = 1, g = 0, d = 0; i < n; i++) {
        if (i < d) z[i] = min(d - i, z[i - g]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > d) { g = i; d = i + z[i]; }
    }
    return z;
}
```

To find a pattern `P` in a text `T`, compute the Z-function of `P + "#" + T`: `P` starts at position `i` of the text when the matching value equals `|P|`. The KMP **prefix function** (`π[i]` = longest border of `s[0..i]`) does the same jobs. Pick the one you prefer.

A word of length `n` has **period** `p` (`s[i] = s[i + p]` everywhere) exactly when `z[p] = n - p`. It can be written `U U … U` with `|U| = p` if, in addition, `p` divides `n`.

## Polynomial hashing

We map a word to a number, its **hash**: `h(s) = s[0]·B^(k-1) + s[1]·B^(k-2) + … + s[k-1]`, modulo a large prime `M`. With the hashes of the prefixes, the hash of any piece is computed in O(1). We then compare two pieces by comparing two numbers.

```python
M = (1 << 61) - 1
B = 911382323
h = [0] * (n + 1)          # h[i] = hash of s[:i]
pw = [1] * (n + 1)         # pw[i] = B^i
for i in range(n):
    h[i + 1] = (h[i] * B + ord(s[i])) % M
    pw[i + 1] = pw[i] * B % M

def hash_of(a, b):         # hash of s[a:b]
    return (h[b] - h[a] * pw[b - a]) % M
```

```cpp
typedef unsigned long long ull;
const ull M = (1ULL << 61) - 1, B = 911382323;
ull mulmod(ull a, ull b) {
    unsigned __int128 p = (unsigned __int128)a * b;
    ull r = (ull)(p & M) + (ull)(p >> 61);
    return r >= M ? r - M : r;
}
// h[i + 1] = (mulmod(h[i], B) + s[i]) % M ;  pw[i + 1] = mulmod(pw[i], B)
ull hashOf(int a, int b) { return (h[b] + M - mulmod(h[a], pw[b - a])) % M; }
```

Two equal pieces have the same hash. The converse is only *very likely*: two different words can **collide**. With `k` hashes and a modulus `M`, about `k² / (2M)` pairs collide. For 50 000 windows and `M ≈ 10⁹`, a collision is almost certain. So take `M = 2⁶¹ - 1`, or two moduli around 10⁹ at the same time. Avoid computing "modulo 2⁶⁴" by plain integer overflow: the Thue-Morse word (`a`, `ab`, `abba`, `abbabaab`…, each step appends the copy with `a` and `b` swapped) produces collisions for every base.

Hashing goes well with **binary search**: to find the greatest length that satisfies a monotone property, test each length in O(N) with a dictionary of hashes.

## Palindromes: Manacher's algorithm

To know which pieces are palindromes, we insert a separator between the letters (`#a#b#a#`). This way, every palindrome has a central letter. `p[i]` is the radius of the longest palindrome centered at `i`. As with the Z-function, we keep the palindrome `[c - p[c], d]` that reaches furthest to the right, and the mirror `2c - i` gives a starting value.

```python
t = "#" + "#".join(s) + "#"
p = [0] * len(t)
c, d = 0, 0
for i in range(len(t)):
    if i < d:
        p[i] = min(d - i, p[2 * c - i])
    while i - p[i] - 1 >= 0 and i + p[i] + 1 < len(t) and t[i - p[i] - 1] == t[i + p[i] + 1]:
        p[i] += 1
    if i + p[i] > d:
        c, d = i, i + p[i]
```

```cpp
string t = "#";
for (char ch : s) { t += ch; t += '#'; }
int m = t.size();
vector<int> p(m, 0);
for (int i = 0, c = 0, d = 0; i < m; i++) {
    if (i < d) p[i] = min(d - i, p[2 * c - i]);
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < m && t[i - p[i] - 1] == t[i + p[i] + 1]) p[i]++;
    if (i + p[i] > d) { c = i; d = i + p[i]; }
}
```

The palindrome centered at `i` has `p[i]` letters in the original word and starts at position `(i - p[i]) / 2`. Removing the first and last letters of a palindrome still gives a palindrome: this remark lets you go from the maximal palindromes to all the others.

## Key takeaways

- Z-function and prefix function: in O(N), the longest common prefix at every position, the occurrences of a pattern, the periods.
- Polynomial hashing: compare two pieces in O(1). Large prime modulus (`2⁶¹ - 1`) or double modulus, never overflow modulo 2⁶⁴.
- Hashing + binary search on the length: the standard method for "the longest substring that…".
- Manacher: all maximal palindromes in O(N), thanks to the same box idea as the Z-function.
