DIRECTIONS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

def ajouter_lectures(grille, i, j, di, dj, lisibles):
    # ajoute tous les mots de 1 à 8 lettres lus depuis (i, j) dans la direction (di, dj)
    r = len(grille)
    c = len(grille[0])
    mot = ""
    while 0 <= i < r and 0 <= j < c and len(mot) < 8:
        mot = mot + grille[i][j]
        lisibles.add(mot)
        i = i + di
        j = j + dj

r, c = map(int, input().split())
grille = []
for i in range(r):
    grille.append(input())

lisibles = set()       # tous les mots que l'on peut lire dans la grille
for i in range(r):
    for j in range(c):
        for di, dj in DIRECTIONS:
            ajouter_lectures(grille, i, j, di, dj, lisibles)

q = int(input())
trouves = 0
for k in range(q):
    if input() in lisibles:
        trouves = trouves + 1
print(trouves)
