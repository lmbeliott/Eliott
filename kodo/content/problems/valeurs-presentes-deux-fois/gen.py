import json, random
random.seed(2026)


def explicite(a, requetes):
    return f"{len(a)} {len(requetes)} 0\n" + " ".join(map(str, a)) + "\n" + "".join(f"{l} {r}\n" for l, r in requetes)


def genere(n, q, graine, v, d):
    return f"{n} {q} {graine}\n{v} {d}\n"


def requetes_aleatoires(n, q):
    res = []
    for _ in range(q):
        l, r = random.randint(1, n), random.randint(1, n)
        res.append((min(l, r), max(l, r)))
    return res


tests = [
    explicite([1, 2, 1, 3, 2, 1, 3, 3], [(1, 8), (1, 5), (2, 7), (4, 4)]),
    genere(10, 5, 2, 5, 6),
]
# Cas limites : un seul élément, tout identique, tout différent
tests.append(explicite([1], [(1, 1)]))
tests.append(explicite([5, 5, 5, 5, 5], [(1, 5), (1, 2), (2, 3), (3, 5), (4, 5), (5, 5)]))
tests.append(explicite([1, 2, 3, 4, 5, 6], [(1, 6), (2, 5)]))
tests.append(explicite([2, 1, 2, 1, 2, 1, 1, 2], [(l, r) for l in range(1, 9) for r in range(l, 9)]))
a = [random.randint(1, 4) for _ in range(30)]
tests.append(explicite(a, requetes_aleatoires(30, 40)))
a = [random.randint(1, 700) for _ in range(2000)]
tests.append(explicite(a, requetes_aleatoires(2000, 2000)))
# Grands tests produits par le générateur
tests.append(genere(100000, 100000, 12345, 50000, 100000))   # beaucoup de valeurs en double
tests.append(genere(100000, 100000, 777, 49999, 5))          # requêtes presque entières
tests.append(genere(100000, 100000, 2026, 20000, 3))         # chaque valeur apparaît environ 5 fois
tests.append(genere(100000, 100000, 31337, 100000, 30))
tests.append(genere(100000, 100000, 4242, 70001, 50000))
print(json.dumps(tests))
