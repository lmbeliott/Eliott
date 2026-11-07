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
            res.append(d[j])        # d[j] est plus petit que g[i], ..., g[fin]
            j += 1
            inv += len(g) - i
    res.extend(g[i:])
    res.extend(d[j:])
    return res, inv

n, x, b, c, m = map(int, input().split())
notes = [x]
for _ in range(2 * n - 1):
    notes.append((notes[-1] * b + c) % m)
candidats = sorted((notes[2 * i], notes[2 * i + 1]) for i in range(n))
second = [r for s, r in candidats]
print(tri_fusion(second)[1])
