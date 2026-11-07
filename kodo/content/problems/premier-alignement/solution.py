h, w, k = map(int, input().split())
m = int(input())
coups = list(map(int, input().split()))

# grille[l][c] : 0 si la case est vide, sinon le numéro du joueur (1 ou 2).
# La ligne 0 est en haut, la ligne h - 1 tout en bas.
grille = []
for _ in range(h):
    grille.append([0] * w)
# hauteur[c] : nombre de jetons déjà posés dans la colonne c.
hauteur = [0] * w

# Les quatre directions d'alignement : horizontale, verticale, deux diagonales.
directions = [(0, 1), (1, 0), (1, 1), (1, -1)]

reponse = 0
for numero in range(1, m + 1):
    joueur = 1 if numero % 2 == 1 else 2
    c = coups[numero - 1] - 1
    l = h - 1 - hauteur[c]     # le jeton tombe sur la plus basse case libre
    grille[l][c] = joueur
    hauteur[c] += 1

    # Seul le jeton qui vient d'être posé peut créer un nouvel alignement.
    for dl, dc in directions:
        nb = 1
        # On compte les jetons du joueur dans un sens, puis dans l'autre.
        for sens in [1, -1]:
            i, j = l + sens * dl, c + sens * dc
            while 0 <= i < h and 0 <= j < w and grille[i][j] == joueur:
                nb += 1
                i += sens * dl
                j += sens * dc
        if nb >= k:
            reponse = numero
    if reponse > 0:
        break

print(reponse)
