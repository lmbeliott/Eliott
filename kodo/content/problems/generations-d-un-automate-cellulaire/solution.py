def voisins_vivants(grille, i, j):
    r = len(grille)
    c = len(grille[0])
    total = 0
    for di in [-1, 0, 1]:
        for dj in [-1, 0, 1]:
            if di != 0 or dj != 0:
                a = i + di
                b = j + dj
                if 0 <= a < r and 0 <= b < c and grille[a][b] == "#":
                    total = total + 1
    return total

def generation_suivante(grille):
    # on construit une nouvelle grille : l'ancienne ne doit pas changer pendant le calcul
    nouvelle = []
    for i in range(len(grille)):
        ligne = ""
        for j in range(len(grille[0])):
            v = voisins_vivants(grille, i, j)
            if v == 3 or (v == 2 and grille[i][j] == "#"):
                ligne = ligne + "#"
            else:
                ligne = ligne + "."
        nouvelle.append(ligne)
    return nouvelle

r, c, k = map(int, input().split())
grille = []
for i in range(r):
    grille.append(input())
for t in range(k):
    grille = generation_suivante(grille)
for ligne in grille:
    print(ligne)
