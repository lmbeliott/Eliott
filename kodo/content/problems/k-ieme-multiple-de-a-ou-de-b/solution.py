import sys
from math import gcd

def kieme(a, b, k):
    l = a // gcd(a, b) * b          # PPCM de a et b
    def compte(x):
        # nombre d'éléments de la liste qui sont au plus x
        return x // a + x // b - x // l
    lo, hi = 0, k * min(a, b)       # invariant : compte(lo) < k <= compte(hi)
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if compte(mid) >= k:
            hi = mid
        else:
            lo = mid
    return hi

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    a, b, k = map(int, donnees[1 + 3 * i: 4 + 3 * i])
    reponses.append(str(kieme(a, b, k)))
print("\n".join(reponses))
