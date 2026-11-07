def compte(t):
    # renvoie (t trié, nombre de paires i < j avec t[i] > 2 t[j])
    n = len(t)
    if n <= 1:
        return t, 0
    g, a = compte(t[:n // 2])
    d, b = compte(t[n // 2:])
    total = a + b
    # paires à cheval : pour chaque y de d, les x de g tels que x > 2y
    i = 0
    for y in d:
        while i < len(g) and g[i] <= 2 * y:
            i += 1
        total += len(g) - i
    # fusion habituelle
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

n, x, b, c, m = map(int, input().split())
a = [x]
for _ in range(n - 1):
    a.append((a[-1] * b + c) % m)
print(compte(a)[1])
