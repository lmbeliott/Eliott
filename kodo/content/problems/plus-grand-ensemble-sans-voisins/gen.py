import json, random
random.seed(2047)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes):
    p = list(range(1, n + 1))
    random.shuffle(p)
    aretes = [(p[a - 1], p[b - 1]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

def hasard(n, p):
    return [(a, b) for a in range(1, n + 1) for b in range(a + 1, n + 1) if random.random() < p]

def cliques(k, s):
    return [(c * s + i + 1, c * s + j + 1) for c in range(k) for i in range(s) for j in range(i + 1, s)]

def cubique(n):
    while True:
        pts = [v for v in range(1, n + 1) for _ in range(3)]
        random.shuffle(pts)
        e = set()
        for i in range(0, len(pts), 2):
            a, b = min(pts[i], pts[i + 1]), max(pts[i], pts[i + 1])
            if a == b or (a, b) in e:
                break
            e.add((a, b))
        else:
            return list(e)

tests = []
tests.append(test(6, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 1), (1, 4)]))
tests.append(test(5, [(1, 2), (1, 3), (1, 4), (1, 5)]))
tests.append(test(1, []))
tests.append(test(50, []))
tests.append(test(50, [(a, b) for a in range(1, 51) for b in range(a + 1, 51)]))
tests.append(test(50, renomme(50, [(i, i % 50 + 1) for i in range(1, 51)])))
tests.append(test(48, renomme(48, cliques(12, 4))))
tests.append(test(50, renomme(50, cliques(10, 5))))
tests.append(test(50, renomme(50, cubique(50))))
tests.append(test(50, renomme(50, cubique(50))))
for p in [0.06, 0.1, 0.15, 0.25, 0.5, 0.8]:
    tests.append(test(50, hasard(50, p)))
# grille 7 x 7 avec diagonales (graphe du roi) : réponse 16
roi = []
for i in range(7):
    for j in range(7):
        for di, dj in [(0, 1), (1, -1), (1, 0), (1, 1)]:
            if 0 <= i + di < 7 and 0 <= j + dj < 7:
                roi.append((7 * i + j + 1, 7 * (i + di) + j + dj + 1))
tests.append(test(49, renomme(49, roi)))
tests.append(test(12, hasard(12, 0.3)))
print(json.dumps(tests))
