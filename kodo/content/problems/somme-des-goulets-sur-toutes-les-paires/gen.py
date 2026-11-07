import json, random
random.seed(4206)


def texte(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {w}\n" for a, b, w in aretes)


def connexe(n, m, wmax):
    ar = [(i, random.randint(1, i - 1), random.randint(1, wmax)) for i in range(2, n + 1)]
    ar += [(random.randint(1, n), random.randint(1, n), random.randint(1, wmax)) for _ in range(m - (n - 1))]
    random.shuffle(ar)
    return [(b, a, w) if random.random() < 0.5 else (a, b, w) for a, b, w in ar]


tests = []
tests.append(texte(4, [(1, 2, 5), (2, 3, 3), (3, 4, 4), (1, 4, 7), (1, 3, 6)]))
tests.append(texte(3, [(1, 2, 10), (2, 3, 10), (1, 3, 10)]))
tests.append(texte(2, [(1, 2, 1000000)]))
tests.append(texte(2, [(1, 1, 1), (1, 2, 9), (2, 1, 4)]))
for n, m, wmax in [(6, 9, 10), (12, 20, 5), (40, 60, 1000), (200, 400, 10 ** 6)]:
    tests.append(texte(n, connexe(n, m, wmax)))
# grands
n = 8000
tests.append(texte(n, connexe(n, 8000, 10 ** 6)))
n = 8000
ar = [(i, i + 1, 10 ** 6 - i) for i in range(1, n)]  # chaîne aux poids décroissants
random.shuffle(ar)
tests.append(texte(n, ar))
n = 4000
tests.append(texte(n, connexe(n, 8000, 20)))  # beaucoup de poids égaux
print(json.dumps(tests))
