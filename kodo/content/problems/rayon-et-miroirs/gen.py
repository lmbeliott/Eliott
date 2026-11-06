import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes)

def parcours(g):
    # Nombre de pas du rayon (en comptant les passages répétés).
    h, w = len(g), len(g[0])
    l, c, dl, dc, pas = 0, 0, 0, 1, 0
    while 0 <= l < h and 0 <= c < w:
        pas += 1
        if g[l][c] == "/":
            dl, dc = -dc, -dl
        elif g[l][c] == "\\":
            dl, dc = dc, dl
        l, c = l + dl, c + dc
    return pas

def hasard(h, w, p):
    # Parmi plusieurs grilles au hasard, on garde celle où le rayon voyage le plus longtemps.
    meilleure, record = None, -1
    for _ in range(60):
        g = ["".join(random.choice("/\\") if random.random() < p else "." for _ in range(w))
             for _ in range(h)]
        if parcours(g) > record:
            meilleure, record = g, parcours(g)
    return test(meilleure)

def serpentin(h, w):
    # Le rayon parcourt toute la grille en zigzag : toutes les cases sont éclairées.
    g = [["."] * w for _ in range(h)]
    for i in range(h):
        if i % 2 == 0:
            if i > 0:
                g[i][0] = "\\"
            g[i][w - 1] = "\\"
        else:
            g[i][0] = "/"
            g[i][w - 1] = "/"
    return test(["".join(r) for r in g])

tests = [
    test(["..\\.", "....", "../."]),
    test(["....\\", ".....", ".....", "..\\./"]),
]
# Cas limites : une seule case, miroir dès la première case, grille vide.
tests.append(test(["."]))
tests.append(test(["/"]))
tests.append(test(["\\"]))
tests.append(test(["/....", ".....", "....."]))
tests.append(test(["\\" + "." * 49] + ["." * 50] * 49))
tests.append(test(["." * 50] * 50))
tests.append(test(["." * 30 + "/" + "." * 19]))
# Le rayon fait le tour et repasse par des cases déjà éclairées.
tests.append(test(["\\..\\", "....", "\\../"]))
tests.append(serpentin(50, 50))
tests.append(serpentin(7, 9))
# Grilles aléatoires.
for (h, w, p) in [(8, 10, 0.2), (20, 20, 0.1), (50, 50, 0.03), (50, 50, 0.08),
                  (50, 50, 0.3), (40, 50, 0.6), (50, 50, 0.95)]:
    tests.append(hasard(h, w, p))
print(json.dumps(tests))
