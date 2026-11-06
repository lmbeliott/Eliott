import json, random
random.seed(2026)


def fmt(n, sauts, glace):
    return f"{n} {len(sauts)}\n" + " ".join(map(str, sauts)) + "\n" + glace + "\n"


def glace_aleatoire(n, p, sommet_sec=True):
    g = ["#" if random.random() < p else "." for _ in range(n)]
    if sommet_sec:
        g[-1] = "."
    return "".join(g)


tests = [
    fmt(5, [1, 2], "....."),
    fmt(8, [2, 1, 3], ".#..#..."),
]
tests.append(fmt(1, [1], "."))
tests.append(fmt(1, [1], "#"))
tests.append(fmt(6, [4, 2], "....#."))      # la marche 4 bloque une des deux montées
tests.append(fmt(7, [2, 4, 6], "......."))  # sauts pairs, sommet impair : 0
tests.append(fmt(10, [10], ".........."))
tests.append(fmt(30, [1, 2], "." * 29 + "#"))  # sommet verglacé
tests.append(fmt(12, [1, 3], ".#" * 6))
tests.append(fmt(100, [1, 2], "." * 100))      # très grand nombre de montées : le modulo compte
tests.append(fmt(2000, random.sample(range(1, 30), 5), glace_aleatoire(2000, 0.1)))
# Grands cas.
n = 100000
tests.append(fmt(n, list(range(1, 11)), glace_aleatoire(n, 0.05)))
tests.append(fmt(n, random.sample(range(1, 1000), 10), glace_aleatoire(n, 0.2)))
tests.append(fmt(60000, [3, 5, 7, 11, 13, 17, 19, 23, 29, 31], glace_aleatoire(60000, 0.0)))
tests.append(fmt(n, [99999, 1, 100000, 50000, 2, 7, 1234, 9, 10, 4], glace_aleatoire(n, 0.3)))
print(json.dumps(tests))
