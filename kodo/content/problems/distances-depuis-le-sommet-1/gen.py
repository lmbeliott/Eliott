import json, random
random.seed(4101)


def texte(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {l}\n" for a, b, l in aretes)


def aleatoire(n, m, lmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax)) for _ in range(m)]


tests = []
tests.append(texte(5, [(1, 2, 4), (1, 3, 1), (3, 2, 2), (2, 4, 5), (3, 4, 8)]))
tests.append(texte(4, [(1, 2, 1000000000), (3, 2, 1000000000), (3, 4, 1000000000)]))
tests.append(texte(1, []))
tests.append(texte(4, []))
tests.append(texte(3, [(1, 1, 5), (2, 3, 7), (2, 3, 2), (3, 2, 9)]))   # boucle, arêtes multiples, 2 et 3 inaccessibles
tests.append(texte(4, [(1, 2, 10), (1, 2, 3), (2, 3, 3), (1, 3, 7), (3, 4, 1), (4, 1, 100)]))
# des petits graphes aléatoires
for n, m in [(8, 12), (15, 20), (30, 60), (60, 50)]:
    tests.append(texte(n, aleatoire(n, m, 20)))
# piège : le chemin direct est long, le détour par beaucoup d'arêtes est court
n = 200
ar = [(i, i + 1, 1) for i in range(1, n)] + [(1, n, 10 ** 9)]
random.shuffle(ar)
tests.append(texte(n, ar))
# grand : longue chaîne de poids proches de 10⁹ (les distances dépassent 2³¹), avec des raccourcis
# tout est accessible : chercher le minimum parmi tous les sommets à chaque étape fait N² = 64 millions d'étapes
n = 8000
ar = [(i, i + 1, random.randint(9 * 10 ** 8, 10 ** 9)) for i in range(1, n)]
for _ in range(2000):
    a = random.randint(1, n - 1)
    b = random.randint(a + 1, min(n, a + 50))
    ar.append((a, b, random.randint(9 * 10 ** 8, 10 ** 9)))
random.shuffle(ar)
ar = [(b, a, l) if random.random() < 0.5 else (a, b, l) for a, b, l in ar]
tests.append(texte(n, ar))
# grand : aléatoire, petits poids (presque tous les sommets sont accessibles)
n = 8000
ar = [(random.randint(1, n), random.randint(1, n), random.randint(1, 100)) for _ in range(10000)]
tests.append(texte(n, ar))
# moyen : arbre aléatoire + arêtes
n = 2000
ar = [(i, random.randint(1, i - 1), random.randint(1, 10 ** 6)) for i in range(2, n + 1)]
ar += aleatoire(n, 1000, 10 ** 6)
random.shuffle(ar)
tests.append(texte(n, ar))
print(json.dumps(tests))
