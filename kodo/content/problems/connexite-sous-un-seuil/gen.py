import json, random
random.seed(2026)


def fmt(n, aretes, questions):
    return (f"{n} {len(aretes)} {len(questions)}\n"
            + "".join(f"{a} {b} {h}\n" for a, b, h in aretes)
            + "".join(f"{x} {y} {s}\n" for x, y, s in questions))


def poids():
    return random.randint(500, 4800)


def questions_aleatoires(n, q, autour=None):
    res = []
    for _ in range(q):
        x, y = random.randint(1, n), random.randint(1, n)
        s = random.choice(autour) + random.randint(-1, 1) if autour and random.random() < 0.3 else poids()
        res.append((x, y, min(4800, max(500, s))))
    return res


def melange(n, aretes):
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    res = [(perm[a - 1], perm[b - 1], h) for a, b, h in aretes]
    random.shuffle(res)
    return res, perm


tests = [
    fmt(5, [(1, 2, 1800), (2, 3, 2400), (3, 4, 2100), (1, 4, 3000), (5, 5, 900)],
        [(1, 3, 2400), (1, 3, 2399), (4, 2, 2200), (4, 1, 3000), (5, 1, 4800), (2, 2, 500)]),
    fmt(3, [], [(1, 2, 4800), (3, 3, 500)]),
]
tests.append(fmt(1, [], [(1, 1, 500)]))
tests.append(fmt(2, [(1, 2, 4800), (2, 1, 3000)], [(1, 2, 2999), (2, 1, 3000), (1, 2, 4800)]))
# Toutes les arêtes ont le même poids.
n = 6
tests.append(fmt(n, [(1, 2, 2000), (2, 3, 2000), (4, 5, 2000), (5, 6, 2000)],
                 [(1, 3, 1999), (1, 3, 2000), (3, 1, 2001), (1, 4, 4800), (6, 4, 2000)]))
aretes = [(random.randint(1, 10), random.randint(1, 10), poids()) for _ in range(12)]
tests.append(fmt(10, aretes, questions_aleatoires(10, 15, [h for _, _, h in aretes])))
aretes = [(random.randint(1, 300), random.randint(1, 300), poids()) for _ in range(400)]
tests.append(fmt(300, aretes, questions_aleatoires(300, 300, [h for _, _, h in aretes])))
# Une chaîne dont les poids augmentent : il faut un seuil élevé pour relier les deux bouts.
n = 3000
aretes = [(v, v + 1, 500 + v) for v in range(1, n)]
aretes, perm = melange(n, aretes)
questions = []
for _ in range(2000):
    i, j = sorted(random.sample(range(1, n + 1), 2))
    questions.append((perm[i - 1], perm[j - 1], 500 + j - 1 + random.randint(-1, 0)))
tests.append(fmt(n, aretes, questions))
# Grands cas.
# Deux grands groupes de 2500 sommets aux arêtes légères, reliés par une seule arête de poids 4800.
# Chaque question relie les deux groupes avec S = 4799 (NON) ou S = 4800 (OUI) : un parcours
# par question visite des milliers de sommets à chaque fois.
n = 5000
moitie = n // 2
aretes = [(random.randint(1, v - 1), v, 500) for v in range(2, moitie + 1)]
aretes += [(random.randint(moitie + 1, v - 1), v, 500) for v in range(moitie + 2, n + 1)]
aretes.append((random.randint(1, moitie), random.randint(moitie + 1, n), 4800))
while len(aretes) < 5000:
    aretes.append((random.randint(1, moitie), random.randint(1, moitie), 500))
aretes, perm = melange(n, aretes)
questions = []
for _ in range(5000):
    x, y = perm[random.randint(1, moitie) - 1], perm[random.randint(moitie + 1, n) - 1]
    if random.random() < 0.5:
        x, y = y, x
    questions.append((x, y, random.choice([4799, 4800])))
tests.append(fmt(n, aretes, questions))
# Graphe aléatoire, seuils élevés : la plupart des arêtes sont utilisables et forment un grand groupe.
aretes = [(random.randint(1, n), random.randint(1, n), poids()) for _ in range(5000)]
questions = [(random.randint(1, n), random.randint(1, n), random.randint(4300, 4800)) for _ in range(5000)]
tests.append(fmt(n, aretes, questions))
print(json.dumps(tests))
