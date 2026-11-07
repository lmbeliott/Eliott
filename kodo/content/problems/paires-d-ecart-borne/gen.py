import json, random
random.seed(2026)


def fmt(bas, haut, a):
    return f"{len(a)} {bas} {haut}\n" + " ".join(map(str, a)) + "\n"


tests = [
    fmt(1, 3, [4, 2, 5, 7, 3, 6]),
    fmt(-2, 0, [3, 3, 1, 2, 3]),
]
tests.append(fmt(0, 5, [8]))
tests.append(fmt(0, 0, [5, 5, 5, 5, 5]))                              # toutes les paires
tests.append(fmt(-1000000000, 1000000000, [0, 1000000000, 0, 1000000000]))
tests.append(fmt(1000000000, 1000000000, [1000000000, 0, 1000000000, 0]))
tests.append(fmt(4, 6, [9, 1, 2, 3, 4]))                              # aucune paire : l'écart est signé
tests.append(fmt(-3, 3, [random.randint(0, 10) for _ in range(20)]))
tests.append(fmt(-400, -100, [random.randint(0, 1000) for _ in range(300)]))
# Grands cas.
tests.append(fmt(-10 ** 8, 3 * 10 ** 8, [random.randint(0, 10 ** 9) for _ in range(15000)]))
tests.append(fmt(0, 2000, sorted(random.randint(0, 10 ** 6) for _ in range(15000))))
tests.append(fmt(-1, 1, [random.randint(0, 50) for _ in range(15000)]))
tests.append(fmt(-1000000000, 1000000000, [random.choice([0, 10 ** 9]) for _ in range(6000)]))
print(json.dumps(tests))
