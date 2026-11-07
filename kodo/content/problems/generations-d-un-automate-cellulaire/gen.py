import json, random
random.seed(2026)

def test(k, grille):
    return f"{len(grille)} {len(grille[0])} {k}\n" + "".join(l + "\n" for l in grille)

def aleatoire(r, c, p):
    return ["".join("#" if random.random() < p else "." for _ in range(c)) for _ in range(r)]

tests = [test(1, [".....", "..#..", "..#..", "..#..", "....."]),
         test(4, ["......", "..#...", "...#..", ".###..", "......", "......"])]
tests.append(test(0, ["#.#", ".#."]))                    # zéro génération
tests.append(test(5, ["#"]))                              # une seule case
tests.append(test(3, ["##", "##"]))                       # bloc stable, collé aux bords
tests.append(test(1, ["###", "###", "###"]))
tests.append(test(2, ["#####"]))
tests.append(test(10, ["." * 10] * 10))                   # vide
tests.append(test(50, [".......", ".......", "..###..", ".......", "......."] * 2))
tests.append(test(12, aleatoire(15, 20, 0.3)))
tests.append(test(50, aleatoire(30, 30, 0.35)))
tests.append(test(50, aleatoire(30, 30, 0.5)))
tests.append(test(37, aleatoire(1, 30, 0.6)))
tests.append(test(50, aleatoire(30, 1, 0.6)))
print(json.dumps(tests))
