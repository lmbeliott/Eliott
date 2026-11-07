def plus_proche(p):
    # p trié par abscisse ; renvoie (plus petit carré de distance, p trié par ordonnée)
    n = len(p)
    if n <= 3:
        meilleur = 4 * 10**18
        for i in range(n):
            for j in range(i + 1, n):
                dx = p[i][0] - p[j][0]
                dy = p[i][1] - p[j][1]
                meilleur = min(meilleur, dx * dx + dy * dy)
        return meilleur, sorted(p, key=lambda q: q[1])
    m = n // 2
    xm = p[m][0]
    d1, g = plus_proche(p[:m])
    d2, d = plus_proche(p[m:])
    meilleur = min(d1, d2)
    # fusion des deux moitiés par ordonnée
    res = []
    i = j = 0
    while i < len(g) and j < len(d):
        if g[i][1] <= d[j][1]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
    res.extend(g[i:])
    res.extend(d[j:])
    # la bande autour de la droite x = xm, triée par ordonnée
    bande = [q for q in res if (q[0] - xm) ** 2 < meilleur]
    for a in range(len(bande)):
        xa, ya = bande[a]
        for b in range(a + 1, len(bande)):
            dy = bande[b][1] - ya
            if dy * dy >= meilleur:
                break
            dx = bande[b][0] - xa
            meilleur = min(meilleur, dx * dx + dy * dy)
    return meilleur, res

n, x, b, c, m = map(int, input().split())
u = [x]
for _ in range(2 * n - 1):
    u.append((u[-1] * b + c) % m)
points = sorted((u[2 * i], u[2 * i + 1]) for i in range(n))
print(plus_proche(points)[0])
