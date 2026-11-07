import json, random
random.seed(2026)

def test(t, grille):
    return f"{len(grille)} {len(grille[0])} {t}\n" + "\n".join(grille) + "\n"

def aleatoire(n, m, densite):
    return ["".join('#' if random.random() < densite else '.' for _ in range(m)) for _ in range(n)]

def avec_trou(n, m, densite, haut, gauche, cote, densite_trou):
    # grille assez dense, avec une zone carrée beaucoup plus vide
    g = [list(ligne) for ligne in aleatoire(n, m, densite)]
    for i in range(haut, haut + cote):
        for j in range(gauche, gauche + cote):
            g[i][j] = '#' if random.random() < densite_trou else '.'
    return ["".join(ligne) for ligne in g]

tests = [
    test(1, ["..#...", ".#..#.", "......", "#..#..", "...#.#"]),
    test(0, ["#.#", "...", "#.#"]),
    test(0, ["#"]),                                   # aucun carré possible : réponse 0
    test(1, ["#"]),
    test(0, ["." * 7]),                               # une seule ligne
    test(2, ["##", "##", "##"]),
    test(3, ["#" * 5] * 5),                           # tout marqué
    test(0, ["." * 9] * 4),                           # rien de marqué
    test(4, aleatoire(12, 15, 0.3)),
    test(20, aleatoire(60, 45, 0.1)),
    test(0, avec_trou(80, 100, 0.4, 20, 30, 37, 0.0)),
    test(15, avec_trou(150, 120, 0.2, 10, 60, 55, 0.004)),
]
# tailles maximales
tests.append(test(30, avec_trou(400, 400, 0.05, 120, 200, 180, 0.0005)))
tests.append(test(2000, aleatoire(400, 400, 0.08)))
print(json.dumps(tests))
