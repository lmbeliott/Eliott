def case_suivante(grille, i, j):
    # la case vers laquelle pointe la flèche de (i, j) ; on ressort de l'autre côté aux bords
    r = len(grille)
    c = len(grille[0])
    f = grille[i][j]
    if f == "^":
        i = i - 1
    elif f == "v":
        i = i + 1
    elif f == "<":
        j = j - 1
    else:
        j = j + 1
    return (i % r, j % c)

r, c, k = map(int, input().split())
grille = []
for i in range(r):
    grille.append(input())

chemin = [(0, 0)]          # chemin[t] = position après t déplacements
instant = {(0, 0): 0}      # case -> premier instant où le robot y est passé
suivante = case_suivante(grille, 0, 0)
# on avance tant que l'instant K n'est pas atteint et que la case suivante est nouvelle
while len(chemin) <= k and suivante not in instant:
    instant[suivante] = len(chemin)
    chemin.append(suivante)
    i, j = suivante
    suivante = case_suivante(grille, i, j)

if len(chemin) > k:
    # K déplacements simulés sans jamais repasser par une case
    fin = chemin[k]
    distinctes = k + 1
else:
    # la case suivante est déjà connue : le robot tourne en rond
    debut = instant[suivante]         # premier instant du cycle
    longueur = len(chemin) - debut    # nombre de cases du cycle
    fin = chemin[debut + (k - debut) % longueur]
    distinctes = len(chemin)
print(fin[0] + 1, fin[1] + 1)
print(distinctes)
