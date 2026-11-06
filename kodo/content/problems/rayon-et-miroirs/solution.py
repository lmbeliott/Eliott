h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())

# eclairee[i][j] vaut True si le rayon est déjà passé par la case (i, j).
eclairee = []
for i in range(h):
    eclairee.append([False] * w)
nb = 0

# Position du rayon, et direction : (dl, dc) est ce qu'on ajoute
# à la ligne et à la colonne à chaque pas. Au départ, vers la droite.
l, c = 0, 0
dl, dc = 0, 1

while 0 <= l < h and 0 <= c < w:
    if not eclairee[l][c]:
        eclairee[l][c] = True
        nb += 1
    if grille[l][c] == "/":
        # droite -> haut, haut -> droite, gauche -> bas, bas -> gauche
        dl, dc = -dc, -dl
    elif grille[l][c] == "\\":
        # droite -> bas, bas -> droite, gauche -> haut, haut -> gauche
        dl, dc = dc, dl
    l += dl
    c += dc

print(nb)
