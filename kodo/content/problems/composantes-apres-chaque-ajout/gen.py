import json, random
random.seed(4201)


def texte(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b}\n" for a, b in aretes)


tests = []
tests.append(texte(6, [(1, 2), (3, 4), (2, 3), (1, 4), (5, 5), (6, 5), (4, 6)]))
tests.append(texte(3, [(1, 1), (2, 3), (3, 2)]))
tests.append(texte(1, [(1, 1)]))
tests.append(texte(2, [(1, 2)]))
for n, m in [(10, 12), (30, 25), (100, 80)]:
    tests.append(texte(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
# grand : une longue chaîne reliée dans un ordre mélangé (beaucoup de fusions de grosses composantes)
n = 10001
ar = [(i, i + 1) for i in range(1, n)]
random.shuffle(ar)
tests.append(texte(n, ar))
# grand : N énorme, arêtes aléatoires (presque tout reste isolé)
n = 100000
tests.append(texte(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(10000)]))
# grand : petit N, beaucoup d'arêtes redondantes
n = 3000
tests.append(texte(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(10000)]))
# grand : étoile construite en reliant des chaînes
n = 10000
ar = [(i, i + 1) for i in range(1, n, 2)] + [(1, i) for i in range(3, n, 2)]
tests.append(texte(n, ar))
print(json.dumps(tests))
