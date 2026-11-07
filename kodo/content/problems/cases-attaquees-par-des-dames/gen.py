import json, random
random.seed(2026)


def grille(t):
    return f"{len(t)} {len(t[0])}\n" + "".join(r + "\n" for r in t)


def aleatoire(n, m, p_dame, p_obstacle):
    lignes = []
    for _ in range(n):
        r = ""
        for _ in range(m):
            x = random.random()
            r += "D" if x < p_dame else ("#" if x < p_dame + p_obstacle else ".")
        lignes.append(r)
    return lignes


tests = [grille(["....", ".D#.", "....", "#..."]), grille(["D.#.D", ".....", "..#.."])]
tests.append(grille(["D"]))
tests.append(grille(["."]))
tests.append(grille(["D" * 40] * 40))
tests.append(grille(["D" + "." * 39] + ["." * 40] * 39))
tests.append(grille(["." * 40] * 20 + ["." * 20 + "D" + "." * 19] + ["." * 40] * 19))
tests.append(grille(["#D#", "DDD", "#D#"]))
tests.append(grille(["...", ".#.", "..D"]))
tests.append(grille(aleatoire(40, 40, 0.02, 0.1)))
tests.append(grille(aleatoire(40, 40, 0.3, 0.2)))
tests.append(grille(aleatoire(40, 17, 0.01, 0.0)))
tests.append(grille(aleatoire(9, 40, 0.05, 0.3)))
print(json.dumps(tests))
