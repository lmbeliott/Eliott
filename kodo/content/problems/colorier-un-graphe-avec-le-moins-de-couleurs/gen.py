import json, random
random.seed(2048)

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

def mycielski(n, aretes):
    # nouveau graphe sans triangle de nombre chromatique augmenté de 1
    res = list(aretes)
    for a, b in aretes:
        res.append((n + a, b))
        res.append((n + b, a))
    for v in range(1, n + 1):
        res.append((n + v, 2 * n + 1))
    return 2 * n + 1, res

def dames(t):
    ar = []
    for a in range(t * t):
        for b in range(a + 1, t * t):
            r1, c1, r2, c2 = a // t, a % t, b // t, b % t
            if r1 == r2 or c1 == c2 or abs(r1 - r2) == abs(c1 - c2):
                ar.append((a + 1, b + 1))
    return t * t, ar

tests = []
tests.append(test(5, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 1)]))
tests.append(test(4, [(1, 2), (2, 3), (3, 4), (4, 1)]))
tests.append(test(1, []))
tests.append(test(30, []))
tests.append(test(30, [(a, b) for a in range(1, 31) for b in range(a + 1, 31)]))
tests.append(test(30, renomme(30, [(i, i % 30 + 1) for i in range(1, 31)])))
n, a = 2, [(1, 2)]
for _ in range(3):
    n, a = mycielski(n, a)
tests.append(test(n, renomme(n, a)))                  # 23 sommets, sans triangle, 5 couleurs
n, a = dames(5)
tests.append(test(n, renomme(n, a)))
for p in [0.2, 0.35, 0.5, 0.5, 0.65, 0.8]:
    tests.append(test(30, hasard(30, p)))
# biparti complet, et graphe de Petersen
tests.append(test(20, renomme(20, [(a, b) for a in range(1, 11) for b in range(11, 21)])))
p = [(i, i % 5 + 1) for i in range(1, 6)] + [(i, i + 5) for i in range(1, 6)] + [(6 + i, 6 + (i + 2) % 5) for i in range(5)]
tests.append(test(10, renomme(10, p)))
tests.append(test(9, hasard(9, 0.4)))
print(json.dumps(tests))
