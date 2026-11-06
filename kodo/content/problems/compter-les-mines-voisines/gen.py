import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes)

def hasard(h, w, p):
    return test(["".join("*" if random.random() < p else "." for _ in range(w)) for _ in range(h)])

tests = [
    test(["*....", ".....", ".*.*."]),
    test(["..*", "***", "*.."]),
]
# Cas limites : une seule case, une seule ligne, une seule colonne, rien que des mines,
# aucune mine, une case entourée de huit mines.
tests.append(test(["."]))
tests.append(test(["*"]))
tests.append(test(["*.*..*.**.*"]))
tests.append(test(list(".*..*.**")))
tests.append(test(["***", "*.*", "***"]))
tests.append(test(["*" * 50] * 50))
tests.append(test(["." * 50] * 50))
# Damier : chaque case vide a exactement 4 mines voisines (sauf sur les bords).
tests.append(test(["".join("*" if (i + j) % 2 == 0 else "." for j in range(50)) for i in range(50)]))
# Grilles aléatoires.
for (h, w, p) in [(6, 9, 0.2), (20, 35, 0.3), (50, 50, 0.15), (50, 50, 0.5), (50, 50, 0.8), (31, 50, 0.4)]:
    tests.append(hasard(h, w, p))
print(json.dumps(tests))
