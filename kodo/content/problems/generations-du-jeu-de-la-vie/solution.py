def voisines_vivantes(g, i, j):
    n = len(g)
    m = len(g[0])
    total = 0
    for a in range(-1, 2):
        for b in range(-1, 2):
            ni = i + a
            nj = j + b
            # (0, 0) est la case elle-même ; hors de la grille, tout est mort.
            if (a != 0 or b != 0) and 0 <= ni < n and 0 <= nj < m:
                if g[ni][nj] == "#":
                    total = total + 1
    return total


def generation(g):
    # Nouvelle grille, calculée uniquement à partir de l'ancienne.
    n = len(g)
    m = len(g[0])
    h = []
    for i in range(n):
        ligne = []
        for j in range(m):
            v = voisines_vivantes(g, i, j)
            if v == 3 or (g[i][j] == "#" and v == 2):
                ligne.append("#")
            else:
                ligne.append(".")
        h.append(ligne)
    return h


n, m, k = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))
for t in range(k):
    g = generation(g)
for ligne in g:
    print("".join(ligne))
