import sys
from collections import deque

donnees = sys.stdin.read().split()
r, c, f = int(donnees[0]), int(donnees[1]), int(donnees[2])
grille = donnees[3:3 + r]
for i in range(r):
    for j in range(c):
        if grille[i][j] == "S":
            depart = (i, j)

# état : (ligne, colonne, face du dessus, face nord, face est), codé par un entier
def code(i, j, h, n, e):
    return ((h * 7 + n) * 7 + e) * r * c + i * c + j

def rouler(h, n, e, direction):
    # nouvelles faces (dessus, nord, est) ; la face opposée à x est 7 - x
    if direction == 0:
        return 7 - n, h, e        # vers le nord
    if direction == 1:
        return n, 7 - h, e        # vers le sud
    if direction == 2:
        return 7 - e, n, h        # vers l'est
    return e, n, 7 - h            # vers l'ouest

deplacements = [(-1, 0), (1, 0), (0, 1), (0, -1)]
dist = [-1] * (343 * r * c)
etat = (depart[0], depart[1], 1, 2, 3)
dist[code(*etat)] = 0
file = deque([etat])
reponse = -1
while file:
    i, j, h, n, e = file.popleft()
    d = dist[code(i, j, h, n, e)]
    if grille[i][j] == "T" and h == f:
        reponse = d
        break
    for k in range(4):
        ni, nj = i + deplacements[k][0], j + deplacements[k][1]
        if 0 <= ni < r and 0 <= nj < c and grille[ni][nj] != "#":
            h2, n2, e2 = rouler(h, n, e, k)
            x = code(ni, nj, h2, n2, e2)
            if dist[x] == -1:
                dist[x] = d + 1
                file.append((ni, nj, h2, n2, e2))
print(reponse)
