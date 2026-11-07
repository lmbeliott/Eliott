import sys
from collections import deque

lignes = sys.stdin.read().split()
r, c = int(lignes[0]), int(lignes[1])
grille = lignes[2:2 + r]
DISPUTEE = 26

dist = [[-1] * c for _ in range(r)]
proprio = [[-1] * c for _ in range(r)]
file = deque()
for i in range(r):
    for j in range(c):
        if "A" <= grille[i][j] <= "Z":       # toutes les sources partent ensemble
            dist[i][j] = 0
            proprio[i][j] = ord(grille[i][j]) - ord("A")
            file.append((i, j))

while file:
    x, y = file.popleft()
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < r and 0 <= ny < c and grille[nx][ny] != "#":
            if dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1
                proprio[nx][ny] = proprio[x][y]
                file.append((nx, ny))
            elif dist[nx][ny] == dist[x][y] + 1 and proprio[nx][ny] != proprio[x][y]:
                proprio[nx][ny] = DISPUTEE

compte = [0] * 27
for i in range(r):
    for j in range(c):
        if proprio[i][j] != -1:
            compte[proprio[i][j]] += 1
presentes = set(ch for ligne in grille for ch in ligne if "A" <= ch <= "Z")
for k in range(26):
    lettre = chr(ord("A") + k)
    if lettre in presentes:
        print(lettre, compte[k])
print(compte[DISPUTEE])
