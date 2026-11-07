import json, random
random.seed(2028)

def test(n, arcs):
    lignes = [f"{n} {len(arcs)}"] + [f"{a} {b}" for a, b in arcs]
    return "\n".join(lignes) + "\n"

def renomme(n, arcs):
    # renumérote les sommets 2..n au hasard, le sommet 1 reste le sommet 1
    p = list(range(2, n + 1))
    random.shuffle(p)
    nom = [0, 1] + p
    arcs = [(nom[a], nom[b]) for a, b in arcs]
    random.shuffle(arcs)
    return arcs

tests = []
tests.append(test(6, [(1, 2), (2, 3), (3, 1), (3, 4), (5, 1), (6, 6)]))
tests.append(test(4, [(2, 1), (3, 2), (1, 4)]))
tests.append(test(1, []))
tests.append(test(3, [(1, 1), (2, 3), (3, 2)]))
tests.append(test(5, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 1)]))
# longue chaîne qui remonte vers 1, et 5 000 sommets qui pointent vers son bout
n = 100000
arcs = [(i + 1, i) for i in range(1, 5000)] + [(random.randint(5001, n), 5000) for _ in range(5000)]
tests.append(test(n, renomme(n, arcs)))
# grand cycle orienté + arcs au hasard
n = 100000
arcs = [(i, i + 1) for i in range(1, 6000)] + [(6000, 1)] + [(random.randint(1, n), random.randint(1, 6000)) for _ in range(4000)]
tests.append(test(n, renomme(n, arcs)))
# graphe aléatoire dense sur peu de sommets
n = 3000
tests.append(test(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(8000)]))
for n, m in [(10, 12), (60, 70), (400, 500), (2000, 1900)]:
    tests.append(test(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
print(json.dumps(tests))
