import json, random
random.seed(2026)

def test(n, rampes):
    return f"{n} {len(rampes)}\n" + "".join(f"{l} {r}\n" for l, r in rampes)

def aleatoire(n, q):
    rampes = []
    for _ in range(q):
        l = random.randint(1, n)
        rampes.append((l, random.randint(l, n)))
    return rampes

def longues(n, q, marge):
    # des rampes qui couvrent presque tout le tableau : le pire cas de la solution naïve
    rampes = []
    for _ in range(q):
        l = random.randint(1, marge)
        rampes.append((l, random.randint(n - marge, n)))
    return rampes

tests = [
    test(8, [(2, 5), (4, 8), (1, 3)]),
    test(6, [(1, 6), (3, 4)]),
    test(1, [(1, 1)]),
    test(5, [(3, 3), (3, 3), (3, 3)]),                 # trois fois la même case
    test(4, [(1, 2), (3, 4)]),                         # maximum atteint deux fois
    test(10, [(1, 10), (1, 10), (6, 10), (2, 2)]),
    test(7, [(5, 7), (1, 3)]),                         # cases jamais touchées
    test(50, aleatoire(50, 20)),
    test(2000, aleatoire(2000, 300)),
    test(100000, [(i, 100000) for i in range(1, 2001)]),
    test(300000, aleatoire(300000, 2000)),
]
# tailles maximales : environ 10^10 additions pour la solution naïve
tests.append(test(1000000, longues(1000000, 10000, 1000)))
tests.append(test(1000000, aleatoire(1000000, 10000)))
print(json.dumps(tests))
