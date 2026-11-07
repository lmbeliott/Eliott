import json, random
random.seed(2046)

def bloc(i, j):
    return (i // 2) * 2 + j // 3

def compter(g, limite):
    # nombre de complétions (arrêt dès qu'on dépasse limite)
    for i in range(6):
        for j in range(6):
            if g[i][j] == 0:
                total = 0
                for d in range(1, 7):
                    if all(g[i][x] != d for x in range(6)) and all(g[x][j] != d for x in range(6)) and \
                       all(g[x][y] != d for x in range(6) for y in range(6) if bloc(x, y) == bloc(i, j)):
                        g[i][j] = d
                        total += compter(g, limite - total)
                        g[i][j] = 0
                        if total > limite:
                            return total
                return total
    return 1

def pleine():
    g = [[0] * 6 for _ in range(6)]
    def remplir(k):
        if k == 36:
            return True
        i, j = divmod(k, 6)
        ch = list(range(1, 7))
        random.shuffle(ch)
        for d in ch:
            if all(g[i][x] != d for x in range(6)) and all(g[x][j] != d for x in range(6)) and \
               all(g[x][y] != d for x in range(6) for y in range(6) if bloc(x, y) == bloc(i, j)):
                g[i][j] = d
                if remplir(k + 1):
                    return True
                g[i][j] = 0
        return False
    remplir(0)
    return g

def enigme(limite, garder_min=0):
    g = pleine()
    cases = [(i, j) for i in range(6) for j in range(6)]
    random.shuffle(cases)
    for (i, j) in cases[:36 - garder_min]:
        d = g[i][j]
        g[i][j] = 0
        if compter(g, limite) > limite:
            g[i][j] = d
    return g

def texte(g):
    return "\n".join("".join("." if d == 0 else str(d) for d in ligne) for ligne in g) + "\n"

tests = []
tests.append(texte(enigme(4)))
g = pleine()
for (i, j) in [(0, 0), (0, 1), (2, 3), (4, 4), (5, 0), (5, 5)]:
    g[i][j] = 0
tests.append(texte(g))
tests.append(texte(pleine()))
g = pleine()
g[0][0], g[0][1] = g[0][1], g[0][0]            # grille pleine mais fausse
tests.append(texte(g))
tests.append("11....\n......\n......\n......\n......\n......\n")
tests.append(texte(enigme(1)))
tests.append(texte(enigme(1)))
tests.append(texte(enigme(100)))
tests.append(texte(enigme(1000)))
tests.append(texte(enigme(5000)))
tests.append(texte(enigme(5000)))
tests.append(texte(enigme(3000)))
# une grille avec des chiffres compatibles deux à deux mais sans aucune complétion
tests.append("123...\n......\n......\n......\n.4....\n..4...\n")
print(json.dumps(tests))
