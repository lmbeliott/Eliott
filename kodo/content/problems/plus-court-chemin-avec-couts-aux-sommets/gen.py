import json, random
random.seed(2026)


def fmt(n, couts, aretes):
    return (f"{n} {len(aretes)}\n" + " ".join(map(str, couts)) + "\n"
            + "".join(f"{a} {b} {t}\n" for a, b, t in aretes))


def renumerote(n, aretes):
    # Mélange les numéros des sommets (sauf 1 et n) et l'ordre des arêtes.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = [(perm[a], perm[b], t) if random.random() < 0.5 else (perm[b], perm[a], t) for a, b, t in aretes]
    random.shuffle(res)
    return res


def connexe(n, m, tmax, pmax):
    aretes = [(random.randint(1, v - 1), v, random.randint(1, tmax)) for v in range(2, n + 1)]
    while len(aretes) < m:
        a, b = random.sample(range(1, n + 1), 2)
        aretes.append((a, b, random.randint(1, tmax)))
    couts = [random.randint(0, pmax) for _ in range(n)]
    return fmt(n, couts, renumerote(n, aretes))


tests = [
    fmt(5, [30, 40, 5, 10, 50], [(1, 2, 10), (2, 5, 10), (1, 3, 15), (3, 4, 10), (4, 5, 5), (1, 4, 40)]),
    fmt(4, [0, 0, 0, 0], [(1, 2, 5), (3, 4, 5)]),
]
tests.append(fmt(1, [500], []))
tests.append(fmt(2, [1000, 1000], [(2, 1, 7), (1, 2, 3)]))
tests.append(fmt(3, [0, 1000, 0], [(1, 2, 1), (2, 3, 1), (1, 3, 1000)]))   # 1000 + 2 contre 1000
tests.append(fmt(3, [0, 997, 0], [(1, 2, 1), (2, 3, 1), (1, 3, 1000)]))
tests.append(connexe(10, 15, 20, 20))
tests.append(connexe(200, 400, 100, 100))
def chaine_a_rebours(n, tmax, pmax, autres):
    # Une chaîne 1 - 2 - … - n (numéros mélangés sauf 1 et n), dont les arêtes sont données
    # en partant de n : Bellman-Ford doit faire environ n passes pour la parcourir.
    # autres(v) renvoie une arête (a, b, t) inutile, en numérotation de la chaîne.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n]
    chaine = [(v + 1, v, random.randint(1, tmax)) for v in range(n - 1, 0, -1)]
    aretes = [(perm[a], perm[b], t) for a, b, t in chaine]
    for a, b, t in autres:
        aretes.insert(random.randint(0, len(aretes)), (perm[a], perm[b], t))
    return fmt(n, [random.randint(0, pmax) for _ in range(n)], aretes)


# Une chaîne avec des raccourcis de longueur 1000 qui ne sautent que 50 sommets au plus :
# la chaîne coûte moins cher entre leurs extrémités, donc le plus court chemin la suit en entier.
n = 3000
raccourcis = []
for _ in range(1000):
    a = random.randint(1, n - 2)
    raccourcis.append((a, min(n, a + random.randint(2, 50)), 1000))
tests.append(chaine_a_rebours(n, 10, 5, raccourcis))
# Grands cas.
tests.append(connexe(5000, 8000, 1000, 1000))
# Une chaîne de 5000 sommets plus des copies longues de ses arêtes : le plus court chemin
# a 4999 arêtes, ce qui rend Bellman-Ford beaucoup trop lent.
n = 5000
copies = []
for _ in range(8000 - (n - 1)):
    v = random.randint(1, n - 1)
    copies.append((v, v + 1, 1000))
tests.append(chaine_a_rebours(n, 3, 3, copies))
# Deux grandes composantes : le sommet N est inaccessible.
n = 3000
aretes = []
for v in range(2, n + 1):
    if v <= 1500:
        aretes.append((random.randint(1, v - 1), v, random.randint(1, 1000)))
    elif v > 1501:
        aretes.append((random.randint(1501, v - 1), v, random.randint(1, 1000)))
while len(aretes) < 4000:
    a, b = random.sample(range(1, 1501), 2) if random.random() < 0.5 else random.sample(range(1501, n + 1), 2)
    aretes.append((a, b, random.randint(1, 1000)))
tests.append(fmt(n, [random.randint(0, 1000) for _ in range(n)], renumerote(n, aretes)))
print(json.dumps(tests))
