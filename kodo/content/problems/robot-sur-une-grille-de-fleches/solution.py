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
retour = None
while len(chemin) <= k:
    i, j = chemin[-1]
    suivante = case_suivante(grille, i, j)
    if suivante in instant:
        retour = suivante  # le robot repasse par une case connue : il tourne en rond
        break
    instant[suivante] = len(chemin)
    chemin.append(suivante)

if retour is None:
    # K déplacements simulés sans jamais repasser par une case
    fin = chemin[k]
    distinctes = k + 1
else:
    debut = instant[retour]           # premier instant du cycle
    longueur = len(chemin) - debut    # nombre de cases du cycle
    fin = chemin[debut + (k - debut) % longueur]
    distinctes = len(chemin)
print(fin[0] + 1, fin[1] + 1)
print(distinctes)
