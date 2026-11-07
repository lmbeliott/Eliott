import sys

def puissance_au_plus(r, k, n):
    # vrai si r^k <= n ; on s'arrête dès que le produit dépasse n
    p = 1
    for _ in range(k):
        p = p * r
        if p > n:
            return False
    return True

def racine(n, k):
    lo, hi = 0, 10**9 + 1          # invariant : lo^k <= n < hi^k
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if puissance_au_plus(mid, k, n):
            lo = mid
        else:
            hi = mid
    return lo

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    n = int(donnees[1 + 2 * i])
    k = int(donnees[2 + 2 * i])
    reponses.append(str(racine(n, k)))
print("\n".join(reponses))
