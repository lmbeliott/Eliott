import json, random
random.seed(2026)


def fmt(n, sauts, interdites):
    return f"{n} {len(sauts)}\n" + " ".join(map(str, sauts)) + "\n" + interdites + "\n"


def interdites_aleatoires(n, p, derniere_libre=True):
    g = ["#" if random.random() < p else "." for _ in range(n)]
    if derniere_libre:
        g[-1] = "."
    return "".join(g)


tests = [
    fmt(5, [1, 2], "....."),
    fmt(8, [2, 1, 3], ".#..#..."),
]
tests.append(fmt(1, [1], "."))
tests.append(fmt(1, [1], "#"))
tests.append(fmt(6, [4, 2], "...#.."))      # la marche 4 bloque deux des trois montées
tests.append(fmt(7, [2, 4, 6], "......."))  # sauts pairs, N impair : 0
tests.append(fmt(10, [10], ".........."))
tests.append(fmt(30, [1, 2], "." * 29 + "#"))  # dernière marche interdite
tests.append(fmt(12, [1, 3], "..#" * 3 + "..."))  # dernière marche libre, chemins à éviter
tests.append(fmt(100, [1, 2], "." * 100))      # très grand nombre de montées : le modulo compte
tests.append(fmt(2000, random.sample(range(1, 30), 5), interdites_aleatoires(2000, 0.1)))
# Grands cas.
n = 100000
tests.append(fmt(n, list(range(1, 11)), interdites_aleatoires(n, 0.05)))
tests.append(fmt(n, random.sample(range(1, 1000), 10), interdites_aleatoires(n, 0.2)))
tests.append(fmt(60000, [3, 5, 7, 11, 13, 17, 19, 23, 29, 31], interdites_aleatoires(60000, 0.0)))
tests.append(fmt(n, [99999, 1, 100000, 50000, 2, 7, 1234, 9, 10, 4], interdites_aleatoires(n, 0.3)))
print(json.dumps(tests))
