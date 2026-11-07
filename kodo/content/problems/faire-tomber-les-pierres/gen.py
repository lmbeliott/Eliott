import json, random
random.seed(2026)


def grille(t):
    return f"{len(t)} {len(t[0])}\n" + "".join(r + "\n" for r in t)


def aleatoire(n, m, p_pierre, p_bloc):
    lignes = []
    for _ in range(n):
        r = ""
        for _ in range(m):
            x = random.random()
            r += "o" if x < p_pierre else ("#" if x < p_pierre + p_bloc else ".")
        lignes.append(r)
    return lignes


tests = [grille(["o.o.", ".#..", "o..o", "...."]), grille(["oo", "o.", "#.", ".o", ".."])]
tests.append(grille(["o"]))
tests.append(grille(["."]))
tests.append(grille(["o", ".", "o", ".", "#", "o", "."]))
tests.append(grille(["o.#o.o"]))
tests.append(grille(["o" * 100] + ["." * 100] * 99))
tests.append(grille(["o" * 100] * 50 + ["." * 100] * 50))
tests.append(grille(aleatoire(100, 100, 0.3, 0.1)))
tests.append(grille(aleatoire(100, 100, 0.5, 0.02)))
tests.append(grille(aleatoire(60, 100, 0.2, 0.3)))
tests.append(grille(aleatoire(100, 7, 0.4, 0.05)))
tests.append(grille(aleatoire(5, 9, 0.4, 0.2)))
print(json.dumps(tests))
