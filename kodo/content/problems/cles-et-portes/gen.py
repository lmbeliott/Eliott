import json, random
random.seed(2040)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "\n".join("".join(l) for l in g) + "\n"

def hasard(r, c, p_mur, nb_cles, nb_portes, lettres, avec_t=True):
    g = [["#" if random.random() < p_mur else "." for _ in range(c)] for _ in range(r)]
    cases = random.sample([(i, j) for i in range(r) for j in range(c)], 2 + nb_cles + nb_portes)
    g[cases[0][0]][cases[0][1]] = "S"
    g[cases[1][0]][cases[1][1]] = "T" if avec_t else "."
    for (i, j) in cases[2:2 + nb_cles]:
        g[i][j] = random.choice(lettres)
    for (i, j) in cases[2 + nb_cles:]:
        g[i][j] = random.choice(lettres).upper()
    return g

def couloirs(r, c):
    # des murs verticaux percés d'une porte ; les clés sont cachées dans des culs-de-sac
    g = [["." for _ in range(c)] for _ in range(r)]
    lettres = "abcdef"
    cols = [6 * (k + 1) for k in range(6) if 6 * (k + 1) < c - 1]
    for k, col in enumerate(cols):
        for i in range(r):
            g[i][col] = "#"
        g[random.randrange(r)][col] = lettres[k].upper()
    for k, col in enumerate(cols):
        # la clé k est dans une zone située avant la porte k
        zone = col - 6
        g[random.randrange(r)][max(0, zone + random.randrange(1, 5))] = lettres[k]
    g[0][0] = "S"
    g[r - 1][c - 1] = "T"
    return g

def enferme(r, c, lettres, porte_t):
    # grille ouverte avec des clés partout ; T est enfermé derrière une porte
    g = hasard(r, c, 0.1, 6, 20, lettres, avec_t=False)
    for i in range(r - 3, r):
        for j in range(c - 3, c):
            g[i][j] = "#"
    g[r - 2][c - 2] = "T"
    g[r - 3][c - 2] = porte_t
    g = [["." if x == "S" else x for x in ligne] for ligne in g]
    g[0][0] = "S"
    return g

tests = []
tests.append(test([list("S.a#."), list(".##A."), list("....T")]))
tests.append(test([list("S.#...T"), list(".a#B###"), list("..A...."), list("###.#.."), list("b......")]))
tests.append(test([list("ST")]))
tests.append(test([list("SaAT")]))
tests.append(test([list("SAaT")]))
tests.append(test([list("SA.T"), list("#.#."), list("b..a")]))
tests.append(test(couloirs(40, 40)))
tests.append(test(couloirs(40, 40)))
tests.append(test(hasard(40, 40, 0.25, 12, 60, "abcdef")))
tests.append(test(hasard(40, 40, 0.15, 6, 200, "abcdef")))
g = enferme(40, 40, "abcde", "F")       # la clé f n'existe pas : impossible
tests.append(test(g))
g = enferme(40, 40, "abcdef", "F")
tests.append(test(g))
tests.append(test(hasard(40, 40, 0.3, 3, 30, "abc")))
tests.append(test(hasard(8, 9, 0.2, 2, 4, "ab")))
tests.append(test(hasard(20, 30, 0.2, 5, 20, "abcd")))
print(json.dumps(tests))
