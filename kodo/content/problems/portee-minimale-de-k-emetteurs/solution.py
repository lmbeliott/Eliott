import sys

donnees = sys.stdin.read().split()
n, k = int(donnees[0]), int(donnees[1])
x = sorted(int(v) for v in donnees[2:2 + n])

def emetteurs(r):
    # nombre minimal d'émetteurs de portée r pour couvrir toutes les maisons
    nb = 0
    couvert = -1          # dernière position couverte
    for pos in x:
        if pos > couvert:
            nb += 1
            couvert = pos + 2 * r   # émetteur placé en pos + r
    return nb

lo, hi = -1, 10**9        # invariant : lo ne convient pas, hi convient
while hi - lo > 1:
    mid = (lo + hi) // 2
    if emetteurs(mid) <= k:
        hi = mid
    else:
        lo = mid
print(hi)
