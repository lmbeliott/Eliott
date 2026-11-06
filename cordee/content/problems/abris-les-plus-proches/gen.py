import json, random
random.seed(2026)


def fmt(carte):
    return f"{len(carte)} {len(carte[0])}\n" + "".join(ligne + "\n" for ligne in carte)


def aleatoire(r, c, p_rocher, nb_abris):
    carte = [["#" if random.random() < p_rocher else "." for _ in range(c)] for _ in range(r)]
    for _ in range(nb_abris):
        carte[random.randrange(r)][random.randrange(c)] = "A"
    return ["".join(ligne) for ligne in carte]


def serpentin(r, c):
    # Un long couloir en zigzag avec un seul abri au bout : distances très grandes.
    carte = []
    for i in range(r):
        if i % 2 == 0:
            carte.append(["."] * c)
        else:
            ligne = ["#"] * c
            ligne[c - 1 if i % 4 == 1 else 0] = "."
            carte.append(ligne)
    carte[0][0] = "A"
    return ["".join(ligne) for ligne in carte]


tests = [
    fmt(["A..#...", ".#.#.#.", "...#.#A", "##.#..."]),
    fmt(["..#..", ".A#..", "..###", "###..", "....."]),
]
tests.append(fmt(["A"]))
tests.append(fmt(["A...."]))
tests.append(fmt([".#A#..."]))
tests.append(fmt(["A", ".", "#", "."]))
tests.append(fmt(["A" * 6] * 3))
tests.append(fmt(aleatoire(8, 10, 0.3, 3)))
tests.append(fmt(aleatoire(40, 60, 0.35, 10)))
# Une prairie vide avec un abri dans un coin.
carte = ["." * 300 for _ in range(300)]
carte[299] = "." * 299 + "A"
tests.append(fmt(carte))
# Grands cas : couloir en zigzag, beaucoup d'abris, beaucoup de poches isolées.
tests.append(fmt(serpentin(300, 300)))
tests.append(fmt(aleatoire(300, 300, 0.3, 3000)))
tests.append(fmt(aleatoire(300, 290, 0.42, 40)))
print(json.dumps(tests))
