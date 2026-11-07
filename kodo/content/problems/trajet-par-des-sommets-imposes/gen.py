import json, random
random.seed(4305)


def texte(n, imposes, aretes):
    return (f"{n} {len(aretes)} {len(imposes)}\n" + " ".join(map(str, imposes)) + "\n"
            + "".join(f"{a} {b} {l}\n" for a, b, l in aretes))


def alea(n, m, lmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax)) for _ in range(m)]


def connexe(n, m, lmax):
    ar = [(i, random.randint(1, i - 1), random.randint(1, lmax)) for i in range(2, n + 1)]
    return ar + alea(n, m - (n - 1), lmax)


tests = []
tests.append(texte(6, [5, 3], [(1, 2, 2), (2, 3, 2), (3, 6, 3), (2, 5, 4), (5, 6, 1), (1, 4, 1), (4, 6, 1)]))
tests.append(texte(4, [3], [(1, 2, 1), (2, 4, 1)]))
tests.append(texte(1, [], []))
tests.append(texte(1, [1], [(1, 1, 5)]))
tests.append(texte(3, [], [(1, 3, 7), (1, 2, 1), (2, 3, 1)]))
tests.append(texte(3, [1, 3, 2], [(1, 3, 7), (1, 2, 1), (2, 3, 1)]))
for n, m, k in [(8, 12, 3), (15, 25, 5), (40, 60, 6), (100, 150, 8)]:
    tests.append(texte(n, random.sample(range(1, n + 1), k), alea(n, m, 100)))
# grands : 8 sommets imposés, longueurs jusqu'à 10⁶ (le total dépasse 2³¹)
n = 6000
ar = [(i, i + 1, random.randint(5 * 10 ** 5, 10 ** 6)) for i in range(1, n)]
random.shuffle(ar)
tests.append(texte(n, random.sample(range(1, n + 1), 8), ar))
n = 6000
tests.append(texte(n, random.sample(range(1, n + 1), 8), connexe(n, 6000, 10 ** 6)))
n = 5000
tests.append(texte(n, random.sample(range(1, n + 1), 8), connexe(n, 6000, 10 ** 6)))
print(json.dumps(tests))
