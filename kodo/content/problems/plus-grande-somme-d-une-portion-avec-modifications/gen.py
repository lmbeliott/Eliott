import json, random
random.seed(2026)


def fmt(a, ops):
    return (f"{len(a)} {len(ops)}\n" + " ".join(map(str, a)) + "\n"
            + "".join(f"{t} {x} {y}\n" for t, x, y in ops))


def operations(n, q, vmin, vmax, part_modif=0.5, longues=False):
    ops = []
    for _ in range(q):
        if random.random() < part_modif:
            ops.append((1, random.randint(1, n), random.randint(vmin, vmax)))
        else:
            if longues:
                l = random.randint(1, n // 4 + 1)
                r = random.randint(3 * n // 4, n)
            else:
                l = random.randint(1, n)
                r = random.randint(l, n)
            ops.append((2, l, r))
    return ops


tests = [
    fmt([2, -5, 3, -1, 4, -6], [(2, 1, 6), (2, 1, 2), (1, 4, -9), (2, 1, 6), (2, 2, 2)]),
    fmt([-3, -1, -2], [(2, 1, 3), (1, 2, 5), (2, 1, 1), (2, 1, 3)]),
]
tests.append(fmt([7], [(2, 1, 1), (1, 1, -1000), (2, 1, 1)]))
tests.append(fmt([-1000] * 5, [(2, 1, 5), (2, 3, 4), (1, 5, 0), (2, 1, 5)]))
tests.append(fmt([1000] * 9, [(2, 1, 9), (2, 4, 4), (1, 5, -1000), (2, 1, 9), (2, 6, 9)]))
tests.append(fmt([0, 0, 0], [(2, 1, 3), (1, 2, -1), (2, 2, 2), (2, 1, 3)]))
tests.append(fmt([random.randint(-10, 10) for _ in range(12)], operations(12, 20, -10, 10)))
tests.append(fmt([random.randint(-1000, 1000) for _ in range(300)], operations(300, 400, -1000, 1000)))
tests.append(fmt([random.randint(-1000, 300) for _ in range(2000)], operations(2000, 2000, -1000, 300)))
# Grands cas : des questions sur de longs intervalles, refaire un parcours à chaque fois est trop lent.
n = 10000
tests.append(fmt([random.randint(-1000, 1000) for _ in range(n)], operations(n, 8000, -1000, 1000, 0.2, longues=True)))
tests.append(fmt([random.randint(-1000, 700) for _ in range(n)], operations(n, 8000, -1000, 950, 0.25, longues=True)))
# Que des valeurs négatives : la meilleure portion est une seule case.
n = 3000
tests.append(fmt([random.randint(-1000, -1) for _ in range(n)], operations(n, 2000, -1000, -1, 0.4)))
print(json.dumps(tests))
