import json, random
random.seed(2026)

def grille(h, w, a, b):
    lignes = []
    for i in range(h):
        ligne = ""
        for j in range(w):
            if (i, j) == a:
                ligne += "A"
            elif (i, j) == b:
                ligne += "B"
            else:
                ligne += "."
        lignes.append(ligne + "\n")
    return f"{h} {w}\n" + "".join(lignes)

def hasard(h, w):
    cases = random.sample([(i, j) for i in range(h) for j in range(w)], 2)
    return grille(h, w, cases[0], cases[1])

tests = [
    grille(3, 5, (0, 0), (2, 3)),
    grille(4, 7, (3, 5), (1, 1)),
]
# Cas limites : grilles d'une ligne ou d'une colonne, cases voisines, coins opposés.
tests.append(grille(1, 2, (0, 0), (0, 1)))
tests.append(grille(2, 1, (1, 0), (0, 0)))
tests.append(grille(1, 50, (0, 49), (0, 0)))
tests.append(grille(50, 1, (0, 0), (49, 0)))
tests.append(grille(50, 50, (0, 0), (49, 49)))
tests.append(grille(50, 50, (49, 0), (0, 49)))
tests.append(grille(50, 50, (20, 30), (20, 31)))
# Grilles aléatoires.
for (h, w) in [(5, 8), (12, 30), (50, 50), (37, 50), (50, 13)]:
    tests.append(hasard(h, w))
print(json.dumps(tests))
