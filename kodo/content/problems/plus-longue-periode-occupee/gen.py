import json, random
random.seed(2026)

M = 10**6

def test(creneaux):
    return f"{len(creneaux)}\n" + "".join(f"{d} {f}\n" for d, f in creneaux)

def hasard(n, longueur_max, melange=True):
    c = []
    for _ in range(n):
        d = random.randint(0, M - 1)
        f = min(M, d + random.randint(1, longueur_max))
        c.append((d, f))
    if melange:
        random.shuffle(c)
    return test(c)

tests = [
    test([(10, 30), (25, 40), (40, 50), (60, 70)]),
    test([(20, 30), (5, 100), (90, 110)]),
]
tests += [
    test([(0, 1)]),                                   # un seul créneau
    test([(0, 1000000)]),
    test([(3, 8)] * 5),                               # tous identiques
    test([(0, 1), (2, 3), (4, 5)]),                   # des trous d'une minute
    test([(i, i + 1) for i in range(99, -1, -1)]),    # bout à bout, à l'envers
    test([(0, 1000000)] + [(i * 10, i * 10 + 5) for i in range(1, 1000)]),  # tout est dedans
    test([(1, 50), (2, 3), (4, 5), (49, 60), (61, 62)]),
    test([(500, 600), (100, 200), (300, 400), (150, 350)]),
    hasard(5000, 50),                                 # beaucoup de petites périodes
    hasard(5000, 400),
    hasard(5000, 3000),                               # quelques grandes périodes
    test([(i * 200, i * 200 + 199) for i in range(5000)]),  # jamais de chevauchement
    hasard(20, 100000),
]
print(json.dumps(tests))
