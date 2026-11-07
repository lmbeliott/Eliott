import sys

donnees = sys.stdin.read().split()
n, k = int(donnees[0]), int(donnees[1])
a = [int(v) for v in donnees[2:2 + n]]

def ok(x):
    # existe-t-il une portion de longueur >= k de médiane >= x ?
    p = [0] * (n + 1)
    for i in range(n):
        p[i + 1] = p[i] + (1 if a[i] >= x else -1)
    mini = p[0]                     # minimum de p[0..j-k]
    for j in range(k, n + 1):
        mini = min(mini, p[j - k])
        if p[j] - mini >= 1:
            return True
    return False

v = sorted(set(a))
lo, hi = 0, len(v)                  # invariant : ok(v[lo]) vrai, ok(v[hi]) faux
while hi - lo > 1:
    mid = (lo + hi) // 2
    if ok(v[mid]):
        lo = mid
    else:
        hi = mid
print(v[lo])
