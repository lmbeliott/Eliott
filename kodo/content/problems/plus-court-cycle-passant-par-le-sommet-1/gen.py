import json, random
random.seed(2026)


def fmt(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {t}\n" for a, b, t in aretes)


def renumerote(n, aretes):
    # Mélange les numéros des sommets (sauf 1), l'ordre des arêtes et leur sens.
    autres = list(range(2, n + 1))
    random.shuffle(autres)
    perm = [0, 1] + autres
    res = []
    for a, b, t in aretes:
        if random.random() < 0.5:
            a, b = b, a
        res.append((perm[a], perm[b], t))
    random.shuffle(res)
    return res


def eventail(n, m, d1, loin, pres, recul=20):
    # d1 arêtes partent du sommet 1, longues (entre loin[0] et loin[1]) ; le reste du graphe
    # est fait d'arêtes courtes entre sommets proches : beaucoup de petits cycles évitent 1.
    aretes = [(1, random.randint(2, n), random.randint(*loin)) for _ in range(d1)]
    for v in range(2, n):
        aretes.append((v, v + 1, random.randint(*pres)))
    while len(aretes) < m:
        a = random.randint(2, n)
        b = random.randint(max(2, a - recul), min(n, a + recul))
        if a != b:
            aretes.append((a, b, random.randint(*pres)))
    return renumerote(n, aretes)


def aleatoire(n, m, tmax):
    aretes = []
    for v in range(2, n + 1):
        aretes.append((random.randint(1, v - 1), v, random.randint(1, tmax)))
    while len(aretes) < m:
        a, b = random.randint(1, n), random.randint(1, n)
        if a != b:
            aretes.append((a, b, random.randint(1, tmax)))
    return renumerote(n, aretes)


tests = [
    fmt(6, [(1, 2, 2), (1, 3, 3), (2, 4, 4), (3, 5, 2), (4, 5, 1), (4, 6, 1), (5, 6, 1)]),
    fmt(4, [(1, 2, 5), (2, 1, 3), (2, 3, 1), (3, 4, 1), (4, 2, 1)]),
]
tests.append(fmt(1, []))
tests.append(fmt(2, [(1, 2, 7)]))
tests.append(fmt(3, [(2, 1, 1000), (3, 2, 1000), (1, 3, 1000)]))
tests.append(fmt(5, [(2, 3, 1), (3, 4, 1), (4, 2, 1), (5, 4, 1)]))             # 1 isolé
tests.append(fmt(5, [(1, 2, 1), (2, 3, 1), (3, 4, 1), (4, 2, 1), (4, 5, 1)]))  # 1 est une feuille
tests.append(fmt(6, [(1, 2, 1), (2, 3, 1), (2, 4, 1), (1, 5, 1), (5, 6, 1)]))  # un arbre
# Un arbre dont la seule arête en plus relie deux sommets d'une même branche, puis
# une autre arête qui relie deux branches : seule la seconde ferme un cycle par 1.
tests.append(fmt(7, [(1, 2, 1), (2, 3, 1), (3, 4, 1), (2, 4, 1), (1, 5, 9), (5, 6, 9), (6, 7, 9), (7, 4, 9)]))
tests.append(fmt(10, aleatoire(10, 14, 10)))
tests.append(fmt(300, eventail(300, 600, 20, (300, 600), (1, 20), recul=5)))
tests.append(fmt(1000, aleatoire(1000, 2000, 1000)))
# Un grand cycle par 1, et des cordes courtes loin de 1.
n = 3000
aretes = [(v, v % n + 1, random.randint(1, 1000)) for v in range(1, n + 1)]
for _ in range(400):
    a = random.randint(n // 4, 3 * n // 4)
    aretes.append((a, a + random.randint(2, 30), random.randint(1, 50)))
tests.append(fmt(n, renumerote(n, aretes)))
# Grands cas : le sommet 1 a des milliers d'arêtes, relancer un calcul par arête est trop lent.
tests.append(fmt(5000, eventail(5000, 8000, 2500, (500, 1000), (1, 4), recul=60)))
tests.append(fmt(5000, eventail(5000, 8000, 2000, (900, 1000), (1, 3), recul=5000)))
# Arêtes parallèles depuis 1 : le meilleur cycle revient par une autre arête vers le même sommet.
n = 5000
aretes = []
for v in range(2, n + 1):
    aretes.append((1, v, random.randint(400, 1000)))
for _ in range(1500):
    aretes.append((1, random.randint(2, n), random.randint(400, 1000)))
for _ in range(8000 - len(aretes)):
    a = random.randint(2, n)
    b = random.randint(2, n)
    if a != b:
        aretes.append((a, b, 1000))
tests.append(fmt(n, renumerote(n, aretes)))
print(json.dumps(tests))
