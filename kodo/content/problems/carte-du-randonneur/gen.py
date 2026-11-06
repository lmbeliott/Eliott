import json, random
random.seed(2026)

def carte(h, w, y, r):
    lignes = []
    for i in range(h):
        ligne = ""
        for j in range(w):
            if (i, j) == y:
                ligne += "Y"
            elif (i, j) == r:
                ligne += "R"
            else:
                ligne += "."
        lignes.append(ligne + "\n")
    return f"{h} {w}\n" + "".join(lignes)

def hasard(h, w):
    cases = random.sample([(i, j) for i in range(h) for j in range(w)], 2)
    return carte(h, w, cases[0], cases[1])

tests = [
    carte(3, 5, (0, 0), (2, 3)),
    carte(4, 7, (3, 5), (1, 1)),
]
# Cas limites : cartes d'une ligne ou d'une colonne, cases voisines, coins opposés.
tests.append(carte(1, 2, (0, 0), (0, 1)))
tests.append(carte(2, 1, (1, 0), (0, 0)))
tests.append(carte(1, 50, (0, 49), (0, 0)))
tests.append(carte(50, 1, (0, 0), (49, 0)))
tests.append(carte(50, 50, (0, 0), (49, 49)))
tests.append(carte(50, 50, (49, 0), (0, 49)))
tests.append(carte(50, 50, (20, 30), (20, 31)))
# Cartes aléatoires.
for (h, w) in [(5, 8), (12, 30), (50, 50), (37, 50), (50, 13)]:
    tests.append(hasard(h, w))
print(json.dumps(tests))
