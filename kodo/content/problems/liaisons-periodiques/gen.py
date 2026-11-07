import json, random
random.seed(2026)


def fmt(n, liaisons):
    return f"{n} {len(liaisons)}\n" + "".join(f"{a} {b} {f} {p} {t}\n" for a, b, f, p, t in liaisons)


def renumerote(n, liaisons, melange=True):
    # Mélange les numéros des sommets (sauf 1 et n) et, si demandé, l'ordre des liaisons.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = [(perm[a], perm[b], f, p, t) for a, b, f, p, t in liaisons]
    if melange:
        random.shuffle(res)
    return res


def liaison(a, b, fmax, pmax, tmax):
    p = random.randint(1, pmax)
    return (a, b, random.randint(0, fmax), p, random.randint(1, tmax))


def aleatoire(n, m, fmax, pmax, tmax, recul=50):
    # Un chemin garanti vers n, puis des liaisons au hasard, surtout « vers l'avant ».
    liaisons = []
    for v in range(1, n):
        liaisons.append(liaison(random.randint(max(1, v - recul), v), v + 1, fmax, pmax, tmax))
    while len(liaisons) < m:
        a = random.randint(1, n)
        b = random.randint(max(1, a - recul), min(n, a + recul))
        if a != b:
            liaisons.append(liaison(a, b, fmax, pmax, tmax))
    return renumerote(n, liaisons)


tests = [
    fmt(4, [(1, 2, 0, 10, 3), (2, 4, 4, 20, 2), (1, 3, 1, 5, 1), (3, 4, 0, 8, 1), (1, 4, 7, 100, 1)]),
    fmt(3, [(1, 2, 0, 1, 5), (3, 2, 0, 1, 5)]),
]
tests.append(fmt(1, []))
tests.append(fmt(2, [(1, 2, 1000000, 1, 1)]))                         # attendre au départ
tests.append(fmt(3, [(1, 2, 0, 1, 7), (2, 3, 2, 5, 1)]))              # arrivée pile à l'heure d'un départ
tests.append(fmt(3, [(1, 2, 0, 1, 8), (2, 3, 2, 5, 1)]))              # le départ vient de partir
tests.append(fmt(2, [(2, 1, 0, 1, 1), (1, 2, 3, 4, 2), (1, 2, 0, 9, 4)]))
tests.append(fmt(8, aleatoire(8, 16, 20, 10, 10)))
tests.append(fmt(200, aleatoire(200, 600, 1000, 300, 500, recul=10)))
tests.append(fmt(3000, aleatoire(3000, 3000, 10 ** 6, 10 ** 6, 10 ** 6)))
tests.append(fmt(2500, aleatoire(2500, 3000, 1000, 50, 1000, recul=5)))
# Une longue chaîne de liaisons lentes, données de la fin vers le début : la date d'arrivée
# dépasse 2³¹, et relâcher les liaisons en boucle demande N tours.
n = 4000
chaine = [(v, v + 1, random.randint(0, 10), random.randint(1, 10), random.randint(900000, 10 ** 6)) for v in range(1, n)]
for _ in range(400):
    a = random.randint(2, n)
    chaine.append(liaison(a, random.randint(1, a), 10, 10, 10 ** 6))   # liaisons vers l'arrière
chaine = [x for x in chaine if x[0] != x[1]]
chaine.sort(key=lambda x: -x[0])
tests.append(fmt(n, renumerote(n, chaine, melange=False)))
# Des départs rares mais rapides, et des départs fréquents mais lents, en parallèle.
n = 2000
liaisons = []
for v in range(1, n):
    liaisons.append((v, v + 1, random.randint(0, 2000), random.randint(500, 2000), random.randint(1, 5)))
    liaisons.append((v, v + 1, 0, 1, random.randint(100, 400)))
tests.append(fmt(n, renumerote(n, liaisons[::-1], melange=False)))
# Le sommet N n'est accessible que par une liaison qui en part : réponse -1.
liaisons = aleatoire(2000, 2400, 1000, 1000, 1000)
liaisons = [(a, b, f, p, t) for a, b, f, p, t in liaisons if b != 2000]
tests.append(fmt(2000, liaisons))
print(json.dumps(tests))
