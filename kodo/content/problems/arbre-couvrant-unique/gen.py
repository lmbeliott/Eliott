import json, random
random.seed(4207)


def texte(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {w}\n" for a, b, w in aretes)


def connexe(n, m, wmax):
    ar = [(i, random.randint(1, i - 1), random.randint(1, wmax)) for i in range(2, n + 1)]
    ar += [(random.randint(1, n), random.randint(1, n), random.randint(1, wmax)) for _ in range(m - (n - 1))]
    random.shuffle(ar)
    return ar


tests = []
tests.append(texte(4, [(1, 2, 1), (2, 3, 2), (3, 4, 2), (4, 2, 2)]))
tests.append(texte(3, [(1, 2, 1), (2, 3, 2), (1, 3, 3)]))
tests.append(texte(1, []))
tests.append(texte(2, [(1, 2, 5), (2, 1, 5)]))
tests.append(texte(2, [(1, 2, 5), (2, 1, 6), (1, 1, 1)]))
tests.append(texte(3, [(1, 2, 1), (2, 3, 1), (1, 3, 1)]))
# l'arête 1 - 3 de poids 2 ferme un cycle avec des arêtes plus légères : elle n'est pas utile, l'arbre est unique
tests.append(texte(4, [(1, 2, 1), (2, 3, 1), (1, 3, 2), (3, 4, 2)]))
tests.append(texte(3, [(1, 2, 1), (2, 3, 2), (1, 3, 2)]))
tests.append(texte(4, [(1, 2, 1), (3, 4, 1), (1, 3, 2), (2, 4, 2), (1, 4, 3)]))
for n, m, wmax in [(6, 9, 4), (10, 15, 6), (30, 50, 100000)]:
    tests.append(texte(n, connexe(n, m, wmax)))
# grands : unique (poids distincts), non unique (beaucoup d'égalités), unique avec égalités inoffensives
n = 8000
ar = connexe(n, 8000, 1)
ws = random.sample(range(1, 10 ** 6 + 1), len(ar))
tests.append(texte(n, [(a, b, w) for (a, b, _), w in zip(ar, ws)]))
n = 5000
tests.append(texte(n, connexe(n, 7000, 30)))
# arbre aux poids quelconques + arêtes plus lourdes que tout le chemin qu'elles ferment : unique
n = 6000
par = [0, 0] + [random.randint(max(1, i - 3), i - 1) for i in range(2, n + 1)]
ar = [(i, par[i], random.randint(1, 500)) for i in range(2, n + 1)]
ar += [(random.randint(1, n), random.randint(1, n), 1000) for _ in range(1500)]
random.shuffle(ar)
tests.append(texte(n, ar))
print(json.dumps(tests))
