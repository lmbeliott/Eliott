import json, random
random.seed(2041)

def test(g, f):
    return f"{len(g)} {len(g[0])} {f}\n" + "\n".join("".join(l) for l in g) + "\n"

def hasard(r, c, p_mur):
    g = [["#" if random.random() < p_mur else "." for _ in range(c)] for _ in range(r)]
    a, b = random.sample([(i, j) for i in range(r) for j in range(c)], 2)
    g[a[0]][a[1]] = "S"
    g[b[0]][b[1]] = "T"
    return g

tests = []
tests.append(test([list("S..T")], 3))
tests.append(test([list("S.."), list("..."), list("..T")], 1))
tests.append(test([list("S..T")], 2))                 # couloir : le 2 ne vient jamais dessus
tests.append(test([list("ST")], 4))
tests.append(test([list("S"), list("T")], 5))
tests.append(test([list("S."), list(".T")], 1))
tests.append(test([list("S."), list(".T")], 3))
g = [["."] * 50 for _ in range(50)]
g[0][0] = "S"
g[0][1] = "T"
tests.append(test(g, 1))                              # il faut faire un détour
g = [["."] * 50 for _ in range(50)]
g[0][0] = "S"
g[49][49] = "T"
tests.append(test(g, 6))
tests.append(test(hasard(50, 50, 0.2), 2))
tests.append(test(hasard(50, 50, 0.3), 3))
# un serpent d'une case de large, puis une petite salle au bout
g = [["#"] * 50 for _ in range(50)]
for i in range(0, 46, 2):
    for j in range(50):
        g[i][j] = "."
    g[i + 1][49 if i % 4 == 0 else 0] = "."
for i in range(46, 50):
    for j in range(46, 50):
        g[i][j] = "."
g[0][0] = "S"
g[49][49] = "T"
tests.append(test(g, 2))
# T enfermé : tout l'espace d'états est exploré
g = [["."] * 50 for _ in range(50)]
g[0][0] = "S"
g[30][30] = "T"
for i, j in [(29, 30), (31, 30), (30, 29), (30, 31)]:
    g[i][j] = "#"
tests.append(test(g, 5))
tests.append(test(hasard(6, 7, 0.2), 5))
tests.append(test(hasard(20, 30, 0.25), 6))
print(json.dumps(tests))
