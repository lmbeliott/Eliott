import json, random
random.seed(2029)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes):
    p = list(range(1, n + 1))
    random.shuffle(p)
    nom = [0] + p
    aretes = [(nom[a], nom[b]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

tests = []
tests.append(test(6, [(1, 2), (2, 3), (3, 1), (3, 4), (5, 6), (5, 6)]))
tests.append(test(4, [(1, 2), (2, 2), (3, 4)]))
tests.append(test(1, []))
tests.append(test(1, [(1, 1), (1, 1), (1, 1)]))
tests.append(test(5, [(1, 2), (2, 3), (3, 4), (4, 5)]))
tests.append(test(4, [(a, b) for a in range(1, 5) for b in range(a + 1, 5)]))
# arbre de 10 001 sommets : rien à supprimer
n = 10001
tests.append(test(n, renomme(n, [(i, random.randint(1, i - 1)) for i in range(2, n + 1)])))
# graphe dense sur 200 sommets
n = 200
tests.append(test(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(10000)]))
# 100 000 sommets, dont 12 000 touchés par 10 000 arêtes au hasard
n = 100000
tests.append(test(n, [(random.randint(1, 12000), random.randint(1, 12000)) for _ in range(10000)]))
# un long cycle et des arêtes multiples
n = 5000
a = [(i, i % n + 1) for i in range(1, n + 1)] + [(i, i + 1) for i in range(1, 1000)]
tests.append(test(n, renomme(n, a)))
for n, m in [(10, 9), (50, 60), (1000, 1500)]:
    tests.append(test(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
print(json.dumps(tests))
