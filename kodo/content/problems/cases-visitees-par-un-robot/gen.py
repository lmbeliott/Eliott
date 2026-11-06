import json, random
random.seed(2026)

def test(lignes, ordres):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes) + ordres + "\n"

def hasard(h, w, p, n, biais="NSEO"):
    g = [["#" if random.random() < p else "." for _ in range(w)] for _ in range(h)]
    i, j = random.randrange(h), random.randrange(w)
    g[i][j] = "D"
    ordres = "".join(random.choice(biais) for _ in range(n))
    return test(["".join(r) for r in g], ordres)

tests = [
    test(["D..#.", ".#...", ".....", "#...."], "EEESSOOONNE"),
    test(["#.#", "#D#", "###"], "SNNNOE"),
]
# Cas limites : une seule case, un couloir, des allers-retours, tout ignoré.
tests.append(test(["D"], "NSEOOEN"))
tests.append(test(["..D..."], "OOOOEEEEEEEO"))
tests.append(test(list("..D.#."), "SSSSSSSNNN"))
tests.append(test(["D." , ".."], "EOEOEOEOEO" * 10))
tests.append(test(["#####", "#.D.#", "#####"], "NSNSEEEEEOOOOOO"))
# Grande grille vide parcourue en serpentin : toutes les cases sont visitées.
serp = ""
for r in range(50):
    serp += ("E" if r % 2 == 0 else "O") * 49
    if r < 49:
        serp += "S"
tests.append(test(["D" + "." * 49] + ["." * 50] * 49, serp[:1000]))
# Grilles aléatoires.
for (h, w, p, n, biais) in [(6, 8, 0.2, 40, "NSEO"), (20, 30, 0.25, 500, "NSEO"),
                            (50, 50, 0.1, 1000, "NSEO"), (50, 50, 0.3, 1000, "NSEO"),
                            (50, 50, 0.05, 1000, "NNEESO"), (50, 50, 0.4, 1000, "SSEEON"),
                            (1, 50, 0.0, 1000, "EO"), (50, 1, 0.1, 1000, "NS")]:
    tests.append(hasard(h, w, p, n, biais))
print(json.dumps(tests))
