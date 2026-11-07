h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input().strip())

# Les quatre directions, dans l'ordre où l'on tourne : droite, bas, gauche, haut.
dl = [0, 1, 0, -1]
dc = [1, 0, -1, 0]

vu = [[False] * w for _ in range(h)]
l, c, d = 0, 0, 0
lettres = []
for _ in range(h * w):
    lettres.append(grille[l][c])
    vu[l][c] = True
    # Si la case suivante sort de la grille ou a déjà été lue, on tourne d'un quart de tour.
    nl, nc = l + dl[d], c + dc[d]
    if nl < 0 or nl >= h or nc < 0 or nc >= w or vu[nl][nc]:
        d = (d + 1) % 4
        nl, nc = l + dl[d], c + dc[d]
    l, c = nl, nc

print("".join(lettres))
