h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())
ordres = input()

# On cherche la case de départ.
for i in range(h):
    for j in range(w):
        if grille[i][j] == "D":
            l, c = i, j

# visitee[i][j] vaut True si le robot est déjà passé sur la case (i, j).
visitee = []
for i in range(h):
    visitee.append([False] * w)
visitee[l][c] = True
nb = 1

for o in ordres:
    # Case visée par l'ordre.
    nl, nc = l, c
    if o == "N":
        nl = l - 1
    elif o == "S":
        nl = l + 1
    elif o == "E":
        nc = c + 1
    else:  # "O"
        nc = c - 1
    # Hors de la grille ou obstacle : l'ordre est ignoré.
    if 0 <= nl < h and 0 <= nc < w and grille[nl][nc] != "#":
        l, c = nl, nc
        if not visitee[l][c]:
            visitee[l][c] = True
            nb += 1

print(nb)
