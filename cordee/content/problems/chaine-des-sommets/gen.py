import json, random
random.seed(2026)


def fmt(sommets):
    return f"{len(sommets)}\n" + "".join(f"{a} {d}\n" for a, d in sommets)


def aleatoire(n, amax, dmax):
    return [(random.randint(1, amax), random.randint(1, dmax)) for _ in range(n)]


def diagonale(n, bruit):
    # Sommets proches de la diagonale : de longs programmes existent.
    res = []
    for _ in range(n):
        x = random.randint(1, 10000)
        res.append((x, min(10000, max(1, x + random.randint(-bruit, bruit)))))
    return res


tests = [
    fmt([(2400, 3), (1800, 2), (3100, 5), (1800, 4), (2900, 4), (3500, 1), (2600, 6)]),
    fmt([(1500, 2), (1500, 5), (1500, 9), (1500, 7)]),
]
tests.append(fmt([(4808, 10000)]))
tests.append(fmt([(7, 7)] * 5))
tests.append(fmt([(i, i) for i in range(1, 21)]))
tests.append(fmt([(i, 21 - i) for i in range(1, 21)]))
# Altitudes égales deux à deux, difficultés croissantes : le piège du tri.
tests.append(fmt([(i // 2 + 1, i + 1) for i in range(30)]))
tests.append(fmt(aleatoire(12, 10, 10)))
tests.append(fmt(aleatoire(300, 1000, 1000)))
# Grands cas.
tests.append(fmt(aleatoire(15000, 10000, 10000)))
tests.append(fmt(diagonale(15000, 300)))
# Beaucoup d'égalités : seulement 150 altitudes et 150 difficultés différentes.
sommets = aleatoire(8000, 150, 150)
tests.append(fmt([(a * 60, d * 60) for a, d in sommets]))
print(json.dumps(tests))
