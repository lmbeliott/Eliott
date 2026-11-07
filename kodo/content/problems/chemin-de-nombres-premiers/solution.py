import sys
from collections import deque

donnees = sys.stdin.read().split()
a, b = int(donnees[0]), int(donnees[1])
k = int(donnees[2])
interdits = [int(x) for x in donnees[3:3 + k]]

# crible d'Ératosthène jusqu'à 100 000
LIMITE = 100000
premier = [True] * LIMITE
premier[0] = premier[1] = False
for i in range(2, 317):
    if premier[i]:
        for j in range(i * i, LIMITE, i):
            premier[j] = False

d = len(str(a))
dist = [-1] * LIMITE
for x in interdits:
    dist[x] = -2                 # marqué : on n'y entre jamais
dist[a] = 0
file = deque([a])
while file:
    x = file.popleft()
    if x == b:
        break
    puissance = 1
    for p in range(d):
        c = x // puissance % 10
        for c2 in range(10):
            if c2 == c or (c2 == 0 and p == d - 1):
                continue
            y = x + (c2 - c) * puissance
            if premier[y] and dist[y] == -1:
                dist[y] = dist[x] + 1
                file.append(y)
        puissance *= 10
print(dist[b])
