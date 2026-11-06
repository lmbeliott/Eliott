import json, random
random.seed(2026)


def fmt(grille):
    return f"{len(grille)} {len(grille[0])}\n" + "".join(ligne + "\n" for ligne in grille)


def aleatoire(r, c, p_mur, nb_marques):
    grille = [["#" if random.random() < p_mur else "." for _ in range(c)] for _ in range(r)]
    for _ in range(nb_marques):
        grille[random.randrange(r)][random.randrange(c)] = "*"
    return ["".join(ligne) for ligne in grille]


def serpentin(r, c):
    # Un long couloir en zigzag avec une seule case marquée au bout : distances très grandes.
    grille = []
    for i in range(r):
        if i % 2 == 0:
            grille.append(["."] * c)
        else:
            ligne = ["#"] * c
            ligne[c - 1 if i % 4 == 1 else 0] = "."
            grille.append(ligne)
    grille[0][0] = "*"
    return ["".join(ligne) for ligne in grille]


tests = [
    fmt(["*..#...", ".#.#.#.", "...#.#*", "##.#..."]),
    fmt(["..#..", ".*#..", "..###", "###..", "....."]),
]
tests.append(fmt(["*"]))
tests.append(fmt(["*...."]))
tests.append(fmt([".#*#..."]))
tests.append(fmt(["*", ".", "#", "."]))
tests.append(fmt(["*" * 6] * 3))
tests.append(fmt(aleatoire(8, 10, 0.3, 3)))
tests.append(fmt(aleatoire(40, 60, 0.35, 10)))
# Une grille sans mur avec une case marquée dans un coin.
grille = ["." * 300 for _ in range(300)]
grille[299] = "." * 299 + "*"
tests.append(fmt(grille))
# Grands cas : couloir en zigzag, beaucoup de cases marquées, beaucoup de poches isolées.
tests.append(fmt(serpentin(300, 300)))
tests.append(fmt(aleatoire(300, 300, 0.3, 3000)))
tests.append(fmt(aleatoire(300, 290, 0.42, 40)))
print(json.dumps(tests))
