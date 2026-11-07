import json, random
random.seed(2026)

def test(k, grille):
    return f"{len(grille)} {len(grille[0])} {k}\n" + "".join(l + "\n" for l in grille)

def serpent(r, c, changements):
    # chaque ligne est parcourue entièrement vers la droite, puis on descend
    g = []
    for i in range(r):
        d = (c - 1 - i) % c
        g.append(["v" if j == d else ">" for j in range(c)])
    for _ in range(changements):
        g[random.randrange(r)][random.randrange(c)] = random.choice("^v<>")
    return ["".join(l) for l in g]

def hasard(r, c):
    return ["".join(random.choice("^v<>") for _ in range(c)) for _ in range(r)]

exemple = ["vv<>", ">>^<", "<<<^"]
tests = [test(3, exemple), test(10**18, exemple)]
tests.append(test(0, exemple))                         # aucun déplacement
tests.append(test(5, exemple))
tests.append(test(6, exemple))
tests.append(test(10**18, [">"]))                      # une seule case
tests.append(test(7, ["<<<<"]))                        # on ressort par la gauche
tests.append(test(999999999999999999, ["^", "^", "^"]))
tests.append(test(10**18, ["v>", "<^"]))
tests.append(test(123456789, hasard(10, 10)))
tests.append(test(10**18, hasard(200, 200)))
g = serpent(200, 200, 0)                               # un seul grand cycle de 40 000 cases
tests.append(test(39999, g))
tests.append(test(10**18 - 7, g))
g = serpent(200, 200, 3)
tests.append(test(10**18, g))
tests.append(test(25000, g))
g = serpent(150, 170, 2)
tests.append(test(987654321987654321, g))
print(json.dumps(tests))
