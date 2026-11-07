import json, random
random.seed(2031)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes, garder1=True):
    p = list(range(2, n + 1))
    random.shuffle(p)
    nom = [0, 1] + p
    aretes = [(nom[a], nom[b]) if random.random() < 0.5 else (nom[b], nom[a]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

def complement_de(n, h):
    # arêtes de G = toutes les paires sauf celles de h
    hs = set((min(a, b), max(a, b)) for a, b in h)
    return [(a, b) for a in range(1, n + 1) for b in range(a + 1, n + 1) if (a, b) not in hs]

tests = []
tests.append(test(5, [(1, 2), (1, 3), (2, 3), (3, 4)]))
tests.append(test(4, [(1, 2), (1, 3), (1, 4), (2, 1)]))
tests.append(test(1, []))
tests.append(test(2, [(1, 2)]))
tests.append(test(2, []))
tests.append(test(6, complement_de(6, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 6)])))
# le complémentaire est un chemin de 140 sommets, 1 à une extrémité
n = 140
tests.append(test(n, renomme(n, complement_de(n, [(i, i + 1) for i in range(1, n)]))))
# le complémentaire est formé de deux cycles et de sommets isolés
n = 130
h = [(i, i % 60 + 1) for i in range(1, 61)] + [(60 + i, 60 + i % 50 + 1) for i in range(1, 51)]
tests.append(test(n, renomme(n, complement_de(n, h))))
# 100 000 sommets : le sommet 1 est voisin de 6 000 sommets dans G
n = 100000
a = [(1, v) for v in random.sample(range(2, n + 1), 6000)] + [(random.randint(2, n), random.randint(2, n)) for _ in range(2000)]
a = [(x, y) for x, y in a if x != y]
tests.append(test(n, a))
# le sommet 1 est voisin dans G de tous les sommets sauf le dernier
n = 3500
a = [(1, v) for v in range(2, n)] + [(n, v) for v in random.sample(range(2, n), 3000)] + [(random.randint(2, n - 1), random.randint(2, n - 1)) for _ in range(3000)]
a = [(x, y) for x, y in a if x != y]
tests.append(test(n, renomme(n, a)))
for n, m in [(9, 25), (30, 300), (120, 6000)]:
    a = [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]
    tests.append(test(n, [(x, y) for x, y in a if x != y]))
print(json.dumps(tests))
