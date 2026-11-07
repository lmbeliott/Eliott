import json, random
random.seed(2035)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "\n".join("".join(l) for l in g) + "\n"

def plateau(r, c, p_trou, s, t):
    g = [["#" if random.random() < p_trou else "." for _ in range(c)] for _ in range(r)]
    g[s[0]][s[1]] = "S"
    g[t[0]][t[1]] = "T"
    return g

tests = []
tests.append(test([list("S#.."), list("..#."), list("...."), list("#..T")]))
tests.append(test([list("S.."), list("..."), list(".T.")]))
tests.append(test([list("S..."), list(".T..")]))
tests.append(test([list("ST")]))
tests.append(test([list("S.."), list(".T."), list("...")]))      # case centrale inaccessible
tests.append(test(plateau(200, 200, 0.0, (0, 0), (199, 199))))
tests.append(test(plateau(200, 200, 0.0, (0, 0), (0, 1))))
tests.append(test(plateau(200, 200, 0.3, (0, 0), (199, 199))))
tests.append(test(plateau(200, 200, 0.55, (100, 100), (3, 190))))
tests.append(test(plateau(2, 200, 0.0, (0, 0), (1, 199))))
tests.append(test(plateau(2, 200, 0.0, (0, 0), (1, 198))))
tests.append(test(plateau(1, 200, 0.0, (0, 0), (0, 199))))
# mur de trous d'une colonne : le cavalier saute par-dessus
g = plateau(50, 60, 0.0, (25, 0), (25, 59))
for i in range(50):
    g[i][30] = "#"
tests.append(test(g))
# mur de deux colonnes : infranchissable
g = plateau(50, 60, 0.0, (25, 0), (25, 59))
for i in range(50):
    g[i][30] = g[i][31] = "#"
tests.append(test(g))
tests.append(test(plateau(30, 40, 0.4, (0, 5), (29, 30))))
print(json.dumps(tests))
