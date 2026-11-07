import sys

donnees = sys.stdin.read().split()
n, k = int(donnees[0]), int(donnees[1])
barres = [int(x) for x in donnees[2:2 + n]]

def possible(x):
    # nombre minimal de coupes pour que tous les morceaux mesurent au plus x
    coupes = 0
    for l in barres:
        coupes += (l + x - 1) // x - 1
    return coupes <= k

lo, hi = 0, max(barres)       # invariant : lo impossible, hi possible
while hi - lo > 1:
    mid = (lo + hi) // 2
    if possible(mid):
        hi = mid
    else:
        lo = mid
print(hi)
