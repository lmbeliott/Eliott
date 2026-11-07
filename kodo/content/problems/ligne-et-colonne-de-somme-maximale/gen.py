import json, random
random.seed(2026)


def grille(t):
    return f"{len(t)} {len(t[0])}\n" + "".join(" ".join(map(str, r)) + "\n" for r in t)


def aleatoire(n, m, a, b):
    return [[random.randint(a, b) for _ in range(m)] for _ in range(n)]


tests = [grille([[3, 0, 7], [1, 5, 2]]), grille([[1, 2], [2, 1], [0, 3]])]
tests.append(grille([[-5]]))
tests.append(grille([[4, -4, 4, -4, 4]]))
tests.append(grille([[2], [-1], [7], [7]]))
tests.append(grille([[0] * 6 for _ in range(4)]))
tests.append(grille(aleatoire(5, 8, -1000, -1)))
tests.append(grille(aleatoire(100, 100, -1000, 1000)))
tests.append(grille(aleatoire(100, 37, -1000, 1000)))
tests.append(grille(aleatoire(23, 100, -3, 3)))
tests.append(grille(aleatoire(100, 100, 1000, 1000)))
tests.append(grille(aleatoire(10, 3, -1000, 1000)))
print(json.dumps(tests))
