import json, random
random.seed(2026)


def fmt(n, k, liaisons):
    return f"{n} {len(liaisons)} {k}\n" + "".join(f"{a} {b} {t} {c}\n" for a, b, t, c in liaisons)


def renumerote(n, liaisons):
    # Mélange les numéros des gares (sauf 1 et n) et l'ordre des liaisons.
    milieu = list(range(2, n))
    random.shuffle(milieu)
    perm = [0, 1] + milieu + [n] if n > 1 else [0, 1]
    res = [(perm[a], perm[b], t, c) if random.random() < 0.5 else (perm[b], perm[a], t, c)
           for a, b, t, c in liaisons]
    random.shuffle(res)
    return res


def liaison(a, b, p_tele):
    # Les téléphériques sont bien plus rapides que les sentiers.
    if random.random() < p_tele:
        return (a, b, random.randint(1, 60), 1)
    return (a, b, random.randint(100, 1000), 0)


def aleatoire(n, m, p_tele):
    liaisons = [liaison(random.randint(1, v - 1), v, p_tele) for v in range(2, n + 1)]
    while len(liaisons) < m:
        a, b = random.sample(range(1, n + 1), 2)
        liaisons.append(liaison(a, b, p_tele))
    return renumerote(n, liaisons)


exemple = [(1, 2, 20, 0), (1, 2, 5, 1), (2, 5, 100, 0), (2, 5, 10, 1), (1, 3, 15, 0), (3, 4, 8, 1), (4, 5, 30, 0)]
tests = [
    fmt(5, 1, exemple),
    fmt(3, 0, [(1, 2, 10, 0), (2, 3, 5, 1)]),
]
tests.append(fmt(5, 0, exemple))
tests.append(fmt(5, 2, exemple))
tests.append(fmt(1, 3, []))
tests.append(fmt(2, 10, [(2, 1, 7, 1), (1, 2, 9, 0)]))
tests.append(fmt(4, 2, [(1, 2, 3, 1), (3, 4, 3, 1)]))     # gare N inaccessible
tests.append(fmt(12, 2, aleatoire(12, 20, 0.4)))
tests.append(fmt(300, 3, aleatoire(300, 500, 0.3)))
# Une longue ligne à pied, doublée de téléphériques : chaque ticket compte.
n = 1500
liaisons = [(v, v + 1, random.randint(100, 200), 0) for v in range(1, n)]
for _ in range(1000):
    a = random.randint(1, n - 1)
    b = min(n, a + random.randint(2, 400))
    liaisons.append((a, b, random.randint(1, 60), 1))
tests.append(fmt(n, 10, renumerote(n, liaisons)))
# Grands cas.
tests.append(fmt(5000, 10, aleatoire(5000, 8000, 0.25)))
tests.append(fmt(5000, 4, aleatoire(5000, 8000, 0.5)))
# Grand cas où N n'est relié au reste que par un téléphérique, sans ticket.
liaisons = aleatoire(3999, 5999, 0.3)
liaisons.append((random.randint(1, 3999), 4000, 1, 1))
tests.append(fmt(4000, 0, liaisons))
print(json.dumps(tests))
