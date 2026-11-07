import sys

M = 10**6
# crible d'Ératosthène jusqu'à M
premier = [True] * (M + 1)
premier[0] = premier[1] = False
i = 2
while i * i <= M:
    if premier[i]:
        for j in range(i * i, M + 1, i):
            premier[j] = False
    i += 1
# pi[x] = nombre de premiers au plus x
pi = [0] * (M + 1)
for x in range(1, M + 1):
    pi[x] = pi[x - 1] + (1 if premier[x] else 0)

def racine(n):
    # plus grand r tel que r * r <= n
    lo, hi = 0, M + 1
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid
    return lo

donnees = sys.stdin.read().split()
q = int(donnees[0])
reponses = []
for k in range(q):
    l, r = int(donnees[1 + 2 * k]), int(donnees[2 + 2 * k])
    reponses.append(str(pi[racine(r)] - pi[racine(l - 1)]))
print("\n".join(reponses))
