import json, random
random.seed(4304)


def texte(n, budget, routes):
    return f"{n} {len(routes)} {budget}\n" + "".join(f"{a} {b} {l} {t}\n" for a, b, l, t in routes)


def alea(n, m, lmax, tmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax), random.randint(1, tmax)) for _ in range(m)]


tests = []
tests.append(texte(4, 10, [(1, 2, 3, 5), (2, 4, 3, 5), (1, 3, 2, 1), (3, 4, 9, 2), (1, 4, 20, 1)]))
tests.append(texte(3, 5, [(1, 2, 3, 1), (2, 3, 3, 1)]))
tests.append(texte(1, 1, []))
tests.append(texte(2, 100, []))
tests.append(texte(2, 7, [(1, 2, 7, 4), (1, 2, 8, 1), (2, 2, 1, 1)]))
for n, m in [(6, 10), (12, 25), (40, 80), (200, 400)]:
    tests.append(texte(n, random.randint(10, 60), alea(n, m, 20, 50)))
# grands : chemin court mais cher, chemins longs et bon marché
n = 10000
ch = [(i, i + 1, 100, random.randint(1, 1000)) for i in range(1, n)][:4000]
routes = ch + alea(n, 1000, 10 ** 6, 10 ** 6)
random.shuffle(routes)
tests.append(texte(n, 10 ** 12, routes))
n = 3000
routes = alea(n, 5000, 1000, 10 ** 6)
tests.append(texte(n, 9000, routes))
n = 5000
routes = alea(n, 5000, 10 ** 6, 5000)
tests.append(texte(n, 3 * 10 ** 6, routes))
print(json.dumps(tests))
