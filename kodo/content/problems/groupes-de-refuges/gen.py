import json, random
random.seed(2026)


def fmt(n, aretes):
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b}\n" for a, b in aretes)


def melange(n, aretes):
    # Renumérote les refuges au hasard et mélange l'ordre des sentiers.
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    res = [(perm[a - 1], perm[b - 1]) for a, b in aretes]
    random.shuffle(res)
    return res


def groupes_aleatoires(n, m, k):
    # k groupes de tailles aléatoires, chacun relié par un arbre, puis des sentiers en plus.
    coupures = sorted(random.sample(range(1, n), k - 1)) if k > 1 else []
    bornes = [0] + coupures + [n]
    aretes = []
    for g in range(k):
        debut, fin = bornes[g] + 1, bornes[g + 1]
        for v in range(debut + 1, fin + 1):
            aretes.append((random.randint(debut, v - 1), v))
    while len(aretes) < m:
        g = random.randrange(k)
        debut, fin = bornes[g] + 1, bornes[g + 1]
        aretes.append((random.randint(debut, fin), random.randint(debut, fin)))
    return melange(n, aretes[:m])


tests = [
    "7 5\n1 2\n2 3\n4 5\n6 6\n3 1\n",
    "5 6\n1 2\n2 1\n3 4\n5 4\n2 5\n3 5\n",
]
tests.append("1 0\n")
tests.append("1 1\n1 1\n")
tests.append("6 0\n")
# Une longue chaîne : un DFS récursif naïf dépasse la limite de récursion.
n = 10000
tests.append(fmt(n, melange(n, [(i, i + 1) for i in range(1, n)])))
# Une étoile : un refuge relié à tous les autres.
n = 3000
tests.append(fmt(n, melange(n, [(1, i) for i in range(2, n + 1)])))
# Petits cas aléatoires.
for n, m, k in [(12, 9, 3), (30, 40, 4), (200, 150, 60)]:
    tests.append(fmt(n, groupes_aleatoires(n, m, k)))
# Beaucoup de petits groupes, et des sentiers tirés au hasard.
n, m = 10000, 4000
tests.append(fmt(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
# Grands cas.
tests.append(fmt(10000, groupes_aleatoires(10000, 10000, 5)))
n, m = 10000, 10000
tests.append(fmt(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
print(json.dumps(tests))
