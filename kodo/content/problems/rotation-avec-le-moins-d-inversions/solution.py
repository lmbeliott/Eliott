from bisect import bisect_left, bisect_right

def tri_fusion(t):
    # renvoie (t trié, nombre d'inversions de t)
    n = len(t)
    if n <= 1:
        return t, 0
    g, inv_g = tri_fusion(t[:n // 2])
    d, inv_d = tri_fusion(t[n // 2:])
    res = []
    inv = inv_g + inv_d
    i = j = 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
            inv += len(g) - i
    res.extend(g[i:])
    res.extend(d[j:])
    return res, inv

n, x, b, c, m = map(int, input().split())
a = [x]
for _ in range(n - 1):
    a.append((a[-1] * b + c) % m)

s, inv = tri_fusion(a)
meilleur = inv
for k in range(n - 1):
    # a[k] passe de la tête à la fin
    plus_petits = bisect_left(s, a[k])
    plus_grands = n - bisect_right(s, a[k])
    inv = inv - plus_petits + plus_grands
    meilleur = min(meilleur, inv)
print(meilleur)
