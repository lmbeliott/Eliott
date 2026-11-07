import json, random
random.seed(4202)


def texte(n, existantes, candidates):
    return (f"{n} {len(existantes)} {len(candidates)}\n" + "".join(f"{a} {b}\n" for a, b in existantes)
            + "".join(f"{a} {b} {c}\n" for a, b, c in candidates))


def paires(n, k):
    return [(random.randint(1, n), random.randint(1, n)) for _ in range(k)]


def cand(n, m, cmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, cmax)) for _ in range(m)]


tests = []
tests.append(texte(5, [(1, 2)], [(2, 3, 4), (1, 3, 2), (3, 4, 7), (4, 5, 1), (3, 5, 3), (1, 2, 5)]))
tests.append(texte(4, [(1, 2)], [(3, 4, 5)]))
tests.append(texte(1, [], []))
tests.append(texte(3, [(1, 2), (2, 3)], [(1, 3, 1)]))
tests.append(texte(3, [(1, 1)], [(1, 2, 4), (2, 3, 4), (1, 3, 4), (2, 2, 1)]))
for n, k, m in [(8, 3, 12), (20, 10, 30), (60, 40, 80), (100, 0, 300)]:
    tests.append(texte(n, paires(n, k), cand(n, m, 100)))
# grand : 5 000 paires déjà reliées, une chaîne de liaisons chères les relie (total > 2³¹)
n = 10000
ex = [(i, i + 1) for i in range(1, n, 2)]
ca = [(i, i + 2, 10 ** 6 - random.randint(0, 10)) for i in range(1, n - 1, 2)] + cand(n, 1000, 10 ** 6)
random.shuffle(ca)
tests.append(texte(n, ex, ca))
# grand : connexe grâce à une chaîne de secours très chère
n = 3000
ca = cand(n, 2900, 1000) + [(i, i + 1, 10 ** 6) for i in range(1, n)]
random.shuffle(ca)
tests.append(texte(n, paires(n, 3000), ca))
# grand : arbre de candidates mélangé, aucune liaison existante
n = 6001
ca = [(i, random.randint(1, i - 1), random.randint(1, 10 ** 6)) for i in range(2, n + 1)]
random.shuffle(ca)
tests.append(texte(n, [], ca))
print(json.dumps(tests))
