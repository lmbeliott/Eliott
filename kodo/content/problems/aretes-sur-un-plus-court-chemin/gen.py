import json, random
random.seed(2026)


def fmt(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {t}\n" for a, b, t in aretes)


def renumerote(n, aretes):
    # Mélange les numéros des sommets (sauf 1 et n), l'ordre des arêtes et leur sens.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = []
    for a, b, t in aretes:
        if random.random() < 0.5:
            a, b = b, a
        res.append((perm[a], perm[b], t))
    random.shuffle(res)
    return res


def aleatoire(n, m, tmax, recul=30):
    # Une chaîne qui relie tout, puis des arêtes entre sommets proches.
    aretes = [(v, v + 1, random.randint(1, tmax)) for v in range(1, n)]
    while len(aretes) < m:
        a = random.randint(1, n)
        b = random.randint(max(1, a - recul), min(n, a + recul))
        if a != b:
            aretes.append((a, b, random.randint(1, tmax)))
    return renumerote(n, aretes)


def grille(l, c, tmax):
    # Grille l × c : beaucoup de plus courts chemins quand les longueurs sont égales.
    num = lambda i, j: i * c + j + 1
    aretes = []
    for i in range(l):
        for j in range(c):
            if j + 1 < c:
                aretes.append((num(i, j), num(i, j + 1), random.randint(1, tmax)))
            if i + 1 < l:
                aretes.append((num(i, j), num(i + 1, j), random.randint(1, tmax)))
    return renumerote(l * c, aretes)


tests = [
    fmt(5, [(1, 2, 2), (2, 5, 3), (1, 3, 1), (3, 4, 2), (4, 5, 2), (3, 5, 6), (2, 4, 1)]),
    fmt(4, [(1, 2, 1), (2, 1, 1), (2, 4, 5), (3, 4, 1), (1, 3, 7)]),
]
tests.append(fmt(1, []))
tests.append(fmt(3, [(1, 2, 4)]))                           # N inaccessible
tests.append(fmt(2, [(1, 2, 3), (2, 1, 3), (1, 2, 4)]))     # arêtes parallèles
tests.append(fmt(6, [(1, 2, 1), (2, 3, 1), (3, 6, 1), (1, 4, 1), (4, 5, 1), (5, 6, 1), (2, 5, 1), (4, 3, 1)]))
tests.append(fmt(8, aleatoire(8, 14, 3)))
tests.append(fmt(100, aleatoire(100, 250, 2, recul=5)))
tests.append(fmt(400, grille(20, 20, 1)))
# Grandes grilles : énormément de plus courts chemins, la réponse est grande.
tests.append(fmt(4000, grille(50, 80, 1)))
tests.append(fmt(1500, grille(30, 50, 2)))
tests.append(fmt(5000, aleatoire(5000, 8000, 1000)))
tests.append(fmt(2000, aleatoire(2000, 3000, 3, recul=8)))
# Deux grandes moitiés reliées par une seule arête, et des cul-de-sac.
n = 5000
aretes = aleatoire(2500, 4000, 5, recul=10)
aretes += [(a + 2500, b + 2500, t) for a, b, t in aleatoire(2500, 3999, 5, recul=10)]
aretes.append((2500, 2501, 7))
tests.append(fmt(n, renumerote(n, aretes)))
print(json.dumps(tests))
