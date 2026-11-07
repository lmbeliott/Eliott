import json, random
from collections import deque
random.seed(2026)

VMAX = 99999


def fmt(grille, lmax):
    return f"{len(grille)} {len(grille[0])} {lmax}\n" + "".join(" ".join(map(str, ligne)) + "\n" for ligne in grille)


def plus_court(grille):
    # longueur du plus court chemin sans contrainte de qualité (cases > 0), ou None
    r, c = len(grille), len(grille[0])
    dist = [[-1] * c for _ in range(r)]
    dist[0][0] = 0
    file = deque([(0, 0)])
    while file:
        i, j = file.popleft()
        for a, b in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
            if 0 <= a < r and 0 <= b < c and grille[a][b] > 0 and dist[a][b] < 0:
                dist[a][b] = dist[i][j] + 1
                file.append((a, b))
    return dist[r - 1][c - 1] if dist[r - 1][c - 1] >= 0 else None


def aleatoire(r, c, p_zero, vmin=1, vmax=VMAX):
    g = [[0 if random.random() < p_zero else random.randint(vmin, vmax) for _ in range(c)] for _ in range(r)]
    g[0][0] = random.randint(vmin, vmax)
    g[r - 1][c - 1] = random.randint(vmin, vmax)
    return g


def connexe(r, c, p_zero):
    while True:
        g = aleatoire(r, c, p_zero)
        d = plus_court(g)
        if d is not None:
            return g, d


def deux_routes(n):
    # Une route courte (diagonale en escalier) aux valeurs moyennes, et un long serpentin
    # aux valeurs élevées. Le reste est interdit. Les valeurs proches de la route courte
    # sont un peu plus basses que celles du serpentin.
    g = [[0] * n for _ in range(n)]
    for k in range(n):
        g[k][k] = random.randint(30000, 60000)
        if k + 1 < n:
            g[k][k + 1] = random.randint(30000, 60000)
    # serpentin dans le triangle sous la diagonale
    for i in range(2, n, 2):
        for j in range(0, i - 1):
            g[i][j] = random.randint(70000, VMAX)
        if i + 2 < n:
            col = 0 if (i // 2) % 2 == 0 else i - 2
            g[i + 1][col] = random.randint(70000, VMAX)
    g[1][0] = random.randint(70000, VMAX)
    for i in range(0, n):
        if g[i][0] == 0 and i < 3:
            g[i][0] = random.randint(70000, VMAX)
    # bruit : des cases isolées un peu partout au-dessus de la diagonale
    for _ in range(n * n // 3):
        i, j = random.randrange(n), random.randrange(n)
        if j > i + 1:
            g[i][j] = random.randint(1, VMAX)
    return g


def chemin_plante(r, c, serpentin):
    # Valeurs aléatoires partout (25 % de cases interdites), puis un chemin de valeurs hautes.
    # La réponse tombe alors vers le milieu des valeurs : ni trop haute, ni trop basse.
    g = aleatoire(r, c, 0.25)
    cases = []
    if serpentin:
        # bandes verticales, une colonne sur deux
        for j in range(0, c, 2):
            lignes = range(r) if (j // 2) % 2 == 0 else range(r - 1, -1, -1)
            cases += [(i, j) for i in lignes]
            if j + 2 < c:
                cases.append((r - 1 if (j // 2) % 2 == 0 else 0, j + 1))
        cases += [(i, c - 1) for i in range(r)] if c % 2 == 0 else []
    else:
        i = j = 0
        cases.append((0, 0))
        while (i, j) != (r - 1, c - 1):
            if j == c - 1 or (i < r - 1 and random.random() < 0.5):
                i += 1
            else:
                j += 1
            cases.append((i, j))
    for (i, j) in cases:
        g[i][j] = random.randint(40000, VMAX)
    return g


def porte(r, c):
    # Le départ est dans une grande zone de valeur maximale, séparée du reste par un mur percé
    # d'une seule porte de valeur moyenne. Le reste contient beaucoup de valeurs différentes,
    # au-dessus et au-dessous de celle de la porte, et un couloir qui mène à l'arrivée.
    # Essayer les seuils un par un oblige à reparcourir toute la zone pour chacun.
    h = r // 2
    g = [[VMAX] * c for _ in range(h)]
    mur = [0] * c
    mur[c - 1] = 50000
    g.append(mur)
    valeurs = random.sample(range(1, VMAX), (r - h - 1) * c)
    k = 0
    for i in range(h + 1, r):
        ligne = []
        for j in range(c):
            ligne.append(valeurs[k])
            k += 1
        g.append(ligne)
    for i in range(h + 1, r):
        g[i][c - 1] = VMAX  # couloir le long du bord droit
    for j in range(c):
        g[r - 1][j] = VMAX
    return g


G = [[9, 4, 4, 4, 9], [9, 0, 0, 0, 4], [9, 0, 9, 9, 9], [9, 9, 9, 0, 9]]
tests = [fmt(G, 7), fmt(G, 9)]
# Cas limites : une seule case, L = 0, chemin coupé, L trop petit
tests.append(fmt([[42]], 0))
tests.append(fmt([[3, 0], [0, 4]], 10))
tests.append(fmt([[1, 2, 3], [4, 5, 6]], 2))
tests.append(fmt([[7, 7, 7], [7, 7, 7]], 3))
g, d = connexe(8, 9, 0.2)
tests.append(fmt(g, d + 2))
g, d = connexe(30, 40, 0.25)
tests.append(fmt(g, d))
tests.append(fmt(deux_routes(20), 60))
# Grands cas
g = chemin_plante(150, 150, False)
tests.append(fmt(g, 298))
g = porte(150, 150)
tests.append(fmt(g, 2 * 150 - 2))
g, d = connexe(100, 100, 0.3)
tests.append(fmt(g, 100 * 100))
g = deux_routes(100)
tests.append(fmt(g, plus_court(g) + 40))
print(json.dumps(tests))
