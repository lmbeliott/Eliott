import json, random
random.seed(2027)

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
tests.append(test(6, [(1, 2), (2, 3), (4, 5)]))
tests.append(test(5, [(1, 1), (2, 4), (4, 2), (5, 3), (3, 2)]))
tests.append(test(1, []))
tests.append(test(1, [(1, 1)]))
tests.append(test(100000, []))
tests.append(test(2, [(1, 2), (2, 1)]))
# un seul long chemin de 10 001 sommets parmi 100 000
tests.append(test(100000, renomme(100000, [(i, i + 1) for i in range(1, 10001)])))
# 10 000 arêtes au hasard sur 100 000 sommets
tests.append(test(100000, [(random.randint(1, 100000), random.randint(1, 100000)) for _ in range(10000)]))
# graphe connexe de 10 001 sommets : réponse 50 005 000
tests.append(test(10001, renomme(10001, [(i, random.randint(1, i - 1)) for i in range(2, 10002)][:10000])))
# petits paquets
a = []
for k in range(0, 300, 3):
    a += [(k + 1, k + 2), (k + 2, k + 3)]
tests.append(test(300, renomme(300, a)))
for n, m in [(20, 10), (500, 300), (3000, 2500)]:
    tests.append(test(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
print(json.dumps(tests))
