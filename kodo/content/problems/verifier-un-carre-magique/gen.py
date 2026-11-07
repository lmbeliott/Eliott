import json, random
random.seed(2026)


def siamois(n):
    # n impair
    g = [[0] * n for _ in range(n)]
    i, j = 0, n // 2
    for v in range(1, n * n + 1):
        g[i][j] = v
        ni, nj = (i - 1) % n, (j + 1) % n
        if g[ni][nj]:
            ni, nj = (i + 1) % n, j
        i, j = ni, nj
    return g


def double_pair(n):
    # n multiple de 4
    g = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            v = i * n + j + 1
            if (i % 4 in (0, 3)) == (j % 4 in (0, 3)):
                v = n * n + 1 - v
            g[i][j] = v
    return g


def strachey(n):
    # n = 4k + 2
    m = n // 2
    a = siamois(m)
    k = (n - 2) // 4
    g = [[0] * n for _ in range(n)]
    for i in range(m):
        for j in range(m):
            g[i][j] = a[i][j]
            g[i + m][j + m] = a[i][j] + m * m
            g[i][j + m] = a[i][j] + 2 * m * m
            g[i + m][j] = a[i][j] + 3 * m * m
    for i in range(m):
        cols = list(range(k)) if i != m // 2 else list(range(1, k + 1))
        for j in cols:
            g[i][j], g[i + m][j] = g[i + m][j], g[i][j]
        for j in range(n - k + 1, n):
            g[i][j], g[i + m][j] = g[i + m][j], g[i][j]
    return g


def magique(n):
    if n % 2 == 1:
        return siamois(n)
    if n % 4 == 0:
        return double_pair(n)
    return strachey(n)


def est_magique(g):
    n = len(g)
    vals = sorted(v for r in g for v in r)
    if vals != list(range(1, n * n + 1)):
        return False
    s = sum(g[0])
    sommes = [sum(r) for r in g] + [sum(g[i][j] for i in range(n)) for j in range(n)]
    sommes += [sum(g[i][i] for i in range(n)), sum(g[i][n - 1 - i] for i in range(n))]
    return all(x == s for x in sommes)


def tourner(g):
    n = len(g)
    return [[g[n - 1 - j][i] for j in range(n)] for i in range(n)]


def grille(g):
    return f"{len(g)}\n" + "".join(" ".join(map(str, r)) + "\n" for r in g)


for n in range(3, 51):
    assert est_magique(magique(n)), n

tests = [grille([[2, 7, 6], [9, 5, 1], [4, 3, 8]]), grille([[5] * 3 for _ in range(3)])]
tests.append(grille([[1]]))
tests.append(grille([[1, 2], [3, 4]]))
tests.append(grille([[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]))
# Lignes permutées : lignes et colonnes justes, diagonales fausses.
g = magique(5)
tests.append(grille([g[1], g[0], g[2], g[3], g[4]]))
# Colonnes permutées : la diagonale principale est juste, l'anti-diagonale fausse.
g = magique(7)
while True:
    p = list(range(7))
    random.shuffle(p)
    h = [[r[p[j]] for j in range(7)] for r in g]
    d1 = sum(h[i][i] for i in range(7))
    d2 = sum(h[i][6 - i] for i in range(7))
    if d1 == 175 and d2 != 175:
        break
tests.append(grille(h))
tests.append(grille(magique(6)))
g = magique(10)
g[2][3], g[7][5] = g[7][5], g[2][3]
tests.append(grille(g))
tests.append(grille(tourner(magique(50))))
g = magique(49)
tests.append(grille([r[::-1] for r in g]))
tests.append(grille(magique(48)))
# Un doublon qui garde la somme d'une ligne mais pas tout le reste.
g = magique(4)
g[0][0] = g[0][1]
tests.append(grille(g))
print(json.dumps(tests))
