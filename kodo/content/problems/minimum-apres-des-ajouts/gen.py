import json, random
random.seed(2026)


def fmt(n, ops):
    lignes = []
    for op in ops:
        lignes.append(" ".join(map(str, op)))
    return f"{n} {len(ops)}\n" + "\n".join(lignes) + "\n"


def operations(n, q, vmax, p_ajout=0.5, large=False):
    ops = []
    for _ in range(q):
        if large:
            l = random.randint(1, max(1, n // 10))
            r = random.randint(n - n // 10, n)
        else:
            l, r = sorted((random.randint(1, n), random.randint(1, n)))
        if random.random() < p_ajout:
            ops.append(('+', l, r, random.randint(-vmax, vmax)))
        else:
            ops.append(('?', l, r))
    return ops


tests = [
    fmt(6, [('?', 1, 6), ('+', 2, 4, 3), ('+', 4, 6, -2), ('?', 1, 6), ('?', 2, 3), ('+', 1, 1, -2), ('?', 1, 4)]),
    fmt(5, [('+', 1, 5, 7), ('+', 3, 3, -1), ('?', 2, 4), ('+', 2, 4, 1), ('?', 1, 5)]),
]
tests.append(fmt(1, [('?', 1, 1), ('+', 1, 1, -1000000), ('?', 1, 1)]))
tests.append(fmt(7, [('+', 1, 7, 0), ('?', 7, 7), ('?', 1, 7), ('+', 7, 7, -1), ('?', 1, 7), ('?', 6, 7)]))
tests.append(fmt(10, operations(10, 30, 3)))
tests.append(fmt(100, operations(100, 300, 2)))
tests.append(fmt(1000, operations(1000, 2000, 1000000)))
# Grands cas : des intervalles presque complets, beaucoup d'égalités, des valeurs au-delà de 2³¹.
tests.append(fmt(1000000, operations(1000000, 6000, 1, large=True)))
tests.append(fmt(999999, operations(999999, 6000, 1000000, large=True)))
ops = [('+', random.randint(1, 50), random.randint(999900, 1000000), random.randint(900000, 1000000)) for _ in range(3500)]
ops += [('?', random.randint(1, 500000), random.randint(500000, 1000000)) for _ in range(2000)]
random.shuffle(ops)
tests.append(fmt(1000000, ops))
tests.append(fmt(131073, operations(131073, 1000, 5)))
print(json.dumps(tests))
