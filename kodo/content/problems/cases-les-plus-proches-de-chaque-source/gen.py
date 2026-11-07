import json, random
random.seed(2038)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "\n".join("".join(l) for l in g) + "\n"

def grille(r, c, p_mur, sources, lettres):
    g = [["#" if random.random() < p_mur else "." for _ in range(c)] for _ in range(r)]
    for _ in range(sources):
        g[random.randrange(r)][random.randrange(c)] = random.choice(lettres)
    return g

tests = []
tests.append(test([list("A...B"), list(".#..."), list("....C")]))
tests.append(test([list("A..#.."), list("...#.B"), list("A..#..")]))
tests.append(test([list("Z")]))
tests.append(test([list("A.B")]))
tests.append(test([list("A#B"), list("###"), list("...")]))
g = grille(250, 300, 0.0, 0, "AB")
g[10][20] = "A"
g[200][250] = "B"
g[240][5] = "A"
tests.append(test(g))
tests.append(test(grille(300, 300, 0.25, 26, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")))
tests.append(test(grille(300, 300, 0.1, 300, "ABC")))
tests.append(test(grille(300, 300, 0.4, 2000, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")))
# deux lettres aux coins opposés : la diagonale est disputée
g = [["."] * 200 for _ in range(200)]
g[0][0] = "P"
g[199][199] = "Q"
tests.append(test(g))
tests.append(test(grille(8, 10, 0.2, 4, "AB")))
tests.append(test(grille(30, 40, 0.3, 12, "XYZ")))
print(json.dumps(tests))
