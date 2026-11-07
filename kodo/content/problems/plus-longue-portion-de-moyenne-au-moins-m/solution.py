import sys

def plus_longue(a, m):
    n = len(a)
    # sommes préfixes de a[k] - m
    p = [0] * (n + 1)
    for k in range(n):
        p[k + 1] = p[k] + a[k] - m
    # L[i] = min(p[0..i]) ; R[j] = max(p[j..n])
    L = [0] * (n + 1)
    L[0] = p[0]
    for i in range(1, n + 1):
        L[i] = min(L[i - 1], p[i])
    R = [0] * (n + 1)
    R[n] = p[n]
    for j in range(n - 1, -1, -1):
        R[j] = max(R[j + 1], p[j])
    meilleur = 0
    i = 0
    j = 0
    while i <= n and j <= n:
        if L[i] <= R[j]:
            meilleur = max(meilleur, j - i)
            j = j + 1
        else:
            i = i + 1
    return meilleur

donnees = sys.stdin.read().split()
n = int(donnees[0])
q = int(donnees[1])
a = [int(x) for x in donnees[2:2 + n]]
for k in range(q):
    print(plus_longue(a, int(donnees[2 + n + k])))
