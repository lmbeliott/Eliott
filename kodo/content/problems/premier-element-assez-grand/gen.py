import json, random
random.seed(2026)


def fmt(valeurs, operations):
    return (f"{len(valeurs)} {len(operations)}\n" + " ".join(map(str, valeurs)) + "\n"
            + "".join(f"{op} {i} {x}\n" for op, i, x in operations))


def aleatoire(n, q, p_modif, amin=1, amax=5000):
    valeurs = [random.randint(amin, amax) for _ in range(n)]
    ops = []
    for _ in range(q):
        if random.random() < p_modif:
            ops.append(("M", random.randint(1, n), random.randint(amin, amax)))
        else:
            ops.append(("Q", random.randint(1, n), random.randint(amin, amax)))
    return fmt(valeurs, ops)


tests = [
    fmt([2100, 1800, 2500, 1900, 2700, 2400],
        [("Q", 1, 2000), ("Q", 2, 2600), ("Q", 6, 2500), ("M", 4, 2650), ("Q", 2, 2600), ("Q", 3, 2500)]),
    fmt([3000, 1000, 1000],
        [("Q", 2, 1001), ("M", 1, 500), ("Q", 1, 1000), ("M", 3, 1500), ("Q", 2, 1001)]),
]
tests.append(fmt([4808], [("Q", 1, 4808), ("Q", 1, 4809), ("M", 1, 5000), ("Q", 1, 4809)]))
tests.append(fmt([7] * 9, [("Q", 1, 7), ("Q", 9, 7), ("Q", 5, 8), ("M", 9, 8), ("Q", 5, 8), ("M", 9, 1), ("Q", 1, 8)]))
tests.append(aleatoire(17, 20, 0.3, 1, 20))
tests.append(aleatoire(1000, 600, 0.5))
# Valeurs croissantes : les réponses sont loin à droite.
n = 3000
ops = [("Q", random.randint(1, 100), random.randint(4000, 5000)) for _ in range(1500)]
tests.append(fmt([1 + 5000 * i // n for i in range(n)], ops))
# Grands cas.
tests.append(aleatoire(10000, 10000, 0.4))
# Petites valeurs avec quelques grandes tout à droite : les recherches traversent presque tout.
n, q = 10000, 10000
valeurs = [random.randint(1, 1000) for _ in range(n)]
for i in range(n - 5, n):
    valeurs[i] = random.randint(3000, 5000)
ops = []
for _ in range(q):
    r = random.random()
    if r < 0.1:
        ops.append(("M", random.randint(1, n), random.randint(1, 1000)))
    elif r < 0.12:
        ops.append(("M", random.randint(n - 200, n), random.randint(1, 5000)))
    else:
        ops.append(("Q", random.randint(1, 50), random.randint(1001, 5000)))
tests.append(fmt(valeurs, ops))
print(json.dumps(tests))
