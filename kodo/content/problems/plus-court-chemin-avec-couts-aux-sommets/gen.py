import json, random
random.seed(2026)


def fmt(n, couts, aretes):
    return (f"{n} {len(aretes)}\n" + " ".join(map(str, couts)) + "\n"
            + "".join(f"{a} {b} {t}\n" for a, b, t in aretes))


def renumerote(n, aretes):
    # Mélange les numéros des sommets (sauf 1 et n) et l'ordre des arêtes.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = [(perm[a], perm[b], t) if random.random() < 0.5 else (perm[b], perm[a], t) for a, b, t in aretes]
    random.shuffle(res)
    return res


def connexe(n, m, tmax, pmax):
    aretes = [(random.randint(1, v - 1), v, random.randint(1, tmax)) for v in range(2, n + 1)]
    while len(aretes) < m:
        a, b = random.sample(range(1, n + 1), 2)
        aretes.append((a, b, random.randint(1, tmax)))
    couts = [random.randint(0, pmax) for _ in range(n)]
    return fmt(n, couts, renumerote(n, aretes))


tests = [
    fmt(5, [30, 40, 5, 10, 50], [(1, 2, 10), (2, 5, 10), (1, 3, 15), (3, 4, 10), (4, 5, 5), (1, 4, 40)]),
    fmt(4, [0, 0, 0, 0], [(1, 2, 5), (3, 4, 5)]),
]
tests.append(fmt(1, [500], []))
tests.append(fmt(2, [1000, 1000], [(2, 1, 7), (1, 2, 3)]))
tests.append(fmt(3, [0, 1000, 0], [(1, 2, 1), (2, 3, 1), (1, 3, 1000)]))   # 1000 + 2 contre 1000
tests.append(fmt(3, [0, 997, 0], [(1, 2, 1), (2, 3, 1), (1, 3, 1000)]))
tests.append(connexe(10, 15, 20, 20))
tests.append(connexe(200, 400, 100, 100))
# Une chaîne avec des raccourcis longs : le plus court chemin traverse beaucoup de sommets.
n = 2000
aretes = [(v, v + 1, random.randint(1, 10)) for v in range(1, n)]
for _ in range(1000):
    a, b = random.sample(range(1, n + 1), 2)
    aretes.append((a, b, 1000))
tests.append(fmt(n, [random.randint(0, 5) for _ in range(n)], renumerote(n, aretes)))
# Grands cas.
tests.append(connexe(5000, 8000, 1000, 1000))
tests.append(connexe(5000, 8000, 50, 1000))
# Deux grandes composantes : le sommet N est inaccessible.
n = 3000
aretes = []
for v in range(2, n + 1):
    if v <= 1500:
        aretes.append((random.randint(1, v - 1), v, random.randint(1, 1000)))
    elif v > 1501:
        aretes.append((random.randint(1501, v - 1), v, random.randint(1, 1000)))
while len(aretes) < 4000:
    a, b = random.sample(range(1, 1501), 2) if random.random() < 0.5 else random.sample(range(1501, n + 1), 2)
    aretes.append((a, b, random.randint(1, 1000)))
tests.append(fmt(n, [random.randint(0, 1000) for _ in range(n)], renumerote(n, aretes)))
print(json.dumps(tests))
