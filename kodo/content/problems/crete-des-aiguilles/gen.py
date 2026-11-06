import json, random
random.seed(2026)


def fmt(altitudes, operations):
    return (f"{len(altitudes)} {len(operations)}\n" + " ".join(map(str, altitudes)) + "\n"
            + "".join(f"{op} {i} {x}\n" for op, i, x in operations))


def aleatoire(n, q, p_modif, amin=1, amax=5000):
    altitudes = [random.randint(amin, amax) for _ in range(n)]
    ops = []
    for _ in range(q):
        if random.random() < p_modif:
            ops.append(("M", random.randint(1, n), random.randint(amin, amax)))
        else:
            ops.append(("A", random.randint(1, n), random.randint(amin, amax)))
    return fmt(altitudes, ops)


tests = [
    fmt([2100, 1800, 2500, 1900, 2700, 2400],
        [("A", 1, 2000), ("A", 2, 2600), ("A", 6, 2500), ("M", 4, 2650), ("A", 2, 2600), ("A", 3, 2500)]),
    fmt([3000, 1000, 1000],
        [("A", 2, 1001), ("M", 1, 500), ("A", 1, 1000), ("M", 3, 1500), ("A", 2, 1001)]),
]
tests.append(fmt([4808], [("A", 1, 4808), ("A", 1, 4809), ("M", 1, 5000), ("A", 1, 4809)]))
tests.append(fmt([7] * 9, [("A", 1, 7), ("A", 9, 7), ("A", 5, 8), ("M", 9, 8), ("A", 5, 8), ("M", 9, 1), ("A", 1, 8)]))
tests.append(aleatoire(17, 20, 0.3, 1, 20))
tests.append(aleatoire(1000, 600, 0.5))
# Altitudes croissantes vers l'est : les réponses sont loin à droite.
n = 3000
ops = [("A", random.randint(1, 100), random.randint(4000, 5000)) for _ in range(1500)]
tests.append(fmt([1 + 5000 * i // n for i in range(n)], ops))
# Grands cas.
tests.append(aleatoire(10000, 10000, 0.4))
# Crête basse avec quelques pics tout à l'est : les recherches traversent presque tout.
n, q = 10000, 10000
altitudes = [random.randint(1, 1000) for _ in range(n)]
for i in range(n - 5, n):
    altitudes[i] = random.randint(3000, 5000)
ops = []
for _ in range(q):
    r = random.random()
    if r < 0.1:
        ops.append(("M", random.randint(1, n), random.randint(1, 1000)))
    elif r < 0.12:
        ops.append(("M", random.randint(n - 200, n), random.randint(1, 5000)))
    else:
        ops.append(("A", random.randint(1, 50), random.randint(1001, 5000)))
tests.append(fmt(altitudes, ops))
print(json.dumps(tests))
