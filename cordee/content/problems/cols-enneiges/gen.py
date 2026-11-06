import json, random
random.seed(2026)


def fmt(n, sentiers, questions):
    return (f"{n} {len(sentiers)} {len(questions)}\n"
            + "".join(f"{a} {b} {h}\n" for a, b, h in sentiers)
            + "".join(f"{x} {y} {s}\n" for x, y, s in questions))


def altitude():
    return random.randint(500, 4800)


def questions_aleatoires(n, q, autour=None):
    res = []
    for _ in range(q):
        x, y = random.randint(1, n), random.randint(1, n)
        s = random.choice(autour) + random.randint(-1, 1) if autour and random.random() < 0.3 else altitude()
        res.append((x, y, min(4800, max(500, s))))
    return res


def melange(n, sentiers):
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    res = [(perm[a - 1], perm[b - 1], h) for a, b, h in sentiers]
    random.shuffle(res)
    return res, perm


tests = [
    fmt(5, [(1, 2, 1800), (2, 3, 2400), (3, 4, 2100), (1, 4, 3000), (5, 5, 900)],
        [(1, 3, 2400), (1, 3, 2399), (4, 2, 2200), (4, 1, 3000), (5, 1, 4800), (2, 2, 500)]),
    fmt(3, [], [(1, 2, 4800), (3, 3, 500)]),
]
tests.append(fmt(1, [], [(1, 1, 500)]))
tests.append(fmt(2, [(1, 2, 4800), (2, 1, 3000)], [(1, 2, 2999), (2, 1, 3000), (1, 2, 4800)]))
# Tous les cols à la même altitude.
n = 6
tests.append(fmt(n, [(1, 2, 2000), (2, 3, 2000), (4, 5, 2000), (5, 6, 2000)],
                 [(1, 3, 1999), (1, 3, 2000), (3, 1, 2001), (1, 4, 4800), (6, 4, 2000)]))
sentiers = [(random.randint(1, 10), random.randint(1, 10), altitude()) for _ in range(12)]
tests.append(fmt(10, sentiers, questions_aleatoires(10, 15, [h for _, _, h in sentiers])))
sentiers = [(random.randint(1, 300), random.randint(1, 300), altitude()) for _ in range(400)]
tests.append(fmt(300, sentiers, questions_aleatoires(300, 300, [h for _, _, h in sentiers])))
# Une chaîne dont les cols montent : il faut une limite haute pour relier les deux bouts.
n = 3000
sentiers = [(v, v + 1, 500 + v) for v in range(1, n)]
sentiers, perm = melange(n, sentiers)
questions = []
for _ in range(2000):
    i, j = sorted(random.sample(range(1, n + 1), 2))
    questions.append((perm[i - 1], perm[j - 1], 500 + j - 1 + random.randint(-1, 0)))
tests.append(fmt(n, sentiers, questions))
# Grands cas.
n = 5000
sentiers = [(random.randint(1, v - 1), v, altitude()) for v in range(2, n + 1)] + [(random.randint(1, n), random.randint(1, n), altitude())]
sentiers, _ = melange(n, sentiers)
tests.append(fmt(n, sentiers, questions_aleatoires(n, 5000, [h for _, _, h in sentiers])))
sentiers = [(random.randint(1, n), random.randint(1, n), altitude()) for _ in range(5000)]
tests.append(fmt(n, sentiers, questions_aleatoires(n, 5000, [h for _, _, h in sentiers])))
print(json.dumps(tests))
