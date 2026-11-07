import json, random
random.seed(2026)


def grille(t):
    return f"{len(t)} {len(t[0])}\n" + "".join(r + "\n" for r in t)


def aleatoire(n, m, chiffres="0123456789"):
    return ["".join(random.choice(chiffres) for _ in range(m)) for _ in range(n)]


tests = [grille(["1231", "1121", "5111"]), grille(["90", "09"])]
tests.append(grille(["7"]))
tests.append(grille(["55", "55"]))
tests.append(grille(["13579"]))
tests.append(grille(["9", "1", "9", "1", "8"]))
tests.append(grille(["0000000", "0909090", "0000000", "0909090"]))
tests.append(grille(["9" * 100 for _ in range(100)]))
tests.append(grille(aleatoire(100, 100)))
tests.append(grille(aleatoire(100, 100, "01")))
tests.append(grille(aleatoire(37, 100)))
tests.append(grille(aleatoire(100, 3)))
# Damier de 9 sur fond de 0 : beaucoup de sommets en bord de grille.
tests.append(grille(["".join("9" if (i % 2 == 0 and j % 2 == 0) else "0" for j in range(99)) for i in range(99)]))
print(json.dumps(tests))
