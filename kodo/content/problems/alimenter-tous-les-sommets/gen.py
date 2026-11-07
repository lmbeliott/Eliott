import json, random
random.seed(2026)


def fmt(p, aretes):
    return (f"{len(p)} {len(aretes)}\n" + " ".join(map(str, p)) + "\n"
            + "".join(f"{a} {b} {c}\n" for a, b, c in aretes))


def aleatoire(n, m, pmin, pmax, cmin, cmax, connexe=True):
    p = [random.randint(pmin, pmax) for _ in range(n)]
    aretes = []
    if connexe:
        perm = list(range(1, n + 1))
        random.shuffle(perm)
        for i in range(1, n):
            aretes.append((perm[i], perm[random.randrange(max(0, i - 20), i)], random.randint(cmin, cmax)))
    while len(aretes) < m:
        a, b = random.sample(range(1, n + 1), 2)
        aretes.append((a, b, random.randint(cmin, cmax)))
    random.shuffle(aretes)
    return fmt(p, aretes)


tests = [
    fmt([5, 8, 3, 9], [(1, 2, 2), (2, 3, 7), (3, 4, 4), (1, 4, 10)]),
    fmt([4, 1, 6], []),
]
tests.append(fmt([7], []))
tests.append(fmt([100, 100, 100], [(1, 2, 1), (2, 3, 1), (1, 3, 1)]))     # une seule source
tests.append(fmt([1, 1, 1], [(1, 2, 5), (2, 3, 5)]))                       # des sources partout
tests.append(fmt([10, 10], [(1, 2, 3), (2, 1, 1), (1, 2, 2)]))             # liaisons multiples
tests.append(fmt([6, 2, 9, 9, 4, 7], [(1, 3, 3), (3, 4, 3), (2, 5, 8), (5, 6, 1), (4, 1, 2)]))
tests.append(aleatoire(10, 14, 1, 30, 1, 20))
tests.append(aleatoire(300, 400, 1, 1000, 1, 1000, connexe=False))
tests.append(aleatoire(3000, 4500, 1, 10 ** 6, 1, 10 ** 6))
tests.append(aleatoire(3000, 4500, 1000, 10 ** 6, 1, 3000))
tests.append(aleatoire(3000, 4500, 1, 5000, 1000, 10 ** 6, connexe=False))
# Sources et liaisons toutes chères : le total dépasse 2³¹.
tests.append(aleatoire(3000, 3500, 999000, 10 ** 6, 999000, 10 ** 6))
# Une longue chaîne de liaisons bon marché, avec une seule source bon marché au bout.
n = 2000
p = [10 ** 6] * n
p[n - 1] = 1
aretes = [(v, v + 1, random.randint(1, 10)) for v in range(1, n)]
aretes += [(random.randint(1, n), random.randint(1, n), 10 ** 6) for _ in range(500)]
aretes = [(a, b, c) for a, b, c in aretes if a != b]
random.shuffle(aretes)
tests.append(fmt(p, aretes))
print(json.dumps(tests))
