import sys

def compte(p, l, r):
    # renvoie (p trié, nombre de paires i < j avec l <= p[j] - p[i] <= r)
    n = len(p)
    if n <= 1:
        return p, 0
    g, a = compte(p[:n // 2], l, r)
    d, b = compte(p[n // 2:], l, r)
    total = a + b
    # paires à cheval : pour v à gauche, les w à droite dans [v + l, v + r]
    bas = haut = 0
    for v in g:
        while bas < len(d) and d[bas] < v + l:
            bas += 1
        while haut < len(d) and d[haut] <= v + r:
            haut += 1
        total += haut - bas
    # fusion
    res = []
    i = j = 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
    res.extend(g[i:])
    res.extend(d[j:])
    return res, total

donnees = sys.stdin.read().split()
n, l, r, x, b, c, m, dd = map(int, donnees[:8])
p = [0] * (n + 1)
u = x
for k in range(n):
    p[k + 1] = p[k] + u - dd
    u = (u * b + c) % m
print(compte(p, l, r)[1])
