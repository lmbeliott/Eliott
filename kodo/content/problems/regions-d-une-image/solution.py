import sys
from collections import deque

lignes = sys.stdin.read().split()
r, c = int(lignes[0]), int(lignes[1])
image = lignes[2:2 + r]

vu = [[False] * c for _ in range(r)]
regions = 0
plus_grande = 0
for i in range(r):
    for j in range(c):
        if vu[i][j]:
            continue
        # nouvelle région : parcours en largeur depuis (i, j)
        regions += 1
        couleur = image[i][j]
        vu[i][j] = True
        file = deque([(i, j)])
        taille = 0
        while file:
            x, y = file.popleft()
            taille += 1
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < r and 0 <= ny < c and not vu[nx][ny] and image[nx][ny] == couleur:
                    vu[nx][ny] = True
                    file.append((nx, ny))
        plus_grande = max(plus_grande, taille)
print(regions, plus_grande)
