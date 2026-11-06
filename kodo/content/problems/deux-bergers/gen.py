import json, random
random.seed(2026)


def fmt(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b}\n" for a, b in aretes)


def melange(n, aretes):
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    res = []
    for a, b in aretes:
        a, b = perm[a - 1], perm[b - 1]
        res.append((a, b) if random.random() < 0.5 else (b, a))
    random.shuffle(res)
    return res


def biparti(n, m, p):
    # Chaque alpage est dans le camp 0 (probabilité p) ou 1 ; les paires relient deux camps.
    camp = [0] + [0 if random.random() < p else 1 for _ in range(n)]
    gauche = [v for v in range(1, n + 1) if camp[v] == 0]
    droite = [v for v in range(1, n + 1) if camp[v] == 1]
    aretes = [(random.choice(gauche), random.choice(droite)) for _ in range(m)]
    return aretes


tests = [
    "8 5\n1 2\n1 3\n4 1\n5 6\n7 6\n",
    "5 5\n1 2\n2 3\n3 1\n4 5\n5 4\n",
]
tests.append("1 0\n")
tests.append("2 1\n2 1\n")
tests.append("7 0\n")
tests.append("4 4\n1 2\n2 3\n3 4\n4 1\n")
tests.append("5 5\n1 2\n2 3\n3 4\n4 5\n5 1\n")
# Une étoile : Inès garde le centre.
tests.append(fmt(9, melange(9, [(1, v) for v in range(2, 10)])))
# Petits cas aléatoires, avec plusieurs composantes déséquilibrées.
tests.append(fmt(40, melange(40, biparti(40, 30, 0.3))))
# Longue chaîne (récursion profonde pour un DFS récursif).
n = 10000
tests.append(fmt(n, melange(n, [(v, v + 1) for v in range(1, n)])))
# Grands cas bipartis.
tests.append(fmt(10000, melange(10000, biparti(10000, 10000, 0.35))))
tests.append(fmt(10000, melange(10000, biparti(10000, 6000, 0.2))))
# Grand cas biparti sauf un triangle caché : réponse -1.
aretes = biparti(10000, 9998, 0.4)
x, y = aretes[0]
z = next(v for v in range(1, 10001) if v != x and v != y)
aretes += [(y, z), (z, x)]
tests.append(fmt(10000, melange(10000, aretes)))
print(json.dumps(tests))
