import json, random
random.seed(2026)


def fmt(g):
    return f"{len(g)} {len(g[0])}\n" + "".join("".join(ligne) + "\n" for ligne in g)


def place(g, symbole):
    libres = [(i, j) for i in range(len(g)) for j in range(len(g[0])) if g[i][j] == '.']
    i, j = random.choice(libres)
    g[i][j] = symbole


def aleatoire(r, c, p):
    g = [['#' if random.random() < p else '.' for _ in range(c)] for _ in range(r)]
    place(g, 'S')
    place(g, 'T')
    return g


def serpent(r, c, trou):
    # Une ligne sur deux est un mur percé d'un seul passage, alternativement à gauche et à droite.
    g = [['.'] * c for _ in range(r)]
    for i in range(1, r, 2):
        g[i] = ['#'] * c
        for k in range(trou):
            g[i][k if (i // 2) % 2 == 0 else c - 1 - k] = '.'
    g[0][0] = 'S'
    g[r - 1 if r % 2 else r - 2][c // 2] = 'T'
    return g


def spirale(n):
    # Un couloir en spirale vers le centre : chaque coin est un virage obligatoire.
    g = [['#'] * n for _ in range(n)]
    i, j, d = 0, 0, 0
    pas = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    g[0][0] = '.'
    bloque = 0
    while bloque < 4:
        di, dj = pas[d]
        ni, nj, nni, nnj = i + di, j + dj, i + 2 * di, j + 2 * dj
        if 0 <= nni < n and 0 <= nnj < n and g[nni][nnj] == '#' and g[ni][nj] == '#':
            g[ni][nj] = g[nni][nnj] = '.'
            i, j = nni, nnj
            bloque = 0
        else:
            d = (d + 1) % 4
            bloque += 1
    g[0][0] = 'S'
    g[i][j] = 'T'
    return g


def escalier(n):
    # Grille ouverte, mais des murs en escalier : le chemin le plus court en cases fait beaucoup
    # de virages, alors qu'un détour par les bords n'en fait que deux.
    g = [['.'] * n for _ in range(n)]
    for i in range(1, n - 1):
        for j in range(1, n - 1):
            if (i + j) % 4 == 0 and i != j:
                g[i][j] = '#'
    g[1][1] = 'S'
    g[n - 2][n - 2] = 'T'
    return g


tests = [
    fmt([list("S..#...."), list(".#.#.##."), list(".#...#.."), list(".####.#."), list("......#T")]),
    fmt([list("S.#"), list("##."), list("..T")]),
]
tests.append(fmt([list("ST")]))
tests.append(fmt([list("T"), list("."), list("."), list("S")]))
tests.append(fmt([list("S...."), list("....."), list("....T")]))
tests.append(fmt([list("S.#.T")]))
# Le chemin le plus court en cases n'est pas celui qui tourne le moins.
tests.append(fmt([list(".#....."), list("..#.#.T"), list("#...#.."), list("##....#"), list("...S##.")]))
# Garder une seule valeur par case (sans la direction) ne suffit pas.
tests.append(fmt([list("#.#.."), list(".S.##"), list("....T")]))
tests.append(fmt(aleatoire(12, 15, 0.3)))
tests.append(fmt(serpent(199, 200, 1)))
tests.append(fmt(serpent(200, 157, 3)))
tests.append(fmt(spirale(200)))
tests.append(fmt(escalier(200)))
tests.append(fmt(aleatoire(200, 200, 0.25)))
tests.append(fmt(aleatoire(200, 200, 0.4)))
g = aleatoire(200, 200, 0.05)
tests.append(fmt(g))
# Arrivée enfermée dans un grand labyrinthe : réponse -1.
g = aleatoire(200, 200, 0.3)
for i in range(200):
    for j in range(200):
        if g[i][j] == 'T':
            for di, dj in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                if 0 <= i + di < 200 and 0 <= j + dj < 200 and g[i + di][j + dj] == '.':
                    g[i + di][j + dj] = '#'
tests.append(fmt(g))
print(json.dumps(tests))
