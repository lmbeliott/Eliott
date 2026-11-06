h, w = map(int, input().split())
carte = []
for _ in range(h):
    carte.append(input())
ordres = input()

# On cherche la case de départ.
for i in range(h):
    for j in range(w):
        if carte[i][j] == "D":
            l, c = i, j

# damee[i][j] vaut True si la dameuse est déjà passée sur la case (i, j).
damee = []
for i in range(h):
    damee.append([False] * w)
damee[l][c] = True
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
    # Hors de la carte ou sapin : l'ordre est ignoré.
    if 0 <= nl < h and 0 <= nc < w and carte[nl][nc] != "#":
        l, c = nl, nc
        if not damee[l][c]:
            damee[l][c] = True
            nb += 1

print(nb)
