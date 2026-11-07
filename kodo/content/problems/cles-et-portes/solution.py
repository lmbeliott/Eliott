import sys
from collections import deque

lignes = sys.stdin.read().split()
r, c = int(lignes[0]), int(lignes[1])
grille = lignes[2:2 + r]
for i in range(r):
    for j in range(c):
        if grille[i][j] == "S":
            depart = (i, j)

# un état (i, j, clés) est codé par l'entier (clés * r + i) * c + j
def code(i, j, cles):
    return (cles * r + i) * c + j

dist = [-1] * (64 * r * c)
dist[code(depart[0], depart[1], 0)] = 0
file = deque([(depart[0], depart[1], 0)])
reponse = -1
while file:
    i, j, cles = file.popleft()
    d = dist[code(i, j, cles)]
    if grille[i][j] == "T":
        reponse = d
        break
    for ni, nj in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):
        if not (0 <= ni < r and 0 <= nj < c):
            continue
        case = grille[ni][nj]
        if case == "#":
            continue
        if "A" <= case <= "F" and not (cles >> (ord(case) - ord("A")) & 1):
            continue                                  # porte fermée
        nouvelles = cles
        if "a" <= case <= "f":
            nouvelles = cles | (1 << (ord(case) - ord("a")))   # on ramasse la clé
        k = code(ni, nj, nouvelles)
        if dist[k] == -1:
            dist[k] = d + 1
            file.append((ni, nj, nouvelles))
print(reponse)
