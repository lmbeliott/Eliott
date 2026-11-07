import sys
from collections import deque

lignes = sys.stdin.read().split()
r, c = int(lignes[0]), int(lignes[1])
plateau = lignes[2:2 + r]
for i in range(r):
    for j in range(c):
        if plateau[i][j] == "S":
            depart = (i, j)
        elif plateau[i][j] == "T":
            arrivee = (i, j)

coups = [(1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2)]
dist = [[-1] * c for _ in range(r)]
dist[depart[0]][depart[1]] = 0
file = deque([depart])
while file:
    x, y = file.popleft()
    for dx, dy in coups:
        nx, ny = x + dx, y + dy
        if 0 <= nx < r and 0 <= ny < c and plateau[nx][ny] != "#" and dist[nx][ny] == -1:
            dist[nx][ny] = dist[x][y] + 1
            file.append((nx, ny))
print(dist[arrivee[0]][arrivee[1]])
