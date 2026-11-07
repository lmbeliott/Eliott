h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())

# La ligne i de la nouvelle grille est la colonne i, lue de bas en haut.
for i in range(w):
    ligne = ""
    for l in range(h - 1, -1, -1):
        ligne = ligne + grille[l][i]
    print(ligne)
