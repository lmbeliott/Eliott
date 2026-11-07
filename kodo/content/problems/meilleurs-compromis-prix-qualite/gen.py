import json, random
random.seed(3108)
LETTRES = "abcdefghijklmnopqrstuvwxyz"

def noms(n, lo=4, hi=8):
    vus = set()
    res = []
    while len(res) < n:
        m = "".join(random.choice(LETTRES) for _ in range(random.randint(lo, hi)))
        if m not in vus:
            vus.add(m)
            res.append(m)
    return res

def test(produits):
    return f"{len(produits)}\n" + "".join(f"{m} {q} {p}\n" for m, q, p in produits)

def aleatoire(n, qmax, pmax):
    return [(m, random.randint(0, qmax), random.randint(1, pmax)) for m in noms(n)]

tests = [test([("velo", 7, 300), ("trottinette", 5, 150), ("roller", 4, 200), ("skate", 7, 300), ("tandem", 9, 900)]),
         test([("a", 5, 10), ("b", 5, 10), ("c", 6, 10), ("d", 2, 5)])]
tests.append(test([("seul", 0, 1)]))
tests.append(test([("x", 3, 7), ("y", 3, 7), ("z", 3, 7)]))                 # tous identiques : tous gardés
tests.append(test([("p", 1, 1), ("q", 2, 2), ("r", 3, 3), ("s", 4, 4)]))    # aucun n'est dépassé
tests.append(test([("cher", 5, 100), ("moins", 5, 50), ("mieux", 6, 50)]))  # un seul gagnant
tests.append(test(aleatoire(30, 10, 10)))
tests.append(test(aleatoire(300, 50, 50)))
tests.append(test(aleatoire(2000, 1000, 10**6)))
# grands tests : comparer toutes les paires serait trop lent
tests.append(test(aleatoire(8000, 1000, 10**6)))
pts = []
for i, m in enumerate(noms(8000, 5, 9)):
    p = random.randint(1, 10**6)
    q = min(1000, p // 1000 + random.randint(0, 3))   # beaucoup de produits non dépassés
    pts.append((m, q, p))
tests.append(test(pts))
print(json.dumps(tests))
