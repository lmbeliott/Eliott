import json, random
random.seed(2026)

def test(k, objets):
    return f"{len(objets)} {k}\n" + "".join(f"{v} {p}\n" for v, p in objets)

def aleatoire(n, hi=10000):
    return [(random.randint(1, hi), random.randint(1, hi)) for _ in range(n)]

def piege(n):
    # quelques objets lourds au très bon rapport, des objets lourds au rapport moyen
    # et des objets légers au rapport faible : choisir les meilleurs rapports un par un
    # ne donne pas le meilleur total
    objets = []
    for _ in range(n // 10):
        p = random.randint(9000, 10000)
        objets.append((p - random.randint(0, 50), p))
    for _ in range(n // 2):
        p = random.randint(8000, 10000)
        objets.append((p * random.randint(55, 75) // 100, p))
    while len(objets) < n:
        p = random.randint(1, 30)
        objets.append((max(1, p * random.randint(20, 50) // 100), p))
    random.shuffle(objets)
    return objets

tests = [
    test(2, [(6, 4), (3, 3), (9, 5), (1, 2)]),
    test(2, [(100, 100), (1, 2), (60, 100)]),
    test(1, [(7, 3)]),
    test(3, [(5, 7), (2, 9), (8, 1)]),                    # K = N : tout prendre
    test(1, [(1, 10000), (2, 10000), (1, 9999)]),         # rapport très petit : réponse 0
    test(2, [(10000, 1), (10000, 1), (1, 1)]),            # rapport maximal
    test(2, [(3, 3), (3, 3), (3, 3)]),
    test(3, aleatoire(8, 20)),
    test(5, piege(60)),
    test(40, aleatoire(500)),
    test(300, piege(2000)),
]
# tailles maximales
tests.append(test(1000, piege(10000)))
tests.append(test(4321, aleatoire(10000)))
tests.append(test(9999, aleatoire(10000)))
print(json.dumps(tests))
