import json, random
random.seed(3308)

def test(l, k, lampes):
    return f"{l} {len(lampes)} {k}\n" + "".join(f"{a} {b}\n" for a, b in lampes)

def aleatoire(l, n, k, portee):
    lampes = []
    for _ in range(n):
        a = random.randint(1, l)
        lampes.append((a, min(l, a + random.randint(0, portee))))
    return test(l, k, lampes)

tests = [test(12, 1, [(1, 3), (5, 6), (6, 8), (11, 12)]), test(10, 2, [(4, 4), (8, 9)])]
tests.append(test(1, 0, [(1, 1)]))
tests.append(test(5, 0, [(3, 3)]))                           # K = 0 : un seul point éclairé
tests.append(test(5, 5, [(2, 2)]))                           # assez de lampes : toute la route
tests.append(test(6, 1, [(1, 2), (5, 6)]))                   # égalité : le plus à gauche
tests.append(aleatoire(40, 5, 3, 4))
tests.append(aleatoire(3000, 100, 50, 20))
tests.append(aleatoire(100000, 2000, 0, 100))
# grands tests
tests.append(aleatoire(300000, 8000, 5000, 60))
tests.append(aleatoire(300000, 300, 2000, 3000))
tests.append(aleatoire(300000, 3000, 100000, 10))
print(json.dumps(tests))
