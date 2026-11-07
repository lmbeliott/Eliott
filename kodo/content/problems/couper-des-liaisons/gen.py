import json, random
random.seed(4204)


def texte(n, aretes, coupures):
    return (f"{n} {len(aretes)} {len(coupures)}\n" + "".join(f"{a} {b}\n" for a, b in aretes)
            + " ".join(map(str, coupures)) + "\n")


def alea(n, m):
    return [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]


tests = []
tests.append(texte(5, [(1, 2), (2, 3), (3, 4), (4, 5), (1, 3)], [2, 5, 3, 4]))
tests.append(texte(3, [(1, 2), (2, 3)], [1, 2]))
tests.append(texte(1, [(1, 1)], [1]))
tests.append(texte(4, [(1, 2), (1, 2), (3, 4)], [2, 3, 1]))
for n, m in [(8, 10), (20, 30), (60, 70)]:
    ar = alea(n, m)
    tests.append(texte(n, ar, random.sample(range(1, m + 1), random.randint(1, m))))
# grand : chaîne coupée dans un ordre aléatoire
n = 8000
ar = [(i, i + 1) for i in range(1, n)]
random.shuffle(ar)
tests.append(texte(n, ar, random.sample(range(1, n), n - 1)))
# grand : graphe aléatoire, on coupe la moitié des arêtes
n = 5000
ar = alea(n, 5000)
tests.append(texte(n, ar, random.sample(range(1, 5001), 2500)))
# grand : étoile, on coupe toutes les branches
n = 6001
ar = [(1, v) for v in range(2, n + 1)]
tests.append(texte(n, ar, random.sample(range(1, n), n - 1)))
# grand : N = 100 000 sommets, une chaîne de 8 001 sommets choisis au hasard, coupée entièrement
n = 100000
som = random.sample(range(1, n + 1), 8001)
ar = [(som[i], som[i + 1]) for i in range(8000)]
tests.append(texte(n, ar, random.sample(range(1, 8001), 8000)))
print(json.dumps(tests))
