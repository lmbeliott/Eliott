import sys

def racine(n, k):
    # plus grand r tel que r^k <= n, par dichotomie
    lo, hi = 0, 2
    while hi ** k <= n:
        hi = hi * 2
    while hi - lo > 1:          # invariant : lo^k <= n < hi^k
        mid = (lo + hi) // 2
        if mid ** k <= n:
            lo = mid
        else:
            hi = mid
    return lo

def compte(x):
    # nombre d'entiers de 1 à x qui ne sont ni des carrés ni des cubes
    s = racine(x, 2)
    return x - s - racine(x, 3) + racine(s, 3)

def kieme(k):
    lo, hi = k - 1, 2 * k       # invariant : compte(lo) < k <= compte(hi)
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if compte(mid) >= k:
            hi = mid
        else:
            lo = mid
    return hi

donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(kieme(int(donnees[1 + i]))) for i in range(t)))
