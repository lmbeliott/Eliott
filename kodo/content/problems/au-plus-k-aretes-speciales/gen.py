import json, random
random.seed(2026)


def fmt(n, k, aretes):
    return f"{n} {len(aretes)} {k}\n" + "".join(f"{a} {b} {t} {c}\n" for a, b, t, c in aretes)


def renumerote(n, aretes):
    # Mélange les numéros des sommets (sauf 1 et n) et l'ordre des arêtes.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = [(perm[a], perm[b], t, c) if random.random() < 0.5 else (perm[b], perm[a], t, c)
           for a, b, t, c in aretes]
    random.shuffle(res)
    return res


def arete(a, b, p_spe):
    # Les arêtes spéciales sont bien plus courtes que les arêtes normales.
    if random.random() < p_spe:
        return (a, b, random.randint(1, 60), 1)
    return (a, b, random.randint(100, 1000), 0)


def diamants(n, k, extra):
    # Une chaîne où chaque maillon est doublé : une arête normale et une arête spéciale, de
    # longueurs du même ordre (1 à 20). Avec K petit, il faut bien choisir où utiliser ses passages.
    aretes = []
    for v in range(1, n):
        aretes.append((v, v + 1, random.randint(1, 20), 0))
        aretes.append((v, v + 1, random.randint(1, 20), 1))
        if random.random() < 0.5:
            aretes.append((v, min(n, v + 2), random.randint(1, 40), random.randint(0, 1)))
    for _ in range(extra):
        a, b = random.sample(range(1, n + 1), 2)
        aretes.append((a, b, random.randint(1, 20), random.randint(0, 1)))
    return fmt(n, k, renumerote(n, aretes))


def aleatoire(n, m, p_spe):
    aretes = [arete(random.randint(1, v - 1), v, p_spe) for v in range(2, n + 1)]
    while len(aretes) < m:
        a, b = random.sample(range(1, n + 1), 2)
        aretes.append(arete(a, b, p_spe))
    return renumerote(n, aretes)


exemple = [(1, 2, 20, 0), (1, 2, 5, 1), (2, 5, 100, 0), (2, 5, 10, 1), (1, 3, 15, 0), (3, 4, 8, 1), (4, 5, 30, 0)]
tests = [
    fmt(5, 1, exemple),
    fmt(3, 0, [(1, 2, 10, 0), (2, 3, 5, 1)]),
]
tests.append(fmt(5, 0, exemple))
tests.append(fmt(5, 2, exemple))
tests.append(fmt(1, 3, []))
tests.append(fmt(2, 10, [(2, 1, 7, 1), (1, 2, 9, 0)]))
tests.append(fmt(4, 2, [(1, 2, 3, 1), (3, 4, 3, 1)]))     # sommet N inaccessible
tests.append(fmt(12, 2, aleatoire(12, 20, 0.4)))
# Garder par sommet la meilleure longueur et le plus petit nombre de passages ne suffit pas :
# la bonne réponse est 13, ces méthodes trouvent 15.
tests.append(fmt(4, 1, [(2, 4, 4, 1), (2, 1, 13, 0), (1, 3, 5, 0), (1, 3, 2, 1), (4, 2, 3, 1),
                        (1, 3, 20, 0), (4, 1, 16, 0), (2, 3, 5, 0), (4, 1, 15, 0)]))
tests.append(diamants(8, 2, 0))
tests.append(diamants(10, 2, 0))
tests.append(diamants(30, 3, 5))
tests.append(diamants(200, 3, 50))
tests.append(diamants(1000, 5, 200))
# Une longue chaîne d'arêtes normales, doublée d'arêtes spéciales : chaque passage compte.
n = 1500
aretes = [(v, v + 1, random.randint(100, 200), 0) for v in range(1, n)]
for _ in range(1000):
    a = random.randint(1, n - 1)
    b = min(n, a + random.randint(2, 400))
    aretes.append((a, b, random.randint(1, 60), 1))
tests.append(fmt(n, 10, renumerote(n, aretes)))
# Grands cas.
tests.append(fmt(5000, 10, aleatoire(5000, 8000, 0.25)))
# Une chaîne de 5000 sommets, arêtes données en partant de N, avec des raccourcis spéciaux :
# le meilleur chemin a des milliers d'arêtes.
n = 5000
milieu = list(range(2, n))
random.shuffle(milieu)
perm = [0, 1] + milieu + [n]
aretes = [(v, v + 1, random.randint(100, 200), 0) for v in range(n - 1, 0, -1)]
for _ in range(8000 - (n - 1)):
    a = random.randint(1, n - 1)
    b = min(n, a + random.randint(2, 400))
    aretes.insert(random.randint(0, len(aretes)), (a, b, random.randint(1, 60), 1))
tests.append(fmt(n, 10, [(perm[a], perm[b], t, c) for a, b, t, c in aretes]))
# Grand cas où N n'est relié au reste que par une arête spéciale, avec K = 0.
aretes = aleatoire(2999, 4499, 0.3)
aretes.append((random.randint(1, 2999), 3000, 1, 1))
tests.append(fmt(3000, 0, aretes))
print(json.dumps(tests))
