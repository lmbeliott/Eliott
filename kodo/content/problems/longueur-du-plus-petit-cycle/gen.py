import json, random
random.seed(2032)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes):
    p = list(range(1, n + 1))
    random.shuffle(p)
    nom = [0] + p
    aretes = [(nom[a], nom[b]) if random.random() < 0.5 else (nom[b], nom[a]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

def simple(n, m):
    s = set()
    while len(s) < m:
        a, b = random.randint(1, n), random.randint(1, n)
        if a != b:
            s.add((min(a, b), max(a, b)))
    return list(s)

def plan_projectif(q):
    # graphe d'incidence points-droites du plan projectif sur Z/qZ (q premier) : maille 6
    pts = []
    for x in range(q):
        for y in range(q):
            pts.append((x, y, 1))
    for x in range(q):
        pts.append((x, 1, 0))
    pts.append((1, 0, 0))
    k = len(pts)
    ar = []
    for i, (a, b, c) in enumerate(pts):          # la droite i a pour équation a x + b y + c z = 0
        for j, (x, y, z) in enumerate(pts):
            if (a * x + b * y + c * z) % q == 0:
                ar.append((j + 1, k + i + 1))
    return 2 * k, ar

tests = []
tests.append(test(6, [(1, 2), (2, 3), (3, 4), (4, 1), (4, 5), (5, 6), (6, 4)]))
tests.append(test(5, [(1, 2), (2, 3), (3, 4), (4, 5)]))
tests.append(test(1, []))
tests.append(test(3, [(1, 2), (2, 3), (3, 1)]))
# graphe de Petersen : maille 5
p = [(i, i % 5 + 1) for i in range(1, 6)] + [(i, i + 5) for i in range(1, 6)] + [(6 + i, 6 + (i + 2) % 5) for i in range(5)]
tests.append(test(10, renomme(10, p)))
# un seul grand cycle de 400 sommets
tests.append(test(400, renomme(400, [(i, i % 400 + 1) for i in range(1, 401)])))
# arbre de 400 sommets
tests.append(test(400, renomme(400, [(i, random.randint(1, i - 1)) for i in range(2, 401)])))
# grille 20 x 20 : maille 4
g = []
for r in range(20):
    for c in range(20):
        v = 20 * r + c + 1
        if c < 19: g.append((v, v + 1))
        if r < 19: g.append((v, v + 20))
tests.append(test(400, renomme(400, g)))
# plans projectifs : maille 6
n, a = plan_projectif(7)
tests.append(test(n, renomme(n, a)))
n, a = plan_projectif(5)
tests.append(test(n, renomme(n, a)))
# deux grands cycles reliés par un long chemin
a = [(i, i % 150 + 1) for i in range(1, 151)] + [(150 + i, 150 + i % 170 + 1) for i in range(1, 171)] + [(1, 321)] + [(320 + i, 321 + i) for i in range(1, 80)] + [(400, 200)]
tests.append(test(400, renomme(400, a)))
tests.append(test(400, renomme(400, simple(400, 405))))
# un cycle de 9 et un cycle de 10 reliés par un chemin, au milieu d'un arbre
a = [(i, i % 9 + 1) for i in range(1, 10)] + [(9 + i, 9 + i % 10 + 1) for i in range(1, 11)] + [(1, 20), (20, 10)] + [(i, random.randint(1, i - 1)) for i in range(21, 401)]
tests.append(test(400, renomme(400, a)))
tests.append(test(400, renomme(400, simple(400, 1000))))
tests.append(test(12, renomme(12, simple(12, 14))))
print(json.dumps(tests))
