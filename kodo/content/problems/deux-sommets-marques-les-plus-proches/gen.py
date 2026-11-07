import json, random
random.seed(4106)


def texte(n, marques, aretes):
    return (f"{n} {len(aretes)} {len(marques)}\n" + " ".join(map(str, marques)) + "\n"
            + "".join(f"{a} {b} {l}\n" for a, b, l in aretes))


def alea(n, m, lmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax)) for _ in range(m)]


tests = []
tests.append(texte(6, [1, 4, 6], [(1, 2, 3), (2, 3, 2), (3, 4, 4), (2, 5, 1), (5, 6, 7), (4, 6, 20), (3, 6, 2)]))
tests.append(texte(4, [1, 4], [(1, 2, 5), (3, 4, 5)]))
tests.append(texte(2, [2, 1], [(1, 2, 10 ** 9), (2, 1, 7)]))
tests.append(texte(3, [1, 3], [(1, 1, 1), (2, 2, 1)]))
# deux sommets marqués voisins dont l'arête directe est chère ; le bon chemin passe par d'autres sommets
tests.append(texte(5, [1, 2], [(1, 2, 100), (1, 3, 10), (3, 4, 10), (4, 5, 10), (5, 2, 10)]))
for n, m, k in [(8, 12, 3), (15, 25, 5), (40, 60, 2), (60, 70, 20)]:
    tests.append(texte(n, random.sample(range(1, n + 1), k), alea(n, m, 50)))
# grand : étoile, tous les sommets sauf le centre sont marqués
n = 4000
tests.append(texte(n, list(range(2, n + 1)), [(1, v, 10 ** 9 - random.randint(0, 3)) for v in range(2, n + 1)]))
# grand : longue chaîne, sommets marqués épars, grandes longueurs
n = 3000
ar = [(i, i + 1, random.randint(5 * 10 ** 8, 10 ** 9)) for i in range(1, n)]
random.shuffle(ar)
tests.append(texte(n, random.sample(range(1, n + 1), 3), ar))
# grand : peigne. Une chaîne de 2 500 sommets non marqués, à petites longueurs, et une dent marquée
# très éloignée sur chacun : un Dijkstra par sommet marqué, même arrêté au premier sommet marqué
# atteint, parcourt toute la chaîne à chaque fois.
n = 5000
dos = random.sample(range(1, n + 1), n // 2)
dents = [v for v in range(1, n + 1) if v not in set(dos)]
ar = [(dos[i], dos[i + 1], random.randint(1, 9)) for i in range(n // 2 - 1)]
ar += [(dents[i], dos[i], 10 ** 9 - random.randint(0, 10 ** 6)) for i in range(n // 2)]
random.shuffle(ar)
tests.append(texte(n, dents, ar))
# grands aléatoires
n = 5000
tests.append(texte(n, random.sample(range(1, n + 1), 2500), alea(n, 5000, 10 ** 6)))
n = 2000
tests.append(texte(n, random.sample(range(1, n + 1), 40), alea(n, 2000, 10 ** 9)))
print(json.dumps(tests))
